<script setup lang="ts">
import { ref } from 'vue';

const site = ref<string>('1');


</script>

<template>
    <h1>Home</h1>

    <a-radio-group v-model:value="site" button-style="solid">
        <a-radio-button value="1">线路所</a-radio-button>
        <a-radio-button value="2">阜阳西</a-radio-button>
        <a-radio-button value="3">太和东</a-radio-button>
        <a-radio-button value="4">临泉</a-radio-button>
        <a-radio-button value="5">界首</a-radio-button>
        <a-radio-button value="6">古城东</a-radio-button>
        <a-radio-button value="7">毫州南</a-radio-button>
        <a-radio-button value="8">芦庙</a-radio-button>
    </a-radio-group>
</template>

<style scoped></style>
