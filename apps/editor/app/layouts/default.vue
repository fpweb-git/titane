<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable>
            <template #header>
                <h2 class="text-sm font-bold">Titane</h2>
            </template>
            <SidebarHierarchy />
        </UDashboardSidebar>
        <slot />
    </UDashboardGroup>
</template>