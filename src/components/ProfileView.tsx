import React, { useState } from 'react';
import { DriverDocument, DriverProfile, ServiceType, VehicleInfo } from '../types';
import { 
  User, 
  ShieldCheck, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Car, 
  Bike, 
  Package, 
  Camera, 
  Edit3, 
  Eye, 
  IdCard,
  Building,
  Calendar,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

interface ProfileViewProps {
  profile: DriverProfile;
  onUpdateProfile: (updated: DriverProfile) => void;
  onOpenPresentationCard?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenPresentationCard,
}) => {
  const [selectedDocForUpload, setSelectedDocForUpload] = useState<DriverDocument | null>(null);
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [docNumberInput, setDocNumberInput] = useState('');
  const [degreeInput, setDegreeInput] = useState('3ra Grado');
  const [editPlateNumber, setEditPlateNumber] = useState(profile.plateNumber);
  const [isEditingPlate, setIsEditingPlate] = useState(false);

  // Toggle offering service line
  const handleToggleService = (service: ServiceType) => {
    let updatedServices: ServiceType[];
    if (profile.servicesOffered.includes(service)) {
      if (profile.servicesOffered.length === 1) {
        alert('Debes mantener al menos una categoría de servicio activa.');
        return;
      }
      updatedServices = profile.servicesOffered.filter((s) => s !== service);
    } else {
      updatedServices = [...profile.servicesOffered, service];
    }

    onUpdateProfile({
      ...profile,
      servicesOffered: updatedServices,
    });
  };

  // Submit document upload
  const handleConfirmDocUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForUpload) return;

    const updatedDocs = profile.documents.map((doc) => {
      if (doc.id === selectedDocForUpload.id) {
        return {
          ...doc,
          status: 'approved' as const, // Instant simulated approval
          documentNumber: docNumberInput || doc.documentNumber,
          degree: selectedDocForUpload.id === 'doc-licencia' ? degreeInput : doc.degree,
          notes: 'Documento verificado y actualizado.',
        };
      }
      return doc;
    });

    onUpdateProfile({
      ...profile,
      documents: updatedDocs,
    });

    setSelectedDocForUpload(null);
    setUploadFile(null);
    setDocNumberInput('');
  };

  const handleSavePlate = () => {
    if (!editPlateNumber || editPlateNumber.trim().length < 4) {
      alert('Por favor ingresa un número de placa válido.');
      return;
    }
    onUpdateProfile({
      ...profile,
      plateNumber: editPlateNumber.trim().toUpperCase(),
    });
    setIsEditingPlate(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Driver Header Profile Card */}
      <div className="bg-gradient-to-r from-purple-950 via-zinc-900 to-purple-950 border-2 border-purple-600/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 relative z-10">
          
          {/* Avatar with photo change trigger */}
          <div className="relative group">
            <img
              src={profile.profilePhotoUrl}
              alt={profile.fullName}
              className="w-28 h-28 rounded-2xl object-cover ring-4 ring-purple-500 shadow-xl"
            />
            <button
              onClick={() => {
                const newUrl = prompt('Ingresa la URL de la nueva foto de perfil:', profile.profilePhotoUrl);
                if (newUrl) onUpdateProfile({ ...profile, profilePhotoUrl: newUrl });
              }}
              className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-xl shadow-lg border border-purple-300 transition-all"
              title="Cambiar Foto de Perfil"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Basic Info */}
          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl font-black text-white">{profile.fullName}</h2>
              <span className="flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Conductor Verificado INTT</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Cédula: <span className="font-mono text-zinc-200 font-bold">{profile.cedula}</span> • Teléfono: <span className="font-mono text-zinc-200">{profile.phone}</span>
            </p>

            {/* OBLIGATORIO: Muestra de Número de Placa */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="bg-zinc-950 border border-purple-500/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <span className="text-[10px] text-purple-300 font-bold uppercase">Placa de Presentación:</span>
                {isEditingPlate ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editPlateNumber}
                      onChange={(e) => setEditPlateNumber(e.target.value.toUpperCase())}
                      className="w-24 bg-zinc-900 border border-purple-500 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-white text-center"
                    />
                    <button onClick={handleSavePlate} className="text-emerald-400 font-bold text-xs bg-emerald-950 px-2 py-0.5 rounded">
                      Guardar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white text-base tracking-wider">{profile.plateNumber}</span>
                    <button onClick={() => setIsEditingPlate(true)} className="text-purple-400 hover:text-purple-300" title="Editar Placa">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {onOpenPresentationCard && (
                <button
                  onClick={onOpenPresentationCard}
                  className="bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600/80 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                  title="Ver Tarjeta Digital de Presentación Vixy Driver"
                >
                  <IdCard className="w-4 h-4 text-purple-300" />
                  <span>Ver Tarjeta de Presentación / Placa</span>
                </button>
              )}

              <div className="text-xs text-zinc-400">
                Calificación: <strong className="text-amber-400 font-mono">★ {profile.rating}</strong> ({profile.totalTrips} viajes)
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Services Selection Categories (Renglones de Servicio Elegibles) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div>
          <h3 className="text-base font-extrabold text-white">Renglones de Servicio Activos</h3>
          <p className="text-xs text-zinc-400">Selecciona las categorías de viajes que deseas ofrecer en Vixy Driver</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Moto */}
          <div className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
            profile.servicesOffered.includes('moto')
              ? 'bg-purple-950/60 border-purple-600 text-white'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
          }`} onClick={() => handleToggleService('moto')}>
            <div className="flex items-center gap-3">
              <Bike className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-bold text-sm">Vixy Moto</div>
                <div className="text-[10px] text-zinc-400">Placa + Casco + Lic. 2da</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.servicesOffered.includes('moto')}
              onChange={() => {}}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>

          {/* Taxi */}
          <div className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
            profile.servicesOffered.includes('taxi')
              ? 'bg-purple-950/60 border-purple-600 text-white'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
          }`} onClick={() => handleToggleService('taxi')}>
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-bold text-sm">Vixy Taxi</div>
                <div className="text-[10px] text-zinc-400">Placa + RCV + Lic. 3ra</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.servicesOffered.includes('taxi')}
              onChange={() => {}}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>

          {/* Delivery */}
          <div className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
            profile.servicesOffered.includes('delivery')
              ? 'bg-purple-950/60 border-purple-600 text-white'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
          }`} onClick={() => handleToggleService('delivery')}>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-bold text-sm">Vixy Delivery</div>
                <div className="text-[10px] text-zinc-400">Bolso Térmico</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.servicesOffered.includes('delivery')}
              onChange={() => {}}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>

        </div>
      </div>

      {/* Mandatory Documents Venezuelan Legislation Checklist (Documentos Obligatorios Ley de Tránsito) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Documentos Obligatorios (Ley de Tránsito Venezolana)</h3>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                INTT
              </span>
            </div>
            <p className="text-xs text-zinc-400">Requisitos indispensables para habilitar servicios de transporte según la legislación nacional</p>
          </div>

          <div className="text-right font-mono text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-800">
            {profile.documents.filter(d => d.status === 'approved').length} de {profile.documents.length} Aprobados
          </div>
        </div>

        {/* Document Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-600/50 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm">{doc.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                    doc.status === 'approved' 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{doc.status === 'approved' ? 'APROBADO' : 'PENDIENTE'}</span>
                  </span>
                </div>

                <p className="text-[11px] text-purple-300 font-medium">
                  {doc.legalBasis}
                </p>

                {doc.documentNumber && (
                  <div className="text-xs text-zinc-400 font-mono">
                    Nº: <strong className="text-zinc-200">{doc.documentNumber}</strong> {doc.degree && `(${doc.degree})`}
                  </div>
                )}

                {doc.expiryDate && (
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Vencimiento: {doc.expiryDate}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-zinc-400 italic">{doc.notes}</span>
                <button
                  onClick={() => setSelectedDocForUpload(doc)}
                  className="bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Actualizar</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Modal for Document Upload */}
      {selectedDocForUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-purple-600 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-extrabold text-sm text-white">Actualizar {selectedDocForUpload.name}</h3>
              <button onClick={() => setSelectedDocForUpload(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-purple-300">
              {selectedDocForUpload.legalBasis}
            </p>

            <form onSubmit={handleConfirmDocUpload} className="space-y-3 text-xs">
              
              {selectedDocForUpload.id === 'doc-licencia' && (
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Grado de Licencia INTT:</label>
                  <select
                    value={degreeInput}
                    onChange={(e) => setDegreeInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="2da Grado">2da Grado (Motocicletas)</option>
                    <option value="3ra Grado">3ra Grado (Vehículos hasta 9 puestos)</option>
                    <option value="4ta Grado">4ta Grado (Transporte colectivo / Carga)</option>
                    <option value="5ta Grado">5ta Grado (Carga pesada)</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Número de Documento / Póliza / Matrícula:</label>
                <input
                  type="text"
                  required
                  value={docNumberInput}
                  onChange={(e) => setDocNumberInput(e.target.value)}
                  placeholder="Ej: RCV-991208 ó LIC-20145890"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Foto o Archivo del Documento:</label>
                <div className="border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-950 p-4 rounded-xl text-center cursor-pointer">
                  <Upload className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <span className="text-zinc-400">Cargar foto frontal clara e inteligible</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocForUpload(null)}
                  className="bg-zinc-800 text-zinc-300 font-bold px-3 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg"
                >
                  Guardar Documento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
