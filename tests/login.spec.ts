import { test, expect } from '@playwright/test';

test('Debería poder iniciar sesión como Coordinador', async ({ page }) => {
  // 1. Ir al login
  await page.goto('http://localhost:3000/login');

  // 2. Llenar credenciales (Revisa que los selectores 'input[name="..."]' sean correctos en tu HTML)
  await page.fill('input[name="email"]', 'rasef@crucianelli.com'); // <--- Poner email real de tu DB local
  await page.fill('input[name="password"]', 'rekocarp'); // <--- Poner pass real

  // 3. Hacer clic en el botón
  // CAMBIO CLAVE: Buscamos el botón por su rol y el texto aproximado (ignora mayúsculas)
  // Si tu botón dice "Ingresar", "Entrar" o "Iniciar", esto lo encontrará.
  await page.getByRole('button').click(); 

  // 4. Verificar redirección
  // Aumentamos un poco el tiempo de espera por si la carga es lenta la primera vez
  await expect(page).toHaveURL('http://localhost:3000/dashboard', { timeout: 10000 });
});