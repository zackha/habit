<script setup lang="ts">
import { format } from 'date-fns';
const { user, loggedIn, clear } = useUserSession();
const config = useRuntimeConfig();
const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
  enabled: !!loggedIn.value,
});

const emptyHabits = computed(() => habits.value?.length === 0);
const today = new Date();
const formattedDate = {
  day: format(today, 'dd'),
  monthAndYear: format(today, "MMM''yy"),
  weekDay: format(today, 'EEEE'),
};

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
  <Container>
    <div class="flex justify-between rounded-xl p-5">
      <div class="flex items-center gap-4">
        <button @click="toggleDark">
          <div class="capitalize underline">{{ colorMode.preference }}</div>
        </button>
        <div>
          <a v-if="!loggedIn" href="/api/auth/github">Sign in</a>
          <a v-else @click="clear()">Sign Out</a>
        </div>
      </div>
    </div>
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
    <div class="flex flex-col rounded-3xl border border-neutral-800 bg-neutral-900">
      <div class="flex items-start justify-between p-4">
        <div class="flex flex-col items-start gap-3">
          <UAvatar size="3xl" :src="user?.avatar_url" :alt="user?.login" />
          <div class="flex flex-col gap-1">
            <div class="text-xl font-medium">{{ user?.name }}</div>
            <div class="text-xs text-neutral-400">{{ user?.bio }}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <UButton :ui="{ rounded: 'rounded-full' }" variant="soft" icon="i-heroicons-plus-16-solid" @click="createHabitModal = true">Create</UButton>
          <UModal v-model="createHabitModal">
            <div class="p-10">
              <HabitForm />
            </div>
          </UModal>
          <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
            <UButton color="white" :ui="{ rounded: 'rounded-full' }" square trailing-icon="i-heroicons-cog-8-tooth" />
          </UDropdown>
        </div>
      </div>
      <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      <div v-if="emptyHabits" class="relative mx-3 mb-3 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-center">
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
    </div>
    <div class="flex flex-col items-center text-xs text-neutral-600">
      <div>Habit v{{ config.public.version }}</div>
      <a href="https://github.com/zackha/habit" target="_blank">Github</a>
    </div>
  </Container>
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
