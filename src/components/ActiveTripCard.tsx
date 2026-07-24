import React, { useState } from 'react';
import { TripService, TripStatus } from '../types';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Bike,
  Car,
  Package
} from 'lucide-react';

interface ActiveTripCardProps {
  trip: TripService;
  onUpdateStatus: (newStatus: TripStatus) => void;
  onCancelTrip: (reason: string) => void;
  onOpenPanicModal: () => void;
  onCompleteTripAndRate: () => void;
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  trip,
  onUpdateStatus,
  onCancelTrip,
  onOpenPanicModal,
  onCompleteTripAndRate,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('Cliente no responde');

  const getStatusStepInfo = () => {
    switch (trip.status) {
      case 'accepted':
      case 'en_camino_pasajero':
        return {
          title: 'En camino al pasajero',
          sub: 'Dirígete al punto A para recoger al cliente',
          nextStatus: 'en_punto_recogida' as TripStatus,
          nextButtonText: '¡Llegué al Punto de Recogida!',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'en_punto_recogida':
        return {
          title: 'En el punto de recogida',
          sub: 'Notifica al pasajero y verifica su identidad',
          nextStatus: 'en_trayecto_destino' as TripStatus,
          nextButtonText: 'Iniciar Servicio con Pasajero',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'en_trayecto_destino':
        return {
          title: 'En trayecto al destino final',
          sub: 'Conduce de manera segura hacia el punto B',
          nextStatus: 'completed' as TripStatus,
          nextButtonText: 'Finalizar Servicio & Cobrar',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      default:
        return {
          title: 'Servicio en proceso',
          sub: '',
          nextStatus: 'completed' as TripStatus,
          nextButtonText: 'Continuar',
          badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        };
    }
  };

  const stepInfo = getStatusStepInfo();

  const handleNextStep = () => {
    if (trip.status === 'en_trayecto_destino') {
      onCompleteTripAndRate();
    } else {
      onUpdateStatus(stepInfo.nextStatus);
    }
  };

  const cancelReasons = [
    'Cliente no se presentó / No responde',
    'Falla mecánica en el vehículo',
    'Accidente o caucho espichado',
    'Dirección de origen inaccesible / Tráfico pesado',
    'Emergencia personal del conductor',
  ];

  return (
    <div className="bg-zinc-900 border-2 border-purple-600/70 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100 space-y-4 relative overflow-hidden">
      
      {/* Driver Presentation Card Notification Banner */}
      <div className="bg-purple-950/80 border border-purple-700/60 rounded-xl p-2.5 text-xs text-purple-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>Tarjeta Enviada:</strong> El cliente ya ve tu foto y tu placa registrada.</span>
        </div>
        <span className="text-[10px] bg-purple-900 px-2 py-0.5 rounded font-mono text-purple-300">
          INTT ✓
        </span>
      </div>

      {/* Header with Panic & Cancel Buttons */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stepInfo.badgeBg}`}>
              {stepInfo.title}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{stepInfo.sub}</p>
        </div>

        {/* Emergency & Discrete Stealth Panic Button (BOTÓN DE PÁNICO SILENCIOSO) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPanicModal}
            title="Botón de Pánico Discreto y Silencioso (Robo o Accidente)"
            className="flex items-center gap-1.5 bg-red-950 hover:bg-red-900 text-red-200 border-2 border-red-600 px-3 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-red-950/80 animate-pulse transition-all hover:scale-105 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">PÁNICO SOS</span>
          </button>
        </div>
      </div>

      {/* Passenger & Fare Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-950/80 rounded-xl p-3 border border-zinc-800">
        
        {/* Passenger Profile */}
        <div className="flex items-center gap-3">
          <img
            src={trip.passenger.photoUrl}
            alt={trip.passenger.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500"
          />
          <div>
            <div className="font-extrabold text-white text-sm">{trip.passenger.name}</div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{trip.passenger.rating}</span>
            </div>
          </div>
        </div>

        {/* Call & Fare Box */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
          <a
            href={`tel:${trip.passenger.phone}`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Simulando llamada a cliente: ${trip.passenger.phone}`);
            }}
            className="flex items-center gap-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-700/60"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Llamar</span>
          </a>

          <div className="text-right">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Cobrar al Final</div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              ${trip.fareUsd.toFixed(2)} USD
            </div>
          </div>
        </div>

      </div>

      {/* Current Address Details */}
      <div className="space-y-2 text-xs bg-zinc-950/50 p-3 rounded-xl border border-zinc-800">
        {trip.status !== 'en_trayecto_destino' ? (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Punto A (Recogida):</span>
              <div className="text-white font-bold">{trip.pickupLocation.address}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Navigation className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Punto B (Destino Final):</span>
              <div className="text-white font-bold">{trip.dropoffLocation.address}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Control & Cancel Button */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        
        {/* Next Step Action Button */}
        <button
          onClick={handleNextStep}
          className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-xl shadow-purple-950 flex items-center justify-center gap-2 active:scale-98"
        >
          <span>{stepInfo.nextButtonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Cancel Trip Button (BOTÓN DE CANCELAR VIAJE) */}
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-red-300 font-bold px-4 py-3.5 rounded-xl text-xs border border-zinc-700 hover:border-red-800/60 transition-all flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-4 h-4 text-red-400" />
          <span>Cancelar Viaje</span>
        </button>

      </div>

      {/* Modal Cancelar Viaje */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-red-800/80 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-extrabold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Cancelar Servicio Activo</span>
            </div>
            <p className="text-xs text-zinc-300">
              Indica la razón por la cual debes cancelar el viaje. Las cancelaciones justificadas no afectan tu tasa de aceptación.
            </p>

            <div className="space-y-2">
              {cancelReasons.map((reason, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedCancelReason === reason
                      ? 'bg-red-950/60 border-red-600 text-red-200 font-bold'
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={selectedCancelReason === reason}
                    onChange={() => setSelectedCancelReason(reason)}
                    className="accent-red-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs"
              >
                Volver al Viaje
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  onCancelTrip(selectedCancelReason);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-red-950"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
