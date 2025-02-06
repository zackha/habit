<script setup lang="ts">
defineProps<{ isMyProfile: Boolean }>();
const createHabitModal = ref(false);
</script>

<template>
  <ContentBox class="relative mx-4 mb-4 flex flex-col items-center justify-center overflow-hidden bg-white/5 text-center">
    <div class="absolute flex flex-col gap-0.5">
      <div v-for="row in 14" :key="row" class="flex w-full gap-0.5">
        <div v-for="col in 27" :key="col" class="h-2.5 w-2.5 rounded-sm bg-neutral-600/5"></div>
      </div>
    </div>
    <div v-if="isMyProfile" class="flex flex-col items-center justify-center gap-2 py-6">
      <button @click="createHabitModal = true" class="button mb-2 bg-green-400 p-2.5 text-green-950 hover:bg-green-300">
        <UIcon name="i-heroicons-plus-16-solid" class="h-6 w-6" />
      </button>
      <div class="font-medium">No habit found</div>
      <div class="text-xs text-neutral-400">Create a new habit to track your progress</div>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-2 py-9">
      <div class="button mb-2 bg-green-400 p-1.5 text-green-950">
        <div class="h-8 w-8 rounded-full bg-green-900 shadow-inner shadow-black/50"></div>
      </div>
      <div class="font-medium">No visible habits</div>
    </div>
  </ContentBox>
  <UModal
    v-model="createHabitModal"
    :ui="{ container: 'items-center', width: 'w-96', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'bg-white/5 dark:bg-black/60' } }">
    <HabitForm @habitAdded="createHabitModal = false" />
  </UModal>
</template>
