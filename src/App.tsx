import React, { useState, useEffect } from 'react';
import { 
  DriverProfile, 
  TabType, 
  TripService, 
  TripStatus, 
  WalletTransaction 
} from './types';
import { 
  INITIAL_DRIVER_PROFILE, 
  INITIAL_WALLET_TRANSACTIONS, 
  SAMPLE_TRIP_OFFERS, 
  COMMISSION_PERCENTAGE, 
  MIN_BALANCE_THRESHOLD 
} from './data/mockData';
import { APP_THEMES, AppTheme } from './data/themes';
import { Navbar } from './components/Navbar';
import { MapContainer } from './components/MapContainer';
import { DriverPresentationCardModal } from './components/DriverPresentationCardModal';
import { IncomingTripModal } from './components/IncomingTripModal';
import { ActiveTripCard } from './components/ActiveTripCard';
import { PanicModal } from './components/PanicModal';
import { PassengerRatingModal } from './components/PassengerRatingModal';
import { WalletView } from './components/WalletView';
import { ProfileView } from './components/ProfileView';
import { SupportView } from './components/SupportView';
import { FaqView } from './components/FaqView';
import { LoginModal } from './components/LoginModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { AdminInterconnectionModal } from './components/AdminInterconnectionModal';
import { UniversityTariffModal } from './components/UniversityTariffModal';
import { syncDriverProfileToAdmin, syncTripLedgerToAdmin } from './services/adminIntegrationService';
import { testFirebaseConnection } from './lib/firebase';
import { syncDriverProfileToFirebase, syncTripToFirebase, syncTransactionToFirebase } from './services/firebaseSyncService';

