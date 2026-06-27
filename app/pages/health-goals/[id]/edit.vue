<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import HealthGoalForm from "~/components/health-goals/HealthGoalsForm.vue";

definePageMeta({
  name: "EditHealthGoal",
});

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

interface HealthGoalResponse {
  goal: HealthGoalFormData;
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
} = await useFetch<HealthGoalResponse>(`/api/health-goals/${id}`);

const formData = computed<HealthGoalFormData>(() => ({
  type: data.value?.goal.type ?? "",
  targetValue: data.value?.goal.targetValue ?? null,
  startValue: data.value?.goal.startValue ?? null,
  unit: data.value?.goal.unit ?? "",
  direction: data.value?.goal.direction ?? "increase",
  startDate: data.value?.goal.startDate ?? "",
  endDate: data.value?.goal.endDate ?? "",
  status: data.value?.goal.status ?? "active",
}));

const healthGoalForm = useTemplateRef("health-goal-form");

async function editHealthGoal(formData: HealthGoalFormData) {
  mutationLoading.value = true;
  mutationError.value = null;

  try {
    await $fetch(`/api/health-goals/${id}`, {
      method: "PATCH",
      body: formData,
    });

    await refresh();

    toast.success("Obiectivul a fost editat cu succes.");

    await router.push({
      name: "ViewHealthGoal",
      params: { id },
    });
  } catch {
    mutationError.value = "Obiectivul nu a putut fi editat.";
    toast.error("A apărut o eroare la editarea obiectivului.");
  } finally {
    mutationLoading.value = false;
  }
}
</script>

<template>
  <HealthGoalForm
    v-if="!queryLoading && data?.goal"
    ref="health-goal-form"
    :loading="mutationLoading || queryLoading"
    :error="mutationError || queryError?.message"
    :initial-form-data="formData"
    @submit="editHealthGoal"
  >
    <template #title> Editează obiectiv </template>

    <template #buttonName>
      {{ mutationLoading ? "Se editează..." : "Editează" }}
    </template>
  </HealthGoalForm>

  <main
    v-else
    class="flex min-h-dvh items-center justify-center bg-neutral-950 text-white"
  >
    <p class="text-neutral-400">Se încarcă...</p>
  </main>
</template>
