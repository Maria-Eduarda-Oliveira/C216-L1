import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ItemCard } from '../../components/ItemCard';

describe('ItemCard', () => {
  it('exibe o nome e a descricao do item', () => {
    const item = { id: '1', nome: 'Caderno', descricao: 'Caderno universitario' };
    render(<ItemCard item={item} />);
    expect(screen.getByText('Caderno')).toBeInTheDocument();
    expect(screen.getByText('Caderno universitario')).toBeInTheDocument();
  });
});
