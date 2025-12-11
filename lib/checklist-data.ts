export type ChecklistItem = {
  id: string;
  label: string;
  category: string;
};

export type MachineChecklist = {
  model: string;
  title: string;
  items: ChecklistItem[];
};

export const CHECKLISTS_DATA: Record<string, MachineChecklist> = {
// =======================================================================
  // DRILOR (IS22008-0) - ORDEN FINAL Y COMPLETO
  // =======================================================================
  drillor: {
    model: "drillor",
    title: "Puesta en Marcha - Sembradora Drillor",
    items: [
      // 1. VERIFICACIÓN INICIAL
      { category: "1. Verificación Inicial", id: "1.1", label: "Cumplimiento del certificado de recepción." },
      { category: "1. Verificación Inicial", id: "1.2", label: "Cumplimiento del certificado de preentrega." },
      
      // 2. CARGA Y DESCARGA DEL CARRETÓN / 3. INTRODUCCIÓN
      { category: "3. Introducción", id: "3.1", label: "Muestra de manual y política de garantía al cliente." },

      // 4. TRACTOR
      { category: "4. Tractor", id: "4.1", label: "Verificación de las especificaciones técnicas del tractor vs. máquina." },
      { category: "4. Tractor", id: "4.2", label: "Colocación del monitor y cableado en cabina (Conectar siempre directo a batería)." },
      { category: "4. Tractor", id: "4.3", label: "Chequear diametro perno enganche tractor con puntera de enganche." },
      { category: "4. Tractor", id: "4.5", label: "Vinculación y medición de caudales hidráulicos (Chasis, Alas, Turbinas, Drenaje)." },
      { category: "4. Tractor", id: "4.7", label: "Medición 540 RPM en toma de fuerza del tractor." },
      { category: "4. Tractor", id: "4.9", label: "Colocación y regulación del radar (35° inclinación, 80 cm suelo)." },
      
      // 5. PASAJE DE TRANSPORTE A TRABAJO
      { category: "5. Pasa de Transporte a Trabajo", id: "5.1", label: "Capacitar al cliente para el paso de transporte a trabajo y viceversa." },

      // 6. RIENDAS ROSCADAS
      { category: "6. Riendas Roscadas", id: "6.1", label: "Regulación de riendas chasis central (Largo 925)." },
      { category: "6. Riendas Roscadas", id: "6.3", label: "Regulación de riendas del carro portaherramientas." },
      { category: "6. Riendas Roscadas", id: "6.4", label: "Alineación de alas con respecto al chasis central (Largo 1275)." },
      { category: "6. Riendas Roscadas", id: "6.5", label: "Regular tope trasero roscado del balancín ruedas alas (dejar 15mm libres)." },

      // 7. TREN DE SIEMBRA
      { category: "7. Tren de Siembra", id: "7.1", label: "Alineación de cuchillas de corte." },
      { category: "7. Tren de Siembra", id: "7.2", label: "Regulación de profundidad y presión cuchillas (5 hilos de rosca)." },
      { category: "7. Tren de Siembra", id: "7.6", label: "Regulación de profundidad de siembra." },
      { category: "7. Tren de Siembra", id: "7.7", label: "Regulación de presión, alineación y posición de ruedas tapadoras." },
      { category: "7. Tren de Siembra", id: "7.8", label: "Posición de trabajo de las ruedas niveladoras." },

      // 8. DOSIFICADOR MONOGRANO
      { category: "8. Dosificador Monograno", id: "8.1", label: "Colocación de placas, enrasadores y expulsores correspondientes." },
      { category: "8. Dosificador Monograno", id: "8.2", label: "Regulación de las guillotinas de entrada." },
      
      // 9. SENSORES
      { category: "9. Sensores", id: "9.1", label: "Regulación de sensores de levante 1 (Discos apoyando, sensando Activo)." },
      { category: "9. Sensores", id: "9.2", label: "Regulación de sensores de levante 2 (Recorrer unos metros con máquina clavada, sensando Activo)." },
      { category: "9. Sensores", id: "9.3", label: "Verificación de posición correcta de sensores de velocidad y RPM." },

      // 10. CONFIGURACIÓN DE TOLVA
      { category: "10. Configuración de Tolva", id: "10.2", label: "Solo semilla: Se deben retirar las tapas divisoras de ambas tolvas." },

      // 11. FONDO DE TOLVA
      { category: "11. Fondo de Tolva", id: "11.1", label: "Configuración según tipo de siembra (abastecimiento o dosificación)." },

      // 12. ABASTECIMIENTO Y DOSIFICACIÓN --> REGULACIONES
      { category: "12. Regulaciones", id: "12.2", label: "Dosificación de semillas. Colocar fondo dosificador, verificar chevrones/encauzador." },
      { category: "12. Regulaciones", id: "12.3", label: "Dosificación de fertilizantes. Verificar correcta colocación de los chevrones." },
      { category: "12. Regulaciones", id: "12.5", label: "Configurar Y según tren de siembra a utilizar." },

      // 13. TURBINA DE VACÍO
      { category: "13. Turbina de Vacío", id: "13.2", label: "Regulación de caudal según vacío requerido (Maiz, Soja, Girasol, Sorgo)." },
      
      // 14. MONITOR
      { category: "14. Monitor", id: "14.1", label: "Carga de lotes, regulaciones, configuraciones y calibraciones." },

      // 15. CALIBRACIÓN DE DOSIS
      { category: "15. Calibración de Dosis", id: "15.1", label: "Calibración de dosis de semilla y fertilizante." },

      // 16. SEGURIDAD OPERATIVA Y CONDICIONES DE TRANSPORTE
      { category: "16. Seguridad Operativa", id: "16.1", label: "Consideraciones según configuración de máquina." },
      
      // 17. MANTENIMIENTO Y RECOMENDACIONES DE USO
      { category: "17. Mantenimiento", id: "17.1", label: "Controlar ajuste de bulones de ruedas." },
      { category: "17. Mantenimiento", id: "17.5", label: "Engrasar Barra Cardanica (cada 16 hs)." },
      { category: "17. Mantenimiento", id: "17.6", label: "Controlar nivel de aceite depósito YPFBP 68 (100 lts)." },
    ]
  },
  // =======================================================================
  // PLANTOR (IS22003-0) - ORDEN FINAL Y COMPLETO
  // =======================================================================
  plantor: {
    model: "plantor",
    title: "Puesta en Marcha - Sembradora Plantor",
    items: [
      // 1. VERIFICACIÓN GENERAL
      { category: "1. Verificación General", id: "1.1", label: "Cumplimiento del certificado de recepción." },
      { category: "1. Verificación General", id: "1.2", label: "Cumplimiento del certificado de preentrega." },

      // 2. INTRODUCCIÓN
      { category: "2. Introducción", id: "2.1", label: "Muestra de manual y política de garantía al cliente." },
      
      // 3. TRACTOR
      { category: "3. Tractor", id: "3.1", label: "Verificación de las especificaciones técnicas del tractor vs. máquina." },
      { category: "3. Tractor", id: "3.2", label: "Colocación del monitor y cableado en la cabina del tractor." },
      { category: "3. Tractor", id: "3.5", label: "Vinculación y medición de caudales hidráulicos (Movimiento, Soplado, Vacío, Motores, Drenaje)." },
      { category: "3. Tractor", id: "3.6", label: "Medición 540 RPM en toma de fuerza del tractor." },
      { category: "3. Tractor", id: "3.7", label: "Colocación y regulación del radar (35° inclinación, 80 cm suelo)." },

      // 4. PASAJE DE TRANSPORTE A TRABAJO
      { category: "4. Pasa de Transporte a Trabajo", id: "4.1", label: "Explicación al cliente para el paso de transporte a trabajo y viceversa / Regulaciones." },

      // 5. TREN DE SIEMBRA
      { category: "5. Tren de Siembra", id: "5.1", label: "Alineación de cuchillas de corte." },
      { category: "5. Tren de Siembra", id: "5.2", label: "Regulación de profundidad y presión cuchillas (dejar libre 5 hilos de rosca)." },
      { category: "5. Tren de Siembra", id: "5.7", label: "Regulación de ángulo y presión barrerastrojos." },
      { category: "5. Tren de Siembra", id: "5.8", label: "Regulación de presión, alineación y profundidad de doble disco fertilizador." },
      
      // 6. DOSIFICADOR
      { category: "6. Dosificador", id: "6.1", label: "Colocación de placas, enrasadores y expulsores correspondientes." },
      { category: "6. Dosificador", id: "6.2", label: "Regulación de las guillotinas de entrada." },
      
      // 7. SENSORES
      { category: "7. Sensores", id: "7.1", label: "Regulación del sensor de levante." },
      { category: "7. Sensores", id: "7.2", label: "Verificación de posición correcta de sensores de velocidad y RPM." },

      // 8. FONDO DE TOLVA
      { category: "8. Fondo de Tolva", id: "8.1", label: "Colocación en modo abastecimiento o modo dosificación." },
      { category: "8. Fondo de Tolva", id: "8.2", label: "Según tipo de siembra, verificar correcta colocación de chevrones y configuración de tolvas." },
      
      // 9. ABASTECIMIENTO Y DOSIFICACIÓN
      { category: "9. Regulaciones", id: "9.1", label: "Abastecimiento de semillas." },
      { category: "9. Regulaciones", id: "9.2", label: "Dosificación de fertilizantes." },

      // 10. TURBINA DE VACÍO
      { category: "10. Turbina de Vacío", id: "10.2", label: "Regulación de caudal según vacío requerido (Maiz, Soja, Girasol, Sorgo)." },

      // 11. MONITOR (Faltante)
      { category: "11. Monitor", id: "11.1", label: "Carga de lotes, regulaciones, configuraciones y calibraciones." },

      // 12. TOPES CILINDROS
      { category: "12. Topes Cilindros", id: "12.1", label: "Regulación de topes en cilindros hidráulicos." },
      
      // 13. CONTROL DE DOSIS (Faltante)
      { category: "13. Control de Dosis", id: "13.1", label: "Control de dosis de semilla." },
      { category: "13. Control de Dosis", id: "13.2", label: "Control de dosis de fertilizante." },

      // 14. SEGURIDAD OPERATIVA Y CONDICIONES DE TRANSPORTE
      { category: "14. Seguridad Operativa", id: "14.1", label: "Consideraciones según configuración de máquina." },
      
      // 15. MANTENIMIENTO Y CONDICIONES DE USO
      { category: "15. Mantenimiento", id: "15.1", label: "Controlar ajuste de bulones de ruedas." }, 
    ]
  }
};