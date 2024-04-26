<script lang="ts" setup>
import { defineProps } from "vue";

defineProps(["desc"]);
</script>

<template>
    <main>
        <p>全文概述</p>
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
</style>