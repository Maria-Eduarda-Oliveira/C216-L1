import { afterEach, describe, expect, it, vi } from 'vitest';
import { createItem, listItems } from '../../services/items';

describe('items service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('listItems retorna os itens quando a resposta e ok', async () => {
    const itensFake = [{ id: 1, nome: 'Caderno', descricao: '', concluida: false }];
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(itensFake),
    });

    const resultado = await listItems();

    expect(resultado).toEqual(itensFake);
  });

  it('listItems lanca erro quando a resposta nao e ok', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false });

    await expect(listItems()).rejects.toThrow('Nao foi possivel carregar os itens');
  });

  it('createItem retorna o item criado quando a resposta e ok', async () => {
    const itemCriado = { id: 1, nome: 'Caderno', descricao: '', concluida: false };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve(itemCriado),
    });

    const resultado = await createItem({ nome: 'Caderno' });

    expect(resultado).toEqual(itemCriado);
  });

  it('createItem lanca erro com a mensagem do backend quando o nome ja existe', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ detail: 'Ja existe um item com esse nome' }),
    });

    await expect(createItem({ nome: 'Caderno' })).rejects.toThrow(
      'Ja existe um item com esse nome',
    );
  });
});
