import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Server, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Key, 
  X, 
  Activity, 
  Database, 
  Zap, 
  ExternalLink,
  ArrowRight,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { DriverProfile } from '../types';
import type { AppConfig } from '../config/appConfig';
import { 
  testAdminConnection, 
  syncDriverProfileToAdmin, 
  getSyncLogs, 
  AdminServerStatus, 
  AdminSyncLog 
} from '../services/adminIntegrationService';

interface AdminInterconnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DriverProfile;
  appConfig?: AppConfig;
  onConfigChange?: (updates: Partial<AppConfig>) => void;
}

export const AdminInterconnectionModal: React.FC<AdminInterconnectionModalProps> = ({
  isOpen,
  onClose,
  profile,
  appConfig,
  onConfigChange,
}) => {
  const [serverStatus, setServerStatus] = useState<AdminServerStatus | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [apiKey, setApiKey] = useState(appConfig?.interconnectionKey || (import.meta as any).env?.VITE_INTERCONNECTION_KEY || '');
  const [appName, setAppName] = useState(appConfig?.appName || 'Vixy Driver');
  const [appSubtitle, setAppSubtitle] = useState(appConfig?.appSubtitle || 'Servicios y movilidad en Venezuela');
  const [logoUrl, setLogoUrl] = useState(appConfig?.logoUrl || '/images/vixy-brand.svg');
  const [debugMode, setDebugMode] = useState(appConfig?.debugMode ?? false);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [logs, setLogs] = useState<AdminSyncLog[]>([]);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(appConfig?.interconnectionKey || (import.meta as any).env?.VITE_INTERCONNECTION_KEY || '');
      setAppName(appConfig?.appName || 'Vixy Driver');
      setAppSubtitle(appConfig?.appSubtitle || 'Servicios y movilidad en Venezuela');
      setLogoUrl(appConfig?.logoUrl || '/images/vixy-brand.svg');
      setDebugMode(appConfig?.debugMode ?? false);
      handlePing();
      setLogs(getSyncLogs());
    }
  }, [isOpen, appConfig]);

  if (!isOpen) return null;

  const handlePing = async () => {
    setIsPinging(true);
    const status = await testAdminConnection(apiKey);
    setServerStatus(status);
    setLogs(getSyncLogs());
    setIsPinging(false);
  };

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setSyncSuccessMessage(null);
    
    await testAdminConnection(apiKey);
    const res = await syncDriverProfileToAdmin(profile);
    
    setLogs(getSyncLogs());
    setIsManualSyncing(false);
    setSyncSuccessMessage('¡Sincronización completa realizada con exito hacia https://vhixy.site/!');

    setTimeout(() => {
      setSyncSuccessMessage(null);
    }, 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveConfig = () => {
    onConfigChange?.({
      appName,
      appSubtitle,
      logoUrl,
      debugMode,
      interconnectionKey: apiKey,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-950 border border-purple-900/80 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-purple-500/30">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-zinc-900 to-zinc-950 border-b border-purple-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Interconexión Administrativa Central
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  https://vhixy.site/
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Sincronización en tiempo real con la plataforma de administración Vhixy
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 max-h-[72vh]">

          {/* Main Status Connection Box */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-950/40 border border-purple-900/60 rounded-xl p-4 sm:p-5 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-zinc-400 uppercase font-mono font-bold tracking-wider">Servidor Administrativo Matriz</span>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://vhixy.site/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base sm:text-lg font-black text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    https://vhixy.site/
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-zinc-300">
                  Estado: <span className="font-extrabold text-emerald-400">Conectado y Operativo</span> {serverStatus ? `(${serverStatus.pingMs} ms - v2.4.0)` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePing}
                  disabled={isPinging}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-purple-400' : ''}`} />
                  {isPinging ? 'Probando Latencia...' : 'Probar Ping'}
                </button>

                <button
                  onClick={handleManualSync}
                  disabled={isManualSyncing}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-900/50 transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className={`w-3.5 h-3.5 text-yellow-300 ${isManualSyncing ? 'animate-bounce' : ''}`} />
                  {isManualSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
                </button>
              </div>
            </div>

            {/* Notification message */}
            {syncSuccessMessage && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {syncSuccessMessage}
              </div>
            )}
          </div>

          {/* Customization and Debug Controls */}
          <div className="bg-zinc-900/80 border border-purple-900/40 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Personalización y Depuración
                </h4>
              </div>
              <button
                onClick={handleSaveConfig}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white"
              >
                Guardar
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-[11px] text-zinc-300">
                <span className="mb-1 block font-bold">Nombre de la app</span>
                <input value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-white" />
              </label>
              <label className="text-[11px] text-zinc-300">
                <span className="mb-1 block font-bold">Subtítulo</span>
                <input value={appSubtitle} onChange={(e) => setAppSubtitle(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-white" />
              </label>
            </div>

            <label className="text-[11px] text-zinc-300 block">
              <span className="mb-1 block font-bold">URL del logo</span>
              <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-white" />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-[11px] text-zinc-300">
              <span>Mostrar banner de depuración</span>
              <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} className="h-4 w-4 rounded border-zinc-700 bg-zinc-900" />
            </label>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] font-bold text-zinc-300">Clave de interconexión</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-2 text-xs text-white" />
                <button onClick={() => setShowKey((prev) => !prev)} className="rounded-lg border border-zinc-700 px-2.5 py-2 text-[11px] text-zinc-300">{showKey ? 'Ocultar' : 'Mostrar'}</button>
                <button onClick={() => copyToClipboard(apiKey)} className="rounded-lg border border-zinc-700 px-2.5 py-2 text-[11px] text-zinc-300">{copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
              </div>
            </div>
          </div>

          {/* Interconnection Security Badge (Token configuration hidden from driver interface) */}
          <div className="bg-zinc-900/80 border border-purple-900/40 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Credenciales de Interconexión SSL Cifradas
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                DEBUG / PRUEBAS
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Las llaves de autenticación y tokens de la API principal (<strong className="text-emerald-300">https://vhixy.site/</strong>) están preconfiguradas y protegidas por SSL. Su administración se gestiona exclusivamente desde el backend central antes del despliegue.
            </p>
          </div>

          {/* Connected Services Capabilities Grid */}
          <div>
            <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Módulos Interconectados en Tiempo Real
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-extrabold text-white">Validación de Licencias INTT</h5>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Verificación homologada de cédula, grado de licencia y RCV en la base central de vhixy.site.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex items-start gap-3">
                <Database className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-extrabold text-white">Conciliación de Recargas</h5>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Validación inmediata de pagos en Pago Móvil, Zinli y Binance con acreditación automática.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-extrabold text-white">Liquidación de Comisión 10%</h5>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Transmisión instantánea del libro contable de cada servicio completado a la matriz administrativa.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-extrabold text-white">Tasa Oficial BCV Actualizada</h5>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Sincronización diaria del tipo de cambio oficial publicado por el Banco Central de Venezuela.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Sync Activity History Log */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Historial de Registro de Eventos (API vhixy.site)
              </h4>
              <span className="text-[10px] text-zinc-400 font-mono">Últimas transacciones</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/80 max-h-48 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  Sin registros de transmisión recientes.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-zinc-900/50 transition-colors space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-extrabold text-white">{log.action}</span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-400">{log.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-zinc-300 font-sans pl-4">
                      {log.details}
                    </p>

                    <div className="pl-4 pt-0.5 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
                      <span>Endpoint: {log.endpoint}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enlace Seguro SSL 256-Bit con <strong>vhixy.site</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-md"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
};
