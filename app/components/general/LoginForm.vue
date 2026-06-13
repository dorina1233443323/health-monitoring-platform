<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormData {
  email: string,
  password: string
}

const { loading, error, initialFormData } = defineProps<{
  loading: boolean
  error?: string | null
  initialFormData?: FormData | null
}>()

const emit = defineEmits<{
  submit: [data: FormData]
}>()

const localEmail = ref<string | null>(null)
const localPassword = ref<string | null>(null)

const formEmail = computed({
  get: () => localEmail.value ?? initialFormData?.email ?? '',
  set: (value) => (localEmail.value = value),
})

const formPassword = computed({
  get: () => localPassword.value ?? initialFormData?.password ?? '',
  set: (value) => (localPassword.value = value),
})
const isFormValid = computed(() => {
  return (
    formEmail.value.trim() !== '' &&
    formPassword.value.trim() !== ''
  )
})

const messageError = ref(false)

watch(isFormValid, (valid) => {
  if (valid) {
    messageError.value = false
  }
})
function submitForm() {
  if (!isFormValid.value) {
    messageError.value = true
    return
  }
  messageError.value = false
  emit('submit', {
    email: formEmail.value,
    password: formPassword.value,
  })
}
</script>

<template>
  <main class="min-h-screen bg-neutral-950 text-white">
    <section class="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-15 sm:px-6 lg:px-8">
      <div :class="cn('w-full max-w-md flex flex-col gap-6')">
        <Card class="border-neutral-800 bg-neutral-900 text-white shadow-xl">
          <CardHeader class="space-y-2 text-center">
            <p class="text-sm font-medium uppercase tracking-wide text-emerald-400">
              VitalCare
            </p>
            <CardTitle class="text-3xl font-bold tracking-tight">Logare</CardTitle>
            <CardDescription class="text-neutral-400">
              Introduce-ți-vă datele
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="submitForm">
              <FieldGroup>
                <Field>
                  <FieldLabel for="email" class="text-neutral-200">
                    Email
                  </FieldLabel>
                  <Input id="email" type="email" v-model="formEmail" placeholder="email@exemplu.com"
                    class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" required />
                </Field>
                <Field>
                  <div class="flex items-center">
                    <FieldLabel for="password" class="text-neutral-200">
                      Parola
                    </FieldLabel>
                  </div>
                  <Input id="password" type="password" v-model="formPassword" placeholder="Parola dvs."
                    class="border-neutral-700 bg-neutral-950 text-white" required />
                </Field>
                <Field>
                  <p v-if="messageError" class="text-red-500">Trebuie să completați tot.</p>
                </Field>
                <Field>
                  <Button type="submit" class="w-full bg-emerald-500 text-neutral-950 hover:bg-emerald-400"> Login
                  </Button>
                  <FieldDescription class="text-center">
                    Nu aveți un cont?
                    <Button asChild variant="default"
                      class="text-emerald-400 underline-offset-4 hover:bg-emerald-300 hover:underline">
                      <NuxtLink :to="{ name: 'Register' }">Înregistrare</NuxtLink>
                    </Button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <div v-if="error">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              <p>{{ error }}</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  </main>
</template>
