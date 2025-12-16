'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Base de datos extraída de la imagen
const WHEEL_DATA = {
  'PSIII Y PIV': {
    headers: ['Cubierta 7.5x16 (Siembra/Fert)', 'Cubierta 5.00x15 (2º Fert)'],
    data: [
      { dist: 17.5, val1: 22.5, val2: 28 },
      { dist: 20,   val1: 19.7, val2: 24.5 },
      { dist: 23.3, val1: 16.9, val2: 21 },
      { dist: 35,   val1: 11.3, val2: 14 },
      { dist: 40,   val1: 9.8,  val2: 12.3 },
      { dist: 46.6, val1: 8.4,  val2: 10.5 },
      { dist: 52.5, val1: 7.5,  val2: 9.3 },
      { dist: 70,   val1: 5.6,  val2: 7 },
    ]
  },
  'GRINGA V': {
    headers: ['Cubierta 6.50x16 (Siembra/Fert)'],
    data: [
      { dist: 42,   val1: 10.0 },
      { dist: 52.5, val1: 8.0 },
      { dist: 70,   val1: 6.0 },
      { dist: 100,  val1: 4.2 },
    ]
  },
  'GRINGA 70/35': {
    headers: ['Cubierta 7.5x16 (Siembra/Fert)'],
    data: [
      { dist: 35,   val1: 11.3 },
      { dist: 38.1, val1: 10.4 },
      { dist: 42,   val1: 9.4 },
      { dist: 52.5, val1: 7.5 },
      { dist: 70,   val1: 5.6 },
    ]
  }
};

export default function WheelTurnsPage() {
  const router = useRouter();
  
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedDist, setSelectedDist] = useState<string>('');

  // Obtener opciones de distancia según el modelo seleccionado
  const availableDistances = useMemo(() => {
    if (!selectedModel) return [];
    // @ts-ignore
    return WHEEL_DATA[selectedModel].data.map((d) => d.dist);
  }, [selectedModel]);

  // Buscar el resultado
  const result = useMemo(() => {
    if (!selectedModel || !selectedDist) return null;
    // @ts-ignore
    const modelData = WHEEL_DATA[selectedModel];
    const found = modelData.data.find((d: any) => d.dist.toString() === selectedDist);
    
    return {
      headers: modelData.headers,
      values: found
    };
  }, [selectedModel, selectedDist]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    setSelectedDist(''); // Resetear distancia al cambiar modelo
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="text-gray-600 font-medium hover:text-gray-900"
        >
          ← Volver
        </button>
        <h1 className="text-xl font-bold text-gray-800">Vueltas de Rueda</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-500 mb-6">
          Calcula las vueltas de la rueda de mando (1/10 ha) según el modelo y separación.
        </p>

        {/* 1. Selector de Modelo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo de Máquina
          </label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Seleccionar Modelo --</option>
            {Object.keys(WHEEL_DATA).map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* 2. Selector de Distancia (Aparece cuando hay modelo) */}
        {selectedModel && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distancia entre líneas (cm)
            </label>
            <select
              value={selectedDist}
              onChange={(e) => setSelectedDist(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Seleccionar Distancia --</option>
              {availableDistances.map((dist: number) => (
                <option key={dist} value={dist}>{dist} cm</option>
              ))}
            </select>
          </div>
        )}

        {/* 3. Resultado */}
        {result && (
          <div className="bg-blue-50 rounded-xl border border-blue-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
              <p className="text-blue-800 font-semibold text-sm text-center">
                Vueltas para {selectedDist} cm
              </p>
            </div>
            
            <div className="p-4 grid gap-4">
              {/* Resultado 1 */}
              <div className="text-center">
                <p className="text-xs text-blue-600 uppercase font-bold tracking-wide mb-1">
                  {result.headers[0]}
                </p>
                <p className="text-4xl font-extrabold text-blue-900">
                  {result.values.val1}
                </p>
                <p className="text-sm text-blue-700">vueltas</p>
              </div>

              {/* Resultado 2 (Solo si existe, caso PSIII) */}
              {result.values.val2 && (
                <>
                  <div className="border-t border-blue-200"></div>
                  <div className="text-center">
                    <p className="text-xs text-blue-600 uppercase font-bold tracking-wide mb-1">
                      {result.headers[1]}
                    </p>
                    <p className="text-4xl font-extrabold text-blue-900">
                      {result.values.val2}
                    </p>
                    <p className="text-sm text-blue-700">vueltas</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}