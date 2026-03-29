<template>
    <UHeader>
        <template #title>
            <Logo class="h-4 w-auto" />
        </template>
        <template #right>
            <UColorModeButton size="xs" />
            <TopbarMenu />
        </template>
    </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Docs',
        to: '/docs/getting-started',
        active: route.path.startsWith('/docs/getting-started')
    }
])

</script>