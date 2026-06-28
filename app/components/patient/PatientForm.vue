<script setup lang="ts">
import { cn } from '@/lib/utils'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { watch } from 'vue'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

interface PatientProfileFormValues {
    birthDate: string
    sex: 'male' | 'female' | 'other' | ''
    heightCm: string
    weightKg: string
    phone: string
    address: string
    emergencyContactName: string
    emergencyContactPhone: string
}

const { loading, error, initialFormData } = defineProps<{
    loading: boolean
    error?: string | null
    initialFormData?: PatientProfileFormData | null
}>()

const emit = defineEmits<{
    submit: [data: PatientProfileFormData]
}>()

const schema = toTypedSchema(
    z.object({
        birthDate: z.string().trim().min(1, 'Data nașterii este obligatorie'),
        sex: z.enum(['male', 'female', 'other'], {
            message: 'Sexul este obligatoriu',
        }),
        heightCm: z.coerce
            .string()
            .trim()
            .regex(/^\d*\.?\d*$/, 'Înălțimea trebuie să fie un număr.')
            .optional(),
        weightKg: z.coerce
            .string()
            .trim()
            .regex(/^\d*\.?\d*$/, 'Greutatea trebuie să fie un număr.')
            .optional(),
        phone: z.string().trim().min(1, 'Telefonul este obligatoriu'),
        address: z.string().optional(),
        emergencyContactName: z.string().optional(),
        emergencyContactPhone: z.string().optional(),
    }),
)

const {
    defineField,
    handleSubmit,
    errors,
    handleReset,
    setValues,
} = useForm<PatientProfileFormValues>({
    validationSchema: schema,
    initialValues: {
        birthDate: '',
        sex: '',
        heightCm: '',
        weightKg: '',
        phone: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    },
})

const [birthDate] = defineField('birthDate')
const [sex] = defineField('sex')
const [heightCm] = defineField('heightCm')
const [weightKg] = defineField('weightKg')
const [phone] = defineField('phone')
const [address] = defineField('address')
const [emergencyContactName] = defineField('emergencyContactName')
const [emergencyContactPhone] = defineField('emergencyContactPhone')

watch(
    () => initialFormData,
    (data) => {
        if (!data) return

        setValues(
            {
                birthDate: data.birthDate ?? '',
                sex: data.sex ?? '',
                heightCm: data.heightCm?.toString() ?? '',
                weightKg: data.weightKg?.toString() ?? '',
                phone: data.phone ?? '',
                address: data.address ?? '',
                emergencyContactName: data.emergencyContactName ?? '',
                emergencyContactPhone: data.emergencyContactPhone ?? '',
            },
            false,
        )
    },
    { immediate: true },
)

const submitForm = handleSubmit((values) => {
    emit('submit', {
        birthDate: values.birthDate,
        sex: values.sex,
        heightCm: values.heightCm ? Number(values.heightCm) : null,
        weightKg: values.weightKg ? Number(values.weightKg) : null,
        phone: values.phone,
        address: values.address ?? '',
        emergencyContactName: values.emergencyContactName ?? '',
        emergencyContactPhone: values.emergencyContactPhone ?? '',
    })
})

function resetForm() {
    handleReset()
    setValues(
        {
            birthDate: initialFormData?.birthDate ?? '',
            sex: initialFormData?.sex ?? '',
            heightCm: initialFormData?.heightCm?.toString() ?? '',
            weightKg: initialFormData?.weightKg?.toString() ?? '',
            phone: initialFormData?.phone ?? '',
            address: initialFormData?.address ?? '',
            emergencyContactName: initialFormData?.emergencyContactName ?? '',
            emergencyContactPhone: initialFormData?.emergencyContactPhone ?? '',
        },
        false,
    )
}

defineExpose({
    resetForm,
})
</script>

<template>
    <main class="min-h-screen bg-neutral-950 text-white">
        <section class="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-15">
            <div :class="cn('w-full max-w-xl flex flex-col gap-6')">
                <Card class="border-neutral-800 bg-neutral-900 text-white shadow-xl">
                    <CardHeader class="text-center">
                        <p class="text-sm font-medium uppercase tracking-wide text-emerald-400">
                            VitalCare
                        </p>

                        <CardTitle class="text-3xl font-bold">
                            Profil pacient
                        </CardTitle>

                        <CardDescription class="text-neutral-400">
                            Completați informațiile personale
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form @submit.prevent="submitForm">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel class="text-white">Data nașterii *</FieldLabel>
                                    <Input v-model="birthDate" type="date"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" />
                                    <p v-if="errors.birthDate" class="text-sm text-red-500">
                                        {{ errors.birthDate }}
                                    </p>
                                </Field>

                                <Field>
                                    <FieldLabel class="text-white">Sex *</FieldLabel>

                                    <select v-model="sex"
                                        class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white">
                                        <option value="">Selectați</option>
                                        <option value="male">Masculin</option>
                                        <option value="female">Feminin</option>
                                        <option value="other">Altul</option>
                                    </select>

                                    <p v-if="errors.sex" class="text-sm text-red-500">
                                        {{ errors.sex }}
                                    </p>
                                </Field>

                                <Field>
                                    <FieldLabel class="text-white">Înălțime (cm)</FieldLabel>
                                    <Input v-model="heightCm" type="number"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" />
                                    <p v-if="errors.heightCm" class="text-sm text-red-500">
                                        {{ errors.heightCm }}
                                    </p>
                                </Field>

                                <Field>
                                    <FieldLabel class="text-white">Greutate (kg)</FieldLabel>
                                    <Input v-model="weightKg" type="number"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" />
                                    <p v-if="errors.weightKg" class="text-sm text-red-500">
                                        {{ errors.weightKg }}
                                    </p>
                                </Field>

                                <Field>
                                    <FieldLabel class="text-white">Telefon *</FieldLabel>
                                    <Input v-model="phone" type="tel"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" />
                                    <p v-if="errors.phone" class="text-sm text-red-500">
                                        {{ errors.phone }}
                                    </p>
                                </Field>

                                <Field>
                                    <FieldLabel class="text-white">Adresă</FieldLabel>
                                    <Input v-model="address" type="text"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" />
                                </Field>

                                <Field>
                                    <FieldLabel class="text-white">Persoană contact urgență</FieldLabel>
                                    <Input v-model="emergencyContactName" type="text"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" />
                                </Field>

                                <Field>
                                    <FieldLabel class="text-white">Telefon contact urgență</FieldLabel>
                                    <Input v-model="emergencyContactPhone" type="tel"
                                        class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500" />
                                </Field>

                                <Field>
                                    <Button type="submit" :disabled="loading"
                                        class="w-full bg-emerald-500 text-neutral-950 hover:bg-emerald-400">
                                        {{ loading ? 'Se salvează...' : 'Salvează profilul' }}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                <p v-if="error" class="text-center text-red-500">
                    {{ error }}
                </p>
            </div>
        </section>
    </main>
</template>