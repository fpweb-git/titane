<template>
    <div class="flex items-center justify-between gap-2">
        <UUser
            size="sm"
            :name="`Entity #${selectedEntityId}`"
            description="GameObject"
            :avatar="{
                icon: 'i-lucide-box'
            }" />
        <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            size="sm" />
    </div>
</template>

<script setup lang="ts">
import { useTitane } from '../../composables/useTitane';

const { selectedEntityId } = useTitane();
</script>