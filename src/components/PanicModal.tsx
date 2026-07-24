import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock, Radio, X } from 'lucide-react';

interface PanicModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverLocation: { lat: number; lng: number };
}

export const PanicModal: React.FC<PanicModalProps> = ({
  isOpen,
  onClose,
  driverLocation,
}) => {
  const [selectedEmergency, setSelectedEmergency] = useState<'robo' | 'accidente' | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSendAlert = (type: 'robo' | 'accidente') => {
    setSelectedEmergency(type);
    setIsTransmitting(true);

    // Silent transmission simulation (no loud sound)
    setTimeout(() => {
      setIsTransmitting(false);
      setIsSent(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsSent(false);
    setSelectedEmergency(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border-2 border-red-800 rounded-2xl p-5 shadow-2xl text-zinc-100 space-y-4">
        
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-700/80 flex items-center justify-center text-red-400 shadow-lg">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-red-400 uppercase tracking-wide">
                Botón de Pánico Silencioso
              </h3>
              <span className="text-[9px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5 rounded uppercase font-mono">
                Modo Discreto
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Protocolo seguro de respuesta rápida Vixy Venezuela.
            </p>
          </div>
        </div>

        {/* Stealth Banner */}
        <div className="bg-zinc-900 border border-red-900/60 rounded-xl p-3 text-xs text-zinc-300 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Alarma Silenciosa:</strong> Esta función no emite sonidos, destellos ni avisos sonoros para proteger tu integridad física frente a sospechosos.
          </div>
        </div>

        {/* State 1: Choose Option */}
        {!isTransmitting && !isSent && (
          <div className="space-y-3 pt-1">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider text-center">
              Selecciona el Tipo de Emergencia:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: ROBO / ATRACO */}
              <button
                onClick={() => handleSendAlert('robo')}
                className="bg-red-950/80 hover:bg-red-900 border-2 border-red-600 rounded-xl p-4 text-center transition-all shadow-xl hover:scale-102 active:scale-98 flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-red-900/60 flex items-center justify-center text-red-300 border border-red-500/50 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm">ROBO EN PROCESO</div>
                  <div className="text-[11px] text-red-300">Intento de atraco / Secuestro</div>
                </div>
              </button>

              {/* Option 2: ACCIDENTE DE TRÁNSITO */}
              <button
                onClick={() => handleSendAlert('accidente')}
                className="bg-amber-950/80 hover:bg-amber-900 border-2 border-amber-600 rounded-xl p-4 text-center transition-all shadow-xl hover:scale-102 active:scale-98 flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-900/60 flex items-center justify-center text-amber-300 border border-amber-500/50 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm">ACCIDENTE VIAL</div>
                  <div className="text-[11px] text-amber-300">Colisión / Emergencia Médica</div>
                </div>
              </button>

            </div>

            <div className="text-[10px] text-zinc-500 text-center font-mono pt-2">
              Ubicación GPS: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)} • Caracas
            </div>
          </div>
        )}

        {/* State 2: Transmitting stealth payload */}
        {isTransmitting && (
          <div className="py-8 text-center space-y-3">
            <Radio className="w-10 h-10 text-red-500 animate-pulse mx-auto" />
            <div className="font-extrabold text-white text-sm">Transmitiendo Alerta Silenciosa...</div>
            <div className="text-xs text-zinc-400 font-mono">Conectando con Central Vixy Monitoreo 24/7 y Cuadrantes de Paz</div>
          </div>
        )}

        {/* State 3: Confirmed Silent Sent */}
        {isSent && (
          <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-xl p-4 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-emerald-300 text-base">
                Alerta Silenciosa Transmitida
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Se ha notificado discretamente a la Central de Seguridad Vixy con tu ubicación GPS en vivo y los datos del pasajero.
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-2 text-[11px] font-mono text-emerald-400 text-left">
              • Tipo: {selectedEmergency === 'robo' ? 'ROBO' : 'ACCIDENTE'}<br />
              • Protocolo: Alerta encubierta activa<br />
              • Estado: Unidades de respuesta informadas
            </div>
            <button
              onClick={handleCloseModal}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-lg"
            >
              Entendido (Cerrar)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
