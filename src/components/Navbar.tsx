import React from 'react';
import { DriverProfile, TabType } from '../types';
import { 
  Map, 
  Wallet, 
  User, 
  Headphones, 
  HelpCircle, 
  Power, 
  ShieldCheck, 
  Percent, 
  AlertTriangle,
  IdCard,
  LogOut,
  Palette
} from 'lucide-react';
import { AppTheme } from '../data/themes';

interface NavbarProps {
  profile: DriverProfile;
  balance: number;
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onToggleOnline: () => void;
  onOpenPresentationCard: () => void;
  onLogout: () => void;
  onOpenThemeModal?: () => void;
  currentTheme?: AppTheme;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  balance,
  currentTab,
  onTabChange,
  onToggleOnline,
  onOpenPresentationCard,
  onLogout,
  onOpenThemeModal,
  currentTheme,
}) => {
  const isDetenido = balance < -0.50;
  const gradientClass = currentTheme?.gradientClass || 'from-purple-700 via-purple-600 to-fuchsia-500';

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-purple-900/50 px-2 sm:px-6 py-2 shadow-2xl">
      <div className="max-w-7xl mx-auto space-y-2">
        
        {/* ROW 1: BRAND LOGO + QUICK ACTION CONTROLS */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar">
          
          {/* Left Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center shadow-md ring-1 ring-white/30`}>
              <span className="text-sm sm:text-xl font-black italic tracking-tighter text-white">VX</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm sm:text-lg font-extrabold tracking-tight text-white">VIXY</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                  DRIVER
                </span>
              </div>
              <p className="text-[9px] text-zinc-400 hidden md:block">
                Venezuela • Placa: <span className="font-mono text-purple-300 font-bold">{profile.plateNumber}</span>
              </p>
            </div>
          </div>

          {/* Center: Commission Banner (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 bg-purple-950/70 border border-purple-800/50 rounded-full px-3.5 py-1 text-xs text-purple-200 shadow-inner shrink-0">
            <Percent className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Comisión Vixy: <strong className="text-white font-bold">10%</strong></span>
          </div>

          {/* Right Action Controls Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Theme Selector Button */}
            {onOpenThemeModal && (
              <button
                onClick={onOpenThemeModal}
                title="Elegir entre 10 temas visuales de diseño"
                className="flex items-center gap-1.5 bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 text-purple-200 border border-purple-700/80 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
              >
                <Palette className="w-3.5 h-3.5 text-fuchsia-400 animate-bounce" />
                <span className="text-xs">Diseño (10)</span>
              </button>
            )}

            {/* Quick Wallet Balance Button */}
            <button 
              onClick={() => onTabChange('wallet')}
              title="Ver Cartera / Recargar Saldo"
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isDetenido 
                  ? 'bg-red-950/90 text-red-200 border-red-700 animate-pulse'
                  : balance < 2 
                    ? 'bg-amber-950/60 text-amber-200 border-amber-700/60'
                    : 'bg-zinc-900 text-purple-300 border-purple-800/80 hover:bg-purple-950/50'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="font-mono text-xs">${balance.toFixed(2)}</span>
            </button>

            {/* Compact Touch-Friendly Connect Toggle Button */}
            <button
              onClick={onToggleOnline}
              disabled={isDetenido || !profile.hasInitialRecharge}
              className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all shadow-md active:scale-95 touch-manipulation shrink-0 ${
                isDetenido
                  ? 'bg-red-900/50 text-red-300 border border-red-700/60 cursor-not-allowed'
                  : !profile.hasInitialRecharge
                    ? 'bg-amber-900/50 text-amber-300 border border-amber-700/60 cursor-not-allowed'
                    : profile.isActiveOnline
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 ring-2 ring-emerald-400/40 animate-pulse'
                      : 'bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700'
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${profile.isActiveOnline ? 'text-white' : 'text-purple-300'}`} />
              <span className="text-xs">
                {isDetenido
                  ? 'DETENIDO'
                  : !profile.hasInitialRecharge
                    ? 'RECARGAR $5'
                    : profile.isActiveOnline
                      ? 'EN LÍNEA'
                      : 'CONECTAR'}
              </span>
            </button>

            {/* Driver Presentation Card Button (Boton Tarjeta / Placa) */}
            <button
              onClick={onOpenPresentationCard}
              title="Tarjeta de Presentación del Conductor"
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-purple-300 border border-purple-800/80 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0"
            >
              <IdCard className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="hidden sm:inline text-xs font-mono font-bold">
                {profile.plateNumber}
              </span>
              <span className="sm:hidden text-[11px] font-bold">Tarjeta</span>
            </button>

            {/* Logout Icon Button */}
            <button
              onClick={onLogout}
              title="Cerrar Sesión / Cambiar Conductor"
              className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 transition-all shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

        {/* ROW 2: TOP NAVIGATION BUTTONS BAR (SCROLLABLE HORIZONTALLY ON MOBILE) */}
        <nav className="flex items-center overflow-x-auto no-scrollbar gap-1.5 pt-1.5 border-t border-zinc-800/80">
          <button
            onClick={() => onTabChange('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
              currentTab === 'map'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 ring-1 ring-purple-400/50'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-purple-300" />
            <span>Mapa & Servicios</span>
          </button>

          <button
            onClick={() => onTabChange('wallet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
              currentTab === 'wallet'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 ring-1 ring-purple-400/50'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-purple-300" />
            <span>Cartera</span>
            {isDetenido && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
              currentTab === 'profile'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 ring-1 ring-purple-400/50'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-300" />
            <span>Perfil & Docs</span>
          </button>

          <button
            onClick={() => onTabChange('support')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
              currentTab === 'support'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 ring-1 ring-purple-400/50'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-purple-300" />
            <span>Soporte</span>
          </button>

          <button
            onClick={() => onTabChange('faq')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
              currentTab === 'faq'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 ring-1 ring-purple-400/50'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
            <span>FAQs</span>
          </button>
        </nav>

      </div>

      {/* Status Warning Banner if Detenido */}
      {isDetenido && (
        <div className="mt-2 max-w-7xl mx-auto bg-red-950/90 border border-red-800 rounded-lg p-2 text-xs text-red-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              <strong>ESTADO DETENIDO:</strong> Tu saldo (${balance.toFixed(2)}) es menor a -$0.50 USD. Recarga para recibir servicios.
            </span>
          </div>
          <button 
            onClick={() => onTabChange('wallet')}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-2.5 py-1 rounded text-[11px] shrink-0"
          >
            Recargar Ahora
          </button>
        </div>
      )}

      {/* Android Mobile Bottom App Dock Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-purple-900/60 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
            currentTab === 'map'
              ? 'text-purple-400 font-extrabold bg-purple-950/80 border border-purple-800/80 scale-105'
              : 'text-zinc-400 font-medium'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px]">Mapa</span>
        </button>

        <button
          onClick={() => onTabChange('wallet')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl relative transition-all ${
            currentTab === 'wallet'
              ? 'text-purple-400 font-extrabold bg-purple-950/80 border border-purple-800/80 scale-105'
              : 'text-zinc-400 font-medium'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Cartera</span>
          {isDetenido && <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-red-500 animate-ping" />}
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
            currentTab === 'profile'
              ? 'text-purple-400 font-extrabold bg-purple-950/80 border border-purple-800/80 scale-105'
              : 'text-zinc-400 font-medium'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Perfil</span>
        </button>

        <button
          onClick={() => onTabChange('support')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
            currentTab === 'support'
              ? 'text-purple-400 font-extrabold bg-purple-950/80 border border-purple-800/80 scale-105'
              : 'text-zinc-400 font-medium'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px]">Soporte</span>
        </button>

        <button
          onClick={() => onTabChange('faq')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
            currentTab === 'faq'
              ? 'text-purple-400 font-extrabold bg-purple-950/80 border border-purple-800/80 scale-105'
              : 'text-zinc-400 font-medium'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px]">FAQs</span>
        </button>
      </nav>
    </header>
  );
};
