<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

import MeasurementForm from '~/components/measurements/MeasurementForm.vue'

definePageMeta({
    name: 'EditMeasurement',
})

interface MeasurementFormData {
    type: string
    value: number
    unit: string
    measuredAt: string
}

const route = useRoute()
const id = route.params.id

const mutationLoading = ref(false)
const mutationError = ref<string | null>(null)

const {
    data: measurement,
    pending: queryLoading,
    error: queryError,
    refresh,
} = await useFetch<MeasurementFormData | null>(`/api/measurements/${id}`)

const formData = computed(() => ({
    type: measurement.value?.type ?? '',
    value: measurement.value?.value ?? 0,
    unit: measurement.value?.unit ?? '',
    measuredAt: measurement.value?.measuredAt ?? '',
}))

const measurementForm = useTemplateRef('measurement-form')

async function editMeasurement(data: MeasurementFormData) {
    mutationLoading.value = true
    mutationError.value = null

    try {
        await $fetch(`/api/measurements/${id}`, {
            method: 'PATCH',
            body: data,
        })

        await refresh()
        measurementForm.value?.resetForm()

        toast.success('Măsurătoarea a fost editată cu succes.')
    } catch {
        mutationError.value = 'Măsurătoarea nu a putut fi editată.'
        toast.error('A apărut o eroare la editarea măsurătorii.')
    } finally {
        mutationLoading.value = false
    }
}
</script>

<template>
    <MeasurementForm ref="measurement-form" :loading="mutationLoading || queryLoading"
        :error="mutationError || queryError?.message" :initial-form-data="formData" @submit="editMeasurement">
        <template #title>
            Editează măsurătoare
        </template>

        <template #buttonName>
            {{ mutationLoading ? 'Se editează...' : 'Editează' }}
        </template>
    </MeasurementForm>
</template>