<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable>
            <template #header>
                <h2 class="text-sm font-bold flex items-center gap-2">
                    <UIcon name="i-lucide-box" />
                    Titane
                </h2>
            </template>
            <SidebarHierarchy />
        </UDashboardSidebar>
        <slot />
        <UDashboardSidebar side="right" collapsible resizable>
            <template #header>
                <h2 class="text-sm font-bold flex items-center gap-2">
                    <UIcon name="i-lucide-settings" />
                    Inspector
                </h2>
            </template>
            <Inspector />
        </UDashboardSidebar>
    </UDashboardGroup>
</template>