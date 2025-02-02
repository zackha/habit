import type { User, Habit } from '~~/server/utils/db';

export interface PublicUser{
  info: User | null;
  habits: Habit[] | null;
  status: number | null;
}