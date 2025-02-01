<template>
  <Container>
    <Transition name="fade" mode="out-in">
      <slot />
    </Transition>
    <AppFooter />
  </Container>
</template>

<style lang="postcss">
.scrollable-card {
  scrollbar-width: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.button {
  box-shadow:
    inset 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.1),
    inset -0.5px -0.5px 1px 0px rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2) 0px 3px 10px -5px;
  @apply flex items-center justify-center gap-2 rounded-full text-sm backdrop-blur-sm transition-all;
  &:active {
    @apply scale-95;
  }
}

* {
  scrollbar-color: #555 rgba(0, 0, 0, 0);
}
</style>
