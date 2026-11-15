import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OrdensServico } from '../../components/OrdensServico';

function resposta(corpo, { ok = true, status = 200 } = {}) {
  return Promise.resolve({ ok, status, json: () => Promise.resolve(corpo) });
}

describe('OrdensServico', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mostra o botao Iniciar para uma ordem aberta e envia o novo status', async () => {
    const user = userEvent.setup();
    const ordem = {
      id: 7,
      descricao_problema: 'Vazamento de oleo',
      responsavel: 'Carlos',
      status: 'aberta',
    };
    const espiao = vi.spyOn(global, 'fetch').mockImplementation(() => resposta([ordem]));

    render(<OrdensServico equipamento={{ id: 1 }} />);

    await user.click(await screen.findByRole('button', { name: 'Iniciar' }));

    const patch = espiao.mock.calls.find(([, opcoes]) => opcoes?.method === 'PATCH');
    expect(patch[0]).toMatch(/\/ordens-servico\/7\/status$/);
    expect(JSON.parse(patch[1].body)).toEqual({ status: 'em_andamento' });
  });

  it('nao mostra botao de avancar para ordem concluida', async () => {
    const ordem = {
      id: 7,
      descricao_problema: 'Vazamento de oleo',
      responsavel: 'Carlos',
      status: 'concluida',
    };
    vi.spyOn(global, 'fetch').mockImplementation(() => resposta([ordem]));

    render(<OrdensServico equipamento={{ id: 1 }} />);

    expect(await screen.findByText(/Concluída/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Iniciar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Concluir' })).not.toBeInTheDocument();
  });
});
