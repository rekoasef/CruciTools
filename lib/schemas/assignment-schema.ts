import { z } from 'zod';

export const AssignmentSchema = z.object({
  // FKs obligatorias
  technician_id: z.string().uuid({ message: "Debe seleccionar un técnico válido." }),
  service_type_id: z.string().uuid({ message: "Debe seleccionar un tipo de servicio." }),
  
  // Datos del cliente y la máquina
  client_name: z.string().min(5, { message: "El nombre del cliente es obligatorio (min. 5 chars)." }),
  machine_model: z.string().min(3, { message: "El modelo de la máquina es obligatorio." }),
  machine_serial: z.string().min(3, { message: "El número de serie es obligatorio." }).optional().nullable(),
  
  // --- NUEVOS CAMPOS FASE 4.1 (AQUÍ ESTABA EL ERROR) ---
  client_location: z.string().min(3, { message: "La ubicación del cliente es obligatoria." }),
  origin_location: z.string().default('Planta Crucianelli, Armstrong'), 
  distance_km: z.number().min(0).default(0),
  // ----------------------------------------------------

  // Notas y Fechas
  notes: z.string().min(10, { message: "Debe incluir una descripción/notas de la falla (min. 10 chars)." }),
  due_date: z.string().optional().nullable(),
});

export type AssignmentData = z.infer<typeof AssignmentSchema>;