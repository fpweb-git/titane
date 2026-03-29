<template>
    <UCollapsible default-open>
        <UButton
            label="Transform"
            color="neutral"
            variant="soft"
            trailing-icon="i-lucide-chevron-down"
            size="sm"
            block />

        <template #content>
            <div class="space-y-2 py-2">
                <div class="space-y-2">
                    <UiFormLabel label="Position" />
                    <div class="grid grid-cols-3 gap-2">
                        <UInput v-for="axis in axes" :key="'pos-' + axis"
                            v-model.number="transform.position[axis]"
                            type="number" step="0.1" size="xs" color="primary"
                            @update:model-value="markDirty"
                            @change="saveChanges">
                            <template #leading>
                                <UiInputLeading :label="axis" />
                            </template>
                        </UInput>
                    </div>
                </div>

                <div class="space-y-2">
                    <UiFormLabel label="Rotation" />
                    <div class="grid grid-cols-3 gap-2">
                        <UInput v-for="axis in axes" :key="'rot-' + axis" v-model.number="transform.rotation[axis]"
                            type="number"
                            step="0.01" size="xs" color="primary" @update:model-value="markDirty" @change="saveChanges">
                            <template #leading>
                                <UiInputLeading :label="axis" />
                            </template>
                        </UInput>
                    </div>
                </div>

                <div class="space-y-2">
                    <UiFormLabel label="Scale" />
                    <div class="grid grid-cols-3 gap-2">
                        <UInput v-for="axis in axes" :key="'scale-' + axis" v-model.number="transform.scale[axis]"
                            type="number"
                            step="0.1" size="xs" color="primary" @update:model-value="markDirty" @change="saveChanges">
                            <template #leading>
                                <UiInputLeading :label="axis" />
                            </template>
                        </UInput>
                    </div>
                </div>
            </div>
        </template>
    </UCollapsible>
</template>

<script setup lang="ts">
import type { Transform } from '@titane/core';

const props = defineProps<{
    transform: Transform;
}>();

const { saveToStorage } = usePersistence();

const axes = ['x', 'y', 'z'] as const;

/**
 * Notifies the Engine that the data has changed.
 * This triggers the HierarchySystem to recompute the World Matrix.
 */
const markDirty = () => {
    props.transform.isDirty = true;
};

const saveChanges = () => {
    saveToStorage();
};
</script>