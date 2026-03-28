import { serializeWorld, deserializeWorld, createWorld, type SerializedWorld } from '@titane/core';
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

    /**
     * Serializes the current world and saves it to local storage.
     */
    const autoSaveToStorage = () => {
        if (!engine.value) return;
        try {
            const data = serializeWorld(engine.value.world);
            localStorage.setItem('titane_autosave_buffer', JSON.stringify(data));
        } catch (error) {
            console.error('[Titane] Failed to auto-save to local storage.', error);
        }
    };

    /**
     * Tries to restore the world from local storage.
     * Returns true if successfully restored, false otherwise.
     */
    const loadFromStorage = (): boolean => {
        if (!engine.value) return false;

        const stored = localStorage.getItem('titane_autosave_buffer');
        if (!stored) return false;

        try {
            const data = JSON.parse(stored) as SerializedWorld;
            engine.value.world = deserializeWorld(data);
            syncWorld();
            console.log('[Titane] Session recovered from local storage.');
            return true;
        } catch (error) {
            console.error('[Titane] Failed to recover session. Corrupted data.', error);
            clearStorage();
            engine.value.world = createWorld();
            syncWorld();
            return false;
        }
    };

    /**
     * Removes the auto-save backup from local storage.
     */
    const clearStorage = () => {
        localStorage.removeItem('titane_autosave_buffer');
    };

    return { 
        saveToDisk, 
        loadFromDisk,
        autoSaveToStorage,
        loadFromStorage,
        clearStorage
    };
};