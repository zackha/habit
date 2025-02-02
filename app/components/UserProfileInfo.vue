<script setup lang="ts">
const { user } = useUserSession();
const { publicUser } = usePublicUser()

const userInfo = computed(() => {
  if (publicUser.value.status === 404) {
    return {
      icon: 'i-heroicons-exclamation-circle-20-solid',
      message: 'User not found'
    };
  } else if (publicUser.value.status === 403) {
    return {
      icon: 'i-heroicons-lock-closed-20-solid',
      message: 'User profile is private'
    };
  } else if (publicUser.value.status !== null) {
    return {
      icon: 'i-heroicons-user-question-mark-circle-20-solid',
      message: 'An error occurred. Please try again.'
    };
  }
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <UAvatar size="3xl" :icon="userInfo?.icon" :src="!publicUser.info ? user?.avatar_url : publicUser.info.avatarUrl" :alt="user?.login" />
    <div class="flex flex-col gap-1">
      <template v-if="!publicUser.info">
        <div class="text-xl font-medium">{{ user?.name }}</div>
        <div class="text-xs text-white/40">{{ user?.bio }}</div>
      </template>
      <template v-else>
        <div class="text-xl font-medium">{{ publicUser.info?.name }}</div>
        <div class="text-xs text-white/40">{{ publicUser.info?.bio }}</div>
      </template>
      <div class="text-xl font-medium" v-if="userInfo?.message">{{ userInfo?.message }}</div>
    </div>
  </div>
</template>
