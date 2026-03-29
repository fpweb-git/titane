<template>
    <main class="flex flex-col h-screen">
        <TopbarMain />
        <!-- Editor Layout -->
        <div class="flex justify-between w-full h-full">
            <!-- Hierarchy Sidebar -->
            <USidebar side="left" :rail="true" :ui="{ body: 'p-0' }">
                <SidebarHierarchy />
            </USidebar>

            <!-- Canvas -->
            <div class="flex flex-col w-full h-full">
                <TopbarCanvas />
                <slot />
            </div>
            <!-- Inspector Sidebar -->
            <USidebar side="right" :rail="true">
                <template #header class="min-h-2 py-0">
                    <h2 class="text-xs text-muted">
                        Inspector
                    </h2>
                </template>
                <Inspector />
            </USidebar>
        </div>
    </main>
</template>

<script setup lang="ts">
const { isPlaying, togglePlay } = useRuntime();
</script>