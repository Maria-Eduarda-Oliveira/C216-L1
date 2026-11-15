import { afterEach, describe, expect, it, vi } from 'vitest';
import { alterarStatusOrdem, criarEquipamento, listarEquipamentos } from '../../services/api';

function respostaFake({ ok = true, status = 200, corpo = null }) {
  return { ok, status, json: () => Promise.resolve(corpo) };
}

describe('services/api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('listarEquipamentos retorna os dados da API', async () => {
    const dados = [{ id: 1, nome: 'Compressor', local: 'Galpao A' }];
    vi.spyOn(global, 'fetch').mockResolvedValue(respostaFake({ corpo: dados }));

    expect(await listarEquipamentos()).toEqual(dados);
  });

  it('repassa a mensagem do backend em caso de conflito', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      respostaFake({
        ok: false,
        status: 409,
        corpo: { detail: 'Ja existe um equipamento com esse nome' },
      }),
    );

    await expect(criarEquipamento({ nome: 'Compressor' })).rejects.toThrow(
      'Ja existe um equipamento com esse nome',
    );
  });

  it('usa mensagem generica quando a validacao falha (422 com lista)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      respostaFake({ ok: false, status: 422, corpo: { detail: [{ msg: 'x' }] } }),
    );

    await expect(criarEquipamento({ nome: 'ab' })).rejects.toThrow('Dados invalidos');
  });

  it('informa erro de conexao quando o servidor nao responde', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(listarEquipamentos()).rejects.toThrow('Nao foi possivel conectar ao servidor');
  });

  it('alterarStatusOrdem envia PATCH com o novo status', async () => {
    const espiao = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(respostaFake({ corpo: { id: 1, status: 'em_andamento' } }));

    await alterarStatusOrdem(1, 'em_andamento');

    const [url, opcoes] = espiao.mock.calls[0];
    expect(url).toMatch(/\/ordens-servico\/1\/status$/);
    expect(opcoes.method).toBe('PATCH');
    expect(JSON.parse(opcoes.body)).toEqual({ status: 'em_andamento' });
  });
});
