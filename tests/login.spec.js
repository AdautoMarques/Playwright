import { test, expect } from "@playwright/test";
import { obterCodigo2FA } from "../support/db";
import { LoginPage } from "../pages/loginPage";
import { DashPage } from "../pages/DashPage";

test("Não deve logar quando o codigo de autenticacao e invalido", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const usuario = {
    cpf: "00000014141",
    senha: "147258",
  };
  await loginPage.acessaPagina();
  await loginPage.preencheCpf(usuario.cpf);
  await loginPage.preencheSenha(usuario.senha);

  await loginPage.informe2fa("123456");
  await page.waitForTimeout(2000);
  await expect(page.locator("span")).toContainText(
    "Código inválido. Por favor, tente novamente."
  );
});

test("Deve acessar a conta do usuario", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashPage = new DashPage(page);
  const usuario = {
    cpf: "00000014141",
    senha: "147258",
  };
  await loginPage.acessaPagina();
  await loginPage.preencheCpf(usuario.cpf);
  await loginPage.preencheSenha(usuario.senha);

  await page.waitForTimeout(3000);
  const codigo = await obterCodigo2FA();

  await loginPage.informe2fa(codigo);
  await page.waitForTimeout(2000);

  expect(await dashPage.obterSaldo()).toHaveText("R$ 5.000,00");
});
