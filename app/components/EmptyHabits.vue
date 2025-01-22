<script setup lang="ts">
const createHabitModal = ref(false);
</script>

<template>
  <div class="relative mx-3 mb-3 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-center">
    <div class="absolute flex flex-col gap-0.5">
      <div v-for="row in 14" :key="row" class="flex w-full gap-0.5">
        <div v-for="col in 27" :key="col" class="h-2.5 w-2.5 rounded-sm bg-neutral-600/10"></div>
      </div>
    </div>
    <div class="absolute h-full w-full bg-gradient-to-t from-neutral-950"></div>
    <div class="z-10 flex flex-col items-center justify-center gap-2 p-6">
      <UButton class="mb-2" icon="i-heroicons-plus-16-solid" @click="createHabitModal = true" size="xl" variant="solid" :ui="{ rounded: 'rounded-full' }" />
      <div class="font-medium">No habit found</div>
      <div class="text-xs text-neutral-400">Create a new habit to track your progress</div>
    </div>
  </div>
  <UModal v-model="createHabitModal" :ui="{ width: 'w-80', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'dark:bg-black/60' } }">
    <HabitForm />
  </UModal>
</template>
