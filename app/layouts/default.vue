<template>
    <Container>
        <Transition name="fade" mode="out-in">
            <slot/>
        </Transition>
        <AppFooter />
    </Container>
</template>
