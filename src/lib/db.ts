import { db } from './firebase';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import type { User, DailyProgress } from '@/types';
import { MOCK_USERS } from './mock-data';

// Function to seed the database with initial mock data.
// This is useful for development and testing.
export async function seedDatabase() {
  const usersCollectionRef = collection(db, 'users');
  const snapshot = await getDocs(usersCollectionRef);

  // Only seed if the collection is empty
  if (snapshot.empty) {
    console.log('Seeding database with initial data...');
    for (const user of MOCK_USERS) {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, { ...user }, { merge: true });
    }
    console.log('Database seeded.');
  }
}

export async function getAllUsers(): Promise<User[]> {
  // await seedDatabase(); // Optional: seed data if db is empty
  const usersCollectionRef = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollectionRef);
  const users: User[] = [];
  userSnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as User);
  });
  return users;
}

export async function getUser(userId: string): Promise<User | null> {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
}

export async function addStepRecord(userId: string, newProgress: DailyProgress) {
  const userDocRef = doc(db, 'users', userId);
  const user = await getUser(userId);

  if (user) {
    const progressIndex = user.progress.findIndex(p => p.day === newProgress.day);
    
    if (progressIndex > -1) {
      // Update existing progress record
      const updatedProgress = [...user.progress];
      updatedProgress[progressIndex] = newProgress;
      await updateDoc(userDocRef, { progress: updatedProgress });
    } else {
      // This case should ideally not happen if progress is pre-initialized
      await updateDoc(userDocRef, {
        progress: arrayUnion(newProgress)
      });
    }
  }
}
