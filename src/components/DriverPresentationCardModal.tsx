import React from 'react';
import { DriverProfile } from '../types';
import { ShieldCheck, Star, Car, Bike, Package, X, CheckCircle2, Copy, Share2 } from 'lucide-react';

interface DriverPresentationCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DriverProfile;
}

export const DriverPresentationCardModal: React.FC<DriverPresentationCardModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const activeVehicle = profile.vehicles.taxi || profile.vehicles.moto || profile.vehicles.delivery;

  const handleCopyCard = () => {
    const text = `Conductor Vixy: ${profile.fullName}\nPlaca: ${profile.plateNumber}\nVehículo: ${activeVehicle?.brand} ${activeVehicle?.model} (${activeVehicle?.color})\nCalificación: ${profile.rating}★\nVerificado Vixy Driver Venezuela`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-purple-600/50 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
        
        {/* Header background pattern */}
        <div className="h-28 bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-900 relative p-4 flex justify-between items-start">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-purple-200 border border-purple-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tarjetahabiente Verificado</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Photo & Main Presentation Info */}
        <div className="px-6 pb-6 relative">
          
          {/* Avatar floating */}
          <div className="relative -mt-14 mb-3 inline-block">
            <img
              src={profile.profilePhotoUrl}
              alt={profile.fullName}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-600 shadow-xl bg-zinc-800"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg ring-2 ring-zinc-900" title="Verificado por Vixy">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Name & Plate */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white">{profile.fullName}</h3>
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{profile.rating}</span>
                <span className="text-zinc-400 font-normal">({profile.totalTrips} viajes)</span>
              </div>
            </div>
            
            <p className="text-xs text-zinc-400 mt-0.5">Cédula: {profile.cedula} • {profile.city}</p>
          </div>

          {/* OBLIGATORIO: Placa de Presentación Destacada */}
          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border-2 border-purple-500/80 rounded-xl p-4 mb-4 text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-600 text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 rounded-bl-lg">
              Identificador Legal
            </div>
            <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider mb-1">
              Número de Placa Registrada (INTT)
            </div>
            <div className="text-3xl font-black font-mono tracking-widest text-white bg-zinc-950 inline-block px-6 py-2 rounded-lg border border-purple-500/40 shadow-lg">
              {profile.plateNumber}
            </div>
            <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verificado con RCV y Licencia Oficial</span>
            </div>
          </div>

          {/* Active Services Badges */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-zinc-400 mb-2">Servicios que ofrece este conductor:</div>
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-2 rounded-xl border text-center text-xs flex flex-col items-center gap-1 ${
                profile.servicesOffered.includes('moto') 
                  ? 'bg-purple-950/60 border-purple-600/80 text-purple-200' 
                  : 'bg-zinc-800/40 border-zinc-700/40 text-zinc-500 opacity-50'
              }`}>
                <Bike className="w-4 h-4 text-purple-400" />
                <span className="font-bold">Moto</span>
              </div>

              <div className={`p-2 rounded-xl border text-center text-xs flex flex-col items-center gap-1 ${
                profile.servicesOffered.includes('taxi') 
                  ? 'bg-purple-950/60 border-purple-600/80 text-purple-200' 
                  : 'bg-zinc-800/40 border-zinc-700/40 text-zinc-500 opacity-50'
              }`}>
                <Car className="w-4 h-4 text-purple-400" />
                <span className="font-bold">Taxi</span>
              </div>

              <div className={`p-2 rounded-xl border text-center text-xs flex flex-col items-center gap-1 ${
                profile.servicesOffered.includes('delivery') 
                  ? 'bg-purple-950/60 border-purple-600/80 text-purple-200' 
                  : 'bg-zinc-800/40 border-zinc-700/40 text-zinc-500 opacity-50'
              }`}>
                <Package className="w-4 h-4 text-purple-400" />
                <span className="font-bold">Delivery</span>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          {activeVehicle && (
            <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/60 mb-5 flex items-center justify-between text-xs">
              <div>
                <div className="text-zinc-400 font-medium">Vehículo Actual:</div>
                <div className="text-white font-bold">{activeVehicle.brand} {activeVehicle.model} ({activeVehicle.year})</div>
                <div className="text-zinc-400">Color: {activeVehicle.color}</div>
              </div>
              <img 
                src={activeVehicle.photoUrl} 
                alt="Vehículo" 
                className="w-16 h-12 rounded-lg object-cover border border-purple-500/40"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCard}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/40"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Datos Copiados!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Tarjeta</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-zinc-700"
            >
              Cerrar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
