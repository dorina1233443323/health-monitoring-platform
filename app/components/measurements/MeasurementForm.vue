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

interface MeasurementFormData {
  type: string;
  value: number;
  unit: string;
  measuredAt: string;
}

interface MeasurementFormValues {
  type: string;
  value: string;
  unit: string;
  measuredAt: string;
}

const { loading, error, initialFormData } = defineProps<{
  loading: boolean;
  error?: string | null;
  initialFormData?: MeasurementFormData | null;
}>();

const emit = defineEmits<{
  submit: [data: MeasurementFormData];
}>();

defineSlots<{
  title(): unknown;
  buttonName(): unknown;
}>();

const schema = toTypedSchema(
  z.object({
    type: z.string().trim().min(1, "Tipul măsurătorii este obligatoriu"),
    value: z.coerce
      .string()
      .trim()
      .min(1, "Valoarea este obligatorie")
      .regex(/^\d*\.?\d*$/, "Valoarea trebuie să fie un număr"),
    unit: z.string().trim().min(1, "Unitatea este obligatorie"),
    measuredAt: z.string().trim().min(1, "Data măsurătorii este obligatorie"),
  }),
);

const { handleSubmit, setValues, handleReset } = useForm<MeasurementFormValues>(
  {
    validationSchema: schema,
    initialValues: {
      type: "",
      value: "",
      unit: "",
      measuredAt: "",
    },
  },
);

watch(
  () => initialFormData,
  (data) => {
    if (!data) return;

    setValues(
      {
        type: data.type ?? "",
        value: data.value?.toString() ?? "",
        unit: data.unit ?? "",
        measuredAt: data.measuredAt ?? "",
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
  value,
  errorMessage: valueError,
  setTouched: setValueTouched,
} = useField<string>("value");

const {
  value: unit,
  errorMessage: unitError,
  setTouched: setUnitTouched,
} = useField<string>("unit");

const {
  value: measuredAt,
  errorMessage: measuredAtError,
  setTouched: setMeasuredAtTouched,
} = useField<string>("measuredAt");

const submitError = ref<string | null>(null);

const handleFormSubmit = handleSubmit(() => {
  submitError.value = null;

  emit("submit", {
    type: type.value,
    value: Number(value.value),
    unit: unit.value,
    measuredAt: measuredAt.value,
  });
});

function resetForm() {
  handleReset();

  setValues(
    {
      type: initialFormData?.type ?? "",
      value: initialFormData?.value?.toString() ?? "",
      unit: initialFormData?.unit ?? "",
      measuredAt: initialFormData?.measuredAt ?? "",
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
                      Tip măsurătoare
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
                    <FieldLabel for="value" class="text-white">
                      Valoare
                    </FieldLabel>

                    <Input
                      id="value"
                      v-model="value"
                      :disabled="loading"
                      type="number"
                      step="0.01"
                      class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                      placeholder="Ex: 120"
                      @input="setValueTouched(true)"
                    />

                    <FieldError
                      v-if="valueError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ valueError }}
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
                      placeholder="Ex: mmHg, bpm, kg, mg/dL"
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
                    <FieldLabel for="measuredAt" class="text-white">
                      Data măsurătorii
                    </FieldLabel>

                    <Input
                      id="measuredAt"
                      v-model="measuredAt"
                      :disabled="loading"
                      type="datetime-local"
                      class="border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                      @input="setMeasuredAtTouched(true)"
                    />

                    <FieldError
                      v-if="measuredAtError"
                      class="mt-1 text-xs font-medium text-red-400"
                    >
                      {{ measuredAtError }}
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
