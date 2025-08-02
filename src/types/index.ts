export type DailyProgress = {
  day: number;
  date: string;
  steps: number | null;
  goalMet: boolean;
  image?: string; // Storing as a data URI
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  progress: DailyProgress[];
};
