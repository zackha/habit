<script setup lang="ts">
defineProps<{ user: User }>();
</script>

<template>
  <ContentBox class="relative mx-4 mb-4 flex flex-col items-center justify-center overflow-hidden bg-white/5 text-center">
    <div class="absolute flex flex-col gap-0.5">
      <div v-for="row in 14" :key="row" class="flex w-full gap-0.5">
        <div v-for="col in 27" :key="col" class="h-2.5 w-2.5 rounded-sm bg-neutral-600/5"></div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center gap-2 py-9">
      <div class="button mb-2 bg-green-400 p-2.5 text-green-950">
        <UIcon name="i-heroicons-lock-closed-solid" class="h-6 w-6" />
      </div>
      <div class="font-medium">@{{ user.login }}'s account is private</div>
    </div>
  </ContentBox>
</template>
