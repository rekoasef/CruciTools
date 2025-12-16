'use client';

import { useState } from 'react';

export default function DoseControlPage() {
  const [selectedSpacing, setSelectedSpacing] = useState('');
  const [metersToRun, setMetersToRun] = useState(0);

  // Datos exactos copiados de la tabla de la imagen (Leaf Agrotronics)
  const DATA_TABLE = [
    { cm: "17,5", value: 57.10 },
    { cm: "19",   value: 52.60 },
    { cm: "21",   value: 47.60 },
    { cm: "26,25", value: 38.10 },
    { cm: "35",   value: 28.57 },
    { cm: "38",   value: 26.30 },
    { cm: "42",   value: 23.80 },
    { cm: "52,5", value: 19.05 },
  ];

  const handleSelection = (e: { target: { value: any; }; }) => {
    const spacing = e.target.value;
    setSelectedSpacing(spacing);
    
    // Buscar el valor correspondiente en la tabla
    const found = DATA_TABLE.find((item) => item.cm === spacing);
    if (found) {
      setMetersToRun(found.value);
    } else {
      setMetersToRun(0);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Control de Dosis (Kg/Ha)</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tabla de referencia oficial para control de siembra.
        </p>
      </div>
      
      {/* Tarjeta de Selección */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona la distancia entre líneas
        </label>
        
        {/* Selector (Dropdown) */}
        <select
          value={selectedSpacing}
          onChange={handleSelection}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white cursor-pointer"
        >
          <option value="" disabled>-- Seleccionar distancia --</option>
          {DATA_TABLE.map((item) => (
            <option key={item.cm} value={item.cm}>
              {item.cm} cm
            </option>
          ))}
        </select>

        {/* Resultado Visual */}
        <div className="mt-8 bg-teal-50 rounded-xl p-6 text-center border border-teal-100">
          <p className="text-teal-600 text-sm font-semibold uppercase tracking-wide">Debe recorrer</p>
          <div className="text-5xl font-bold text-teal-800 my-3">
            {metersToRun > 0 ? metersToRun.toFixed(2).replace('.', ',') : '---'}
          </div>
          <p className="text-teal-600 text-sm font-medium">metros lineales</p>
        </div>
      </div>

      {/* Nota Importante (Texto de la imagen) */}
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-1">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-orange-800 uppercase">Instrucciones de Calibración</h3>
            <div className="mt-2 text-sm text-orange-800 space-y-3 leading-relaxed">
              <p>
                <strong>1. Motores:</strong> La calibración se realiza del lado izquierdo (motores 1), tanto para semilla, fertilizante y alfalfero.
              </p>
              <p>
                <strong>2. Procedimiento:</strong> Colocar en las salidas que sean necesarias para controlar los kg en la hectárea.
              </p>
              <div className="bg-orange-100 p-3 rounded-md border border-orange-200">
                <p className="font-bold text-orange-900 mb-1">⚠️ IMPORTANTE: Demora de arranque</p>
                <p>
                  Contemplar el tiempo de demora del motor por avances de velocidad hasta llegar a <strong>1,5 km/h</strong>. 
                </p>
                <p className="mt-2">
                  Existe una demora aproximada de <strong>0,80 m (80 cm)</strong> que se le debe <u>sumar a la medición en grilla</u>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}