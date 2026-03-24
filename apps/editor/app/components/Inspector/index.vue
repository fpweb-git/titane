<template>
    <div class="flex flex-col h-full">
        <div v-if="selectedEntityId !== null && transform" class="space-y-6 overflow-y-auto">
            <InspectorHeader />
            <USeparator />
            <InspectorItem :transform="transform" />
        </div>
        <InspectorNoSelection v-else />
    </div>
</template>

<script setup lang="ts">
import { TRANSFORM_ID, getComponent, type Transform } from '@titane/core';

const { engine, selectedEntityId } = useTitane();

// Retrieves the transform data of the selected entity.
const transform = computed<Transform | null | undefined>(() => {
    if (selectedEntityId.value === null || !engine.value) return null;

    return getComponent<Transform>(engine.value.world, selectedEntityId.value, TRANSFORM_ID);
});
</script>