<template>
    <div class="w-full h-full relative bg-gray-900 overflow-hidden">
        <canvas ref="canvasReference" class="w-full h-full block outline-none" tabindex="0"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { TitaneEngine } from '@titane/core';

const canvasReference = ref<HTMLCanvasElement | null>(null);
let engineInstance: TitaneEngine | null = null;

onMounted(() => {
    if (!canvasReference.value) return;

    engineInstance = new TitaneEngine(canvasReference.value);

    engineInstance.handleResize();
    engineInstance.start();
});

onBeforeUnmount(() => {
    if (engineInstance) {
        engineInstance.stop();
        window.removeEventListener('resize', engineInstance.handleResize);
    }
});
</script>