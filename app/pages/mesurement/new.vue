<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { toast } from 'vue-sonner'

import MeasurementForm from '~/components/measurements/MeasurementForm.vue'

definePageMeta({
    name: 'CreateMeasurement',
})

interface MeasurementFormData {
    type: string
    value: number
    unit: string
    measuredAt: string
}

const loading = ref(false)
const error = ref<string | null>(null)

const measurementForm = useTemplateRef('measurement-form')

async function createMeasurement(data: MeasurementFormData) {
    loading.value = true
    error.value = null

    try {
        await $fetch('/api/measurements', {
            method: 'POST',
            body: data,
        })
        toast.success('Măsurătoarea a fost creată cu succes.')
        measurementForm.value?.resetForm()
    } catch {
        error.value = 'A apărut o eroare la crearea măsurătorii.'
        toast.error('A apărut o eroare la crearea măsurătorii.')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <MeasurementForm ref="measurement-form" :loading="loading" :error="error" @submit="createMeasurement">
        <template #title>
            Adaugă măsurătoare
        </template>

        <template #buttonName>
            {{ loading ? 'Se salvează...' : 'Salvează' }}
        </template>
    </MeasurementForm>
</template>