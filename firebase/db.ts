import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { StudySpot } from '../types';
import { GT_SPOTS } from '../constants/gtSpots';

// Seed the spots collection if empty (run once on first launch)
export async function seedSpotsIfEmpty() {
  const snapshot = await getDocs(collection(db, 'spots'));
  if (!snapshot.empty) return;

  const batch = writeBatch(db);
  GT_SPOTS.forEach((spot) => {
    const ref = doc(collection(db, 'spots'));
    batch.set(ref, { ...spot, lastUpdated: serverTimestamp() });
  });
  await batch.commit();
}

// Subscribe to all spots in real time
export function subscribeToSpots(callback: (spots: StudySpot[]) => void) {
  return onSnapshot(collection(db, 'spots'), (snapshot) => {
    const spots: StudySpot[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        lastUpdated: (data.lastUpdated as Timestamp)?.toDate() ?? new Date(),
      } as StudySpot;
    });
    callback(spots);
  });
}

// Check in to a spot — increments occupancy, logs the action
export async function checkIn(userId: string, spotId: string) {
  const spotRef = doc(db, 'spots', spotId);
  const userRef = doc(db, 'users', userId);

  await runTransaction(db, async (tx) => {
    const spotSnap = await tx.get(spotRef);
    if (!spotSnap.exists()) throw new Error('Spot not found');

    const current = spotSnap.data().currentOccupancy as number;
    const capacity = spotSnap.data().capacity as number;
    const next = Math.min(current + 1, capacity);

    tx.update(spotRef, {
      currentOccupancy: next,
      isAvailable: next < capacity,
      lastUpdated: serverTimestamp(),
    });
    tx.set(userRef, { currentCheckin: spotId }, { merge: true });
  });

  await addDoc(collection(db, 'checkins'), {
    userId,
    spotId,
    action: 'checkin',
    timestamp: serverTimestamp(),
  });
}

// Check out of a spot — decrements occupancy, logs the action
export async function checkOut(userId: string, spotId: string) {
  const spotRef = doc(db, 'spots', spotId);
  const userRef = doc(db, 'users', userId);

  await runTransaction(db, async (tx) => {
    const spotSnap = await tx.get(spotRef);
    if (!spotSnap.exists()) throw new Error('Spot not found');

    const current = spotSnap.data().currentOccupancy as number;
    const capacity = spotSnap.data().capacity as number;
    const next = Math.max(current - 1, 0);

    tx.update(spotRef, {
      currentOccupancy: next,
      isAvailable: next < capacity,
      lastUpdated: serverTimestamp(),
    });
    tx.set(userRef, { currentCheckin: null }, { merge: true });
  });

  await addDoc(collection(db, 'checkins'), {
    userId,
    spotId,
    action: 'checkout',
    timestamp: serverTimestamp(),
  });
}

export async function toggleFavorite(userId: string, spotId: string, isFav: boolean) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    favoriteSpots: isFav ? arrayRemove(spotId) : arrayUnion(spotId),
  }, { merge: true });
}
