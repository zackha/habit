<script setup lang="ts">
const { session } = useUserSession();
const login = useRoute().params.user as string;
const isMyProfile = computed(() => session.value?.user?.login === login);

const fetchUser = () => useRequestFetch()(`/api/users/${login}`) as Promise<User>;
const fetchHabits = () => useRequestFetch()(`/api/users/${login}/habits`) as Promise<Habit[]>;
const fetchMyHabits = () => useRequestFetch()('/api/habits') as Promise<Habit[]>;

const { data: user } = useQuery({ key: ['user'], query: fetchUser });
const { data: habits } = useQuery({ key: ['habits'], query: fetchHabits });
const { data: myHabits } = useQuery({
  key: ['my_habits'],
  query: fetchMyHabits,
  enabled: isMyProfile.value,
});

const emptyHabits = computed(() => habits.value?.length === 0);
const emptyMyHabits = computed(() => myHabits.value?.length === 0);
const pageTitle = computed(() => (user.value?.login && user.value?.name ? `${user.value.name} (@${user.value.login}) · Habits and Todos` : 'Page Not Found · Habit'));

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  ogSiteName: pageTitle,
});
</script>

<template>
  <Card v-if="user">
    <div class="relative z-10">
      <ProfileHeader :user="user" />
      <template v-if="!user.userView && !isMyProfile"><PrivateAccount :user="user" /></template>
      <template v-else>
        <div class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto">
          <HabitCard v-for="habit in isMyProfile ? myHabits : habits" :key="habit.id" :habit="habit" :isMyProfile="isMyProfile" />
        </div>
        <EmptyHabits v-if="isMyProfile ? emptyMyHabits : emptyHabits" :isMyProfile="isMyProfile" />
      </template>
    </div>
  </Card>
  <Card v-else class="items-start justify-center gap-7 p-6">
    <div class="relative z-10 flex w-5/6 flex-col gap-5">
      <div class="text-3xl font-semibold">404</div>
      <p class="font-semibold">Sorry, this page isn't available.</p>
      <p class="text-sm text-white/50">The link you followed may be broken, or the page may have been removed.</p>
    </div>
    <a href="/" class="button bg-white/20 px-2.5 py-2 hover:bg-white/30">
      <UIcon name="i-heroicons-arrow-left-16-solid" class="h-5 w-5" />
      Go back to Habit
    </a>
  </Card>
</template>
