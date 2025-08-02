import type { User } from '@/types';

const generateUserProgress = (name: string): User['progress'] => {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    let steps = null;
    let goalMet = false;

    // Simulate progress for the first 20 days
    if (day < 20) {
      if (Math.random() > 0.2) { // 80% chance to have logged steps
        steps = Math.floor(Math.random() * 8000) + 7000; // 7k to 15k steps
        goalMet = steps >= 10000;
      }
    }

    return { day, steps, goalMet };
  });
};

const userNames = [
  'Alice Johnson', 'Bob Williams', 'Charlie Brown', 'Diana Miller',
  'Ethan Davis', 'Fiona Garcia', 'George Rodriguez', 'Hannah Wilson'
];

export const MOCK_USERS: User[] = userNames.map((name, index) => ({
  id: `${index + 1}`,
  name: name,
  avatar: `https://placehold.co/40x40.png`,
  progress: generateUserProgress(name),
}));

export const MOCK_CURRENT_USER = MOCK_USERS[0];

export const getLeaderboardData = () => {
  return MOCK_USERS.map(user => {
    const totalSteps = user.progress.reduce((acc, day) => acc + (day.steps || 0), 0);
    
    let maxStreak = 0;
    let currentStreak = 0;
    for (const day of user.progress) {
      if (day.goalMet) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak);

    return { ...user, totalSteps, streak: maxStreak };
  }).sort((a, b) => b.totalSteps - a.totalSteps);
};
