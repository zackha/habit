<script setup lang="ts">
import { format, subDays, isThisYear } from 'date-fns';

interface Day {
  date: string;
}

type Week = Day[];

defineProps<{ habit: Habit }>();

const generateWeeks = (habit: Habit): Week[] => {
  const days: Day[] = Array.from({ length: 49 }, (_, i) => {
    const date = subDays(new Date(), 49 - 1 - i);
    return { date: format(date, 'yyyy-MM-dd') };
  });

  const weeks: Week[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};

const formatDate = (date: string): string => {
  return isThisYear(new Date(date)) ? format(new Date(date), 'MMMM d') : format(new Date(date), 'MMMM d, yyyy');
};
</script>

<template>
  <div class="flex gap-0.5 overflow-hidden rounded-md">
    <div v-for="(week, weekIndex) in generateWeeks(habit)" :key="weekIndex" class="flex flex-col gap-0.5">
      <div v-for="(day, dayIndex) in week" :key="dayIndex">
        <UTooltip :text="formatDate(day.date)" :popper="{ placement: 'top' }" :ui="{ wrapper: 'flex' }">
          <div :class="['day', { active: habit.completeDays.includes(day.date) }]"></div>
        </UTooltip>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.day {
  @apply flex h-2.5 w-2.5 rounded-sm bg-neutral-800;
  &.active {
    @apply bg-green-400;
  }
}
</style>
