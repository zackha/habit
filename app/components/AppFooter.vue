<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <div class="flex flex-col items-center text-xs text-neutral-600">
    <div>Habit v{{ config.public.version }}</div>
    <a href="https://github.com/zackha/habit" target="_blank">Github</a>
  </div>
</template>
