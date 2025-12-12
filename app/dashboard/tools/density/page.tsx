"use client";

import { useState } from "react";
import { ArrowRightLeft, Calculator, Sprout, Info } from "lucide-react";

export default function SeedsCalculatorPage() {
  const [mode, setMode] = useState<'toHa' | 'toMetro'>('toHa');
  
  // Estados para los inputs
  const [rowSpacingSelect, setRowSpacingSelect] = useState<string>("0.52"); // Valor por defecto común
  const [customRowSpacing, setCustomRowSpacing] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  // Estados para resultados
  const [resultMain, setResultMain] = useState<number | null>(null); // El resultado principal (Sem/m o Sem/Ha)
  const [resultDistance, setResultDistance] = useState<number | null>(null); // Distancia entre semillas (cm)

  const handleCalculate = () => {
    // 1. Determinar la distancia entre líneas (en metros)
    let spacing = rowSpacingSelect === "custom" ? parseFloat(customRowSpacing) : parseFloat(rowSpacingSelect);
    
    // 2. Obtener el valor de entrada (Semillas)
    const value = parseFloat(inputValue);

    if (!spacing || spacing <= 0 || !value || value <= 0) {
      alert("Por favor ingresa valores válidos mayor a 0.");
      return;
    }

    if (mode === 'toHa') {
      // MODO: Tengo Semillas/Metro --> Quiero Semillas/Hectárea
      // Fórmula: (100 * SemillasPorMetro) * (100 / DistanciaEntreLíneas)
      // Simplificado matemáticamente: (value * 10000) / spacing
      
      const semHa = (100 * value) * (100 / spacing);
      const distSemillas = 100 / value; // cm

      setResultMain(Math.round(semHa)); // Redondeamos para que no queden decimales feos en población
      setResultDistance(parseFloat(distSemillas.toFixed(2))); // 2 decimales para cm
    } else {
      // MODO: Tengo Semillas/Hectárea --> Quiero Semillas/Metro
      // Fórmula: semillasPorHectárea / (100/distanciaEntreLíneas) / 100
      
      const semMetro = value / (100 / spacing) / 100;
      const distSemillas = 100 / semMetro; // cm (Usamos el resultado calculado)

      setResultMain(parseFloat(semMetro.toFixed(2))); // 2 decimales para semillas por metro
      setResultDistance(parseFloat(distSemillas.toFixed(2)));
    }
  };

  // Resetear resultados al cambiar de modo
  const handleModeChange = (newMode: 'toHa' | 'toMetro') => {
    setMode(newMode);
    setResultMain(null);
    setResultDistance(null);
    setInputValue("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sprout className="w-8 h-8 text-brand-red" />
          Calculadora de Siembra
        </h1>
        <p className="text-gray-500">Convierte densidad de siembra y calcula espaciamiento.</p>
      </div>

      {/* Tabs Selector de Modo */}
      <div className="bg-white p-1 rounded-xl border border-gray-200 flex overflow-hidden shadow-sm">
        <button
          onClick={() => handleModeChange('toHa')}
          className={`flex-1 py-3 text-sm font-medium transition-all rounded-lg flex justify-center items-center gap-2 ${
            mode === 'toHa' 
              ? 'bg-red-50 text-brand-red ring-1 ring-brand-red/20 shadow-sm' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Tengo Sem/Metro
        </button>
        <button
          onClick={() => handleModeChange('toMetro')}
          className={`flex-1 py-3 text-sm font-medium transition-all rounded-lg flex justify-center items-center gap-2 ${
            mode === 'toMetro' 
              ? 'bg-red-50 text-brand-red ring-1 ring-brand-red/20 shadow-sm' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Tengo Sem/Hectárea
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Parámetros de Configuración
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input 1: Distancia entre líneas */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Distancia entre líneas (Metros)
              </label>
              <select 
                value={rowSpacingSelect}
                onChange={(e) => setRowSpacingSelect(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
              >
                <option value="0.35">0.35 m (35 cm)</option>
                <option value="0.38">0.38 m (38 cm)</option>
                <option value="0.42">0.42 m (42 cm)</option>
                <option value="0.52">0.52 m (52 cm)</option>
                <option value="0.70">0.70 m (70 cm)</option>
                <option value="custom">Otro (Manual)</option>
              </select>

              {/* Input extra si elige 'Otro' */}
              {rowSpacingSelect === "custom" && (
                <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                   <input 
                    type="number" 
                    value={customRowSpacing}
                    onChange={(e) => setCustomRowSpacing(e.target.value)}
                    placeholder="Ej: 0.21" 
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none" 
                  />
                  <p className="text-xs text-gray-400 mt-1">Ingresa el valor en metros (ej. 21cm = 0.21)</p>
                </div>
              )}
            </div>
            
            {/* Input 2: Valor Variable (Sem/m o Sem/Ha) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {mode === 'toHa' ? 'Semillas por metro lineal' : 'Población deseada (Sem/Ha)'}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={mode === 'toHa' ? "Ej: 12.5" : "Ej: 70000"} 
                  className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-lg font-medium" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {mode === 'toHa' ? 'sem/m' : 'sem/ha'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full btn-primary py-4 text-lg shadow-lg mt-4 flex items-center justify-center gap-2 font-bold tracking-wide"
          >
            <Calculator className="w-5 h-5" />
            CALCULAR
          </button>
        </div>

        {/* PANEL DERECHO: RESULTADOS */}
        <div className="lg:col-span-1">
          <div className={`h-full bg-brand-dark rounded-xl shadow-lg p-6 text-white flex flex-col justify-center transition-all duration-500 ${resultMain ? 'opacity-100 translate-x-0' : 'opacity-50 lg:opacity-100'}`}>
            
            {!resultMain ? (
              <div className="text-center opacity-40">
                <Info className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Ingresa los datos y presiona calcular para ver los resultados aquí.</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in zoom-in-95 duration-300">
                {/* Resultado Principal */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                    {mode === 'toHa' ? 'Población Estimada' : 'Calibración Necesaria'}
                  </p>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                    {resultMain.toLocaleString('es-AR')}
                  </div>
                  <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs">
                    {mode === 'toHa' ? 'semillas / hectárea' : 'semillas / metro'}
                  </span>
                </div>

                <div className="w-full h-px bg-white/10"></div>

                {/* Resultado Secundario: Distancia entre semillas */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                    Distancia entre semillas
                  </p>
                  <div className="text-3xl font-bold text-brand-red mb-1">
                    {resultDistance?.toLocaleString('es-AR')} <span className="text-xl text-white/60">cm</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Espacio teórico entre cada semilla
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}