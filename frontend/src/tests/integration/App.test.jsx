import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../App';

describe('App - fluxo completo do gerenciador de itens', () => {
  it('permite adicionar um item e ve-lo na lista', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/nome/i), 'Caderno');
    await user.type(screen.getByLabelText(/descricao/i), 'Caderno universitario novo');
    await user.click(screen.getByRole('button', { name: /adicionar item/i }));

    expect(screen.getByText('Caderno')).toBeInTheDocument();
    expect(screen.getByText('Caderno universitario novo')).toBeInTheDocument();
  });

  it('nao adiciona o item quando os dados sao invalidos', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/nome/i), 'ab');
    await user.click(screen.getByRole('button', { name: /adicionar item/i }));

    expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
  });

  it('permite remover um item da lista', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/nome/i), 'Caderno');
    await user.type(screen.getByLabelText(/descricao/i), 'Caderno universitario novo');
    await user.click(screen.getByRole('button', { name: /adicionar item/i }));

    await user.click(screen.getByRole('button', { name: /remover/i }));

    expect(screen.queryByText('Caderno')).not.toBeInTheDocument();
  });
});
