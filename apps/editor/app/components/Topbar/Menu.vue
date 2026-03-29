<template>
    <UDropdownMenu :items="dropDownItems" size="xs">
        <UButton icon="i-lucide-menu" color="neutral" variant="outline" size="xs" />
    </UDropdownMenu>
    <!-- Hidden file input for loading projects -->
    <input
        ref="fileInput"
        type="file"
        accept=".titane"
        class="hidden"
        @change="onFileSelected" />
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { saveToDisk, loadFromDisk } = usePersistence();

const fileInput = ref<HTMLInputElement | null>(null);

const dropDownItems = ref<DropdownMenuItem[][]>([
    [{
        label: 'New Scene',
        icon: 'i-lucide-file-plus',
        onSelect: () => {
            if (confirm('Create new scene? All unsaved changes will be lost.')) {
                window.location.reload(); // Simple reset for now
            }
        }
    }],
    [{
        label: 'Open Project...',
        icon: 'i-lucide-folder-open',
        slot: 'open',
        onSelect: () => fileInput.value?.click()
    },
    {
        label: 'Save Project',
        icon: 'i-lucide-save',
        shortcuts: ['⌘', 'S'],
        onSelect: () => saveToDisk('my-project.titane')
    }]
])

/**
 * Triggered when the user selects a .titane file.
 */
const onFileSelected = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        await loadFromDisk(target.files[0]);
        // Reset the input so the same file can be re-imported if needed
        target.value = '';
    }
};
</script>