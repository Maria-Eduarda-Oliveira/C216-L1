import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useItems } from '../../hooks/useItems';

describe('useItems', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inicia com loading true e depois carrega os itens', async () => {
    const itensFake = [{ id: 1, nome: 'Caderno', descricao: '', concluida: false }];
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(itensFake),
    });

    const { result } = renderHook(() => useItems());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual(itensFake);
    expect(result.current.error).toBeNull();
  });

  it('define uma mensagem de erro quando a listagem inicial falha', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useItems());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toMatch(/nao foi possivel carregar os itens/i);
  });

  it('adiciona um item na lista apos criar com sucesso', async () => {
    const itemCriado = { id: 1, nome: 'Caderno', descricao: '', concluida: false };
    let chamadas = 0;

    vi.spyOn(global, 'fetch').mockImplementation(() => {
      chamadas += 1;
      if (chamadas === 1) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve(itemCriado) });
    });

    const { result } = renderHook(() => useItems());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addItem({ nome: 'Caderno' });
    });

    expect(result.current.items).toContainEqual(itemCriado);
  });
});
