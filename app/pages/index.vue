<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

definePageMeta({
    name: 'LandingPage'
})

const features = [
    { id: 1, name: 'Monitorizare', description: 'Monitorizarea datelor de sănătate ale pacienților' },
    { id: 2, name: 'Gestionarea', description: 'Gestionarea pacienților și a dispozitivelor medicale' },
    { id: 4, name: 'Vizualizarea', description: 'Vizualizarea istoricului valorilor înregistrate' }

]
</script>

<template>
    <main class="min-h-screen bg-neutral-950 text-white">
        <section class="mx-auto max-w-7xl px-4 py-15 sm:px-6 lg:px-8">
            <div class="max-w-3xl">
                <p class="mb-4 text-sm font-medium uppercase tracking-wide text-emerald-400">
                    Platformă medicală digitală
                </p>
                <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
                    VitalCare — Platformă de monitorizare a sănătății
                </h1>
                <p class="mt-6 text-lg leading-8 text-neutral-300">
                    VitalCare este o platformă digitală destinată monitorizării stării de
                    sănătate a pacienților prin colectarea și afișarea datelor medicale
                    relevante într-un mod simplu și accesibil.
                </p>
                <div class="mt-8 flex gap-4">
                    <Button variant="outline" as-child
                        class="border-white/20 bg-transparent text-white hover:bg-white hover:text-neutral-950">
                        <NuxtLink :to="{ name: 'Register' }">Creează un cont</NuxtLink>
                    </Button>
                </div>
            </div>
        </section>

        <section class="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-1.5">
                <h1 class="mt-6 text-4xl pb-4 font-semibold leading-8">
                    Ce vă oferim:
                </h1>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card v-for="feature in features" :key="feature.id"
                        class="border-neutral-800 bg-neutral-900 text-white">
                        <CardHeader>
                            <CardTitle class="text-base">
                                {{ feature.name }}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p class="text-sm text-neutral-400">
                                {{ feature.description }}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </main>
</template>
