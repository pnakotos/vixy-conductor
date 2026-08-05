import { DriverProfile, PaymentGatewayInfo, TripService, WalletTransaction } from '../types';

export const OFFICIAL_BCV_RATE = 68.50; // Tasa Oficial Banco Central de Venezuela
export const COMMISSION_PERCENTAGE = 10; // 10% Comision fija de Vixy Driver
export const MIN_BALANCE_THRESHOLD = -0.50; // Saldo minimo -$0.50 antes de estado detenido
export const MIN_INITIAL_RECHARGE_USD = 5.00; // Recarga minima obligatoria para usuarios nuevos

export const INITIAL_DRIVER_PROFILE: DriverProfile = {
  id: 'DRV-78902',
  fullName: 'Conductor Registrado',
  cedula: 'V-00.000.000',
  phone: '+58 412-0000000',
  email: 'conductor.vixy@gmail.com',
  profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  plateNumber: 'AB1C23D', // Número de Placa obligatorio
  rating: 5.0,
  totalTrips: 0,
  acceptanceRate: 100,
  servicesOffered: ['moto', 'taxi', 'delivery'],
  city: 'Caracas, Distrito Capital',
  isVerifiedByVixy: true,
  isApproved: true,
  isActiveOnline: false,
  isSuspendedByBalance: false,
  hasInitialRecharge: false,
  vehicles: {
    moto: {
      type: 'moto',
      brand: 'Bera',
      model: 'SBR 150',
      year: 2024,
      color: 'Negro',
      plateNumber: 'AB1C23D',
      photoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
      hasHelmet: true,
    },
    taxi: {
      type: 'taxi',
      brand: 'Chevrolet',
      model: 'Aveo LT',
      year: 2014,
      color: 'Gris Plata',
      plateNumber: 'AB1C23D',
      photoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
      seatsCount: 4,
    },
    delivery: {
      type: 'delivery',
      brand: 'Bera',
      model: 'SBR 150',
      year: 2024,
      color: 'Negro',
      plateNumber: 'AB1C23D',
      photoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
      hasThermalBag: true,
    },
  },
  documents: [
    {
      id: 'doc-foto-vehiculo',
      name: 'Fotografía del Vehículo y Placa',
      legalBasis: 'Art. 52 Ley de Tránsito Terrestre - Identificación de Vehículos',
      status: 'approved',
      url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
      requiredFor: ['moto', 'taxi', 'delivery'],
      notes: 'Foto clara frontal y trasera con número de placa legible.',
    },
    {
      id: 'doc-licencia',
      name: 'Licencia de Conducir (INTT)',
      legalBasis: 'Art. 63 Ley de Tránsito Terrestre (2da Grado Moto / 3ra Carro)',
      status: 'approved',
      degree: '3ra Grado (Vehículos hasta 9 puestos)',
      documentNumber: 'LIC-INTT-VZLA',
      expiryDate: '2028-11-15',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      requiredFor: ['moto', 'taxi', 'delivery'],
      notes: 'Vigente emitida por el Instituto Nacional de Transporte Terrestre (INTT).',
    },
    {
      id: 'doc-certificado-medico',
      name: 'Certificado Médico de Salud Integral',
      legalBasis: 'Art. 64 Ley de Tránsito Terrestre - Aptitud física para conducir',
      status: 'approved',
      documentNumber: 'CMSI-SALUD-DF',
      expiryDate: '2027-05-20',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
      requiredFor: ['moto', 'taxi', 'delivery'],
      notes: 'Emitido por Colegio de Médicos o Federación Médica Venezolana.',
    },
    {
      id: 'doc-rcv',
      name: 'Responsabilidad Civil de Vehículos (RCV)',
      legalBasis: 'Art. 58 Ley de Tránsito Terrestre - Póliza de Seguro Obligatorio',
      status: 'approved',
      policyNumber: 'RCV-POL-SEGUROS-VZLA',
      expiryDate: '2027-01-10',
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
      requiredFor: ['moto', 'taxi', 'delivery'],
      notes: 'Póliza vigente contra daños a terceros conforme a regulación nacional.',
    },
    {
      id: 'doc-cedula',
      name: 'Cédula de Identidad Venezolana',
      legalBasis: 'Art. 16 Ley Orgánica de Identificación',
      status: 'approved',
      documentNumber: 'V-00.000.000',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
      requiredFor: ['moto', 'taxi', 'delivery'],
      notes: 'Documento original laminado V- o E- vigentes.',
    },
  ],
};

