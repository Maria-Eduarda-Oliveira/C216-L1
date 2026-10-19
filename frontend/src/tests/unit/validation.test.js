import { describe, expect, it } from 'vitest';
import { validarItem } from '../../utils/validation';

describe('validarItem', () => {
  it('retorna erro quando o nome esta vazio', () => {
    const erros = validarItem({ nome: '', descricao: 'Descricao valida' });
    expect(erros.nome).toBeDefined();
  });

  it('retorna erro quando o nome tem menos de 3 caracteres', () => {
    const erros = validarItem({ nome: 'ab', descricao: 'Descricao valida' });
    expect(erros.nome).toBeDefined();
  });

  it('retorna erro quando a descricao tem menos de 5 caracteres', () => {
    const erros = validarItem({ nome: 'Item valido', descricao: 'abc' });
    expect(erros.descricao).toBeDefined();
  });

  it('nao retorna erros quando os dados sao validos', () => {
    const erros = validarItem({ nome: 'Item valido', descricao: 'Descricao valida' });
    expect(Object.keys(erros)).toHaveLength(0);
  });
});
