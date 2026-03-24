<template>
    <div class="w-full h-full relative overflow-hidden">
        <canvas
            ref="canvasReference"
            class="w-full h-full block outline-none transition-opacity duration-700"
            :class="{ 'opacity-0': !canvasReference, 'opacity-100': canvasReference }"
            tabindex="0">
        </canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { EntityFactory, addComponent, VELOCITY_ID, createVelocity } from '@titane/core';

const canvasReference = ref<HTMLCanvasElement | null>(null);
const { initEngine } = useTitane();

/**
 * Forwards the resize command to the shared engine instance.
 */
const onResize = () => {
    const { engine } = useTitane();
    engine.value?.handleResize();
};

onMounted(() => {
    if (!canvasReference.value) return;

    const engine = initEngine(canvasReference.value);

    // 2. Spawn a test cube (only if world is empty for demo)
    if (engine.world.entities.active.size === 0) {
        const demoCube = EntityFactory.createBox(engine.world, '#4ade80', { x: 0, y: 0, z: 0 });
        addComponent(engine.world, demoCube, VELOCITY_ID, createVelocity(0.1, 0, 0));
    }

    // 3. Start simulation and listen for resize
    window.addEventListener('resize', onResize);
    engine.start();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
});
</script>