export function createNewDriverProfile(data: {
  fullName: string;
  cedula: string;
  phone: string;
  email?: string;
  plateNumber: string;
  vehicleModel?: string;
  city?: string;
  servicesOffered: ('moto' | 'taxi' | 'delivery')[];
}): DriverProfile {
  const formattedCedula = data.cedula.toUpperCase().startsWith('V-') || data.cedula.toUpperCase().startsWith('E-')
    ? data.cedula.toUpperCase()
    : `V-${data.cedula.trim()}`;

  const cleanPlate = data.plateNumber.toUpperCase().trim();

  return {
    ...INITIAL_DRIVER_PROFILE,
    id: `DRV-${Math.floor(100000 + Math.random() * 900000)}`,
    fullName: data.fullName.trim(),
    cedula: formattedCedula,
    phone: data.phone.trim() || '+58 412-0000000',
    email: data.email?.trim() || `${formattedCedula.replace(/\D/g, '')}@vixydriver.app`,
    plateNumber: cleanPlate,
    city: data.city || 'Caracas, Distrito Capital',
    servicesOffered: data.servicesOffered.length > 0 ? data.servicesOffered : ['taxi'],
    hasInitialRecharge: false,
    rating: 5.0,
    totalTrips: 0,
    vehicles: {
      moto: {
        type: 'moto',
        brand: data.vehicleModel?.split(' ')[0] || 'Bera',
        model: data.vehicleModel || 'SBR 150',
        year: 2024,
        color: 'Negro',
        plateNumber: cleanPlate,
        photoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
        hasHelmet: true,
      },
      taxi: {
        type: 'taxi',
        brand: data.vehicleModel?.split(' ')[0] || 'Chevrolet',
        model: data.vehicleModel || 'Particular',
        year: 2014,
        color: 'Gris Plata',
        plateNumber: cleanPlate,
        photoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
        seatsCount: 4,
      },
      delivery: {
        type: 'delivery',
        brand: data.vehicleModel?.split(' ')[0] || 'Bera',
        model: data.vehicleModel || 'SBR 150',
        year: 2024,
        color: 'Negro',
        plateNumber: cleanPlate,
        photoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
        hasThermalBag: true,
      }
    }
  };
}

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1001',
    date: '2026-07-23',
    time: '08:15 AM',
    type: 'recharge',
    amountUsd: 10.00,
    amountVes: 685.00,
    bcvRateUsed: 68.50,
    method: 'pago_movil',
    referenceNumber: '0098124578',
    description: 'Recarga aprobada vía Pago Móvil Banesco',
    status: 'completed',
  },
  {
    id: 'tx-1002',
    date: '2026-07-23',
    time: '08:42 AM',
    type: 'commission_fee',
    amountUsd: -0.80,
    description: 'Comisión Vixy (10%) - Viaje #VX-4891',
    status: 'completed',
  },
  {
    id: 'tx-1003',
    date: '2026-07-23',
    time: '09:10 AM',
    type: 'commission_fee',
    amountUsd: -0.50,
    description: 'Comisión Vixy (10%) - Delivery #VX-4892',
    status: 'completed',
  },
];

