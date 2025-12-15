"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // CORRECCIÓN: Agregamos 'await'
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Credenciales inválidas. Intente nuevamente." };
  }

  return redirect("/dashboard");
};

export const signUp = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!email || !password || !fullName) {
    return { error: "Todos los campos son obligatorios" };
  }

  // CORRECCIÓN: Agregamos 'await'
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error(error);
    return { error: "No se pudo registrar el usuario" };
  }

  return { success: "Revise su correo para confirmar la cuenta" };
};

export const signOut = async () => {
  // CORRECCIÓN: Agregamos 'await'
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};