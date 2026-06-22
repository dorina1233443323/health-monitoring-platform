<script setup lang="ts">
import { AlertCircleIcon } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'

import DeleteMeasurement from '~/components/measurements/DeleteMeasurement.vue'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

definePageMeta({
    name: 'ViewMeasurement',
})

interface Measurement {
    id: number
    type: string
    value: number
    unit: string
    measuredAt: string
    createdAt: string
}

const route = useRoute()
const router = useRouter()

const {
    data: measurement,
    pending: loading,
    error,
} = await useFetch<Measurement | null>(`/api/measurements/${route.params.id}`)

function redirectMeasurementsList() {
    router.replace({
        name: 'Measurements',
    })
}
</script>

<template>
    <main class="flex min-h-dvh flex-col items-center justify-center gap-6 bg-neutral-950 p-8 text-white">
        <div v-if="error || loading" class="flex w-full max-w-4xl flex-col gap-3">
            <div v-if="loading" class="max-w-md text-center text-neutral-400">
                <p>Se încarcă datele...</p>
            </div>

            <Alert v-if="error" variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Eroare!</AlertTitle>
                <AlertDescription>
                    <p>{{ error?.message }}</p>
                </AlertDescription>
            </Alert>
        </div>

        <div v-else-if="measurement" class="flex w-full max-w-4xl flex-col gap-3">
            <h1 class="text-left text-4xl font-semibold tracking-tight">
                Vizualizare măsurătoare
            </h1>

            <Card class="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl">
                <CardTitle class="px-6 pt-6 text-left text-2xl font-semibold tracking-tight">
                    Valoare
                </CardTitle>

                <CardContent>
                    <div class="flex gap-1.5 text-lg">
                        {{ measurement.value }} {{ measurement.unit }}
                    </div>
                </CardContent>
            </Card>

            <Card class="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl">
                <CardTitle class="px-6 pt-6 text-left text-2xl font-semibold tracking-tight">
                    Detalii
                </CardTitle>

                <CardContent class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                    <div class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
                        <h3 class="font-medium text-neutral-400">
                            Tip:
                        </h3>
                        <p class="text-base text-neutral-100">
                            {{ measurement.type }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
                        <h3 class="font-medium text-neutral-400">
                            Unitate:
                        </h3>
                        <p class="text-base text-neutral-100">
                            {{ measurement.unit }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
                        <h3 class="font-medium text-neutral-400">
                            Data măsurătorii:
                        </h3>
                        <p class="text-base text-neutral-100">
                            {{ measurement.measuredAt }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
                        <h3 class="font-medium text-neutral-400">
                            Creat la:
                        </h3>
                        <p class="text-base text-neutral-100">
                            {{ measurement.createdAt }}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div class="flex items-center justify-between gap-2">
                <Button asChild>
                    <RouterLink :to="{ name: 'Measurements' }">
                        Înapoi la listă
                    </RouterLink>
                </Button>

                <div class="flex justify-between gap-2">
                    <Button asChild>
                        <RouterLink :to="{
                            name: 'EditMeasurement',
                            params: { id: measurement.id },
                        }">
                            Editează
                        </RouterLink>
                    </Button>

                    <DeleteMeasurement :id="measurement.id" @delete="redirectMeasurementsList" />
                </div>
            </div>
        </div>
    </main>
</template>