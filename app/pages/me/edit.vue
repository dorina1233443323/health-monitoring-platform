<script setup lang="ts">
import PatientForm from '~/components/patient/PatientForm.vue'

definePageMeta({
    name: 'PatientProfileEdit',
})

interface PatientProfileFormData {
    birthDate: string
    sex: 'male' | 'female' | 'other' | ''
    heightCm: number | null
    weightKg: number | null
    phone: string
    address: string
    emergencyContactName: string
    emergencyContactPhone: string
}

const loading = ref(false)
const error = ref<string | null>(null)

const { data: profile } = await useFetch<PatientProfileFormData | null>(
    '/api/me/patient-profile'
)

if (!profile.value) {
    await navigateTo({ name: 'PatientProfileCreate' })
}

async function handleSubmit(data: PatientProfileFormData) {
    loading.value = true
    error.value = null

    try {
        await $fetch('/api/me/patient-profile', {
            method: 'PATCH',
            body: data,
        })

        await navigateTo({ name: 'PatientProfile' })
    } catch {
        error.value = 'Profilul nu a putut fi actualizat.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <PatientForm v-if="profile" :loading="loading" :error="error" :initial-form-data="profile" mode="edit"
        @submit="handleSubmit" />
</template>