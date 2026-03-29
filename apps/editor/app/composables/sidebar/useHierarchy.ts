import { getComponent, NAME_ID, INPUT_ID, type Name } from '@titane/core';
import type { NavigationMenuItem } from '@nuxt/ui'

export interface HierarchyItem extends NavigationMenuItem {
    id: number;
}

/**
 * Transforms the ECS World state into Nuxt UI Navigation items.
 * 
 * @returns {Object} An object containing the hierarchy items and the count of visible entities.
 */
export const useHierarchy = () => {
    const { engine, entities, selectedEntityId } = useTitane();

    // Filter out system entities and internal engine objects.
    const visibleEntities = computed(() => {
        if (!engine.value) return [];
        const world = engine.value.world;
        return Array.from(entities.value).filter(id => !getComponent(world, id, INPUT_ID));
    });

    // Map entities to Nav items for the UI.
    const hierarchyItems = computed<HierarchyItem[]>(() => {
        if (!engine.value) return [];
        const world = engine.value.world;

        return visibleEntities.value.map(id => {
            const nameComp = getComponent<Name>(world, id, NAME_ID);
            return {
                id,
                label: nameComp?.value || `GameObject #${id}`,
                icon: 'i-lucide-box',
                active: selectedEntityId.value === id,
                slot: 'actions' as const,
                onSelect: () => { selectedEntityId.value = id; }
            };
        });
    });

    return {
        items: hierarchyItems,
        count: computed(() => visibleEntities.value.length)
    };
};