<script setup lang="ts">
const items = [
  [
    {
      label: 'Profile',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/739984?v=4',
      },
    },
  ],
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      shortcuts: ['E'],
      click: () => {
        console.log('Edit');
      },
    },
    {
      label: 'Duplicate',
      icon: 'i-heroicons-document-duplicate-20-solid',
      shortcuts: ['D'],
      disabled: true,
    },
  ],
  [
    {
      label: 'Archive',
      icon: 'i-heroicons-archive-box-20-solid',
    },
    {
      label: 'Move',
      icon: 'i-heroicons-arrow-right-circle-20-solid',
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      shortcuts: ['⌘', 'D'],
    },
  ],
];

const createHabitModal = ref(false);
</script>

<template>
  <div class="flex items-center gap-3">
    <UButton :ui="{ rounded: 'rounded-full' }" variant="soft" icon="i-heroicons-plus-16-solid" @click="createHabitModal = true">Create</UButton>
    <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
      <UButton color="white" :ui="{ rounded: 'rounded-full' }" square trailing-icon="i-heroicons-cog-8-tooth" />
    </UDropdown>
  </div>
  <UModal v-model="createHabitModal">
    <div class="p-10">
      <HabitForm />
    </div>
  </UModal>
</template>
