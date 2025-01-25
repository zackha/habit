<script setup lang="ts">
defineProps<{ habit: Habit; habitDays: number }>();
</script>

<template>
  <div class="flex gap-0.5 overflow-hidden rounded-xl">
    <div v-for="(week, weekIndex) in generateWeeks(habitDays)" :key="weekIndex" class="flex flex-col gap-0.5">
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
  @apply flex h-2.5 w-2.5 rounded-sm bg-white/10;
  &.active {
    @apply border border-black/50 bg-green-400;
  }
}
</style>
