import React, { useState } from 'react';
import { DriverProfile, PaymentGatewayInfo, WalletTransaction } from '../types';
import { PAYMENT_GATEWAYS, OFFICIAL_BCV_RATE } from '../data/mockData';
import { submitRechargeToAdmin } from '../services/adminIntegrationService';
import { 
  Wallet, 
  ArrowUpRight, 
  AlertTriangle, 
  Copy, 
  Check, 
  DollarSign, 
  Upload, 
  FileCheck, 
  CreditCard, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

interface WalletViewProps {
  profile: DriverProfile;
  balance: number;
  transactions: WalletTransaction[];
  onAddTransaction: (tx: WalletTransaction) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  profile,
  balance,
  transactions,
  onAddTransaction,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Recharge Modal State (Paso 1: Datos Fijos / Paso 2: Verificacion)
  const [rechargeStep, setRechargeStep] = useState<1 | 2>(1);
  const [inputCurrency, setInputCurrency] = useState<'VES' | 'USD'>('VES');
  const [manualInputVes, setManualInputVes] = useState<string>('342.50');
  const [manualInputUsd, setManualInputUsd] = useState<string>('5.00');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isDetenido = balance < -0.50;
  const isNewUserNoRecharge = !profile.hasInitialRecharge;

  const handleCopy = (text: string, fieldLabel: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldLabel);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSelectGateway = (gateway: PaymentGatewayInfo) => {
    setSelectedGateway(gateway);
    setRechargeStep(1);
    setReferenceNumber('');
    setReceiptFileName('');
    setSuccessMsg(null);
    const isPm = gateway.id === 'pago_movil';
    setInputCurrency(isPm ? 'VES' : 'USD');
    if (isPm) {
      setManualInputVes('342.50');
      setManualInputUsd('5.00');
    } else {
      setManualInputUsd('5.00');
      setManualInputVes((5 * OFFICIAL_BCV_RATE).toFixed(2));
    }
  };

  const handleVesChange = (val: string) => {
    setManualInputVes(val);
    const numVes = parseFloat(val);
    if (!isNaN(numVes) && numVes >= 0) {
      const usd = numVes / OFFICIAL_BCV_RATE;
      setManualInputUsd(usd.toFixed(2));
    } else {
      setManualInputUsd('0.00');
    }
  };

  const handleUsdChange = (val: string) => {
    setManualInputUsd(val);
    const numUsd = parseFloat(val);
    if (!isNaN(numUsd) && numUsd >= 0) {
      const ves = numUsd * OFFICIAL_BCV_RATE;
      setManualInputVes(ves.toFixed(2));
    } else {
      setManualInputVes('0.00');
    }
  };

  const handleProcessVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUsd = parseFloat(manualInputUsd);
    const finalVes = parseFloat(manualInputVes);

    if (isNaN(finalUsd) || finalUsd <= 0) {
      alert('Por favor ingresa un monto válido de recarga mayor a $0 USD.');
      return;
    }

    if (!referenceNumber || referenceNumber.trim().length < 4) {
      alert('Por favor ingresa un número de referencia o transacción válido (mínimo 4 dígitos).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newTx: WalletTransaction = {
        id: `tx-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'recharge',
        amountUsd: Number(finalUsd.toFixed(2)),
        amountVes: Number(finalVes.toFixed(2)),
        bcvRateUsed: OFFICIAL_BCV_RATE,
        method: selectedGateway?.id,
        referenceNumber: referenceNumber.trim(),
        description: `Recarga aprobada vía ${selectedGateway?.name}`,
        status: 'completed',
      };

      onAddTransaction(newTx);
      submitRechargeToAdmin(newTx); // Transmit to https://vhixy.site/
      setSuccessMsg(`¡Recarga de $${finalUsd.toFixed(2)} USD (~${finalVes.toFixed(2)} BS) procesada e ingresada a tu saldo exitosamente!`);
      
      // Close modal after 2.5s
      setTimeout(() => {
        setSelectedGateway(null);
        setSuccessMsg(null);
      }, 2500);

    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Top Banner & Balance Summary Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900 border-2 border-purple-600/60 rounded-3xl p-6 shadow-2xl">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-purple-600/30 text-purple-300 rounded-xl border border-purple-400/30">
                <Wallet className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl font-black text-white">Cartera de Saldo Conductor</h2>
                <p className="text-xs text-zinc-400">
                  Tasa BCV Oficial: <strong className="text-purple-300 font-mono">{OFFICIAL_BCV_RATE.toFixed(2)} BS/USD</strong>
                </p>
              </div>
            </div>

            {/* Status alerts */}
            {isDetenido && (
              <div className="bg-red-950/90 border border-red-700 rounded-xl p-3 text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <strong>¡ESTADO DETENIDO ACTIVO!</strong> Tu saldo actual (${balance.toFixed(2)}) es menor a -$0.50 USD. Estás suspendido temporalmente de recibir servicios hasta recargar.
                </div>
              </div>
            )}

            {isNewUserNoRecharge && !isDetenido && (
              <div className="bg-amber-950/90 border border-amber-700 rounded-xl p-3 text-xs text-amber-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong>Requisito para Nuevos Conductores:</strong> Debes realizar una recarga mínima de <strong>$5.00 USD</strong> para activar la recepción de viajes en la plataforma Vixy Driver.
                </div>
              </div>
            )}
          </div>

          {/* Balance Numerical Display Box */}
          <div className="bg-zinc-950/90 border border-purple-500/50 rounded-2xl p-5 text-right min-w-[220px] shadow-inner">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              Saldo Disponible en App
            </div>
            <div className={`text-3xl font-black font-mono tracking-tight my-1 ${
              isDetenido ? 'text-red-400' : balance < 2 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              ${balance.toFixed(2)} <span className="text-sm font-normal text-zinc-400">USD</span>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              ~{(balance * OFFICIAL_BCV_RATE).toFixed(2)} BS (BCV)
            </div>
            <div className="text-[10px] text-purple-400 mt-2 font-mono border-t border-zinc-800 pt-1">
              Límite mínimo: -$0.50 USD
            </div>
          </div>

        </div>
      </div>

      {/* Select Recharge Payment Method Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white">Métodos de Recarga Disponibles</h3>
            <p className="text-xs text-zinc-400">Cuentas fijas para depósitos con verificación en 2 pasos</p>
          </div>
          <span className="text-xs text-purple-300 bg-purple-950 border border-purple-800 px-2.5 py-1 rounded-lg font-mono">
            Tasa BCV del Día
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PAYMENT_GATEWAYS.map((gateway) => (
            <button
              key={gateway.id}
              onClick={() => handleSelectGateway(gateway)}
              className="bg-zinc-900/90 hover:bg-zinc-800 border-2 border-purple-900/60 hover:border-purple-500 rounded-xl p-3 text-left transition-all hover:scale-102 active:scale-98 shadow-md flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{gateway.logo}</span>
                <span className="text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-full">
                  {gateway.badge}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-white text-xs group-hover:text-purple-300 transition-colors">
                  {gateway.name}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Moneda: {gateway.currency}
                </p>
              </div>

              <div className="pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Ver Datos Fijos</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gateway Detail & Step 2 Verification Modal */}
      {selectedGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-zinc-900 border-2 border-purple-600 rounded-2xl p-6 shadow-2xl text-zinc-100 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedGateway.logo}</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">{selectedGateway.name}</h3>
                  <p className="text-xs text-purple-300">Paso {rechargeStep} de 2: {rechargeStep === 1 ? 'Datos Fijos' : 'Verificación'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGateway(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Toast inside modal if completed */}
            {successMsg ? (
              <div className="bg-emerald-950/90 border border-emerald-600 rounded-xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="font-black text-white text-base">{successMsg}</div>
                <div className="text-xs text-emerald-300">Tu saldo se ha actualizado inmediatamente. Puedes volver al mapa.</div>
              </div>
            ) : (
              <>
                {/* Step 1: Datos Fijos de Pago */}
                {rechargeStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-300 bg-purple-950/50 p-3 rounded-xl border border-purple-800/50">
                      {selectedGateway.instructions}
                    </p>

                    <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                        Datos Fijos de Cuenta Vixy:
                      </div>

                      {selectedGateway.fields.map((field, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/60 last:border-0">
                          <span className="text-zinc-400 font-medium">{field.label}:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                              {field.value}
                            </span>
                            {field.copyable && (
                              <button
                                onClick={() => handleCopy(field.value, field.label)}
                                className="p-1 text-purple-400 hover:text-purple-300 bg-purple-950 rounded border border-purple-800"
                                title="Copiar al portapapeles"
                              >
                                {copiedField === field.label ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pago Móvil BCV Converter box */}
                    {selectedGateway.id === 'pago_movil' && (
                      <div className="bg-gradient-to-r from-purple-950 to-indigo-950 p-3 rounded-xl border border-purple-700/60 text-xs space-y-1">
                        <div className="flex justify-between items-center text-purple-200">
                          <span>Monto Recargado Manual: <strong>{(parseFloat(manualInputVes) || 0).toFixed(2)} BS</strong></span>
                          <span>Tasa BCV: <strong>{OFFICIAL_BCV_RATE.toFixed(2)} BS</strong></span>
                        </div>
                        <div className="text-sm font-extrabold text-emerald-400 font-mono text-right">
                          Equivale a: ${(parseFloat(manualInputUsd) || 0).toFixed(2)} USD en App
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setRechargeStep(2)}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-purple-950 flex items-center justify-center gap-2"
                    >
                      <span>He Realizado el Pago • Ir a Verificación</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Step 2: Formulario de Verificacion con Monto Manual y Calculador BCV */}
                {rechargeStep === 2 && (
                  <form onSubmit={handleProcessVerification} className="space-y-4">
                    
                    {/* Manual Amount Input & Automatic Currency Converter Box */}
                    <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 space-y-3">
                      
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-purple-400" />
                          <span>Monto Recargado (Ingreso Manual):</span>
                        </label>
                        <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded-full">
                          Tasa BCV: {OFFICIAL_BCV_RATE.toFixed(2)} BS/USD
                        </span>
                      </div>

                      {/* Currency Mode Switcher Tabs */}
                      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                        <button
                          type="button"
                          onClick={() => setInputCurrency('VES')}
                          className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                            inputCurrency === 'VES'
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span>🇻🇪 Bolívares (Bs. VES)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputCurrency('USD')}
                          className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                            inputCurrency === 'USD'
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span>💵 Dólares ($ USD)</span>
                        </button>
                      </div>

                      {/* Manual Amount Number Input */}
                      <div>
                        {inputCurrency === 'VES' ? (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-zinc-300">Escribe el monto en Bolívares (Bs.):</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 font-bold text-purple-400 text-sm font-mono">Bs.</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={manualInputVes}
                                onChange={(e) => handleVesChange(e.target.value)}
                                placeholder="Ej: 342.50"
                                className="w-full bg-zinc-900 border-2 border-purple-500/80 focus:border-purple-400 rounded-xl pl-12 pr-4 py-2.5 text-base font-mono font-black text-white placeholder-zinc-600 focus:outline-none shadow-inner"
                              />
                            </div>
                            <p className="text-[10px] text-zinc-400 italic">Ingresa el monto manual exacto pagado en Bolívares por Pago Móvil.</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-zinc-300">Escribe el monto en Dólares ($ USD):</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 font-bold text-emerald-400 text-sm font-mono">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={manualInputUsd}
                                onChange={(e) => handleUsdChange(e.target.value)}
                                placeholder="Ej: 5.00"
                                className="w-full bg-zinc-900 border-2 border-purple-500/80 focus:border-purple-400 rounded-xl pl-9 pr-4 py-2.5 text-base font-mono font-black text-white placeholder-zinc-600 focus:outline-none shadow-inner"
                              />
                            </div>
                            <p className="text-[10px] text-zinc-400 italic">Ingresa el monto manual en dólares transferido vía Zinli, Binance o PayPal.</p>
                          </div>
                        )}
                      </div>

                      {/* Real-time Auto-Calculated Result Box */}
                      <div className="bg-gradient-to-r from-purple-950/90 via-zinc-900 to-indigo-950/90 border border-purple-600/60 p-3.5 rounded-xl space-y-1 shadow-md">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-200 font-bold uppercase tracking-wider text-[10px]">
                            Monto Calculado que Ingresará a tu Saldo:
                          </span>
                          <span className="text-emerald-400 font-bold text-[10px] font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            CÁLCULO AUTOMÁTICO
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                            ${(parseFloat(manualInputUsd) || 0).toFixed(2)} <span className="text-xs font-normal text-zinc-300">USD</span>
                          </div>
                          <div className="text-xs font-mono font-bold text-purple-300">
                            ~{(parseFloat(manualInputVes) || 0).toFixed(2)} BS
                          </div>
                        </div>

                        <div className="text-[10px] text-zinc-400 border-t border-purple-800/50 pt-1.5 flex justify-between font-mono">
                          <span>Tasa Oficial BCV: {OFFICIAL_BCV_RATE.toFixed(2)} BS/USD</span>
                          {inputCurrency === 'VES' ? (
                            <span>{(parseFloat(manualInputVes) || 0).toFixed(2)} Bs ÷ {OFFICIAL_BCV_RATE} = ${(parseFloat(manualInputUsd) || 0).toFixed(2)} USD</span>
                          ) : (
                            <span>${(parseFloat(manualInputUsd) || 0).toFixed(2)} USD × {OFFICIAL_BCV_RATE} = {(parseFloat(manualInputVes) || 0).toFixed(2)} Bs</span>
                          )}
                        </div>
                      </div>

                      {/* Quick Presets row */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Montos Frecuentes Sugeridos:</span>
                        <div className="flex flex-wrap gap-1">
                          {inputCurrency === 'VES' ? (
                            [342.50, 500, 685, 1000, 2000].map((presetBs) => (
                              <button
                                type="button"
                                key={presetBs}
                                onClick={() => handleVesChange(presetBs.toString())}
                                className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-purple-950 text-purple-300 border border-purple-900/80 hover:border-purple-600 text-[10px] font-mono font-bold transition-all"
                              >
                                {presetBs} Bs (~${(presetBs / OFFICIAL_BCV_RATE).toFixed(2)})
                              </button>
                            ))
                          ) : (
                            [5, 10, 20, 50, 100].map((presetUsd) => (
                              <button
                                type="button"
                                key={presetUsd}
                                onClick={() => handleUsdChange(presetUsd.toString())}
                                className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-purple-950 text-purple-300 border border-purple-900/80 hover:border-purple-600 text-[10px] font-mono font-bold transition-all"
                              >
                                ${presetUsd} USD (~{(presetUsd * OFFICIAL_BCV_RATE).toFixed(2)} Bs)
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Reference Number Input with Security Sanitization */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">
                        Número de Referencia / ID de Transacción:
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={32}
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value.replace(/[^a-zA-Z0-9\-\_]/g, ''))}
                        placeholder="Ej: 0098124578 o ID Binance / TxID"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono tracking-wide"
                      />
                      <p className="text-[10px] text-zinc-500">Formato seguro: Solo caracteres alfanuméricos y guiones (máx 32 caracteres).</p>
                    </div>

                    {/* Receipt Screenshot Upload Simulator */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300">
                        Adjuntar Comprobante de Pago (Captura):
                      </label>
                      <div className="border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-950 rounded-xl p-3 text-center cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setReceiptFileName(e.target.files[0].name);
                            }
                          }}
                          className="hidden"
                          id="receipt-file"
                        />
                        <label htmlFor="receipt-file" className="cursor-pointer space-y-1 block">
                          <Upload className="w-5 h-5 text-purple-400 mx-auto" />
                          <div className="text-xs text-zinc-300">
                            {receiptFileName ? (
                              <span className="text-emerald-400 font-bold">{receiptFileName}</span>
                            ) : (
                              'Haz clic para cargar captura de pantalla'
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setRechargeStep(1)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl text-xs"
                      >
                        Atrás (Ver Datos)
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-purple-950 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                            <span>Verificando Pago...</span>
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-4 h-4" />
                            <span>Enviar Verificación</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}
              </>
            )}

          </div>
        </div>
      )}

      {/* Wallet Transaction History Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">Historial de Movimientos de Cartera</h3>
            <p className="text-xs text-zinc-400">Recargas aprobadas y deducciones automáticas de comisión Vixy (10%)</p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {transactions.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Descripción / Referencia</th>
                <th className="p-3 text-right">Monto ($ USD)</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-zinc-400">
                    {tx.date}<br />
                    <span className="text-[9px] text-zinc-500">{tx.time}</span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'recharge' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}>
                      {tx.type === 'recharge' ? 'RECARGA' : 'COMISIÓN 10%'}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-white">{tx.description}</div>
                    {tx.referenceNumber && (
                      <div className="text-[10px] text-zinc-400 font-mono">
                        Ref: {tx.referenceNumber} {tx.method && `(${tx.method.toUpperCase()})`}
                      </div>
                    )}
                  </td>

                  <td className={`p-3 text-right font-mono font-bold ${
                    tx.amountUsd >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {tx.amountUsd >= 0 ? `+$${tx.amountUsd.toFixed(2)}` : `-$${Math.abs(tx.amountUsd).toFixed(2)}`}
                  </td>

                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Completado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
