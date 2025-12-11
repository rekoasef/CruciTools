'use server';

/**
 * Simula el cálculo de distancia entre dos puntos.
 */
export async function calculateDistanceMock(origin: string, destination: string) {
    // Simulación de Latencia
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!origin || !destination) {
        return { km: 0, error: "Faltan ubicaciones para calcular." };
    }

    // Retorna un número aleatorio entre 15 y 450
    const randomKm = Math.floor(Math.random() * (450 - 15 + 1)) + 15;

    return { 
        km: randomKm, 
        error: null,
        message: "Cálculo de ruta exitoso (Simulado)" 
    };
}