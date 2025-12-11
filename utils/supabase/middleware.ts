import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Creamos una respuesta inicial.
  // Es importante hacer esto al principio porque necesitamos modificar sus headers (cookies)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Instanciamos el cliente de Supabase para Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Actualizamos la cookie en la petición
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Actualizamos la cookie en la respuesta final
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 3. Obtenemos el usuario actual
  // IMPORTANTE: getUser() valida el token contra Supabase Auth de forma segura
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. Lógica de Protección de Rutas
  // Rutas protegidas: todas excepto login, signup, auth/callback y recursos estáticos
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup');
  
  // A. Si NO está logueado y NO está en una ruta de auth -> Mandarlo al Login
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // B. Si SÍ está logueado y trata de entrar al Login -> Mandarlo al Dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // 5. Devolvemos la respuesta con las cookies actualizadas (refresh token)
  return response
}