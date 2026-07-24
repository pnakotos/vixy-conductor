import React, { useState } from 'react';
import { TripService } from '../types';
import { Star, CheckCircle2, ThumbsUp, Shield, MessageSquare, DollarSign } from 'lucide-react';

interface PassengerRatingModalProps {
  trip: TripService;
  onSubmitRating: (rating: number, feedback: string) => void;
}

export const PassengerRatingModal: React.FC<PassengerRatingModalProps> = ({
  trip,
  onSubmitRating,
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Puntual', 'Respetuoso']);
  const [comment, setComment] = useState('');

  const tagsList = [
    'Puntual',
    'Respetuoso',
    'Pagó Exacto',
    'Excelente Comunicación',
    'Hizo Esperar',
    'Lugar Inaccesible',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    const feedbackText = `${selectedTags.join(', ')} ${comment ? ` - ${comment}` : ''}`;
    onSubmitRating(rating, feedbackText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-purple-500/80 rounded-2xl p-5 shadow-2xl text-zinc-100 space-y-4">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white">¡Viaje Finalizado con Éxito!</h3>
          <p className="text-xs text-zinc-400">
            Cobrado: <strong className="text-emerald-400 font-mono">${trip.fareUsd.toFixed(2)} USD</strong> ({trip.paymentMethod})
          </p>
        </div>

        {/* Passenger Card */}
        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center gap-3">
          <img
            src={trip.passenger.photoUrl}
            alt={trip.passenger.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500"
          />
          <div>
            <div className="text-xs text-zinc-400">Calificar Pasajero:</div>
            <div className="font-bold text-white text-sm">{trip.passenger.name}</div>
          </div>
        </div>

        {/* Stars */}
        <div className="text-center space-y-1">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : 'text-zinc-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-xs font-bold text-amber-300">
            {rating === 5 && '¡Excelente pasajero!'}
            {rating === 4 && 'Muy buen servicio'}
            {rating === 3 && 'Servicio regular'}
            {rating < 3 && 'Pasajero problemático'}
          </div>
        </div>

        {/* Quick Tags */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-zinc-400">Detalles de la Experiencia:</div>
          <div className="flex flex-wrap gap-1.5">
            {tagsList.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-950 text-purple-200 border-purple-600'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Comment */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Comentario Adicional (Opcional):</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ej: Pasajero muy educado y puntual..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-lg shadow-purple-950"
        >
          Enviar Calificación & Volver a Inicio
        </button>

      </div>
    </div>
  );
};
