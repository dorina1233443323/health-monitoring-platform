<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import MeasurementForm from "~/components/measurements/MeasurementForm.vue";

definePageMeta({
  name: "EditMeasurement",
});

interface MeasurementFormData {
  type: string;
  value: number;
  unit: string;
  measuredAt: string;
}

interface MeasurementResponse {
  measurement: MeasurementFormData;
}

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const mutationLoading = ref(false);
const mutationError = ref<string | null>(null);

const {
  data,
  pending: queryLoading,
  error: queryError,
  refresh,
} = await useFetch<MeasurementResponse>(`/api/measurements/${id}`);

const formData = computed<MeasurementFormData>(() => ({
  type: data.value?.measurement.type ?? "",
  value: data.value?.measurement.value ?? 0,
  unit: data.value?.measurement.unit ?? "",
  measuredAt: data.value?.measurement.measuredAt ?? "",
}));

const measurementForm = useTemplateRef("measurement-form");

async function editMeasurement(formData: MeasurementFormData) {
  mutationLoading.value = true;
  mutationError.value = null;

  try {
    await $fetch(`/api/measurements/${id}`, {
      method: "PATCH",
      body: formData,
    });

    await refresh();

    toast.success("Măsurătoarea a fost editată cu succes.");

    await router.push({
      name: "ViewMeasurement",
      params: { id },
    });
  } catch {
    mutationError.value = "Măsurătoarea nu a putut fi editată.";
    toast.error("A apărut o eroare la editarea măsurătorii.");
  } finally {
    mutationLoading.value = false;
  }
}
</script>

<template>
  <MeasurementForm
    v-if="!queryLoading && data?.measurement"
    ref="measurement-form"
    :loading="mutationLoading || queryLoading"
    :error="mutationError || queryError?.message"
    :initial-form-data="formData"
    @submit="editMeasurement"
  >
    <template #title> Editează măsurătoare </template>

    <template #buttonName>
      {{ mutationLoading ? "Se editează..." : "Editează" }}
    </template>
  </MeasurementForm>

  <main
    v-else
    class="flex min-h-dvh items-center justify-center bg-neutral-950 text-white"
  >
    <p class="text-neutral-400">Se încarcă...</p>
  </main>
</template>
