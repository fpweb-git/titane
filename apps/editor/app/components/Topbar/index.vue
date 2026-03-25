<template>
    <UDashboardNavbar>
        <template #right>
            <UButton
                :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="togglePlay" />
            <UButton
                :icon="isGridVisible ? 'i-lucide-grid-2x2-x' : 'i-lucide-grid-2x2'"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="toggleGrid" />
            <TopbarMenu />
        </template>
    </UDashboardNavbar>
</template>

<script setup lang="ts">
const { isPlaying, togglePlay, isGridVisible, toggleGrid } = useRuntime();
</script>