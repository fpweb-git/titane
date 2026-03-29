<template>
    <UNavigationMenu
        orientation="vertical"
        :items="hierarchyItems"
        class="data-[orientation=vertical]:w-full"
        :collapsed="false">
        <template #add-trailing>
            <UBadge
                :label="count"
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
        <template #actions-leading>
            <UIcon name="i-lucide-box" class="w-[14px] h-[14px]" />
        </template>
        <template #actions-trailing>
            <UiEntityActions />
        </template>
    </UNavigationMenu>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { EntityFactory } from '@titane/core';

const { engine, syncWorld } = useTitane();
const { items, count } = useHierarchy();

const createNewEntity = (): void => {
    if (!engine.value) return;

    EntityFactory.createBox(engine.value.world);
    syncWorld();
};

const hierarchyItems = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Hierarchy',
        defaultOpen: true,
        slot: 'add',
        children: items.value
    }
]);
</script>