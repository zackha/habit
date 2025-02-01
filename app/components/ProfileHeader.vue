<script setup lang="ts">
import type { User } from '~~/server/utils/db';

export interface Props {
  user?: User
}

defineProps<Props>()
</script>
<template>
  <div class="relative flex p-5">
    <UserProfileInfo :user="user"/>
    <ProfileActions v-if="!user"/>
  </div>
</template>
