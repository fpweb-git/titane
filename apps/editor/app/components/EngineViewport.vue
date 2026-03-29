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
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { EntityFactory, addComponent, VELOCITY_ID, createVelocity } from '@titane/core';

const canvasReference = ref<HTMLCanvasElement | null>(null);
const { initEngine, entities } = useTitane();

let autoSaveInterval: number;
let unwatch: () => void;

/**
 * Forwards the resize command to the shared engine instance.
 */
const onResize = () => {
    const { engine } = useTitane();
    engine.value?.renderer.handleResize();
};

onMounted(() => {
    if (!canvasReference.value) return;

    const engine = initEngine(canvasReference.value);
    const { autoSaveToStorage, loadFromStorage } = usePersistence();

    // 1. Attempt to recover previous session
    const hasRecovered = loadFromStorage();

    // 2. Spawn a test cube (only if no session was recovered and no user entities exist)
    // Note: active.size starts at 1 because the engine always creates a globalInputEntity (entity 0)
    if (!hasRecovered && engine.world.entities.active.size <= 1) {
        const demoCube = EntityFactory.createBox(engine.world, '#4ade80', { x: 0, y: 0, z: 0 });
        addComponent(engine.world, demoCube, VELOCITY_ID, createVelocity(0.4, 0, 0));
    }

    // 3. Set up event-driven auto-save on entity mutations
    unwatch = watch(entities, () => {
        autoSaveToStorage();
    }, { deep: true });

    // 4. Set up periodic auto-save
    autoSaveInterval = window.setInterval(() => {
        autoSaveToStorage();
    }, 60000);

    // 5. Start simulation and listen for resize
    window.addEventListener('resize', onResize);
    engine.start();
});

onBeforeUnmount(() => {
    if (unwatch) unwatch();
    window.clearInterval(autoSaveInterval);
    window.removeEventListener('resize', onResize);
});
</script>