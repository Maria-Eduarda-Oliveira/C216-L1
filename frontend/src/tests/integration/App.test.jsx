import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';

function resposta(corpo, { ok = true, status = 200 } = {}) {
  return Promise.resolve({ ok, status, json: () => Promise.resolve(corpo) });
}

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista os equipamentos vindos da API', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      resposta([{ id: 1, nome: 'Compressor de ar', local: 'Galpao A' }]),
    );

    render(<App />);

    expect(await screen.findByText('Compressor de ar')).toBeInTheDocument();
    expect(screen.getByText('Galpao A')).toBeInTheDocument();
  });

  it('mostra erro quando a listagem falha', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      resposta({ detail: 'Falha interna' }, { ok: false, status: 500 }),
    );

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha interna');
  });

  it('cadastra um equipamento e recarrega a lista', async () => {
    const user = userEvent.setup();
    let cadastrado = false;

    vi.spyOn(global, 'fetch').mockImplementation((_url, opcoes) => {
      if (opcoes?.method === 'POST') {
        cadastrado = true;
        return resposta({ id: 1, nome: 'Bomba', local: null }, { status: 201 });
      }
      return resposta(cadastrado ? [{ id: 1, nome: 'Bomba', local: null }] : []);
    });

    render(<App />);
    await waitFor(() =>
      expect(screen.queryByText(/carregando equipamentos/i)).not.toBeInTheDocument(),
    );

    await user.type(screen.getByLabelText(/nome do equipamento/i), 'Bomba');
    await user.click(screen.getByRole('button', { name: /cadastrar equipamento/i }));

    expect(await screen.findByText('Bomba')).toBeInTheDocument();
  });

  it('exibe a mensagem do backend ao cadastrar nome duplicado', async () => {
    const user = userEvent.setup();

    vi.spyOn(global, 'fetch').mockImplementation((_url, opcoes) => {
      if (opcoes?.method === 'POST') {
        return resposta(
          { detail: 'Ja existe um equipamento com esse nome' },
          { ok: false, status: 409 },
        );
      }
      return resposta([]);
    });

    render(<App />);
    await waitFor(() =>
      expect(screen.queryByText(/carregando equipamentos/i)).not.toBeInTheDocument(),
    );

    await user.type(screen.getByLabelText(/nome do equipamento/i), 'Bomba');
    await user.click(screen.getByRole('button', { name: /cadastrar equipamento/i }));

    expect(await screen.findByText(/ja existe um equipamento/i)).toBeInTheDocument();
  });
});
