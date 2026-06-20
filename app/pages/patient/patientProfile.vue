<script setup lang="ts">
import PatientForm from '~/components/patient/PatientForm.vue'

definePageMeta({
    name: 'PatientProfile',
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

async function handleSubmit(data: PatientProfileFormData) {
    loading.value = true
    error.value = null

    try {
        console.log(data)

        // later:
        // await $fetch('/api/patient-profile', {
        //   method: 'POST',
        //   body: data,
        // })
    } catch {
        error.value = 'Profilul nu a putut fi salvat.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <PatientForm :loading="loading" :error="error" @submit="handleSubmit" />
</template>