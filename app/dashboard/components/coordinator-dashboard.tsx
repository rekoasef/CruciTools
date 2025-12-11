// RUTA: /app/dashboard/components/coordinator-dashboard.tsx

// Este componente no es estrictamente necesario ya que el Coordinador es redirigido a /dashboard/assignments

import { redirect } from "next/navigation";

export default function CoordinatorDashboard() {
    // Ya que la lógica en /dashboard/page.tsx redirige al coordinador,
    // este componente actúa como un guardrail de fallback.
    redirect("/dashboard/assignments");
    return null;
}