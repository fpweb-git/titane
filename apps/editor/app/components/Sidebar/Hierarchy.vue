<template>
    <UNavigationMenu
        orientation="vertical"
        :items="items"
        class="data-[orientation=vertical]:w-full"
        :collapsed="false">
        <template #add-trailing>
            <UBadge
                :label="entities.size"
                color="neutral"
                variant="outline"
                size="sm" />
            <UButton
                icon="i-lucide-plus"
                color="neutral"
                variant="ghost"
                size="sm"
                @click.stop="createNewEntity" />
        </template>
        <template #actions-trailing="{ item }">
            <UiEntityActions />
        </template>
    </UNavigationMenu>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { EntityFactory } from '@titane/core';

const { engine, entities, syncWorld, selectedEntityId } = useTitane();

/**
 * Action: Create a new entity
 */
const createNewEntity = (): void => {
    if (!engine.value) return;

    EntityFactory.createBox(engine.value.world);
    syncWorld();
};

/**
 * Handles the selection of an entity.
 * @param entityId The ID of the clicked entity.
 */
const selectEntity = (entityId: number) => {
    selectedEntityId.value = entityId;
};

const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'World',
        defaultOpen: true,
        slot: 'add' as const,
        children: Array.from(entities.value).map((id) => ({
            label: `GameObject #${id}`,
            icon: 'i-lucide-box',
            slot: 'actions' as const,
            onSelect: () => selectEntity(id)
        }))
    }
]);
</script>