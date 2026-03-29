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
                <UiFormLabel label="Position" />
                <div class="grid grid-cols-3 gap-2">
                    <UInput v-model.number="transform.position.x" @change="markUpdate" size="xs" type="number" step="0.1"
                        color="primary">
                        <template #leading>
                            <UiInputLeading label="x" />
                        </template>
                    </UInput>
                    <UInput v-model.number="transform.position.y" @change="markUpdate" size="xs" type="number" step="0.1" color="primary">
                        <template #leading>
                            <UiInputLeading label="y" />
                        </template>
                    </UInput>
                    <UInput v-model.number="transform.position.z" @change="markUpdate" size="xs" type="number" step="0.1" color="primary">
                        <template #leading>
                            <UiInputLeading label="z" />
                        </template>
                    </UInput>
                </div>

                <UiFormLabel label="Scale" />
                <div class="grid grid-cols-3 gap-2">
                    <UInput v-model.number="transform.scale.x" @change="markUpdate" size="xs" type="number" step="0.1" />
                    <UInput v-model.number="transform.scale.y" @change="markUpdate" size="xs" type="number" step="0.1" />
                    <UInput v-model.number="transform.scale.z" @change="markUpdate" size="xs" type="number" step="0.1" />
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

const markUpdate = () => {
    saveToStorage();
};
</script>