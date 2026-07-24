import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { HelpCircle, ChevronDown, ChevronUp, Search, BookOpen, ShieldCheck, Percent, Wallet } from 'lucide-react';

export const FaqView: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900 border-2 border-purple-600/60 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/30 text-purple-300 rounded-2xl border border-purple-400/30">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Preguntas Frecuentes Vixy Driver</h2>
            <p className="text-xs text-zinc-400">Guía completa de funcionamiento, legislación venezolana y normativas de la app</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar preguntas sobre comisiones, saldo, Pago Móvil, documentos RCV, pánico..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 shadow-xl"
        />
      </div>

      {/* FAQ Items Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-full">
                    {faq.category}
                  </span>
                  <h4 className="font-extrabold text-white text-sm">{faq.question}</h4>
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-purple-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-zinc-300 border-t border-zinc-800/80 bg-zinc-950/60 leading-relaxed space-y-2">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
