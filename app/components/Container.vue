<template>
  <div class="rmterp">
    <div class="fzypcq">
      <slot />
    </div>
    <div class="absolute h-dvh w-screen bg-cover bg-center blur transition-opacity duration-300" style="background-image: url('/bg/bg1.jpg')"></div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative flex h-dvh items-center justify-center;
}

.fzypcq {
  @apply z-10 mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4 p-5;
}
</style>
