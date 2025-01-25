<template>
  <div class="rmterp">
    <div class="fzypcq">
      <slot />
    </div>
    <div class="absolute h-screen w-screen bg-cover bg-center blur-md" style="background-image: url('/bg/bg2.jpg')"></div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative flex min-h-screen flex-col items-center justify-center;
}

.fzypcq {
  @apply z-10 mx-auto flex w-full max-w-sm flex-col gap-4 px-5;
}
</style>
