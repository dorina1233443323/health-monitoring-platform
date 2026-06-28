<script setup lang="ts">
definePageMeta({ name: 'Register' })
import RegisterForm from "~/components/general/RegisterForm.vue"

interface FormData {
  email: string
  password: string
  first_name: string
  last_name: string
}

const loading = ref(false)
const error = ref<string | null>(null)

async function submitForm(data: FormData) {
  loading.value = true
  error.value = null
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: data,
    })
    await navigateTo({ name: 'Login' })
  } catch (err: any) {
    error.value =
      err?.data?.message ??
      'A apărut o eroare la înregistrare.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center bg-neutral-950">
    <div class="w-full max-w-lg">
      <RegisterForm :loading="loading" :error="error" @submit="submitForm" />
    </div>
  </div>
</template>