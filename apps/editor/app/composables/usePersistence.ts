import { serializeWorld, deserializeWorld, type SerializedWorld } from '@titane/core';
import { useTitane } from './useTitane';

export const usePersistence = () => {
    const { engine, syncWorld } = useTitane();

    /**
     * Exports the current scene as a .titane file.
     */
    const saveToDisk = (fileName = 'scene-alpha.titane') => {
        if (!engine.value) return;

        const data = serializeWorld(engine.value.world);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(url);
    };

    /**
     * Loads a .titane file and overwrites the current world.
     */
    const loadFromDisk = async (file: File) => {
        if (!engine.value) return;

        const text = await file.text();
        const data = JSON.parse(text) as SerializedWorld;

        // Overwrite the world instance in the engine
        engine.value.world = deserializeWorld(data);

        // Force the editor UI to refresh the Hierarchy and Inspector
        syncWorld();
    };

    return { saveToDisk, loadFromDisk };
};