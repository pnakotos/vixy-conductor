import React, { useState } from 'react';
import { DriverProfile } from '../types';
import { createNewDriverProfile, INITIAL_DRIVER_PROFILE } from '../data/mockData';
import { syncDriverProfileToFirebase } from '../services/firebaseSyncService';
import { UserCheck, ShieldCheck, LogIn, Lock, Bike, Car, Package, UserPlus, Sparkles } from 'lucide-react';

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
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [cedulaInput, setCedulaInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regCedula, setRegCedula] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlate, setRegPlate] = useState('');
  const [regVehicleModel, setRegVehicleModel] = useState('');
  const [regCity, setRegCity] = useState('Caracas, Distrito Capital');
  const [regServiceMoto, setRegServiceMoto] = useState(true);
  const [regServiceTaxi, setRegServiceTaxi] = useState(true);
  const [regServiceDelivery, setRegServiceDelivery] = useState(true);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedulaInput) {
      alert('Por favor ingresa tu Cédula de Identidad para iniciar sesión.');
      return;
    }

    setIsLoading(true);

    const formattedCedula = cedulaInput.toUpperCase().startsWith('V-') || cedulaInput.toUpperCase().startsWith('E-')
      ? cedulaInput.toUpperCase()
      : `V-${cedulaInput.trim()}`;

    // Check localStorage saved profile or create session
    const saved = localStorage.getItem('vixy_driver_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DriverProfile;
        if (parsed.cedula.replace(/\D/g, '') === formattedCedula.replace(/\D/g, '')) {
          onLoginSuccess(parsed);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error parsing stored profile:', err);
      }
    }

    // Fallback: Create or retrieve profile for this Cédula
    const loggedProfile = createNewDriverProfile({
      fullName: 'Conductor Registrado',
      cedula: formattedCedula,
      phone: '+58 412-0000000',
      plateNumber: 'AB1C23D',
      servicesOffered: ['moto', 'taxi', 'delivery'],
    });

    await syncDriverProfileToFirebase(loggedProfile);
    localStorage.setItem('vixy_driver_profile', JSON.stringify(loggedProfile));
    onLoginSuccess(loggedProfile);
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regCedula || !regPlate) {
      alert('Por favor completa los campos obligatorios: Nombre Completo, Cédula y Placa de Vehículo.');
      return;
    }

    setIsLoading(true);

    const services: ('moto' | 'taxi' | 'delivery')[] = [];
    if (regServiceMoto) services.push('moto');
    if (regServiceTaxi) services.push('taxi');
    if (regServiceDelivery) services.push('delivery');

    const newProfile = createNewDriverProfile({
      fullName: regName,
      cedula: regCedula,
      phone: regPhone,
      email: regEmail,
      plateNumber: regPlate,
      vehicleModel: regVehicleModel,
      city: regCity,
      servicesOffered: services.length > 0 ? services : ['taxi'],
    });

    // Sync to Firestore & persist locally
    await syncDriverProfileToFirebase(newProfile);
    localStorage.setItem('vixy_driver_profile', JSON.stringify(newProfile));
    
    setIsLoading(false);
    onLoginSuccess(newProfile);
  };

  const handleLoadDemoUser = () => {
    const demoProfile = {
      ...INITIAL_DRIVER_PROFILE,
      fullName: 'Carlos Eduardo Mendoza',
      cedula: 'V-20.145.890',
      phone: '+58 412-9882233',
      hasInitialRecharge: true,
    };
    localStorage.setItem('vixy_driver_profile', JSON.stringify(demoProfile));
    onLoginSuccess(demoProfile);
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
            {mode === 'login' ? 'Acceso para Conductores Registrados' : 'Registro Oficial de Conductor Vixy (Legal INTT)'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo Registro</span>
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
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
                placeholder="Ej: V-20145890"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Contraseña:</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-purple-950 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Verificando...' : 'Ingresar a Vixy Driver'}</span>
            </button>
          </form>
        )}

        {/* Form Mode 2: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Nombre Completo Conductor *:</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej: Juan Antonio Rodríguez"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Cédula (V-/E-) *:</label>
                <input
                  type="text"
                  required
                  value={regCedula}
                  onChange={(e) => setRegCedula(e.target.value)}
                  placeholder="V-18902834"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-purple-300">Placa Vehículo (INTT) *:</label>
                <input
                  type="text"
                  required
                  value={regPlate}
                  onChange={(e) => setRegPlate(e.target.value.toUpperCase())}
                  placeholder="AB1C23D"
                  className="w-full bg-zinc-950 border border-purple-500/80 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Teléfono (WhatsApp):</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+58 412-9988776"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Modelo del Vehículo:</label>
                <input
                  type="text"
                  value={regVehicleModel}
                  onChange={(e) => setRegVehicleModel(e.target.value)}
                  placeholder="Bera SBR 150 / Aveo"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Ciudad de Operación:</label>
              <input
                type="text"
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
                placeholder="Caracas, Valencia, Maracaibo..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Services Checkboxes */}
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Servicios Habilitados:</label>
              <div className="grid grid-cols-3 gap-2">
                <label className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${regServiceMoto ? 'bg-purple-950 border-purple-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                  <input type="checkbox" checked={regServiceMoto} onChange={(e) => setRegServiceMoto(e.target.checked)} className="hidden" />
                  <span className="font-bold block text-[11px]">🏍️ Moto</span>
                </label>
                <label className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${regServiceTaxi ? 'bg-purple-950 border-purple-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                  <input type="checkbox" checked={regServiceTaxi} onChange={(e) => setRegServiceTaxi(e.target.checked)} className="hidden" />
                  <span className="font-bold block text-[11px]">🚗 Taxi</span>
                </label>
                <label className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${regServiceDelivery ? 'bg-purple-950 border-purple-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                  <input type="checkbox" checked={regServiceDelivery} onChange={(e) => setRegServiceDelivery(e.target.checked)} className="hidden" />
                  <span className="font-bold block text-[11px]">📦 Delivery</span>
                </label>
              </div>
            </div>

            <div className="bg-purple-950/60 border border-purple-700/60 p-2.5 rounded-xl text-[11px] text-purple-200 space-y-1">
              <strong className="text-purple-300 block">✓ Registro Directo a Base de Datos Firestore</strong>
              <p className="text-zinc-300">
                Al registrarte se crea tu perfil oficial con tu número de Placa de Vehículo y Cédula en el servidor central.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-purple-950 active:scale-95 transition-all"
            >
              {isLoading ? 'Registrando...' : 'Registrar Conductor e Iniciar'}
            </button>
          </form>
        )}

        {/* Quick Demo Pre-fill Option for testing */}
        <div className="pt-2 border-t border-zinc-800 text-center">
          <button
            type="button"
            onClick={handleLoadDemoUser}
            className="text-[11px] text-zinc-400 hover:text-purple-300 font-semibold underline decoration-dotted flex items-center justify-center gap-1 mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cargar Datos de Prueba Rápida (Demo)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
