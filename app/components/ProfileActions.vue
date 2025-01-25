<script setup lang="ts">
const { clear, user } = useUserSession();
const colorMode = useColorMode();

const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: () => (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'),
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
    <button class="button bg-white/20 py-1.5 pl-2 pr-2.5 hover:bg-white/25" @click="createHabitModal = true">
      <UIcon name="i-heroicons-plus-16-solid" class="h-5 w-5" />
      Create
    </button>

    <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
      <button class="button bg-white/20 p-1.5 hover:bg-white/25">
        <UIcon name="i-heroicons-cog-8-tooth" class="h-5 w-5" />
      </button>
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
          <UIcon
            :name="colorMode.preference === 'dark' || colorMode.preference === 'system' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            class="ms-auto h-5 w-5 flex-shrink-0 text-gray-400" />
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
