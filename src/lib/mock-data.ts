
import type { User } from '@/types';
import { addDays, format } from 'date-fns';

const CHALLENGE_START_DATE = new Date('2025-08-30T00:00:00');

const generateUserProgress = (): User['progress'] => {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const date = addDays(CHALLENGE_START_DATE, i);
    const steps = null;
    const goalMet = false;

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

export const MOCK_USERS: User[] = userNames.map((name, index) => ({
  id: `${index + 1}`,
  firstName: name.firstName,
  lastName: name.lastName,
  avatar: `https://placehold.co/40x40.png`,
  progress: generateUserProgress(),
  // Make the first user an admin for demonstration
  isAdmin: index === 0, 
}));

export const MOCK_CURRENT_USER = MOCK_USERS[0];
