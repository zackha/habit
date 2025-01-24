<script setup lang="ts">
import { format } from 'date-fns';
const config = useRuntimeConfig();
const currentYear = format(new Date(), 'yyyy');
</script>

<template>
  <div class="mt-2 flex flex-col items-center justify-between gap-1 text-xs text-neutral-600">
    <div>
      <a class="font-semibold" href="https://github.com/zackha/habit" target="_blank">Habit v{{ config.public.version }}</a>
      - by
      <a class="font-semibold" href="https://github.com/zackha" target="_blank">Sefa Bulak</a>
      {{ currentYear }}
    </div>
  </div>
</template>
