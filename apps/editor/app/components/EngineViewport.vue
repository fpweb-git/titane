<template>
    <div class="w-full h-full relative bg-gray-900 overflow-hidden">
        <canvas ref="canvasReference" class="w-full h-full block outline-none focus:ring-2 focus:ring-primary-500"
            tabindex="0"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
    TitaneEngine,
    EntityFactory,
    addComponent,
    VELOCITY_ID,
    createVelocity
} from '@titane/core';

const canvasReference = ref<HTMLCanvasElement | null>(null);
let engine: TitaneEngine | null = null;

/**
 * Handles the window resize event by delegating to the engine.
 */
const onResize = () => {
    engine?.handleResize();
};

onMounted(() => {
    if (!canvasReference.value) return;

    // 1. Initialize Engine Runtime
    engine = new TitaneEngine(canvasReference.value);

    // 2. Spawn a test object using the Factory
    // This creates an Entity with Transform and Mesh components
    const myCube = EntityFactory.createBox(engine.world, '#4ade80', { x: 0, y: 0, z: 0 });

    // Add movement data
    addComponent(engine.world, myCube, VELOCITY_ID, createVelocity(1, 0.5, 0));

    // 3. Setup Resize Listener
    window.addEventListener('resize', onResize);

    // 4. Start Simulation
    engine.start();
});

onBeforeUnmount(() => {
    if (engine) {
        engine.stop();
        window.removeEventListener('resize', onResize);
    }
});
</script>