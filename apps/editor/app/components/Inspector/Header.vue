<template>
    <div class="flex items-center justify-between gap-2">
        <UUser
            size="sm"
            :name="`Entity #${selectedEntityId}`"
            description="GameObject"
            :avatar="{
                icon: 'i-lucide-box'
            }" />
        <UDropdownMenu :items="dropdownitems" size="sm">
            <UButton
                icon="i-lucide-ellipsis"
                color="neutral"
                variant="ghost"
                size="sm" />
        </UDropdownMenu>
    </div>
</template>

<script setup lang="ts">
import { useTitane } from '../../composables/useTitane';
import { useInspectorActions } from '../../composables/inspector/useInspectorActions';

const { selectedEntityId } = useTitane();
const { deleteSelectedEntity, duplicateSelectedEntity } = useInspectorActions();

const dropdownitems = computed(() => [
    [
        {
            label: 'Duplicate',
            icon: 'i-lucide-copy',
            onSelect: duplicateSelectedEntity
        },
        {
            label: 'Delete',
            icon: 'i-lucide-trash',
            color: 'danger' as const,
            onSelect: deleteSelectedEntity
        }
    ]
]);
</script>