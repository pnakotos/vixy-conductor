export interface AppTheme {
  id: string;
  name: string;
  subtitle: string;
  isLight?: boolean;
  swatchColors: string[];
  gradientClass: string;
  bgClass: string;
  cardBgClass: string;
  borderClass: string;
  textAccentClass: string;
  activeTabClass: string;
  buttonClass: string;
  badgeClass: string;
  ringClass: string;
  description: string;
}

export const APP_THEMES: AppTheme[] = [
  {
    id: 'vixy-cyber-purple',
    name: '1. Vixy Cyber Violet (Neón Nocturno)',
    subtitle: 'El diseño oficial por defecto de Vixy',
    isLight: false,
    swatchColors: ['#7e22ce', '#c026d3', '#10b981'],
    gradientClass: 'from-purple-700 via-purple-600 to-fuchsia-500',
    bgClass: 'bg-zinc-950 text-zinc-100',
    cardBgClass: 'bg-zinc-900/90 border-purple-900/60',
    borderClass: 'border-purple-800/60',
    textAccentClass: 'text-purple-400',
    activeTabClass: 'bg-purple-600 text-white shadow-purple-900/50 ring-purple-400/50',
    buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white',
    badgeClass: 'bg-purple-950 text-purple-300 border-purple-800/80',
    ringClass: 'ring-purple-500/50',
    description: 'Estilo cyber neón violeta de alto impacto nocturno con acentos en fucsia y verde esmeralda.'
  },
  {
    id: 'cyber-yellow-taxi',
    name: '2. Cyber Yellow Taxi (Amarillo Urbano)',
    subtitle: 'Estilo Taxis Ejecutivos Nocturnos',
    isLight: false,
    swatchColors: ['#eab308', '#ca8a04', '#10b981'],
    gradientClass: 'from-yellow-600 via-amber-500 to-yellow-400',
    bgClass: 'bg-stone-950 text-stone-100',
    cardBgClass: 'bg-stone-900/90 border-yellow-900/60',
    borderClass: 'border-yellow-800/60',
    textAccentClass: 'text-yellow-400',
    activeTabClass: 'bg-yellow-500 text-black shadow-yellow-900/50 ring-yellow-400/50 font-black',
    buttonClass: 'bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold',
    badgeClass: 'bg-yellow-950 text-yellow-300 border-yellow-800/80',
    ringClass: 'ring-yellow-500/50',
    description: 'Alta visibilidad e inspiración urbana nocturna con amarillo neón sobre negro carbón.'
  },
  {
    id: 'emerald-fleet',
    name: '3. Emerald Fleet (Verde Esmeralda Finanzas)',
    subtitle: 'Ganancias, éxito y finanzas prosperas',
    isLight: false,
    swatchColors: ['#059669', '#10b981', '#34d399'],
    gradientClass: 'from-emerald-700 via-teal-600 to-emerald-400',
    bgClass: 'bg-slate-950 text-slate-100',
    cardBgClass: 'bg-slate-900/90 border-emerald-900/60',
    borderClass: 'border-emerald-800/60',
    textAccentClass: 'text-emerald-400',
    activeTabClass: 'bg-emerald-600 text-white shadow-emerald-900/50 ring-emerald-400/50',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800/80',
    ringClass: 'ring-emerald-500/50',
    description: 'Tonalidades verdes esmeralda que simbolizan liquidez, seguridad y alta productividad financiera.'
  },
  {
    id: 'sapphire-electric-blue',
    name: '4. Sapphire Tech Blue (Azul Eléctrico)',
    subtitle: 'Tecnología y plataformas de vanguardia',
    isLight: false,
    swatchColors: ['#2563eb', '#0284c7', '#06b6d4'],
    gradientClass: 'from-blue-700 via-sky-600 to-cyan-400',
    bgClass: 'bg-gray-950 text-gray-100',
    cardBgClass: 'bg-gray-900/90 border-blue-900/60',
    borderClass: 'border-blue-800/60',
    textAccentClass: 'text-cyan-400',
    activeTabClass: 'bg-blue-600 text-white shadow-blue-900/50 ring-blue-400/50',
    buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    badgeClass: 'bg-blue-950 text-cyan-300 border-blue-800/80',
    ringClass: 'ring-blue-500/50',
    description: 'Elegante interfaz tecnológica azul zafiro con destellos cian para máxima frescura digital.'
  },
  {
    id: 'sunset-amber',
    name: '5. Sunset Amber & Crimson (Amanecer Urbano)',
    subtitle: 'Energía de atardecer y carretera',
    isLight: false,
    swatchColors: ['#ea580c', '#f97316', '#ef4444'],
    gradientClass: 'from-orange-700 via-amber-600 to-rose-500',
    bgClass: 'bg-neutral-950 text-neutral-100',
    cardBgClass: 'bg-neutral-900/90 border-orange-900/60',
    borderClass: 'border-orange-800/60',
    textAccentClass: 'text-orange-400',
    activeTabClass: 'bg-orange-600 text-white shadow-orange-900/50 ring-orange-400/50',
    buttonClass: 'bg-orange-600 hover:bg-orange-500 text-white',
    badgeClass: 'bg-orange-950 text-orange-300 border-orange-800/80',
    ringClass: 'ring-orange-500/50',
    description: 'Diseño cálido inspirador que evoca el resplandor del sol venezolano en autopistas y avenidas.'
  },
  {
    id: 'executive-gold',
    name: '6. Executive Obsidian Gold (Oro Ejecutivo VIP)',
    subtitle: 'Pizarra negra y acabados dorados VIP',
    isLight: false,
    swatchColors: ['#d97706', '#b45309', '#f59e0b'],
    gradientClass: 'from-amber-700 via-amber-600 to-yellow-500',
    bgClass: 'bg-black text-zinc-100',
    cardBgClass: 'bg-zinc-900/90 border-amber-900/60',
    borderClass: 'border-amber-800/60',
    textAccentClass: 'text-amber-400',
    activeTabClass: 'bg-amber-600 text-black font-extrabold shadow-amber-900/50 ring-amber-400/50',
    buttonClass: 'bg-amber-600 hover:bg-amber-500 text-black font-bold',
    badgeClass: 'bg-amber-950 text-amber-300 border-amber-800/80',
    ringClass: 'ring-amber-500/50',
    description: 'Estética de lujo VIP con acentos de oro cepillado y negro mate para transporte ejecutivo.'
  },
  {
    id: 'clean-day-mode',
    name: '7. Clean Day Mode (Modo Día / Blanco Sol)',
    subtitle: 'Luz diurna y contraste bajo el sol',
    isLight: true,
    swatchColors: ['#ffffff', '#7c3aed', '#1e293b'],
    gradientClass: 'from-purple-800 via-indigo-700 to-purple-600',
    bgClass: 'bg-slate-100 text-slate-900',
    cardBgClass: 'bg-white border-slate-300 shadow-md',
    borderClass: 'border-slate-300',
    textAccentClass: 'text-purple-700',
    activeTabClass: 'bg-purple-700 text-white shadow-slate-400/50 ring-purple-500/50',
    buttonClass: 'bg-purple-700 hover:bg-purple-600 text-white',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    ringClass: 'ring-purple-600/50',
    description: 'Fondo blanco despejado con tipografía oscura ultra legible bajo la luz solar intensa del día.'
  },
  {
    id: 'cyberpunk-caracas',
    name: '8. Cyberpunk Caracas (Magenta & Cian)',
    subtitle: 'Noche Neón fosforescente futurista',
    isLight: false,
    swatchColors: ['#ec4899', '#06b6d4', '#a855f7'],
    gradientClass: 'from-pink-600 via-purple-600 to-cyan-500',
    bgClass: 'bg-zinc-950 text-pink-50',
    cardBgClass: 'bg-zinc-900/90 border-pink-900/60',
    borderClass: 'border-pink-800/60',
    textAccentClass: 'text-pink-400',
    activeTabClass: 'bg-pink-600 text-white shadow-pink-900/50 ring-pink-400/50',
    buttonClass: 'bg-pink-600 hover:bg-pink-500 text-white',
    badgeClass: 'bg-pink-950 text-pink-300 border-pink-800/80',
    ringClass: 'ring-pink-500/50',
    description: 'Estilo vibrante de alta energía cyberpunk nocturno con destellos fucsia y cian eléctrico.'
  },
  {
    id: 'titanium-racing',
    name: '9. Titanium & Racing Red (Deportivo)',
    subtitle: 'Rojo carreras y titanio metálico',
    isLight: false,
    swatchColors: ['#dc2626', '#ef4444', '#71717a'],
    gradientClass: 'from-red-700 via-red-600 to-zinc-600',
    bgClass: 'bg-zinc-950 text-zinc-100',
    cardBgClass: 'bg-zinc-900/90 border-red-900/60',
    borderClass: 'border-red-800/60',
    textAccentClass: 'text-red-400',
    activeTabClass: 'bg-red-600 text-white shadow-red-900/50 ring-red-400/50',
    buttonClass: 'bg-red-600 hover:bg-red-500 text-white',
    badgeClass: 'bg-red-950 text-red-300 border-red-800/80',
    ringClass: 'ring-red-500/50',
    description: 'Inspirado en el espíritu deportivo y automotriz con rojo adrenalina y acentos metálicos titanio.'
  },
  {
    id: 'mint-fresh',
    name: '10. Mint & Charcoal Fresh (Menta Suave)',
    subtitle: 'Fresco, ecológico y descanso visual',
    isLight: false,
    swatchColors: ['#0d9488', '#14b8a6', '#2dd4bf'],
    gradientClass: 'from-teal-700 via-teal-600 to-emerald-500',
    bgClass: 'bg-gray-950 text-gray-100',
    cardBgClass: 'bg-gray-900/90 border-teal-900/60',
    borderClass: 'border-teal-800/60',
    textAccentClass: 'text-teal-400',
    activeTabClass: 'bg-teal-600 text-white shadow-teal-900/50 ring-teal-400/50',
    buttonClass: 'bg-teal-600 hover:bg-teal-500 text-white',
    badgeClass: 'bg-teal-950 text-teal-300 border-teal-800/80',
    ringClass: 'ring-teal-500/50',
    description: 'Tonalidad menta calmante diseñada para reducir el cansancio visual durante jornadas largas de manejo.'
  }
];
