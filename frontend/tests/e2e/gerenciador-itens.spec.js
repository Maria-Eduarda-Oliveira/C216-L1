import { expect, test } from '@playwright/test';

test.describe('Gerenciador de itens', () => {
  test('adiciona um item e exibe na lista', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Nome').fill('Caderno');
    await page.getByLabel('Descricao').fill('Caderno universitario novo');
    await page.getByRole('button', { name: 'Adicionar item' }).click();

    await expect(page.getByRole('heading', { name: 'Caderno' })).toBeVisible();
    await expect(page.getByText('Caderno universitario novo')).toBeVisible();
  });

  test('exibe mensagem de validacao quando o nome e muito curto', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Nome').fill('ab');
    await page.getByRole('button', { name: 'Adicionar item' }).click();

    await expect(page.getByText(/pelo menos 3 caracteres/i)).toBeVisible();
  });

  test('remove um item da lista', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Nome').fill('Caderno');
    await page.getByLabel('Descricao').fill('Caderno universitario novo');
    await page.getByRole('button', { name: 'Adicionar item' }).click();

    await page.getByRole('button', { name: 'Remover' }).click();

    await expect(page.getByText('Caderno')).not.toBeVisible();
  });
});
