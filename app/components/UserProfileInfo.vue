<script setup lang="ts">
const { user } = useUserSession();
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <UAvatar size="3xl" :src="user?.avatar_url" :alt="user?.login" />
    <div class="flex flex-col gap-1">
      <div class="text-xl font-medium">{{ user?.name }}</div>
      <div class="text-xs text-neutral-400">{{ user?.bio }}</div>
    </div>
  </div>
</template>