export const PAYMENT_GATEWAYS: PaymentGatewayInfo[] = [
  {
    id: 'pago_movil',
    name: 'Pago Móvil (Bolívares VES)',
    logo: '📱',
    badge: 'Tasa BCV Oficial',
    currency: 'VES',
    fields: [
      { label: 'Banco Destino', value: '0134 - Banesco Banco Universal', copyable: true },
      { label: 'Cédula / RIF', value: 'J-501293840', copyable: true },
      { label: 'Teléfono', value: '0412-9876543', copyable: true },
      { label: 'Titular de la Cuenta', value: 'Vixy Movilidad C.A.', copyable: false },
    ],
    instructions: 'Transfiere en Bolívares calculados según la Tasa Oficial BCV del día. Guarda la referencia numéricamente para validarla en el paso 2.',
  },
  {
    id: 'zinli',
    name: 'Zinli Wallet',
    logo: '💜',
    badge: 'Sin Comisión Interbancaria',
    currency: 'USD',
    fields: [
      { label: 'Correo Zinli Registrado', value: 'pagos@vixydriver.com', copyable: true },
      { label: 'ID Zinli Vixy', value: 'VIXY-DRV-VZLA', copyable: true },
      { label: 'Titular', value: 'Vixy Driver Venezuela C.A.', copyable: false },
    ],
    instructions: 'Envía los dólares en Zinli indicando tu Cédula o ID de Conductor en la nota. Carga la captura de pantalla o número de transacción en el siguiente formulario.',
  },
  {
    id: 'binance',
    name: 'Binance Pay / USDT',
    logo: '🟡',
    badge: 'Procesamiento Instantáneo',
    currency: 'USD',
    fields: [
      { label: 'Binance Pay ID', value: '892147302', copyable: true },
      { label: 'Red TRC20 (USDT)', value: 'TXv829kM44pLzQxR901vixyDriverCryptoAddr', copyable: true },
      { label: 'Nick Binance', value: 'VixyDriverPay', copyable: false },
    ],
    instructions: 'Aceptamos Binance Pay directamente con Pay ID o transferencias USDT en Red Tron (TRC20). Copia el Hash / TxID o número de orden.',
  },
  {
    id: 'paypal',
    name: 'PayPal International',
    logo: '🟦',
    badge: 'Tarjetas de Crédito / Débito',
    currency: 'USD',
    fields: [
      { label: 'Enlace Directo PayPal', value: 'paypal.me/vixydriver', copyable: true },
      { label: 'Correo PayPal', value: 'cobros@vixydriver.com', copyable: true },
      { label: 'Titular', value: 'Vixy Global Mobility LLC', copyable: false },
    ],
    instructions: 'Realiza el pago seleccionando envío a "Amigos y Familiares" para evitar recargos comerciales. Adjunta el número de transacción PayPal.',
  },
];

