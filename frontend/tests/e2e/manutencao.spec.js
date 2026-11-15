import { expect, test } from '@playwright/test';

test('fluxo completo: cadastra equipamento, abre ordem, avanca status e persiste apos reload', async ({
  page,
}) => {
  const nome = `Compressor E2E ${Date.now()}`;
  await page.goto('/');

  await page.getByLabel('Nome do equipamento').fill(nome);
  await page.getByLabel('Local').fill('Galpao A');
  await page.getByRole('button', { name: 'Cadastrar equipamento' }).click();
  await expect(page.getByRole('heading', { name: nome })).toBeVisible();

  const cartao = page.getByRole('listitem').filter({ hasText: nome });
  await cartao.getByRole('button', { name: 'Ver ordens' }).click();
  await cartao.getByLabel('Descrição do problema').fill('Vazamento de oleo');
  await cartao.getByLabel('Responsável').fill('Carlos');
  await cartao.getByRole('button', { name: 'Abrir ordem' }).click();
  await expect(cartao.getByText('Carlos · Aberta')).toBeVisible();

  await cartao.getByRole('button', { name: 'Iniciar' }).click();
  await expect(cartao.getByText('Carlos · Em andamento')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: nome })).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: nome })
    .getByRole('button', { name: 'Ver ordens' })
    .click();
  await expect(page.getByText('Carlos · Em andamento')).toBeVisible();
});

test('exibe erro do backend para nome duplicado', async ({ page }) => {
  const nome = `Duplicado E2E ${Date.now()}`;
  await page.goto('/');

  await page.getByLabel('Nome do equipamento').fill(nome);
  await page.getByRole('button', { name: 'Cadastrar equipamento' }).click();
  await expect(page.getByRole('heading', { name: nome })).toBeVisible();

  await page.getByLabel('Nome do equipamento').fill(nome);
  await page.getByRole('button', { name: 'Cadastrar equipamento' }).click();

  await expect(
    page.getByRole('alert').filter({ hasText: /ja existe um equipamento/i }),
  ).toBeVisible();
});
