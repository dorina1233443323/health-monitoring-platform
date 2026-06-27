<script setup lang="ts">
import { AlertCircleIcon } from "@lucide/vue";
import { useField, useForm } from "vee-validate";
import { ref, watch } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { healthTypes, getUnitForType } from "~/utils/healthOptions";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface HealthGoalFormData {
  type: string;
  targetValue: number | null;
  startValue: number | null;
  unit: string;
  direction: "increase" | "decrease" | "maintain";
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
}

interface HealthGoalFormValues {
  type: string;
  targetValue: string;
  startValue: string;
  unit: string;
  direction: "increase" | "decrease" | "maintain";
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
}

const { loading, error, initialFormData } = defineProps<{
  loading: boolean;
  error?: string | null;
  initialFormData?: HealthGoalFormData | null;
}>();

const emit = defineEmits<{
  submit: [data: HealthGoalFormData];
}>();

defineSlots<{
  title(): unknown;
  buttonName(): unknown;
}>();

const schema = toTypedSchema(
  z.object({
    type: z.string().trim().min(1, "Tipul obiectivului este obligatoriu"),
    targetValue: z.coerce
      .string()
      .trim()
      .regex(/^\d*\.?\d*$/, "Valoarea țintă trebuie să fie un număr.")
      .optional(),
    startValue: z.coerce
      .string()
      .trim()
      .regex(/^\d*\.?\d*$/, "Valoarea inițială trebuie să fie un număr.")
      .optional(),
    unit: z.string().optional(),
    direction: z.enum(["increase", "decrease", "maintain"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(["active", "completed", "cancelled"]),
  }),
);

const { handleSubmit, setValues, handleReset } = useForm<HealthGoalFormValues>({
  validationSchema: schema,
  initialValues: {
    type: "",
    targetValue: "",
    startValue: "",
    unit: "",
    direction: "increase",
    startDate: "",
    endDate: "",
    status: "active",
  },
});

watch(
  () => initialFormData,
  (data) => {
    if (!data) return;

    setValues(
      {
        type: data.type ?? "",
        targetValue: data.targetValue?.toString() ?? "",
        startValue: data.startValue?.toString() ?? "",
        unit: data.unit ?? "",
        direction: data.direction ?? "increase",
        startDate: data.startDate ?? "",
        endDate: data.endDate ?? "",
        status: data.status ?? "active",
      },
      false,
    );
  },
  { immediate: true },
);

const {
  value: type,
  errorMessage: typeError,
  setTouched: setTypeTouched,
} = useField<string>("type");

const {
  value: targetValue,
  errorMessage: targetValueError,
  setTouched: setTargetValueTouched,
} = useField<string>("targetValue");

const {
  value: startValue,
  errorMessage: startValueError,
  setTouched: setStartValueTouched,
} = useField<string>("startValue");

const {
  value: unit,
  errorMessage: unitError,
  setTouched: setUnitTouched,
} = useField<string>("unit");

const {
  value: direction,
  errorMessage: directionError,
  setTouched: setDirectionTouched,
} = useField<"increase" | "decrease" | "maintain">("direction");

const {
  value: startDate,
  errorMessage: startDateError,
  setTouched: setStartDateTouched,
} = useField<string>("startDate");

const {
  value: endDate,
  errorMessage: endDateError,
  setTouched: setEndDateTouched,
} = useField<string>("endDate");

const {
  value: status,
  errorMessage: statusError,
  setTouched: setStatusTouched,
} = useField<"active" | "completed" | "cancelled">("status");

const submitError = ref<string | null>(null);

const handleFormSubmit = handleSubmit(() => {
  submitError.value = null;

  emit("submit", {
    type: type.value,
    targetValue: targetValue.value ? Number(targetValue.value) : null,
    startValue: startValue.value ? Number(startValue.value) : null,
    unit: unit.value,
    direction: direction.value,
    startDate: startDate.value,
    endDate: endDate.value,
    status: status.value,
  });
});

function resetForm() {
  handleReset();

  setValues(
    {
      type: initialFormData?.type ?? "",
      targetValue: initialFormData?.targetValue?.toString() ?? "",
      startValue: initialFormData?.startValue?.toString() ?? "",
      unit: initialFormData?.unit ?? "",
      direction: initialFormData?.direction ?? "increase",
      startDate: initialFormData?.startDate ?? "",
      endDate: initialFormData?.endDate ?? "",
      status: initialFormData?.status ?? "active",
    },
    false,
  );
}

watch(type, (newType) => {
  const defaultUnit = getUnitForType(newType);

  if (defaultUnit) {
    unit.value = defaultUnit;
  }
});

defineExpose({
  resetForm,
});
</script>

<template>
  <main
    class="flex min-h-dvh flex-col items-center justify-center gap-6 bg-neutral-950 p-8 text-white"
  >
    <div class="flex w-full max-w-md flex-col gap-3">
      <h1 class="text-center text-4xl font-semibold tracking-tight">
        <slot name="title"></slot>
      </h1>

      <Card
        class="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl"
      >
        <CardContent class="flex flex-col gap-6 p-6">
          <form @submit.prevent="handleFormSubmit">
            <FieldGroup>
              <FieldSet>
                <FieldGroup class="space-y-4">
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="type" class="text-white">
                      Tip obiectiv
                    </FieldLabel>

                    <select
                      id="type"
                      v-model="type"
                      :disabled="loading"
                      class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
                      @change="setTypeTouched(true)"
                    >
                      <option value="">Selectați tipul</option>
                      <option
                        v-for="item in healthTypes"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </option>
                    </select>

                    <FieldError
                      v-if="typeError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ typeError }}
                    </FieldError>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="startValue" class="text-white">
                      Valoare inițială
                    </FieldLabel>

                    <Input
                      id="startValue"
                      v-model="startValue"
                      :disabled="loading"
                      type="number"
                      step="0.01"
                      class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                      placeholder="Ex: 80"
                      @input="setStartValueTouched(true)"
                    />

                    <FieldError
                      v-if="startValueError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ startValueError }}
                    </FieldError>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="targetValue" class="text-white">
                      Valoare țintă
                    </FieldLabel>

                    <Input
                      id="targetValue"
                      v-model="targetValue"
                      :disabled="loading"
                      type="number"
                      step="0.01"
                      class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                      placeholder="Ex: 70"
                      @input="setTargetValueTouched(true)"
                    />

                    <FieldError
                      v-if="targetValueError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ targetValueError }}
                    </FieldError>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="unit" class="text-white">
                      Unitate
                    </FieldLabel>

                    <Input
                      id="unit"
                      v-model="unit"
                      :disabled="loading"
                      class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                      placeholder="Ex: kg, pași, mmHg"
                      @input="setUnitTouched(true)"
                    />

                    <FieldError
                      v-if="unitError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ unitError }}
                    </FieldError>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="direction" class="text-white">
                      Direcție obiectiv
                    </FieldLabel>

                    <select
                      id="direction"
                      v-model="direction"
                      :disabled="loading"
                      class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
                      @change="setDirectionTouched(true)"
                    >
                      <option value="increase">Creștere</option>
                      <option value="decrease">Scădere</option>
                      <option value="maintain">Menținere</option>
                    </select>

                    <FieldError
                      v-if="directionError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ directionError }}
                    </FieldError>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="startDate" class="text-white">
                      Data de început
                    </FieldLabel>

                    <Input
                      id="startDate"
                      v-model="startDate"
                      :disabled="loading"
                      type="date"
                      class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                      @input="setStartDateTouched(true)"
                    />

                    <FieldError
                      v-if="startDateError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ startDateError }}
                    </FieldError>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="endDate" class="text-white">
                      Data de final
                    </FieldLabel>

                    <Input
                      id="endDate"
                      v-model="endDate"
                      :disabled="loading"
                      type="date"
                      class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                      @input="setEndDateTouched(true)"
                    />

                    <FieldError
                      v-if="endDateError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ endDateError }}
                    </FieldError>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="status" class="text-white">
                      Status
                    </FieldLabel>

                    <select
                      id="status"
                      v-model="status"
                      :disabled="loading"
                      class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
                      @change="setStatusTouched(true)"
                    >
                      <option value="active">Activ</option>
                      <option value="completed">Completat</option>
                      <option value="cancelled">Anulat</option>
                    </select>

                    <FieldError
                      v-if="statusError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ statusError }}
                    </FieldError>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field class="flex gap-2 pt-2">
                <Button
                  :disabled="loading"
                  type="submit"
                  class="bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
                >
                  <slot name="buttonName"></slot>
                </Button>

                <Button
                  variant="outline"
                  :disabled="loading"
                  type="button"
                  @click="resetForm"
                >
                  Anulează
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <div v-if="error || submitError">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Eroare!</AlertTitle>
          <AlertDescription>
            <p>{{ error || submitError }}</p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  </main>
</template>
