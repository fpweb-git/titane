import {
    getComponent,
    NAME_ID,
    INPUT_ID,
    TRANSFORM_ID,
    type Name,
    type Transform,
    type Entity
} from '@titane/core';
import type { TreeItem } from '@nuxt/ui'

export interface HierarchyItem extends TreeItem {
    id: Entity;
    children?: HierarchyItem[];
}

/**
 * Transforms the ECS World state into Nuxt UI Navigation items.
 * 
 * @returns {Object} An object containing the hierarchy items and the count of visible entities and the selected entity id.
 */
export const useHierarchy = () => {
    const { engine, entities, selectedEntityId } = useTitane();

    /**
     * Internal cache used to map Entity IDs to their respective TreeItem objects.
     * This allows the selection logic to retrieve the full object in O(1) time.
     */
    const entityToNodeCache = new Map<Entity, HierarchyItem>();

    /**
     * Filters out internal engine entities to only show user-relevant GameObjects.
     */
    const visibleEntities = computed(() => {
        if (!engine.value) return [];
        const world = engine.value.world;

        return Array.from(entities.value).filter((entityId) => {
            const inputComponent = getComponent(world, entityId, INPUT_ID);
            return !inputComponent;
        });
    });

    /**
     * Recursively constructs the hierarchy tree structure.
     * Populates the internal cache for selection lookups.
     * * @param parentId - The ID of the parent to look for (null for root entities).
     */
    const buildHierarchyLevels = (parentId: Entity | null = null): HierarchyItem[] => {
        if (!engine.value) return [];
        const world = engine.value.world;

        return visibleEntities.value
            .filter((entityId) => {
                const transform = getComponent<Transform>(world, entityId, TRANSFORM_ID);
                const currentParentId = transform?.parent ?? null;
                return currentParentId === parentId;
            })
            .map((entityId) => {
                const nameComponent = getComponent<Name>(world, entityId, NAME_ID);
                const children = buildHierarchyLevels(entityId);

                const node: HierarchyItem = {
                    id: entityId,
                    label: nameComponent?.value || `GameObject #${entityId}`,
                    children: children.length > 0 ? children : undefined,
                    defaultExpanded: true,
                    value: entityId.toString()
                };

                // Store in cache for the selection 'get' method
                entityToNodeCache.set(entityId, node);

                return node;
            });
    };

    /**
     * Reactive tree structure for the UTree component.
     * Clears the cache on each re-calculation to avoid stale references.
     */
    const hierarchyItems = computed(() => {
        entityToNodeCache.clear();
        return buildHierarchyLevels(null);
    });

    /**
     * Bridge between the Engine's numerical ID selection and the UI's object-based selection.
     */
    const selectionBridge = computed({
        get: () => {
            if (selectedEntityId.value === null) {
                return undefined;
            }
            return entityToNodeCache.get(selectedEntityId.value);
        },
        set: (incomingSelection: HierarchyItem | undefined) => {
            if (!incomingSelection) {
                selectedEntityId.value = null;
            } else {
                selectedEntityId.value = incomingSelection.id;
            }
        }
    });

    return {
        items: hierarchyItems,
        count: computed(() => visibleEntities.value.length),
        selection: selectionBridge,
        selectedEntityId
    };
};