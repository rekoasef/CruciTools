'use client';

import { useState, useEffect } from "react";
import { getCrops, getPlates, getSpacings, getPopulations, getAvailableSpeeds, checkSpeedLimit } from "@/app/dashboard/actions/calculator-actions";
import { Calculator, Sprout, Settings, ArrowRight, CheckCircle, AlertOctagon, Loader2, Ruler, LayoutGrid } from "lucide-react";

export default function SeedCalculatorPage() {
    // Listas de datos
    const [crops, setCrops] = useState<any[]>([]);
    const [plates, setPlates] = useState<any[]>([]);
    const [spacings, setSpacings] = useState<any[]>([]);
    const [populations, setPopulations] = useState<any[]>([]);
    const [speeds, setSpeeds] = useState<any[]>([]);

    // Selecciones del usuario
    const [selectedCrop, setSelectedCrop] = useState("");
    const [selectedPlate, setSelectedPlate] = useState("");
    const [selectedSpacing, setSelectedSpacing] = useState("");
    const [selectedPopulation, setSelectedPopulation] = useState("");
    const [selectedSpeed, setSelectedSpeed] = useState("");

    // Resultado
    const [result, setResult] = useState<{ allowed: boolean, message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // Carga inicial
    useEffect(() => {
        async function load() {
            const data = await getCrops();
            setCrops(data);
        }
        load();
    }, []);

    // --- MANEJADORES DE CAMBIO (CASCADA) ---

    const handleCropChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedCrop(id);
        // Reseteamos todo lo de abajo
        setSelectedPlate(""); setPlates([]); 
        setSelectedSpacing(""); setSpacings([]);
        setSelectedPopulation(""); setPopulations([]);
        setSelectedSpeed(""); setSpeeds([]);
        setResult(null);

        if (id) {
            const data = await getPlates(id);
            setPlates(data);
        }
    };

    const handlePlateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedPlate(id);
        setSelectedSpacing(""); setSpacings([]);
        setSelectedPopulation(""); setPopulations([]);
        setSelectedSpeed(""); setSpeeds([]);
        setResult(null);

        if (id) {
            const data = await getSpacings(id);
            setSpacings(data);
        }
    };

    const handleSpacingChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedSpacing(id);
        setSelectedPopulation(""); setPopulations([]);
        setSelectedSpeed(""); setSpeeds([]);
        setResult(null);

        if (id && selectedPlate) {
            const data = await getPopulations(id, selectedPlate);
            setPopulations(data);
        }
    };

    const handlePopulationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedPopulation(id);
        setSelectedSpeed(""); setSpeeds([]);
        setResult(null);

        if (id && selectedSpacing) {
            const data = await getAvailableSpeeds(id, selectedSpacing);
            setSpeeds(data);
        }
    };

    const handleCalculate = async () => {
        if (!selectedSpeed) return;
        setLoading(true);
        const res = await checkSpeedLimit(selectedPopulation, selectedSpacing, selectedSpeed);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-10">
            <header className="flex items-center gap-3 border-b border-gray-100 pb-6">
                <div className="p-3 bg-red-50 rounded-xl text-brand-red">
                    <Calculator className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Calculadora de Siembra</h1>
                    <p className="text-gray-500 text-sm">Verifica la velocidad óptima según tu configuración.</p>
                </div>
            </header>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                
                {/* 1. CULTIVO */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">1. Cultivo</label>
                    <div className="relative">
                        <Sprout className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select 
                            className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all cursor-pointer" 
                            onChange={handleCropChange} 
                            value={selectedCrop}
                        >
                            <option value="">Seleccionar Cultivo...</option>
                            {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* 2. PLACA */}
                <div className={`transition-opacity duration-300 ${!crops.length ? 'opacity-50' : 'opacity-100'}`}>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">2. Tipo de Placa</label>
                    <div className="relative">
                        <Settings className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select 
                            className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all disabled:cursor-not-allowed" 
                            onChange={handlePlateChange} 
                            value={selectedPlate} 
                            disabled={!plates.length}
                        >
                            <option value="">{plates.length ? 'Seleccionar Placa...' : 'Esperando cultivo...'}</option>
                            {plates.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 3. DISTANCIA */}
                    <div className={`transition-opacity duration-300 ${!selectedPlate ? 'opacity-50' : 'opacity-100'}`}>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">3. Distancia entre líneas</label>
                        <div className="relative">
                            <Ruler className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <select 
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all disabled:cursor-not-allowed" 
                                onChange={handleSpacingChange} 
                                value={selectedSpacing} 
                                disabled={!spacings.length}
                            >
                                <option value="">{spacings.length ? 'Seleccionar...' : '-'}</option>
                                {spacings.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 4. POBLACIÓN */}
                    <div className={`transition-opacity duration-300 ${!selectedSpacing ? 'opacity-50' : 'opacity-100'}`}>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">4. Población (Sem/Ha)</label>
                        <div className="relative">
                            <LayoutGrid className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <select 
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all disabled:cursor-not-allowed" 
                                onChange={handlePopulationChange} 
                                value={selectedPopulation} 
                                disabled={!populations.length}
                            >
                                <option value="">{populations.length ? 'Seleccionar...' : '-'}</option>
                                {populations.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 5. VELOCIDAD Y RESULTADO */}
                {speeds.length > 0 && (
                    <div className="pt-6 mt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                        <label className="block text-center text-sm font-bold text-gray-900 mb-4">
                            ¿A qué velocidad quieres sembrar?
                        </label>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select 
                                className="flex-1 p-4 border-2 border-blue-100 rounded-xl bg-white outline-none focus:border-blue-500 text-lg font-bold text-center text-gray-800 shadow-sm cursor-pointer hover:border-blue-200 transition-colors"
                                value={selectedSpeed}
                                onChange={(e) => { setSelectedSpeed(e.target.value); setResult(null); }}
                            >
                                <option value="">Elegir Km/h...</option>
                                {speeds.map((s, i) => <option key={i} value={s.speed_value}>{s.speed_value}</option>)}
                            </select>
                            
                            <button 
                                onClick={handleCalculate}
                                disabled={!selectedSpeed || loading}
                                className="bg-brand-red text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:shadow-red-300 active:scale-95"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <ArrowRight className="w-5 h-5" />}
                                {loading ? 'Verificando...' : 'Verificar'}
                            </button>
                        </div>
                    </div>
                )}

                {/* TARJETA DE RESULTADO */}
                {result && (
                    <div className={`mt-6 p-5 rounded-2xl border-2 flex items-start gap-4 animate-in zoom-in-95 duration-300 shadow-sm ${result.allowed ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <div className={`p-2 rounded-full shrink-0 ${result.allowed ? 'bg-green-100' : 'bg-red-100'}`}>
                            {result.allowed ? <CheckCircle className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{result.allowed ? 'Velocidad Aprobada' : 'No Recomendada'}</h3>
                            <p className="font-medium opacity-90 text-sm leading-relaxed">{result.message}</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}