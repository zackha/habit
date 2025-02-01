<script setup lang="ts">
defineProps<{ user?: User }>();
</script>

<template>
  <div class="relative flex p-5">
    <UserProfileInfo :user="user" />
    <ProfileActions v-if="!user" />
  </div>
</template>
