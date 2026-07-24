import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TripService } from '../types';
import { Navigation, Locate, Eye, Play, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface MapContainerProps {
  activeTrip: TripService | null;
  driverPosition: { lat: number; lng: number };
  isOnline: boolean;
  isDetenido: boolean;
  onSimulateStep?: () => void;
  onCenterDriver?: () => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  activeTrip,
  driverPosition,
  isOnline,
  isDetenido,
  onSimulateStep,
  onCenterDriver,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const driverMarker = useRef<L.Marker | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const dropoffMarker = useRef<L.Marker | null>(null);
  const polylineRoute = useRef<L.Polyline | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMap.current) return;

    // Caracas initial center
    const map = L.map(mapRef.current, {
      center: [driverPosition.lat, driverPosition.lng],
      zoom: 14,
      zoomControl: false,
    });

    // Dark styled OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap • Vixy Driver Venezuela',
      className: 'dark-map-tiles',
    }).addTo(map);

    leafletMap.current = map;

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update Driver Marker & Camera
  useEffect(() => {
    if (!leafletMap.current) return;

    const map = leafletMap.current;

    // Custom Driver Icon SVG
    const driverIcon = L.divIcon({
      className: 'custom-driver-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 bg-purple-600/30 rounded-full animate-ping"></div>
          <div class="w-8 h-8 bg-purple-600 ring-2 ring-white shadow-xl rounded-full flex items-center justify-center text-white font-black text-xs">
            VX
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (driverMarker.current) {
      driverMarker.current.setLatLng([driverPosition.lat, driverPosition.lng]);
    } else {
      driverMarker.current = L.marker([driverPosition.lat, driverPosition.lng], { icon: driverIcon })
        .addTo(map)
        .bindPopup('<b>Tú (Conductor Vixy)</b><br>Ubicación GPS activa en Caracas');
    }

    if (!activeTrip) {
      map.panTo([driverPosition.lat, driverPosition.lng], { animate: true });
    }
  }, [driverPosition, activeTrip]);

  // Render Pickup & Dropoff Route if Active Trip exists
  useEffect(() => {
    if (!leafletMap.current) return;
    const map = leafletMap.current;

    // Clear previous elements
    if (pickupMarker.current) {
      pickupMarker.current.remove();
      pickupMarker.current = null;
    }
    if (dropoffMarker.current) {
      dropoffMarker.current.remove();
      dropoffMarker.current = null;
    }
    if (polylineRoute.current) {
      polylineRoute.current.remove();
      polylineRoute.current = null;
    }

    if (activeTrip) {
      const pickupIcon = L.divIcon({
        className: 'pickup-icon',
        html: `<div class="w-7 h-7 bg-emerald-500 ring-2 ring-white rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">A</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const dropoffIcon = L.divIcon({
        className: 'dropoff-icon',
        html: `<div class="w-7 h-7 bg-amber-500 ring-2 ring-white rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">B</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      pickupMarker.current = L.marker([activeTrip.pickupLocation.lat, activeTrip.pickupLocation.lng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>Punto A (Origen)</b><br>${activeTrip.pickupLocation.address}`);

      dropoffMarker.current = L.marker([activeTrip.dropoffLocation.lat, activeTrip.dropoffLocation.lng], { icon: dropoffIcon })
        .addTo(map)
        .bindPopup(`<b>Punto B (Destino)</b><br>${activeTrip.dropoffLocation.address}`);

      // Draw polyline connecting Driver -> Pickup -> Dropoff
      const points: [number, number][] = [
        [driverPosition.lat, driverPosition.lng],
        [activeTrip.pickupLocation.lat, activeTrip.pickupLocation.lng],
        [activeTrip.dropoffLocation.lat, activeTrip.dropoffLocation.lng],
      ];

      polylineRoute.current = L.polyline(points, {
        color: '#9333ea',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(map);

      // Fit bounds to show whole trip
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activeTrip]);

  const handleRecenter = () => {
    if (leafletMap.current) {
      leafletMap.current.setView([driverPosition.lat, driverPosition.lng], 15, { animate: true });
    }
    if (onCenterDriver) onCenterDriver();
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[480px] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      
      {/* The Leaflet Map Canvas */}
      <div ref={mapRef} className="w-full h-full z-0 dark-tiles" />

      {/* Floating Map Controls Top Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          title="Centrar en mi ubicación"
          className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-purple-600/50 hover:border-purple-400 text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        >
          <Locate className="w-5 h-5 text-purple-400" />
        </button>

        {activeTrip && onSimulateStep && (
          <button
            onClick={onSimulateStep}
            title="Simular avance del recorrido"
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/60 backdrop-blur-md transition-all hover:scale-105 active:scale-95 animate-bounce"
          >
            <Play className="w-5 h-5 fill-white" />
          </button>
        )}
      </div>

      {/* Status Overlay Banner Top Left */}
      <div className="absolute top-4 left-4 z-20 max-w-xs">
        {isDetenido ? (
          <div className="bg-red-950/90 border border-red-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <div className="font-extrabold text-white">Estado Detenido</div>
              <div className="text-[11px] text-red-300">Saldo insuficiente (&lt; -$0.50). Recarga en la cartera.</div>
            </div>
          </div>
        ) : isOnline ? (
          <div className="bg-zinc-900/90 border border-emerald-500/50 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs text-zinc-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div>
              <div className="font-bold text-emerald-400">En Línea • Buscando Servicios</div>
              <div className="text-[10px] text-zinc-400">Caracas, Venezuela (Comisión 10%)</div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 shrink-0" />
            <div>
              <div className="font-bold text-zinc-300">Fuera de Línea</div>
              <div className="text-[10px]">Conéctate arriba para recibir solicitudes</div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Info Pill when active */}
      {activeTrip && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-lg mx-auto bg-zinc-900/95 border border-purple-500/60 rounded-xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-purple-400 animate-spin" />
            <div>
              <span className="font-bold text-white">{activeTrip.serviceName}</span>
              <span className="text-zinc-400 ml-2">({activeTrip.distanceKm} km • ~{activeTrip.durationMins} min)</span>
            </div>
          </div>
          <div className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            ${activeTrip.fareUsd.toFixed(2)} USD
          </div>
        </div>
      )}

    </div>
  );
};
