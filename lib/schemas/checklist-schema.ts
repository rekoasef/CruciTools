import { z } from 'zod';

const ChecklistResponseSchema = z.object({
  state: z.union([z.literal('ok'), z.literal('no_aplica'), z.literal('observacion')]),
  note: z.string().optional().nullable(), 
});

const MachineModelSchema = z.union([
    z.literal('drillor'),
    z.literal('plantor'),
]);

export const StartupChecklistSchema = z.object({
  client_name: z.string().min(3, { message: "El nombre del cliente es obligatorio." }),
  machine_serial: z.string().min(3, { message: "El número de serie es obligatorio." }),
  machine_model: MachineModelSchema,
  
  responses: z.record(z.string(), ChecklistResponseSchema)
    .refine((data) => Object.keys(data).length > 0, { message: "Debe completar al menos un punto." }),
    
  // --- CORRECCIÓN AQUÍ ---
  // Cambiamos 'puesta_en_marcha' por 'Puesta en Marcha' (Exacto como en la DB)
  type: z.literal('Puesta en Marcha').default('Puesta en Marcha'),
});

export type StartupChecklistData = z.infer<typeof StartupChecklistSchema>;