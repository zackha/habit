interface Habit {
  id: string;
  name: string;
  streak: number;
  days: Record<string, boolean>;
  created_at: string;
}
