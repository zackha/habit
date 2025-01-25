<script setup lang="ts">
const backgroundImage = ref('/bg/bg1.jpg');
const isTransitioning = ref(false);

const setBackground = (image: string) => {
  if (backgroundImage.value !== image) {
    isTransitioning.value = true;
    setTimeout(() => {
      backgroundImage.value = image;
    }, 300);
  }
};
</script>

<template>
  <div class="rmterp">
    <div class="fzypcq">
      <slot />
    </div>
    <div
      class="absolute h-screen w-screen bg-cover bg-center blur transition-opacity duration-300"
      :style="{ backgroundImage: `url('${backgroundImage}')`, opacity: isTransitioning ? 0 : 1 }"
      @transitionend="isTransitioning = false"></div>
    <div class="absolute bottom-8 left-8 flex gap-4">
      <button @click="setBackground('/bg/bg1.jpg')" class="bg-image-button" :style="{ backgroundImage: `url('/bg/bg1.jpg')` }"></button>
      <button @click="setBackground('/bg/bg2.jpg')" class="bg-image-button" :style="{ backgroundImage: `url('/bg/bg2.jpg')` }"></button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative flex min-h-screen flex-col items-center justify-center;
}

.fzypcq {
  @apply z-10 mx-auto flex w-full max-w-sm flex-col gap-4 px-5;
}

.bg-image-button {
  @apply h-12 w-12 rounded-full border-2 border-black/50 bg-cover bg-center transition-opacity hover:opacity-50;
}
</style>
