import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// NOTA: Este cliente usa la SERVICE_ROLE_KEY.
// Solo debe usarse en el servidor (Server Actions o API Routes).
// NUNCA lo importes en un componente 'use client'.

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}