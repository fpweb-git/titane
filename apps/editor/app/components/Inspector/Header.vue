<template>
    <div class="flex items-center justify-between gap-2">
        <UUser
            size="sm"
            :name="`Entity #${selectedEntityId}`"
            description="GameObject"
            :avatar="{
                icon: 'i-lucide-box'
            }" />
        <UiEntityActions />
    </div>
</template>

<script setup lang="ts">
import { useTitane } from '../../composables/useTitane';

const { selectedEntityId } = useTitane();
</script>