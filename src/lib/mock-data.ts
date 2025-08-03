
import type { User } from '@/types';
import { addDays, format } from 'date-fns';

const CHALLENGE_START_DATE = new Date('2025-08-30T00:00:00');

// Generate more realistic progress data
const generateUserProgress = (userId: string): User['progress'] => {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const date = addDays(CHALLENGE_START_DATE, i);
    let steps: number | null = null;
    let goalMet = false;

    // Let's add varied data for the first 10-15 days
    // The amount of data depends on the user ID to create variety
    const userSeed = parseInt(userId, 10);
    const daysWithData = 10 + (userSeed % 8); // e.g., User 1 has 11 days, user 2 has 12, etc.

    if (day <= daysWithData) {
      // Generate some semi-random step counts
      const randomFactor = (Math.sin(day * userSeed) + 1) / 2; // Consistent randomness
      steps = 5000 + Math.floor(randomFactor * 12000); // Steps between 5,000 and 17,000
      goalMet = steps >= 10000;
    }

    return { day, date: format(date, 'MMM d, yyyy'), steps, goalMet };
  });
};

const userNames = [
  { firstName: 'Alice', lastName: 'Johnson' },
  { firstName: 'Bob', lastName: 'Williams' },
  { firstName: 'Charlie', lastName: 'Brown' },
  { firstName: 'Diana', lastName: 'Miller' },
  { firstName: 'Ethan', lastName: 'Davis' },
  { firstName: 'Fiona', lastName: 'Garcia' },
  { firstName: 'George', lastName: 'Rodriguez' },
  { firstName: 'Hannah', lastName: 'Wilson' }
];

export const MOCK_USERS: User[] = userNames.map((name, index) => {
  const user = {
    id: `${index + 1}`,
    firstName: name.firstName,
    lastName: name.lastName,
    avatar: `https://placehold.co/40x40.png`,
    // is Admin is assigned below
  };
  return {
    ...user,
    progress: generateUserProgress(user.id),
    // Make the first user an admin for demonstration
    isAdmin: index === 0, 
  }
});

export const MOCK_CURRENT_USER = MOCK_USERS[0];
