<script setup lang="ts">
const { clear, user } = useUserSession();
const colorMode = useColorMode();

const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: (value: boolean) => {
    colorMode.preference = value ? 'dark' : 'light';
  },
});

const items = [
  [{ label: 'Profile', slot: 'account' }],
  [{ label: 'Theme', slot: 'theme', click: () => (isDarkMode.value = !isDarkMode.value) }],
  [{ label: 'Sign out', click: () => clear() }],
];

const createHabitModal = ref(false);
</script>

<template>
  <div class="flex items-center gap-3">
    <UButton :ui="{ rounded: 'rounded-full' }" variant="soft" icon="i-heroicons-plus-16-solid" @click="createHabitModal = true">Create</UButton>

    <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
      <UButton color="white" :ui="{ rounded: 'rounded-full' }" square trailing-icon="i-heroicons-cog-8-tooth" />
      <template #account>
        <div class="flex items-center gap-2.5">
          <UAvatar :src="user?.avatar_url" size="md" />
          <div class="text-left">
            <p>{{ user?.name }}</p>
            <p class="truncate font-medium text-gray-900 dark:text-white">@{{ user?.login }}</p>
          </div>
        </div>
      </template>

      <template #theme>
        <div class="flex flex-1 items-center justify-between">
          <span class="truncate">Dark mode</span>
          <UToggle size="sm" v-model="isDarkMode" />
        </div>
      </template>

      <template #item>
        <span class="truncate">Sign out</span>
        <UIcon name="i-heroicons-arrow-right-on-rectangle-20-solid" class="ms-auto h-5 w-5 flex-shrink-0 text-gray-400" />
      </template>
    </UDropdown>
  </div>
  <UModal v-model="createHabitModal" :ui="{ width: 'w-80', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'dark:bg-black/60' } }">
    <HabitForm @habitAdded="createHabitModal = false" />
  </UModal>
</template>
