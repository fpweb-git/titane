<template>
    <div class="flex items-center justify-between gap-2 w-full">
        <div class="flex items-center gap-2">
            <h2 class="text-xs text-muted">Hierarchy</h2>
            <UBadge :label="count" variant="subtle" size="xs" color="neutral" />
        </div>
        <UButton
            icon="i-lucide-plus"
            variant="ghost"
            color="neutral"
            size="xs"
            @click="createBox" />
    </div>
</template>

<script setup lang="ts">
import { EntityFactory } from '@titane/core';

const { engine, syncWorld } = useTitane();
const { count } = useHierarchy();

/**
 * Creates a new box entity and synchronizes the world state.
 */
const createBox = (): void => {
    if (!engine.value) return;
    EntityFactory.createBox(engine.value.world);
    syncWorld();
};
</script>