import React, { useState } from 'react';
import { Headphones, MessageSquare, PhoneCall, Send, ShieldAlert, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('pago_cartera');
  const [ticketDetails, setTicketDetails] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDetails) return;

    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketDetails('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900 border-2 border-purple-600/60 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/30 text-purple-300 rounded-2xl border border-purple-400/30">
            <Headphones className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Soporte Técnico & Atención al Conductor</h2>
            <p className="text-xs text-zinc-400">Atención personalizada las 24 horas para la red de conductores Vixy en Venezuela</p>
          </div>
        </div>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/584129876543"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-600/80 rounded-2xl p-4 transition-all shadow-lg flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono">En Línea</span>
          </div>
          <div>
            <div className="font-extrabold text-white text-sm group-hover:text-emerald-300">WhatsApp Soporte Directo</div>
            <div className="text-xs text-emerald-200/80 font-mono mt-0.5">+58 412-9876543</div>
          </div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-2 border-t border-emerald-800/60">
            <span>Iniciar Chat WhatsApp</span>
            <span>→</span>
          </div>
        </a>

        {/* Emergency Line */}
        <div className="bg-red-950/60 border border-red-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <PhoneCall className="w-6 h-6 text-red-400 animate-pulse" />
            <span className="text-[10px] bg-red-900 text-red-200 px-2 py-0.5 rounded font-mono">24/7 Urgente</span>
          </div>
          <div>
            <div className="font-extrabold text-white text-sm">Línea Telefónica Emergencia</div>
            <div className="text-xs text-red-200/80 font-mono mt-0.5">0800-VIXY-HELP (8499)</div>
          </div>
          <div className="text-xs font-bold text-red-300 pt-2 border-t border-red-800/60">
            Atención prioritaria vial y seguridad
          </div>
        </div>

        {/* Telegram Channel */}
        <a
          href="https://t.me/vixydrivervzla"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-950/60 hover:bg-purple-950 border border-purple-600/80 rounded-2xl p-4 transition-all shadow-lg flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <Send className="w-6 h-6 text-purple-400" />
            <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded font-mono">Comunidad</span>
          </div>
          <div>
            <div className="font-extrabold text-white text-sm group-hover:text-purple-300">Canal Telegram Conductores</div>
            <div className="text-xs text-purple-200/80 font-mono mt-0.5">@VixyDriverVzla</div>
          </div>
          <div className="text-xs font-bold text-purple-400 flex items-center gap-1 pt-2 border-t border-purple-800/60">
            <span>Unirme al Canal</span>
            <span>→</span>
          </div>
        </a>

      </div>

      {/* Ticket Submission Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-extrabold text-white text-base">Crear Ticket de Soporte al Conductor</h3>
        <p className="text-xs text-zinc-400">Si tuviste un problema con un pago, reporte de cliente o inconveniente técnico, déjanos tu mensaje:</p>

        {ticketSubmitted ? (
          <div className="bg-emerald-950/80 border border-emerald-600 rounded-xl p-5 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <div className="font-bold text-white text-sm">¡Ticket Registrado con Éxito!</div>
            <div className="text-xs text-emerald-300">Un agente del equipo de Soporte Vixy Venezuela responderá a tu correo a la brevedad.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Categoría de la Consulta:</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="pago_cartera">Inconveniente con Recarga o Cartera</option>
                  <option value="reporte_pasajero">Reporte de Pasajero o Incidencia</option>
                  <option value="documentos_intt">Actualización de Documentos / Vehículo</option>
                  <option value="falla_app">Falla de la Aplicación o GPS</option>
                  <option value="otro">Otras Consultas General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Asunto del Mensaje:</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Ej: Verificación de Pago Móvil pendiente..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Detalles Explicativos:</label>
              <textarea
                required
                rows={4}
                value={ticketDetails}
                onChange={(e) => setTicketDetails(e.target.value)}
                placeholder="Describe brevemente la situación, número de referencia o viaje involucrado..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg shadow-purple-950 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Ticket a Soporte</span>
            </button>

          </form>
        )}
      </div>

    </div>
  );
};
