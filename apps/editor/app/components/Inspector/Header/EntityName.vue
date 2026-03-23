<template>
    <div v-if="componentName">
        <UInput
            v-model="entityName"
            variant="soft"
            placeholder="GameObject Name..."
            size="sm"
            :ui="{
                base: 'text-sm'
            }" />
    </div>
</template>

<script setup lang="ts">
import { NAME_ID, type Name, getComponent, updateComponent } from '@titane/core';

const { engine, selectedEntityId, syncWorld } = useTitane();


const componentName = computed(() => {
    if (selectedEntityId.value === null || !engine.value) return null;

    return getComponent<Name>(engine.value.world, selectedEntityId.value, NAME_ID);
});

/**
 * Computed proxy for v-model.
 * The 'set' uses the engine's secure command API.
 */
const entityName = computed({
    get: () => componentName.value?.value || '',
    set: (newValue: string) => {
        if (selectedEntityId.value === null || !engine.value) return;

        // Use the Fortress API to modify the data
        updateComponent<Name>(
            engine.value.world,
            selectedEntityId.value,
            NAME_ID,
            (data) => { data.value = newValue; }
        );

        // Refresh the world to update the hierarchy
        syncWorld();
    }
});
</script>