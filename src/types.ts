export type ServiceType = 'moto' | 'taxi' | 'delivery';

export type DocumentStatus = 'approved' | 'pending' | 'rejected' | 'missing';

export interface DriverDocument {
  id: string;
  name: string;
  legalBasis: string; // e.g. "Art. 63 Ley de Tránsito Terrestre"
  status: DocumentStatus;
  url?: string;
  expiryDate?: string;
  degree?: string; // For license (2da, 3ra, 4ta, 5ta)
  policyNumber?: string; // For RCV
  documentNumber?: string; // Cédula or License #
  requiredFor: ServiceType[];
  notes?: string;
}

export interface VehicleInfo {
  type: ServiceType;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string; // Obligatorio según ley venezolana
  photoUrl: string;
  hasHelmet?: boolean; // Para moto
  seatsCount?: number; // Para taxi
  hasThermalBag?: boolean; // Para delivery
}

export interface DriverProfile {
  id: string;
  fullName: string;
  cedula: string; // e.g., V-19827364
  phone: string; // e.g., +58 412-5551234
  email: string;
  profilePhotoUrl: string; // Obligatorio para tarjeta de presentación
  plateNumber: string; // Obligatorio para tarjeta de presentación
  rating: number;
  totalTrips: number;
  acceptanceRate: number;
  servicesOffered: ServiceType[];
  vehicles: Record<ServiceType, VehicleInfo | null>;
  documents: DriverDocument[];
  isVerifiedByVixy: boolean;
  isApproved?: boolean;
  isActiveOnline: boolean;
  isSuspendedByBalance: boolean;
  hasInitialRecharge: boolean; // Obligatorio recargar mínimo 5$ usuarios nuevos
  city: string; // e.g. Caracas
}

export interface WalletTransaction {
  id: string;
  date: string;
  time: string;
  type: 'recharge' | 'commission_fee' | 'trip_earning' | 'bonus';
  amountUsd: number;
  amountVes?: number;
  bcvRateUsed?: number;
  method?: 'pago_movil' | 'zinli' | 'binance' | 'paypal' | 'system';
  referenceNumber?: string;
  description: string;
  status: 'completed' | 'pending' | 'rejected';
}

export type TripStatus = 
  | 'offered'
  | 'accepted'
  | 'en_camino_pasajero'
  | 'en_punto_recogida'
  | 'en_trayecto_destino'
  | 'completed'
  | 'cancelled';

export interface PassengerInfo {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  phone: string;
  totalTrips: number;
}

export interface TripService {
  id: string;
  serviceType: ServiceType;
  serviceName: string; // "Vixy Moto Rapidito", "Vixy Taxi Confort", "Vixy Delivery Express"
  passenger: PassengerInfo;
  pickupLocation: {
    address: string;
    cityArea: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    address: string;
    cityArea: string;
    lat: number;
    lng: number;
  };
  distanceKm: number;
  durationMins: number;
  fareUsd: number;
  fareVes: number;
  commissionFeeUsd: number; // Siempre 10%
  driverNetEarningsUsd: number;
  paymentMethod: 'Efectivo USD' | 'Pago Móvil VES' | 'Saldo Vixy App';
  status: TripStatus;
  deliveryNotes?: string;
  cancelReason?: string;
  createdAt: string;
}

export type PaymentMethodType = 'pago_movil' | 'zinli' | 'binance' | 'paypal';

export interface PaymentGatewayInfo {
  id: PaymentMethodType;
  name: string;
  logo: string;
  badge: string;
  currency: 'USD' | 'VES';
  fields: {
    label: string;
    value: string;
    copyable?: boolean;
  }[];
  instructions: string;
}

export type TabType = 'map' | 'wallet' | 'profile' | 'support' | 'faq';
