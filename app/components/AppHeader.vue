<script setup lang="ts">
import { format } from 'date-fns';
const today = new Date();
const formattedDate = {
  day: format(today, 'dd'),
  monthAndYear: format(today, "MMM''yy"),
  weekDay: format(today, 'EEEE'),
};
</script>

<template>
  <div class="flex items-center justify-between px-1">
    <div class="flex items-center justify-center gap-3">
      <div class="text-4xl font-semibold">{{ formattedDate.day }}</div>
      <div class="today completed"></div>
    </div>
    <div class="flex flex-col items-end font-medium">
      <div class="text-xs text-neutral-400">
        {{ formattedDate.monthAndYear }}
      </div>
      <div class="text-sm">{{ formattedDate.weekDay }}</div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.today {
  @apply h-3 w-3 rounded-full;
  background: linear-gradient(165deg, #ff0000 0%, #ff8e8e 92%);
  &.completed {
    background: linear-gradient(165deg, #15ff00 0%, #a5ffa1 92%);
    box-shadow: 0 0 4px 0 #4caf50;
  }
}
</style>
