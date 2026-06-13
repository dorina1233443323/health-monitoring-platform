<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
    password: string,
    first_name: string,
    last_name: string
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
const localFirstName = ref<string | null>(null)
const localLastName = ref<string | null>(null)

const formEmail = computed({
    get: () => localEmail.value ?? initialFormData?.email ?? '',
    set: (value) => (localEmail.value = value),
})

const formPassword = computed({
    get: () => localPassword.value ?? initialFormData?.password ?? '',
    set: (value) => (localPassword.value = value),
})

const formFirstName = computed({
    get: () => localFirstName.value ?? initialFormData?.first_name ?? '',
    set: (value) => (localFirstName.value = value),
})

const formLastName = computed({
    get: () => localLastName.value ?? initialFormData?.last_name ?? '',
    set: (value) => (localLastName.value = value),
})

const isFormValid = computed(() => {
    return (
        formEmail.value.trim() !== '' &&
        formPassword.value.trim() !== '' &&
        formFirstName.value.trim() !== '' &&
        formLastName.value.trim() !== ''
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
        first_name: formFirstName.value,
        last_name: formLastName.value,
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
                        <CardTitle class="text-3xl font-bold tracking-tight">Înregistrare</CardTitle>
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
                                    <Input id="email" type="email" placeholder="email@exemplu.com" v-model="formEmail"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                                        required />
                                </Field>

                                <Field>
                                    <FieldLabel for="password" class="text-neutral-200">
                                        Parola
                                    </FieldLabel>
                                    <Input id="password" type="password" v-model="formPassword"
                                        placeholder="Parola dvs."
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                                        required />
                                </Field>

                                <Field>
                                    <FieldLabel for="last_name" class="text-neutral-200">
                                        Nume
                                    </FieldLabel>
                                    <Input id="last_name" type="text" v-model="formLastName" placeholder="Cornescu"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                                        required />
                                </Field>

                                <Field>
                                    <FieldLabel for="first_name" class="text-neutral-200">
                                        Prenume
                                    </FieldLabel>
                                    <Input id="first_name" type="text" v-model="formFirstName" placeholder="Ion"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                                        required />
                                </Field>
                                <Field>
                                    <p v-if="messageError" class="text-red-500">Trebuie să completați tot.</p>
                                </Field>
                                <Field>
                                    <Button type="submit" :disabled="loading"
                                        class="w-full bg-emerald-500 text-neutral-950 hover:bg-emerald-400">
                                        Înregistrare
                                    </Button>
                                    <FieldDescription class="text-center">
                                        Aveți deja un cont?
                                        <Button asChild
                                            class="text-emerald-400 underline-offset-4 hover:bg-emerald-300 hover:underline">
                                            <NuxtLink :to="{ name: 'Login' }">Logare</NuxtLink>
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