export const SAMPLE_TRIP_OFFERS: TripService[] = [
  {
    id: 'VX-5020',
    serviceType: 'taxi',
    serviceName: 'Vixy Taxi Confort (Tarifa Universitaria)',
    passenger: {
      id: 'PAS-9912',
      name: 'Valentina Ruiz',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      rating: 4.98,
      phone: '+58 412-1122334',
      totalTrips: 28,
      isUniversityStudent: true,
      universityName: 'UCV - Universidad Central de Venezuela',
      studentCardId: 'EST-UCV-2024-9912',
    },
    isUniversityTariff: true,
    universityTariffDiscountUsd: 3.50,
    universityTariffNote: 'Tarifa Universitaria 50% Subsidio - Estudiante UCV Acreditado',
    pickupLocation: {
      address: 'Ciudad Universitaria de Caracas, Plaza del Rectorado',
      cityArea: 'UCV, Los Chaguaramos',
      lat: 10.4901,
      lng: -66.8872,
    },
    dropoffLocation: {
      address: 'Residencias Estudiantiles Los Ilustres, Av. Los Ilustres',
      cityArea: 'San Pedro, Caracas',
      lat: 10.4850,
      lng: -66.8920,
    },
    distanceKm: 2.5,
    durationMins: 9,
    fareUsd: 3.50,
    fareVes: 239.75,
    commissionFeeUsd: 0.35, // 10%
    driverNetEarningsUsd: 3.15,
    paymentMethod: 'Pago Móvil VES',
    status: 'offered',
    createdAt: 'Hace 10 seg',
  },
  {
    id: 'VX-5021',
    serviceType: 'taxi',
    serviceName: 'Vixy Taxi Confort',
    passenger: {
      id: 'PAS-1092',
      name: 'Mariana Silva',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      rating: 4.95,
      phone: '+58 414-2233445',
      totalTrips: 42,
    },
    pickupLocation: {
      address: 'Plaza Altamira, Av. San Juan Bosco',
      cityArea: 'Chacao, Caracas',
      lat: 10.4965,
      lng: -66.8530,
    },
    dropoffLocation: {
      address: 'Centro Comercial Tolón Fashion Mall',
      cityArea: 'Las Mercedes, Caracas',
      lat: 10.4812,
      lng: -66.8615,
    },
    distanceKm: 4.8,
    durationMins: 14,
    fareUsd: 8.00,
    fareVes: 548.00,
    commissionFeeUsd: 0.80, // 10%
    driverNetEarningsUsd: 7.20,
    paymentMethod: 'Pago Móvil VES',
    status: 'offered',
    createdAt: 'Hace 30 seg',
  },
  {
    id: 'VX-5022',
    serviceType: 'moto',
    serviceName: 'Vixy Moto Rapidito',
    passenger: {
      id: 'PAS-3301',
      name: 'José Gregorio Rivas',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      rating: 4.88,
      phone: '+58 424-9988776',
      totalTrips: 87,
    },
    pickupLocation: {
      address: 'Estación Metro Sabana Grande',
      cityArea: 'El Recreo, Caracas',
      lat: 10.4918,
      lng: -66.8785,
    },
    dropoffLocation: {
      address: 'C.C. Sambil Chacao, Av. Libertador',
      cityArea: 'Chacao, Caracas',
      lat: 10.4925,
      lng: -66.8580,
    },
    distanceKm: 3.2,
    durationMins: 8,
    fareUsd: 4.50,
    fareVes: 308.25,
    commissionFeeUsd: 0.45, // 10%
    driverNetEarningsUsd: 4.05,
    paymentMethod: 'Efectivo USD',
    status: 'offered',
    createdAt: 'Hace 15 seg',
  },
  {
    id: 'VX-5023',
    serviceType: 'delivery',
    serviceName: 'Vixy Delivery Express',
    passenger: {
      id: 'PAS-7720',
      name: 'Restaurante Ávila Gourmet',
      photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200',
      rating: 5.0,
      phone: '+58 212-9910022',
      totalTrips: 130,
    },
    pickupLocation: {
      address: 'Av. Principal de La Castellana, Edif. Ámbar',
      cityArea: 'La Castellana, Caracas',
      lat: 10.5010,
      lng: -66.8510,
    },
    dropoffLocation: {
      address: 'Residencias Parque El Hatillo, Apto 4B',
      cityArea: 'El Hatillo, Caracas',
      lat: 10.4350,
      lng: -66.8240,
    },
    distanceKm: 9.5,
    durationMins: 22,
    fareUsd: 7.00,
    fareVes: 479.50,
    commissionFeeUsd: 0.70, // 10%
    driverNetEarningsUsd: 6.30,
    paymentMethod: 'Saldo Vixy App',
    deliveryNotes: 'Llevar bolso térmico cerrado. Contiene 2 pizzas familiares y refresco.',
    status: 'offered',
    createdAt: 'Hace 5 seg',
  },
];

