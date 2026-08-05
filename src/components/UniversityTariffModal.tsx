import React from 'react';
import { GraduationCap, ShieldCheck, Info, CheckCircle2, Award, Heart, BookOpen, AlertCircle, X } from 'lucide-react';

interface UniversityTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversityTariffModal: React.FC<UniversityTariffModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border-2 border-blue-600 rounded-3xl p-5 sm:p-6 shadow-2xl text-zinc-100 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 p-2 rounded-full border border-zinc-700 transition-all hover:scale-105"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-950 ring-4 ring-blue-500/20">
            <GraduationCap className="w-8 h-8 text-sky-200" />
          </div>
          <span className="inline-block bg-blue-950 text-blue-300 border border-blue-700/80 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider font-mono">
            Notificación Oficial para Conductores
          </span>
          <h3 className="text-xl font-extrabold text-white">Tarifa Universitaria Vixy</h3>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
            Información y lineamientos del Programa de Movilidad Estudiantil para universidades en Venezuela (UCV, USB, UCAB, UNEFA, LUZ, ULA, UNIMET y más).
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-zinc-900 border-2 border-blue-500/60 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs">
            <Award className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Beneficio del Pasajero Estudiante</span>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed">
            Los estudiantes universitarios con carnet o constancia activa reciben un <strong className="text-sky-300">descuento preferencial del 50%</strong> en sus viajes en Moto, Taxi o Delivery.
          </p>
        </div>

        {/* Driver Key Principles */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Reglamento & Garantías para el Conductor</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Comisión Vixy Protegida</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                La comisión de Vixy se mantiene congelada en solo el 10%, asegurando que tu ganancia neta siga siendo rentable.
              </p>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Verificación de Carnet</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Puedes solicitar amablemente al estudiante mostrar su carnet universitario o constancia de estudio vigente al subir al vehículo.
              </p>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sky-400">
                <Info className="w-4 h-4 shrink-0 text-sky-400" />
                <span>Indicador en la App</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Cada solicitud con beneficio incluirá una etiqueta distintiva <span className="text-sky-300 font-bold">"🎓 Tarifa Universitaria"</span> en la pantalla de aceptación.
              </p>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-400">
                <Heart className="w-4 h-4 shrink-0 text-purple-400" />
                <span>Impacto Social</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Apoyas la educación y el futuro del país al facilitar el traslado seguro de los futuros profesionales de Venezuela.
              </p>
            </div>

          </div>
        </div>

        {/* Verification Note Box */}
        <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-amber-300 block">¿Qué hacer si el pasajero no presenta Carnet?</strong>
            <p className="text-zinc-300 text-[11px] leading-tight">
              Si el usuario no tiene acreditación universitaria, puedes solicitarle la tarifa estándar o reportarlo desde la aplicación sin penalización.
            </p>
          </div>
        </div>

        {/* Close Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black py-3 rounded-xl text-xs shadow-lg shadow-blue-950 active:scale-98 transition-all"
        >
          Entendido, Continuar Conduciendo
        </button>

      </div>
    </div>
  );
};
