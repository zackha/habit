<template>
  <div class="rmterp">
    <div class="fzypcq">
      <slot />
    </div>
    <div class="iPbnzK"></div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative flex h-dvh items-center justify-center;
}

.fzypcq {
  @apply z-10 mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4 p-5;
}

.iPbnzK {
  @apply absolute h-dvh w-screen bg-cover bg-center blur transition-opacity duration-300;
  background-image: url('/bg/bg1.jpg');
}
</style>
