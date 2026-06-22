<script setup lang="ts">
import { AlertCircleIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'

import DeleteMeasurement from '~/components/measurements/DeleteMeasurement.vue'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

definePageMeta({
    name: 'Measurements',
})

interface Measurement {
    id: number
    type: string
    value: number
    unit: string
    measuredAt: string
    createdAt: string
}

const {
    data: measurements,
    pending: loading,
    error,
    refresh,
} = await useFetch<Measurement[]>('/api/measurements')
</script>

<template>
    <main class="mx-auto w-full max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
        <div class="flex w-full flex-col gap-6">
            <h1 class="text-left text-xl font-semibold tracking-tight">
                Măsurători
            </h1>

            <div v-if="loading || error" class="w-full">
                <p v-if="loading" class="max-w-md text-neutral-400">
                    Se încarcă datele...
                </p>

                <Alert v-if="error" variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Eroare!</AlertTitle>
                    <AlertDescription>
                        <p>{{ error?.message }}</p>
                    </AlertDescription>
                </Alert>
            </div>

            <div v-else class="overflow-hidden rounded-md border border-neutral-700">
                <div v-if="measurements?.length === 0">
                    <p class="w-full p-6 text-center text-neutral-400">
                        Nu există măsurători create.
                    </p>
                </div>

                <Table v-else class="w-full table-fixed">
                    <TableHeader class="bg-neutral-900">
                        <TableRow class="border-b border-neutral-700 hover:bg-transparent">
                            <TableHead class="h-12 w-1/5 px-4 text-left text-sm font-medium text-zinc-400">
                                Tip
                            </TableHead>

                            <TableHead class="h-12 w-1/5 px-4 text-center text-sm font-medium text-zinc-400">
                                Valoare
                            </TableHead>

                            <TableHead class="h-12 w-1/5 px-4 text-center text-sm font-medium text-zinc-400">
                                Unitate
                            </TableHead>

                            <TableHead class="h-12 w-1/5 px-4 text-center text-sm font-medium text-zinc-400">
                                Data măsurătorii
                            </TableHead>

                            <TableHead class="h-12 w-1/5 px-4 text-right text-sm font-medium text-zinc-400">
                                Acțiuni
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="text-start">
                        <TableRow v-for="measurement in measurements" :key="measurement.id"
                            class="border-b border-neutral-700/60 transition-colors hover:bg-zinc-900/30">
                            <TableCell class="p-4 text-sm font-medium">
                                {{ measurement.type }}
                            </TableCell>

                            <TableCell class="p-4 text-center text-sm">
                                {{ measurement.value }}
                            </TableCell>

                            <TableCell class="p-4 text-center text-sm">
                                {{ measurement.unit }}
                            </TableCell>

                            <TableCell class="p-4 text-center text-sm">
                                {{ measurement.measuredAt }}
                            </TableCell>

                            <TableCell class="flex items-center justify-end gap-2 p-4">
                                <Button asChild>
                                    <RouterLink :to="{
                                        name: 'EditMeasurement',
                                        params: { id: measurement.id },
                                    }">
                                        Editează
                                    </RouterLink>
                                </Button>

                                <DeleteMeasurement :id="measurement.id" @delete="refresh" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div class="flex gap-2 text-center">
                <Button asChild variant="default">
                    <RouterLink :to="{ name: 'CreateMeasurement' }">
                        Creează
                    </RouterLink>
                </Button>
            </div>
        </div>
    </main>
</template>