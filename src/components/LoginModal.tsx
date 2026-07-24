import React, { useState } from 'react';
import { DriverProfile } from '../types';
import { INITIAL_DRIVER_PROFILE } from '../data/mockData';
import { UserCheck, ShieldCheck, LogIn, Lock, Bike, Car, Package, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (profile: DriverProfile) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [cedulaInput, setCedulaInput] = useState('V-20.145.890');
  const [passwordInput, setPasswordInput] = useState('••••••••');

  // Register State
  const [regName, setRegName] = useState('');
  const [regCedula, setRegCedula] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPlate, setRegPlate] = useState('');
  const [regServiceMoto, setRegServiceMoto] = useState(true);
  const [regServiceTaxi, setRegServiceTaxi] = useState(true);
  const [regServiceDelivery, setRegServiceDelivery] = useState(true);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(INITIAL_DRIVER_PROFILE);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regCedula || !regPlate) {
      alert('Por favor completa todos los campos obligatorios incluyendo Cédula y Placa.');
      return;
    }

    const services = [];
    if (regServiceMoto) services.push('moto' as const);
    if (regServiceTaxi) services.push('taxi' as const);
    if (regServiceDelivery) services.push('delivery' as const);

    const newProfile: DriverProfile = {
      ...INITIAL_DRIVER_PROFILE,
      id: `DRV-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: regName,
      cedula: regCedula.startsWith('V-') || regCedula.startsWith('E-') ? regCedula : `V-${regCedula}`,
      phone: regPhone || '+58 412-1112233',
      plateNumber: regPlate.toUpperCase(),
      servicesOffered: services.length > 0 ? services : ['taxi'],
      hasInitialRecharge: false, // Nuevo usuario requiere $5 minimo recarga
    };

    onLoginSuccess(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border-2 border-purple-600 rounded-3xl p-6 shadow-2xl text-zinc-100 space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-fuchsia-600 flex items-center justify-center text-white font-black italic text-xl mx-auto shadow-lg shadow-purple-900">
            VX
          </div>
          <h3 className="text-xl font-black text-white">Vixy Driver Venezuela</h3>
          <p className="text-xs text-zinc-400">
            {mode === 'login' ? 'Inicia sesión en tu cuenta de conductor' : 'Registro de Nuevo Conductor (Requisitos Legal INTT)'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'register' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Nuevo Registro
          </button>
        </div>

        {/* Form Mode 1: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Cédula de Identidad (V- / E-):</label>
              <input
                type="text"
                required
                value={cedulaInput}
                onChange={(e) => setCedulaInput(e.target.value)}
                placeholder="V-20145890"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Contraseña:</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-purple-950 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Ingresar a Vixy Driver</span>
            </button>
          </form>
        )}

        {/* Form Mode 2: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Nombre Completo:</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej: Pedro José Pérez"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Cédula (V-/E-):</label>
                <input
                  type="text"
                  required
                  value={regCedula}
                  onChange={(e) => setRegCedula(e.target.value)}
                  placeholder="V-19827364"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Placa Vehículo (INTT):</label>
                <input
                  type="text"
                  required
                  value={regPlate}
                  onChange={(e) => setRegPlate(e.target.value.toUpperCase())}
                  placeholder="AB1C23D"
                  className="w-full bg-zinc-950 border border-purple-500/80 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Teléfono Móvil (WhatsApp):</label>
              <input
                type="text"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+58 412-5551234"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            {/* Services Options */}
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Servicios a Ofrecer:</label>
              <div className="grid grid-cols-3 gap-2">
                <label className={`p-2 rounded-xl border text-center cursor-pointer ${regServiceMoto ? 'bg-purple-950 border-purple-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>
                  <input type="checkbox" checked={regServiceMoto} onChange={(e) => setRegServiceMoto(e.target.checked)} className="hidden" />
                  <span className="font-bold block text-[11px]">Moto</span>
                </label>
                <label className={`p-2 rounded-xl border text-center cursor-pointer ${regServiceTaxi ? 'bg-purple-950 border-purple-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>
                  <input type="checkbox" checked={regServiceTaxi} onChange={(e) => setRegServiceTaxi(e.target.checked)} className="hidden" />
                  <span className="font-bold block text-[11px]">Taxi</span>
                </label>
                <label className={`p-2 rounded-xl border text-center cursor-pointer ${regServiceDelivery ? 'bg-purple-950 border-purple-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>
                  <input type="checkbox" checked={regServiceDelivery} onChange={(e) => setRegServiceDelivery(e.target.checked)} className="hidden" />
                  <span className="font-bold block text-[11px]">Delivery</span>
                </label>
              </div>
            </div>

            <div className="bg-amber-950/60 border border-amber-700/60 p-2.5 rounded-xl text-[11px] text-amber-200">
              <strong>Nota Nuevos Conductores:</strong> Requiere recarga inicial mínima de $5.00 USD para habilitar viajes y carga de RCV + Licencia en Perfil.
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-purple-950"
            >
              Completar Registro de Conductor
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
