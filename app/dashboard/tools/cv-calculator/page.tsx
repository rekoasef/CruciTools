'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CvCalculatorPage() {
  const router = useRouter();

  // Estado para guardar las distancias. Iniciamos con 2 inputs vacíos.
  const [inputs, setInputs] = useState<string[]>(['', '']);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar cambios en los inputs
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    // Limpiamos resultados previos si editan
    setResult(null);
    setError(null);
  };

  // Agregar un nuevo campo
  const addInput = () => {
    setInputs([...inputs, '']);
  };

  // Borrar un campo específico (UX)
  const removeInput = (index: number) => {
    if (inputs.length <= 2) return; // Mínimo 2 datos
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  // Lógica Matemática (Igual a DESVESTA / PROMEDIO * 100)
  const calculateCV = () => {
    // 1. Filtrar vacíos y convertir a números
    const data = inputs
      .map((val) => parseFloat(val.replace(',', '.'))) // Acepta coma o punto
      .filter((val) => !isNaN(val));

    // 2. Validaciones
    if (data.length < 2) {
      setError('Se necesitan al menos 2 datos válidos.');
      return;
    }

    // 3. Calcular Promedio (Media)
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;

    if (mean === 0) {
      setError('El promedio no puede ser 0.');
      return;
    }

    // 4. Calcular Desviación Estándar Muestral (DESVESTA)
    // Fórmula: Raíz( Sumatoria(x - media)^2 / (n - 1) )
    const squaredDiffs = data.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (data.length - 1);
    const stdDev = Math.sqrt(variance);

    // 5. Calcular Coeficiente de Variación
    const cv = (stdDev / mean) * 100;

    // 6. Mostrar resultado (con 2 decimales)
    setResult(cv.toFixed(2));
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header Simple */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="text-gray-600 font-medium hover:text-gray-900"
        >
          ← Volver
        </button>
        <h1 className="text-xl font-bold text-gray-800">Calculadora CV</h1>
        <div className="w-12"></div> {/* Espaciador para centrar título */}
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-4">
            Ingresa las distancias entre semillas (cm). Mínimo 2 datos.
          </p>

          {/* Lista de Inputs */}
          <div className="space-y-3">
            {inputs.map((val, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-gray-400 text-sm w-6 text-center">{index + 1}.</span>
                <input
                  type="number"
                  inputMode="decimal" // Teclado numérico en celular
                  placeholder="Ej: 15"
                  value={val}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                />
                {inputs.length > 2 && (
                  <button
                    onClick={() => removeInput(index)}
                    className="text-red-400 hover:text-red-600 p-2"
                    aria-label="Borrar"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botón Agregar */}
        <button
          onClick={addInput}
          className="w-full mb-4 py-3 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          + Agregar otro dato
        </button>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Botón Calcular */}
        <button
          onClick={calculateCV}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition-transform active:scale-95"
        >
          Calcular CV %
        </button>

        {/* Resultado */}
        {result !== null && (
          <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-100 text-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-green-600 font-medium mb-1">Coeficiente de Variación</p>
            <p className="text-4xl font-extrabold text-green-700">{result}%</p>
            
            {/* Interpretación básica agronómica (Opcional) */}
            <p className="text-sm text-green-800 mt-2 opacity-80">
              {parseFloat(result) < 15 ? '✅ Excelente Uniformidad' : 
               parseFloat(result) < 29 ? '⚠️ Variabilidad Media' : '❌ Alta Variabilidad'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}