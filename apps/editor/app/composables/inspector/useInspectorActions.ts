import { destroyEntity, createEntity, addComponent, TRANSFORM_ID } from '@titane/core';
import { useTitane } from '../useTitane';

/**
 * Composable handling business logic for the Inspector actions
 * (Deletion, Duplication, etc.)
 */
export function useInspectorActions() {
    const { engine, selectedEntityId, syncWorld } = useTitane();

    /**
     * Removes the currently selected entity from the world
     */
    const deleteSelectedEntity = () => {
        if (!engine.value || selectedEntityId.value === null) return;

        destroyEntity(engine.value.world, selectedEntityId.value);

        // Reset selection and notify UI
        selectedEntityId.value = null;
        syncWorld();
    };

    /**
     * Clones the selected entity's data into a new one
     */
    const duplicateSelectedEntity = () => {
        if (!engine.value || selectedEntityId.value === null) return;

        const world = engine.value.world;
        const sourceId = selectedEntityId.value;
        const newId = createEntity(world);

        // Deep clone each component store entry
        world.components.forEach((store, componentId) => {
            const sourceData = store.get(sourceId);
            if (sourceData) {
                const clonedData = JSON.parse(JSON.stringify(sourceData));

                // Visual offset to distinguish the duplicate
                if (componentId === TRANSFORM_ID) {
                    clonedData.position.x += 1;
                }

                addComponent(world, newId, componentId, clonedData);
            }
        });

        // Focus the new entity and notify UI
        selectedEntityId.value = newId;
        syncWorld();
    };

    return {
        deleteSelectedEntity,
        duplicateSelectedEntity
    };
}