export const FAQ_ITEMS = [
  {
    id: 'faq-0',
    category: 'Tarifa Universitaria',
    question: '¿Qué es la Tarifa Universitaria Vixy y cómo beneficia a los conductores y estudiantes?',
    answer: 'Es un programa especial de movilidad estudiantil en Venezuela que otorga un 50% de descuento en la tarifa del viaje a estudiantes universitarios acreditados con carnet activo (UCV, USB, UCAB, LUZ, ULA, UNEFA, etc.). Para el conductor, la comisión Vixy se mantiene protegida al 10% y el viaje incluye el distintivo "🎓 Tarifa Universitaria" en la pantalla de recepción.',
  },
  {
    id: 'faq-1',
    category: 'Comisiones y Saldo',
    question: '¿Cuál es la comisión por servicio en Vixy Driver y cómo funciona?',
    answer: 'Vixy cobra una comisión fija transparente del 10% sobre el valor total de cada servicio completado (Moto, Taxi o Delivery). La comisión siempre se descuenta automáticamente de tu cartera de saldo.',
  },
  {
    id: 'faq-2',
    category: 'Comisiones y Saldo',
    question: '¿Qué sucede si mi saldo llega a -$0.50 USD?',
    answer: 'Según la normativa de la plataforma, el saldo mínimo permitido es de -$0.50 USD. Si tu saldo cae por debajo de -$0.50, tu cuenta entrará automáticamente en "Estado Detenido". Para volver a recibir viajes, simplemente realiza una recarga a través de Pago Móvil, Zinli, Binance o PayPal.',
  },
  {
    id: 'faq-3',
    category: 'Usuarios Nuevos',
    question: '¿Cuál es el monto mínimo de recarga inicial para nuevos conductores?',
    answer: 'Todos los nuevos conductores registrados deben realizar una recarga inicial mínima obligatoria de $5.00 USD (o su equivalente en Bolívares según la tasa del Banco Central de Venezuela BCV) para activar el sistema de recepción de viajes.',
  },
  {
    id: 'faq-4',
    category: 'Legislación Venezolana',
    question: '¿Qué documentos son obligatorios según la Ley de Tránsito Terrestre de Venezuela?',
    answer: 'Para operar legalmente en la plataforma exijamos: 1) Licencia de conducir vigente (2da Grado para Moto, 3ra para Taxi/Particular, 4ta/5ta para Carga/Transporte). 2) Certificado Médico de Salud Integral vigente. 3) Póliza de Responsabilidad Civil de Vehículos (RCV). 4) Cédula de Identidad venezolana (V/E). 5) Foto del vehículo con número de placa visible.',
  },
  {
    id: 'faq-5',
    category: 'Seguridad y Emergencias',
    question: '¿Cómo funciona el Botón de Pánico Discreto y Silencioso?',
    answer: 'Durante un servicio activo dispones del Botón de Pánico. Al activarlo, no emite sonidos ni luces en la pantalla para no alertar al agresor. Puedes reportar en 2 clics "Robo/Intento de Atraco" o "Accidente de Tránsito". Envía de inmediato tu ubicación GPS en vivo y datos del pasajero a la Central Vixy y cuerpos de seguridad.',
  },
  {
    id: 'faq-6',
    category: 'Presentación al Cliente',
    question: '¿Qué información ve el cliente cuando acepto su viaje?',
    answer: 'Al aceptar un servicio, el cliente recibe en su pantalla tu Tarjeta de Presentación oficial conteniendo: tu foto de perfil verificada, tu nombre completo, número de placa del vehículo, marca, modelo, color y calificación con estrellas.',
  },
  {
    id: 'faq-7',
    category: 'Métodos de Pago',
    question: '¿Qué formas de pago puedo utilizar para recargar mi cartera?',
    answer: 'Puedes recargar en Bolívares vía Pago Móvil Banesco a la Tasa BCV Oficial, o en Dólares mediante Zinli, Binance Pay (USDT TRC20) y PayPal. Todas las cuentas tienen datos fijos en la sección "Cartera".',
  },
];
