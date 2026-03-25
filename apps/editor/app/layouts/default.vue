<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable>
            <template #header>
                <h2 class="text-sm font-bold flex items-center gap-2">
                    <UIcon name="i-lucide-file-stack" />
                    Titane
                </h2>
            </template>
            <SidebarHierarchy />
        </UDashboardSidebar>

        <div class="flex flex-col">
            <Topbar />
            <slot />
        </div>
        <UDashboardSidebar side="right" collapsible resizable class="border-l border-default">
            <template #header>
                <h2 class="text-sm">
                    Inspector
                </h2>
            </template>
            <USeparator />
            <Inspector />
        </UDashboardSidebar>
    </UDashboardGroup>
</template>

<script setup lang="ts">
const { isPlaying, togglePlay } = useRuntime();
</script>