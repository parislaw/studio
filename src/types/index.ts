
export type DailyProgress = {
  day: number;
  date: string;
  steps: number | null;
  goalMet: boolean;
  image?: string; // Storing as a data URI
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  progress: DailyProgress[];
  isAdmin?: boolean;
};
