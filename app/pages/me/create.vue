<script setup lang="ts">
import PatientForm from '~/components/patient/PatientForm.vue'

definePageMeta({
    name: 'PatientProfileCreate',
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

const { data: profile } = await useFetch('/api/me/patient-profile')

if (profile.value) {
    await navigateTo({ name: 'PatientProfileEdit' })
}

async function handleSubmit(data: PatientProfileFormData) {
    loading.value = true
    error.value = null

    try {
        await $fetch('/api/me/patient-profile', {
            method: 'POST',
            body: data,
        })

        await navigateTo({ name: 'PatientProfile' })
    } catch {
        error.value = 'Profilul nu a putut fi creat.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <PatientForm :loading="loading" :error="error" mode="create" @submit="handleSubmit" />
</template>