const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5501/interfas_pu/index.html');
});

test.describe('Formulario de contacto', () => {
  test('debería generar el mailto correctamente', async ({ page }) => {
    // Rellenar campos
    await page.getByLabel('Nombre Completo').fill('Danna');
    await page.getByLabel('Correo electrónico').fill('danna@gmail.com');
    await page.getByLabel('Mensaje').fill('Hola, este es un mensaje de prueba.');

    // Interceptamos la acción de clic en el <a id="trucazo"> para verificar el href generado
    await page.evaluate(() => {
      window._clickedHref = null;
      const link = document.querySelector('#trucazo');
      link.click = () => {
        window._clickedHref = link.href;
      };
    });

    // Hacer submit
    await page.getByRole('button', { name: 'ENVIAR FORMULARIO' }).click();

    // Verificar que el mailto sea el correcto
    const href = await page.evaluate(() => window._clickedHref);
    expect(href).toBe(
      'mailto:danna.lopez@vallegrande.edu.pe?subject=nombre%20Danna%20%20correo%20danna@gmail.com&body=Hola,%20este%20es%20un%20mensaje%20de%20prueba.'
    );
  });

  test('deberían vaciarse los campos luego del envío (si el formulario lo hace)', async ({ page }) => {
    const inputName = page.getByLabel('Nombre Completo');
    const inputEmail = page.getByLabel('Correo electrónico');
    const inputMessage = page.getByLabel('Mensaje');

    await inputName.fill('Danna');
    await inputEmail.fill('danna@gmail.com');
    await inputMessage.fill('Mensaje de prueba');

    await page.getByRole('button', { name: 'ENVIAR FORMULARIO' }).click();

    // Esperar un poco para que el formulario se procese
    await page.waitForTimeout(1000);  // Aumentamos el tiempo de espera

    // Si el formulario vacía los campos, verifica:
    await expect(inputName).toBeEmpty();
    await expect(inputEmail).toBeEmpty();
    await expect(inputMessage).toBeEmpty();
  });
});
