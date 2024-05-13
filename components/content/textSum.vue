<script lang="ts" setup>
import { defineProps } from "vue";
const colorMode = useColorMode()

defineProps(["desc"]);
</script>

<template>
    <main>
        <p style="text-transform: uppercase;font-weight: bold;">overview</p>
        <span>{{desc }}</span>
    </main>
</template>

<style lang="scss" scoped>
main {
    background: #fafafa;
    padding: 10px;
    font-size: 1vh;
    margin-top: 10px;
    margin-bottom: 10px;
}
.dark-mode main {
    background: #121212;
}
</style>