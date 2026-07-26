import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { DriverProfile, TripService, WalletTransaction } from '../types';
import { sanitizePayload } from '../utils/security';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

/**
 * Saves or updates driver profile in Firebase Firestore
 */
export async function syncDriverProfileToFirebase(profile: DriverProfile): Promise<boolean> {
  const path = `drivers/${profile.cedula}`;
  try {
    const cleanProfile = sanitizePayload({
      cedula: profile.cedula,
      fullName: profile.fullName,
      phone: profile.phone,
      email: profile.email,
      plateNumber: profile.plateNumber,
      isActiveOnline: profile.isActiveOnline,
      isApproved: profile.isApproved ?? true,
      hasInitialRecharge: profile.hasInitialRecharge,
      rating: profile.rating,
      totalTrips: profile.totalTrips,
      city: profile.city,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'drivers', profile.cedula), cleanProfile, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Stores completed trip service in Firebase Firestore
 */
export async function syncTripToFirebase(trip: TripService): Promise<boolean> {
  const path = `trips/${trip.id}`;
  try {
    const cleanTrip = sanitizePayload({
      id: trip.id,
      serviceType: trip.serviceType,
      serviceName: trip.serviceName,
      passengerName: trip.passenger.name,
      pickupLocation: trip.pickupLocation.address,
      dropoffLocation: trip.dropoffLocation.address,
      fareUsd: trip.fareUsd,
      fareVes: trip.fareVes,
      commissionFeeUsd: trip.commissionFeeUsd,
      paymentMethod: trip.paymentMethod,
      status: trip.status,
      createdAt: trip.createdAt || new Date().toISOString()
    });
    await setDoc(doc(db, 'trips', trip.id), cleanTrip, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Stores wallet transaction in Firebase Firestore
 */
export async function syncTransactionToFirebase(transaction: WalletTransaction): Promise<boolean> {
  const path = `transactions/${transaction.id}`;
  try {
    const cleanTx = sanitizePayload({
      id: transaction.id,
      type: transaction.type,
      amountUsd: transaction.amountUsd,
      amountVes: transaction.amountVes || 0,
      method: transaction.method || 'system',
      referenceNumber: transaction.referenceNumber || '',
      description: transaction.description,
      status: transaction.status,
      date: transaction.date || new Date().toISOString()
    });
    await setDoc(doc(db, 'transactions', transaction.id), cleanTx, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}
