<template>
    <div class="h-full overflow-y-auto p-1">
        <UTree
            v-model="selection"
            :items="items"
            :multiple="false"
            :get-key="(item: HierarchyItem) => item.value as string"
            class="w-full">
            <template #item-leading="{ item, expanded }">
                <UIcon
                    :name="item.children ? (expanded ? 'i-lucide-folder-open' : 'i-lucide-folder') : 'i-lucide-box'" />
            </template>

            <template #item-label="{ item }">
                <span class="truncate text-xs">{{ item.label }}</span>
            </template>
        </UTree>
        <!-- TODO: Remove this button -->
        <UButton @click="addChildBox" class="mt-20"> Add Child </UButton>
    </div>
</template>

<script setup lang="ts">
import { EntityFactory, setParent } from '@titane/core';
const { items, selection } = useHierarchy();

// TODO: Remove this function
const addChildBox = () => {
    const { engine, syncWorld } = useTitane();
    if (!engine.value) return;

    // Add child to the first root entity for testing
    const firstRootId = items.value.length > 0 ? items.value[0].id : null;

    const child = EntityFactory.createBox(engine.value.world);
    setParent(engine.value.world, child, firstRootId);
    syncWorld();
};
</script>