export default function App() {
  // Core App State (Persisted in LocalStorage / Firebase)
  const [profile, setProfile] = useState<DriverProfile>(() => {
    const saved = localStorage.getItem('vixy_driver_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    }
    return INITIAL_DRIVER_PROFILE;
  });

  const [balanceUsd, setBalanceUsd] = useState<number>(() => {
    const savedProfile = localStorage.getItem('vixy_driver_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        return parsed.hasInitialRecharge ? 10.00 : 0.00;
      } catch (e) {}
    }
    return 0.00;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [currentTab, setCurrentTab] = useState<TabType>('map');
  
  // Theme State (10 Theme Options)
  const [currentThemeId, setCurrentThemeId] = useState<string>('vixy-cyber-purple');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const currentTheme = APP_THEMES.find((t) => t.id === currentThemeId) || APP_THEMES[0];

  // Trip & Map State
  const [activeTrip, setActiveTrip] = useState<TripService | null>(null);
  const [incomingTripOffer, setIncomingTripOffer] = useState<TripService | null>(null);
  const [driverPosition, setDriverPosition] = useState({ lat: 10.4965, lng: -66.8530 }); // Caracas
  
  // Modals
  const [isPresentationCardOpen, setIsPresentationCardOpen] = useState(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [completedTripForRating, setCompletedTripForRating] = useState<TripService | null>(null);
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  
  // Open login/register modal automatically if no user is saved in localStorage
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem('vixy_driver_profile');
  });
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const isDetenido = balanceUsd < MIN_BALANCE_THRESHOLD;

  // Boot Firebase connection test & initial sync
  useEffect(() => {
    testFirebaseConnection();
    if (profile.cedula && profile.cedula !== 'V-00.000.000') {
      syncDriverProfileToFirebase(profile);
    }
  }, []);

  // Auto-enforce "Estado Detenido" if balance drops below -$0.50
  useEffect(() => {
    if (isDetenido && profile.isActiveOnline) {
      const updated = { ...profile, isActiveOnline: false, isSuspendedByBalance: true };
      setProfile(updated);
      syncDriverProfileToFirebase(updated);
      if (activeTrip) {
        alert('ADVERTENCIA: Tu saldo ha caído por debajo de -$0.50 USD. Estás en Estado Detenido.');
      }
    }
  }, [balanceUsd, isDetenido]);

  // Simulate incoming trip offer when driver turns online
  useEffect(() => {
    if (profile.isActiveOnline && !activeTrip && !incomingTripOffer && !isDetenido) {
      const timer = setTimeout(() => {
        // Select random offer from sample list
        const randomOffer = SAMPLE_TRIP_OFFERS[Math.floor(Math.random() * SAMPLE_TRIP_OFFERS.length)];
        // Filter by offered service line
        if (profile.servicesOffered.includes(randomOffer.serviceType)) {
          setIncomingTripOffer({ ...randomOffer, id: `VX-${Math.floor(5000 + Math.random() * 1000)}` });
        }
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [profile.isActiveOnline, activeTrip, incomingTripOffer, isDetenido, profile.servicesOffered]);

  // Toggle Driver Online / Offline
  const handleToggleOnline = () => {
    if (isDetenido) {
      alert('NO PUEDES CONECTARTE: Tu saldo es menor a -$0.50 USD. Por favor realiza una recarga en la cartera.');
      setCurrentTab('wallet');
      return;
    }
    if (!profile.hasInitialRecharge) {
      alert('REQUISITO NUEVO USUARIO: Debes realizar una recarga mínima inicial de $5.00 USD para activar recepción de viajes.');
      setCurrentTab('wallet');
      return;
    }

    const updatedOnline = !profile.isActiveOnline;
    const updatedProfile = { ...profile, isActiveOnline: updatedOnline };
    setProfile(updatedProfile);
    syncDriverProfileToAdmin(updatedProfile); // Transmit to https://vhixy.site/
    syncDriverProfileToFirebase(updatedProfile); // Sync to Firebase Firestore
  };

  // Accept incoming trip offer
  const handleAcceptTrip = (trip: TripService) => {
    setIncomingTripOffer(null);
    const acceptedTrip: TripService = {
      ...trip,
      status: 'accepted',
    };
    setActiveTrip(acceptedTrip);
    setCurrentTab('map');

    // Auto open presentation card notification preview
    setIsPresentationCardOpen(true);
  };

  // Reject incoming trip offer
  const handleRejectTrip = () => {
    setIncomingTripOffer(null);
  };

  // Step trip forward in simulation
  const handleSimulateStep = () => {
    if (!activeTrip) return;

    if (activeTrip.status === 'accepted' || activeTrip.status === 'en_camino_pasajero') {
      // Move driver closer to pickup
      setDriverPosition({
        lat: activeTrip.pickupLocation.lat,
        lng: activeTrip.pickupLocation.lng,
      });
      setActiveTrip({ ...activeTrip, status: 'en_punto_recogida' });
    } else if (activeTrip.status === 'en_punto_recogida') {
      setActiveTrip({ ...activeTrip, status: 'en_trayecto_destino' });
    } else if (activeTrip.status === 'en_trayecto_destino') {
      // Move driver to destination
      setDriverPosition({
        lat: activeTrip.dropoffLocation.lat,
        lng: activeTrip.dropoffLocation.lng,
      });
      handleCompleteTrip();
    }
  };

  // Update active trip status
  const handleUpdateTripStatus = (newStatus: TripStatus) => {
    if (!activeTrip) return;
    setActiveTrip({ ...activeTrip, status: newStatus });
  };

  // Cancel trip
  const handleCancelTrip = (reason: string) => {
    if (!activeTrip) return;
    alert(`Viaje cancelado por el conductor. Motivo: ${reason}`);
    setActiveTrip(null);
  };

  // Complete Trip & Process Commission (Deducción del 10% fija)
  const handleCompleteTrip = () => {
    if (!activeTrip) return;

    const commissionFee = activeTrip.commissionFeeUsd; // 10%
    const newBalance = balanceUsd - commissionFee;

    setBalanceUsd(newBalance);

    // Record commission fee transaction
    const newTx: WalletTransaction = {
      id: `tx-comm-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'commission_fee',
      amountUsd: -commissionFee,
      description: `Comisión Vixy (10%) - Viaje #${activeTrip.id}`,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Transmit trip ledger and 10% commission entry to https://vhixy.site/
    syncTripLedgerToAdmin(activeTrip);

    // Sync trip and commission transaction to Firebase Firestore
    syncTripToFirebase(activeTrip);
    syncTransactionToFirebase(newTx);

    // Open rating modal
    setCompletedTripForRating(activeTrip);
    setIsRatingModalOpen(true);
    setActiveTrip(null);
  };

  // Submit passenger rating
  const handleSubmitPassengerRating = (rating: number, feedback: string) => {
    setIsRatingModalOpen(false);
    setCompletedTripForRating(null);
    const updated = { ...profile, totalTrips: profile.totalTrips + 1 };
    setProfile(updated);
    syncDriverProfileToFirebase(updated);
  };

  // Wallet recharge transaction
  const handleAddTransaction = (tx: WalletTransaction) => {
    setTransactions((prev) => [tx, ...prev]);
    setBalanceUsd((prev) => prev + tx.amountUsd);
    syncTransactionToFirebase(tx);

    // If new user, set initial recharge true
    if (!profile.hasInitialRecharge) {
      const updated = { ...profile, hasInitialRecharge: true };
      setProfile(updated);
      syncDriverProfileToFirebase(updated);
    }
  };

  // Account login/logout switcher
  const handleLoginSuccess = (newProfile: DriverProfile) => {
    setProfile(newProfile);
    localStorage.setItem('vixy_driver_profile', JSON.stringify(newProfile));
    setIsLoginModalOpen(false);
    setBalanceUsd(newProfile.hasInitialRecharge ? 10.00 : 0.00);
  };

  const handleLogout = () => {
    localStorage.removeItem('vixy_driver_profile');
    setProfile(INITIAL_DRIVER_PROFILE);
    setBalanceUsd(0.00);
    setIsLoginModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgClass} flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 selection:bg-purple-600 selection:text-white`}>
      
      {/* Navbar with Dedicated Navigation Buttons, Theme Switcher & Commission Banner */}
      <Navbar
        profile={profile}
        balance={balanceUsd}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onToggleOnline={handleToggleOnline}
        onOpenPresentationCard={() => setIsPresentationCardOpen(true)}
        onLogout={handleLogout}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenUniversityModal={() => setIsUniversityModalOpen(true)}
        currentTheme={currentTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 pb-20 sm:pb-6 max-w-7xl w-full mx-auto space-y-4">
        
        {/* TAB 1: MAP & TRIP RECEIVING ENGINE */}
        {currentTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Map Canvas (Col 2/3) */}
            <div className="lg:col-span-2">
              <MapContainer
                activeTrip={activeTrip}
                driverPosition={driverPosition}
                isOnline={profile.isActiveOnline}
                isDetenido={isDetenido}
                onSimulateStep={handleSimulateStep}
                onCenterDriver={() => {}}
              />
            </div>

            {/* Active Trip Sidebar or Controls (Col 1/3) */}
            <div className="space-y-4">
              {activeTrip ? (
                <ActiveTripCard
                  trip={activeTrip}
                  onUpdateStatus={handleUpdateTripStatus}
                  onCancelTrip={handleCancelTrip}
                  onOpenPanicModal={() => setIsPanicModalOpen(true)}
                  onCompleteTripAndRate={handleCompleteTrip}
                />
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-600/50 flex items-center justify-center text-purple-400 mx-auto shadow-lg">
                    <span className="text-2xl font-black italic">VX</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base">Panel del Conductor Vixy</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {profile.isActiveOnline
                        ? 'En línea buscando servicios cercanos en Caracas...'
                        : 'Conéctate con el botón superior para empezar a recibir viajes'}
                    </p>
                  </div>

                  {/* Active Services List */}
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-left space-y-2">
                    <div className="text-[10px] font-bold uppercase text-purple-300">Servicios que recibes:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.servicesOffered.map((srv) => (
                        <span key={srv} className="bg-purple-950 text-purple-200 border border-purple-800 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase">
                          • {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Presentation Card Quick Trigger */}
                  <button
                    onClick={() => setIsPresentationCardOpen(true)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-purple-300 font-bold py-2.5 rounded-xl text-xs border border-purple-900/60 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ver Mi Tarjeta de Presentación & Placa</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CARTERA DE SALDO */}
        {currentTab === 'wallet' && (
          <WalletView
            profile={profile}
            balance={balanceUsd}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {/* TAB 3: PERFIL & DOCUMENTOS LEY TRÁNSITO */}
        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              syncDriverProfileToFirebase(updated);
            }}
            onOpenPresentationCard={() => setIsPresentationCardOpen(true)}
          />
        )}

        {/* TAB 4: SOPORTE AL CONDUCTOR */}
        {currentTab === 'support' && (
          <SupportView />
        )}

        {/* TAB 5: PREGUNTAS FRECUENTES */}
        {currentTab === 'faq' && (
          <FaqView />
        )}

      </main>

      {/* MODALS */}
      
      {/* Driver Presentation Card Modal */}
      <DriverPresentationCardModal
        isOpen={isPresentationCardOpen}
        onClose={() => setIsPresentationCardOpen(false)}
        profile={profile}
      />

      {/* Incoming Service Offer Popup Modal */}
      <IncomingTripModal
        trip={incomingTripOffer}
        onAccept={handleAcceptTrip}
        onReject={handleRejectTrip}
      />

      {/* Stealth Discrete Panic Button Modal (Robo o Accidente) */}
      <PanicModal
        isOpen={isPanicModalOpen}
        onClose={() => setIsPanicModalOpen(false)}
        driverLocation={driverPosition}
      />

      {/* Post-Trip Passenger Rating Modal */}
      {isRatingModalOpen && completedTripForRating && (
        <PassengerRatingModal
          trip={completedTripForRating}
          onSubmitRating={handleSubmitPassengerRating}
        />
      )}

      {/* Account Login / Registration Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* 10 Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={setCurrentThemeId}
      />

      {/* Central Admin Platform Interconnection Modal (https://vhixy.site/) */}
      <AdminInterconnectionModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        profile={profile}
      />

      {/* University Student Tariff Notification Modal */}
      <UniversityTariffModal
        isOpen={isUniversityModalOpen}
        onClose={() => setIsUniversityModalOpen(false)}
      />

    </div>
  );
}
