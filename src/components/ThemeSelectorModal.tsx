import React from 'react';
import { Palette, Check, Sparkles, X, Sun, Moon } from 'lucide-react';
import { APP_THEMES, AppTheme } from '../data/themes';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const currentTheme = APP_THEMES.find((t) => t.id === currentThemeId) || APP_THEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-950 border border-purple-900/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-purple-500/30">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-zinc-900 to-zinc-950 border-b border-purple-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 ring-1 ring-purple-400/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Diseño & Temas Visuales
                </h3>
                <span className="text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-700/80 px-2 py-0.5 rounded-full">
                  10 Opciones
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Selecciona la apariencia que mejor se adapte a tu estilo de conducción
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently Active Theme Banner */}
        <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-zinc-300">
              Tema Activo Actual: <strong className="text-white font-extrabold">{currentTheme.name}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-400 font-bold hidden sm:inline">
            Cambio instantáneo en tiempo real
          </span>
        </div>

        {/* Theme Options Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[65vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {APP_THEMES.map((theme) => {
              const isSelected = theme.id === currentThemeId;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all relative group flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-zinc-900/95 border-purple-500 shadow-xl shadow-purple-950/50 ring-2 ring-purple-500/40'
                      : 'bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800/80 hover:border-purple-800/60'
                  }`}
                >
                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-purple-600 text-white p-1 rounded-full shadow-lg shadow-purple-900/60">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {/* Header & Swatches */}
                  <div>
                    <div className="flex items-center justify-between pr-8">
                      <div className="flex items-center gap-2">
                        {theme.isLight ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-purple-400" />
                        )}
                        <h4 className="font-extrabold text-white text-sm group-hover:text-purple-300 transition-colors">
                          {theme.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-purple-300 font-medium mt-0.5">
                      {theme.subtitle}
                    </p>

                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Visual Color Swatches & Gradient Bar Preview */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    {/* Swatch dots */}
                    <div className="flex items-center gap-1.5">
                      {theme.swatchColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={`Color ${idx + 1}: ${color}`}
                        />
                      ))}
                    </div>

                    {/* Gradient bar preview */}
                    <div className="flex-1 max-w-[120px] h-3 rounded-full bg-gradient-to-r overflow-hidden border border-white/10 ring-1 ring-black/40">
                      <div className={`w-full h-full bg-gradient-to-r ${theme.gradientClass}`} />
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                      isSelected 
                        ? 'bg-purple-600 text-white border-purple-400' 
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {isSelected ? 'APLICADO' : 'SELECCIONAR'}
                    </span>
                  </div>

                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-zinc-400 hidden sm:block">
            Tu preferencia de diseño se aplica automáticamente en toda la app Vixy Driver.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto ml-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-900/40 transition-all"
          >
            Confirmar y Continuar
          </button>
        </div>

      </div>
    </div>
  );
};
