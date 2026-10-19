import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ItemCard } from '../../components/ItemCard';

describe('ItemCard', () => {
  const item = { id: '1', nome: 'Caderno', descricao: 'Caderno universitario' };

  it('exibe o nome e a descricao do item', () => {
    render(<ItemCard item={item} onRemover={() => {}} />);
    expect(screen.getByText('Caderno')).toBeInTheDocument();
    expect(screen.getByText('Caderno universitario')).toBeInTheDocument();
  });

  it('chama onRemover com o id correto ao clicar em remover', async () => {
    const onRemover = vi.fn();
    const user = userEvent.setup();
    render(<ItemCard item={item} onRemover={onRemover} />);
    await user.click(screen.getByRole('button', { name: /remover/i }));
    expect(onRemover).toHaveBeenCalledWith('1');
  });
});
