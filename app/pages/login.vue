<script setup lang="ts">
definePageMeta({
    name: 'Login',
})
import LoginForm from "~/components/general/LoginForm.vue"

interface FormData {
    email: string
    password: string
}
const { fetchUser, user } = useAuth()
const loading = ref(false)
const error = ref<string | null>(null)

async function submitForm(data: FormData) {
    loading.value = true
    error.value = null
    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: data,
        })
        await fetchUser()
        await navigateTo({ name: 'Home' })
    } catch (err: any) {
        error.value =
            err?.data?.message ??
            'A apărut o eroare la logare.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex items-center justify-center bg-neutral-950">
        <div class="w-full max-w-lg">
            <LoginForm :loading="loading" :error="error" @submit="submitForm" />
        </div>
    </div>
</template>