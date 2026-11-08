import { expect, test } from '@playwright/test';

test.describe('Gerenciador de itens - integracao com a API', () => {
  test('cadastra um item e ele persiste apos recarregar a pagina', async ({ page }) => {
    const nomeUnico = `Caderno E2E ${Date.now()}`;
    await page.goto('/');

    await page.getByLabel('Nome').fill(nomeUnico);
    await page.getByLabel('Descricao').fill('Item criado pelo teste E2E');
    await page.getByRole('button', { name: 'Adicionar item' }).click();

    await expect(page.getByRole('heading', { name: nomeUnico })).toBeVisible();

    await page.reload();

    await expect(page.getByRole('heading', { name: nomeUnico })).toBeVisible();
  });

  test('exibe mensagem de validacao quando o nome e muito curto', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Nome').fill('ab');
    await page.getByRole('button', { name: 'Adicionar item' }).click();
    await expect(page.getByText(/pelo menos 3 caracteres/i)).toBeVisible();
  });

  test('exibe erro do backend ao cadastrar nome duplicado', async ({ page }) => {
    const nomeUnico = `Item Duplicado ${Date.now()}`;
    await page.goto('/');

    await page.getByLabel('Nome').fill(nomeUnico);
    await page.getByLabel('Descricao').fill('Primeira criacao');
    await page.getByRole('button', { name: 'Adicionar item' }).click();
    await expect(page.getByRole('heading', { name: nomeUnico })).toBeVisible();

    await page.getByLabel('Nome').fill(nomeUnico);
    await page.getByLabel('Descricao').fill('Tentativa duplicada');
    await page.getByRole('button', { name: 'Adicionar item' }).click();

    await expect(page.getByText(/ja existe um item com esse nome/i)).toBeVisible();
  });
});
