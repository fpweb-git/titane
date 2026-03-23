import { TitaneEngine, ThreeRenderer, type Entity } from '@titane/core';
import { type ShallowRef } from 'vue';

const engineInstance = shallowRef<TitaneEngine | null>(null);
const isInitialized = ref(false);

/**
 * A reactive list of active entities.
 * We use shallowRef to avoid Vue's deep proxy overhead on the engine state.
 */
const activeEntities = shallowRef<Set<Entity>>(new Set());

const selectedEntityId = ref<Entity | null>(null);

export const useTitane = () => {

    const initEngine = (canvas: HTMLCanvasElement): TitaneEngine => {
        if (engineInstance.value) return engineInstance.value;

        const renderer = new ThreeRenderer();
        const engine = new TitaneEngine(renderer, canvas);
        engineInstance.value = engine;

        // Link our ref to the engine's active entities set
        activeEntities.value = engine.world.entities.active;
        isInitialized.value = true;

        return engine;
    };

    /**
     * Notifies Vue that the world state has changed.
     * Call this after adding/removing entities.
     */
    const syncWorld = () => {
        triggerRef(activeEntities);
    };

    return {
        engine: engineInstance,
        isInitialized,
        /** This ref updates only when syncWorld() is called */
        entities: activeEntities as ShallowRef<Set<Entity>>,
        selectedEntityId,
        initEngine,
        syncWorld
    };
};