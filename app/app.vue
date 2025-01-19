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
const openHabitModal = ref(false);
</script>

<template>
  <Container>
    <div class="flex justify-between items-center px-1">
      <div class="flex justify-center items-center gap-3">
        <div class="text-4xl font-semibold">{{ formattedDate.day }}</div>
        <div class="today completed"></div>
      </div>
      <div class="flex flex-col items-end font-medium">
        <div class="text-xs text-neutral-400">{{ formattedDate.monthAndYear }}</div>
        <div class="text-sm">{{ formattedDate.weekDay }}</div>
      </div>
    </div>
    <div class="flex flex-col border border-neutral-800 bg-neutral-900 rounded-3xl">
      <div class="flex justify-between items-start p-4">
        <div class="flex flex-col items-start gap-3">
          <UAvatar size="3xl" :src="user?.avatar_url" :alt="user?.login" />
          <div class="flex flex-col gap-1">
            <div class="text-xl font-medium">{{ user?.name }}</div>
            <div class="text-xs text-neutral-400">{{ user?.bio }}</div>
          </div>
        </div>
        <div class="items-center flex gap-3">
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
      <div class="bg-neutral-950 p-3 flex flex-row rounded-2xl border border-neutral-800 gap-3 mx-3 mb-3 cursor-pointer" @click="openHabitModal = true">
        <div class="flex flex-col gap-1 flex-1">
          <div class="font-medium text-lg">Pleasure Detox</div>
          <div class="text-xs text-neutral-400 line-clamp-3">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
        </div>
        <div class="flex flex-col gap-0.5 overflow-auto rounded-md max-h-max hover:bg-green-500">
          <div v-for="row in 7" :key="row" class="flex w-full gap-0.5">
            <div v-for="col in 7" :key="col" :class="['w-2.5 h-2.5 flex rounded-sm', row === 7 && col === 7 ? 'bg-green-400' : 'bg-neutral-800']"></div>
          </div>
        </div>
      </div>
      <UModal v-model="openHabitModal">
        <div class="p-4 flex flex-col gap-2">
          <div class="flex flex-col gap-0.5 overflow-auto rounded-md max-h-max">
            <div v-for="row in 7" :key="row" class="flex w-full gap-0.5">
              <div v-for="col in 40" :key="col" :class="['w-2.5 h-2.5 flex rounded-sm', row === 7 && col === 40 ? 'bg-green-400' : 'bg-neutral-800']"></div>
            </div>
          </div>
          <div class="flex flex-col gap-1 flex-1">
            <div class="font-medium text-lg">Pleasure Detox</div>
            <div class="text-xs text-neutral-400">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
              with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </div>
          </div>
        </div>
      </UModal>
      <!--<div class="flex justify-between border p-5 rounded-xl">
        <h1 class="text-2xl">Habit</h1>
        <div class="flex gap-4 items-center">
          <button @click="toggleDark">
            <div class="capitalize underline">{{ colorMode.preference }}</div>
          </button>
          <div>
            <a v-if="!loggedIn" href="/api/auth/github">Sign in</a>
            <a v-else @click="clear()">Sign Out</a>
          </div>
        </div>
      </div>
      <HabitCard v-if="loggedIn" v-for="habit in habits" :key="habit.id" :habit="habit" />-->
    </div>
    <div class="flex flex-col items-center text-xs text-neutral-600">
      <div>Habit v{{ config.public.version }}</div>
      <a href="https://github.com/zackha/habit" target="_blank">Github</a>
    </div>
  </Container>
</template>

<style lang="postcss" scoped>
.today {
  @apply w-3 h-3 rounded-full;
  background: linear-gradient(165deg, #ff0000 0%, #ff8e8e 92%);
  &.completed {
    background: linear-gradient(165deg, #15ff00 0%, #a5ffa1 92%);
    box-shadow: 0 0 4px 0 #4caf50;
  }
}
</style>
