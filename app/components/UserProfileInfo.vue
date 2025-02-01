<script setup lang="ts">
const props = defineProps<{ user?: User }>();

const { user } = useUserSession();
</script>

<template>
  <div v-if="props.user" class="flex flex-col gap-3">
    <UAvatar size="3xl" :src="props.user?.avatarUrl || undefined" :alt="props.user?.username" />
    <div class="flex flex-col gap-1">
      <div class="text-xl font-medium">{{ props.user?.name }}</div>
      <div class="text-xs text-white/40">{{ props.user?.bio }}</div>
    </div>
  </div>
  <div v-else class="flex flex-col gap-3">
    <UAvatar size="3xl" :src="user?.avatar_url" :alt="user?.login" />
    <div class="flex flex-col gap-1">
      <div class="text-xl font-medium">{{ user?.name }}</div>
      <div class="text-xs text-white/40">{{ user?.bio }}</div>
    </div>
  </div>
</template>
