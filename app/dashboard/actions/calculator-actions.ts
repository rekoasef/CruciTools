'use server';

import { createClient } from "@/utils/supabase/server";

// --- FUNCIÓN HELPER PARA ORDENAR NÚMEROS DENTRO DE TEXTO ---
// Convierte "35 cm" -> 35, "52.5 cm" -> 52.5 para poder ordenar bien
const sortByNumber = (a: any, b: any, field: string) => {
    const getNum = (str: string) => {
        // Busca el primer número (entero o decimal) en el texto
        const match = String(str).match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[0]) : 0;
    };
    return getNum(a[field]) - getNum(b[field]);
};


// 1. Obtener Cultivos (Orden alfabético normal)
export async function getCrops() {
    const supabase = createClient();
    // @ts-ignore
    const { data } = await supabase.from('seed_crops').select('*').order('name');
    return data || [];
}

// 2. Obtener Placas (Orden alfabético normal)
export async function getPlates(cropId: string) {
    const supabase = createClient();
    // @ts-ignore
    const { data } = await supabase
        .from('seed_plates')
        .select('*')
        .eq('crop_id', cropId)
        .order('name');
    return data || [];
}

// 3. Obtener Distancias (ORDEN NUMÉRICO: 35, 42, 52.5...)
export async function getSpacings(plateId: string) {
    const supabase = createClient();
    // @ts-ignore
    const { data } = await supabase
        .from('row_spacings')
        .select('*')
        .eq('plate_id', plateId);
    
    // Ordenamos en memoria usando el helper numérico
    return data?.sort((a, b) => sortByNumber(a, b, 'name')) || [];
}

// 4. Obtener Poblaciones (ORDEN NUMÉRICO: 50000, 60000, 100000...)
export async function getPopulations(spacingId: string, plateId: string) {
    const supabase = createClient();
    // @ts-ignore
    const { data } = await supabase
        .from('seed_populations')
        .select('*')
        .eq('spacing_id', spacingId)
        .eq('plate_id', plateId);
        
    // Ordenamos por el número dentro del nombre (ej: 50000 vs 100000)
    return data?.sort((a, b) => sortByNumber(a, b, 'name')) || [];
}

// 5. Obtener Velocidades Disponibles (ORDEN NUMÉRICO: 5 km/h, 5.5 km/h...)
export async function getAvailableSpeeds(populationId: string, spacingId: string) {
    const supabase = createClient();
    // @ts-ignore
    const { data } = await supabase
        .from('speed_limits')
        .select('speed_value')
        .eq('population_id', populationId)
        .eq('spacing_id', spacingId);
    
    // Ordenamos por el valor de velocidad
    return data?.sort((a, b) => sortByNumber(a, b, 'speed_value')) || [];
}

// 6. VERIFICAR RESULTADO FINAL
export async function checkSpeedLimit(populationId: string, spacingId: string, speedValue: string) {
    const supabase = createClient();
    
    // @ts-ignore
    const { data, error } = await supabase
        .from('speed_limits')
        .select('result')
        .eq('population_id', populationId)
        .eq('spacing_id', spacingId)
        .eq('speed_value', speedValue)
        .single();

    if (error || !data) {
        console.error("Error en simulador:", error);
        return { allowed: false, message: "Datos no encontrados para esta configuración." };
    }

    const text = data.result?.toLowerCase() || "";
    
    // Lógica flexible para detectar aprobación
    const isAllowed = 
        text.startsWith('si') || 
        text.includes('velocidad maxima') ||
        text.includes('velocidad minima'); // Asumimos que si sugiere velocidad mínima, es viable bajo condiciones
    
    return { 
        allowed: isAllowed, 
        message: data.result 
    };
}