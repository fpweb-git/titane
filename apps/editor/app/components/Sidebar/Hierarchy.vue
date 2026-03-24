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
        <template #actions-trailing>
            <UiEntityActions />
        </template>
    </UNavigationMenu>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { EntityFactory, getComponent, NAME_ID, type Name } from '@titane/core';

const { engine, entities, syncWorld, selectedEntityId } = useTitane();

const createNewEntity = (): void => {
    if (!engine.value) return;

    EntityFactory.createBox(engine.value.world);
    syncWorld();
};

const selectEntity = (entityId: number) => {
    selectedEntityId.value = entityId;
};

/**
* Transforms the ECS World state into Nuxt UI Navigation items.
* Fetches the 'Name' component for each entity to provide a clear label.
*/
const items = computed<NavigationMenuItem[]>(() => {
    if (!engine.value) return [];
    const world = engine.value.world;

    return [
        {
            label: 'World',
            defaultOpen: true,
            slot: 'add' as const,
            children: Array.from(entities.value).map((id) => {
                const componentName = getComponent<Name>(world, id, NAME_ID);
                const displayName = componentName?.value || `GameObject #${id}`;

                return {
                    label: displayName,
                    icon: 'i-lucide-box',
                    slot: 'actions' as const,
                    active: selectedEntityId.value === id,
                    onSelect: () => selectEntity(id)
                };
            })
        }
    ];
});
</script>