import { test, expect } from '@playwright/test';

test('Debería crear una nueva asignación correctamente', async ({ page }) => {
  
  // 1. LOGIN (Usa tus credenciales reales)
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'rasef@crucianelli.com'); 
  await page.fill('input[name="password"]', 'rekocarp'); 
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  
  // Esperar a entrar al dashboard
  await expect(page).toHaveURL('http://localhost:3000/dashboard');

  // 2. IR A ASIGNACIONES
  await page.goto('http://localhost:3000/dashboard/assignments');

  // 3. LLENAR FORMULARIO
  
  // Selectores (Técnico y Servicio)
  // Nota: Si falla, prueba usar .selectOption({ label: 'Nombre Mecanico' })
  await page.locator('select[name="technician_id"]').selectOption({ index: 1 });
  await page.locator('select[name="service_type_id"]').selectOption({ index: 1 });

  // Fechas (Formato HTML Standard: AAAA-MM-DD)
  await page.fill('input[name="start_date"]', '2025-12-15');
  await page.fill('input[name="due_date"]', '2025-12-17');

  // Datos Cliente
  await page.fill('input[name="client_name"]', 'Cliente Test Robot');
  await page.fill('input[name="machine_model"]', 'Sembradora Robot 3000');
  await page.fill('input[name="machine_serial"]', 'SN-9999'); // Agregué serie por si acaso
  await page.fill('input[name="client_location"]', 'Rosario, Santa Fe');

  // --- CORRECCIÓN: LLENAR DESCRIPCIÓN / NOTAS ---
  await page.fill('textarea[name="notes"]', 'Esta es una prueba automatizada creada por el robot.');
  // ----------------------------------------------

  // 4. ENVIAR (Esperamos a que el botón no esté deshabilitado)
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  await page.click('button[type="submit"]');

  // 5. VALIDAR ÉXITO
  // Aumentamos el timeout a 10s por si la base de datos está lenta
  await expect(page.getByText('Asignación creada correctamente')).toBeVisible({ timeout: 10000 });
});