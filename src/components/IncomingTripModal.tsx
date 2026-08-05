import React, { useEffect, useState } from 'react';
import { TripService } from '../types';
import { Star, MapPin, Navigation, DollarSign, Percent, ArrowRight, Bike, Car, Package, Clock, ShieldCheck, GraduationCap } from 'lucide-react';

interface IncomingTripModalProps {
  trip: TripService | null;
  onAccept: (trip: TripService) => void;
  onReject: () => void;
}

export const IncomingTripModal: React.FC<IncomingTripModalProps> = ({
  trip,
  onAccept,
  onReject,
}) => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!trip) return;
    setTimeLeft(15);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [trip]);

  if (!trip) return null;

  const ServiceIcon = trip.serviceType === 'moto' ? Bike : trip.serviceType === 'taxi' ? Car : Package;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border-2 border-purple-500 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
        
        {/* Top Header with Countdown Bar */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-zinc-900 p-4 border-b border-purple-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-600/30 rounded-xl border border-purple-400/30 text-purple-300">
              <ServiceIcon className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-purple-300 tracking-wider">¡Nueva Solicitud!</div>
              <h4 className="text-base font-extrabold text-white">{trip.serviceName}</h4>
            </div>
          </div>

          {/* Countdown timer badge */}
          <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-black font-mono">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={trip.passenger.photoUrl}
              alt={trip.passenger.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500"
            />
            <div>
              <div className="font-bold text-white text-sm">{trip.passenger.name}</div>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{trip.passenger.rating}</span>
                <span className="text-zinc-500 font-normal">({trip.passenger.totalTrips} viajes)</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Pago Cliente</div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60 inline-block">
              {trip.paymentMethod}
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-4 space-y-3">
          
          {/* Tarifa Universitaria Notification Banner if Student */}
          {(trip.isUniversityTariff || trip.passenger.isUniversityStudent) && (
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 border-2 border-blue-500/70 rounded-xl p-3 text-xs text-blue-100 flex items-start gap-2.5 shadow-md">
              <div className="p-1.5 bg-blue-600 rounded-lg text-white shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-black text-sky-300 text-[11px] uppercase tracking-wider">
                  <span>🎓 Tarifa Universitaria Aplicada</span>
                  <span className="bg-sky-500 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono">50% DESC</span>
                </div>
                <p className="text-zinc-200 text-[11px] leading-tight">
                  Pasajero Estudiante: <strong>{trip.passenger.universityName || 'Universidad Nacional'}</strong> ({trip.passenger.studentCardId || 'Carnet Verificado'}).
                </p>
                <p className="text-sky-200/80 text-[10px] italic">
                  *Comisión Vixy protegida al 10%. Solicitar Carnet Estudiantil al abordar.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs">
            {/* Pickup */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold border border-emerald-500/40">
                A
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Punto de Recogida</div>
                <div className="text-white font-bold text-sm leading-tight">{trip.pickupLocation.address}</div>
                <div className="text-[11px] text-zinc-400">{trip.pickupLocation.cityArea}</div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="pl-2.5 border-l-2 border-dashed border-purple-600/50 my-1 ml-3 h-3" />

            {/* Dropoff */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold border border-amber-500/40">
                B
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Destino Final</div>
                <div className="text-white font-bold text-sm leading-tight">{trip.dropoffLocation.address}</div>
                <div className="text-[11px] text-zinc-400">{trip.dropoffLocation.cityArea}</div>
              </div>
            </div>
          </div>

          {/* Delivery Note if any */}
          {trip.deliveryNotes && (
            <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-2.5 text-xs text-purple-200">
              <span className="font-bold text-purple-300">Nota Delivery:</span> {trip.deliveryNotes}
            </div>
          )}

          {/* Fare & Commission Breakdown Box */}
          <div className="bg-zinc-950 rounded-xl p-3 border border-purple-900/60 space-y-1.5">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Tarifa Total del Viaje:</span>
              <span className="font-mono font-bold text-white">${trip.fareUsd.toFixed(2)} USD (~{trip.fareVes.toFixed(2)} BS)</span>
            </div>

            {/* OBLIGATORIO: Muestra de comision del 10% siempre visible */}
            <div className="flex justify-between items-center text-xs text-purple-300 bg-purple-950/80 px-2 py-1 rounded border border-purple-800/60 font-mono">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-purple-400" />
                <span>Comisión Vixy (10%):</span>
              </span>
              <span className="font-bold text-red-300">-${trip.commissionFeeUsd.toFixed(2)} USD</span>
            </div>

            <div className="pt-1.5 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Tu Ganancia Neta:</span>
              <span className="text-lg font-black font-mono text-emerald-400">${trip.driverNetEarningsUsd.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3">
          <button
            onClick={onReject}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl text-xs transition-all border border-zinc-700"
          >
            Rechazar
          </button>
          
          <button
            onClick={() => onAccept(trip)}
            className="flex-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 active:scale-98"
          >
            <span>Aceptar Servicio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
