import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';

describe('App - fluxo completo do gerenciador de itens', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('permite adicionar um item e ve-lo na lista', async () => {
    const user = userEvent.setup();
    const itemCriado = {
      id: 1,
      nome: 'Caderno',
      descricao: 'Caderno universitario novo',
      concluida: false,
    };
    let chamadas = 0;

    vi.spyOn(global, 'fetch').mockImplementation(() => {
      chamadas += 1;
      if (chamadas === 1) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve(itemCriado) });
    });

    render(<App />);
    await waitFor(() => expect(screen.queryByText(/carregando itens/i)).not.toBeInTheDocument());

    await user.type(screen.getByLabelText(/nome/i), 'Caderno');
    await user.type(screen.getByLabelText(/descricao/i), 'Caderno universitario novo');
    await user.click(screen.getByRole('button', { name: /adicionar item/i }));

    expect(await screen.findByText('Caderno')).toBeInTheDocument();
  });

  it('nao adiciona o item quando os dados sao invalidos', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<App />);
    await waitFor(() => expect(screen.queryByText(/carregando itens/i)).not.toBeInTheDocument());

    await user.type(screen.getByLabelText(/nome/i), 'ab');
    await user.click(screen.getByRole('button', { name: /adicionar item/i }));

    expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
  });

  it('exibe a mensagem do backend quando o nome ja existe', async () => {
    const user = userEvent.setup();
    let chamadas = 0;

    vi.spyOn(global, 'fetch').mockImplementation(() => {
      chamadas += 1;
      if (chamadas === 1) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ detail: 'Ja existe um item com esse nome' }),
      });
    });

    render(<App />);
    await waitFor(() => expect(screen.queryByText(/carregando itens/i)).not.toBeInTheDocument());

    await user.type(screen.getByLabelText(/nome/i), 'Caderno');
    await user.type(screen.getByLabelText(/descricao/i), 'Caderno universitario novo');
    await user.click(screen.getByRole('button', { name: /adicionar item/i }));

    expect(await screen.findByText(/ja existe um item com esse nome/i)).toBeInTheDocument();
  });
});
