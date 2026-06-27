<script setup lang="ts">
import { useTemplateRef } from "vue";
import { toast } from "vue-sonner";

import HealthGoalForm from "~/components/health-goals/HealthGoalsForm.vue";

definePageMeta({
  name: "CreateHealthGoal",
});

interface HealthGoalFormData {
  type: string
  targetValue: number | null
  startValue: number | null
  unit: string
  direction: 'increase' | 'decrease' | 'maintain'
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'cancelled'
}

const loading = ref(false);
const error = ref<string | null>(null);

const healthGoalForm = useTemplateRef("health-goal-form");

async function createHealthGoal(data: HealthGoalFormData) {
  loading.value = true;
  error.value = null;

  try {
    await $fetch("/api/health-goals", {
      method: "POST",
      body: data,
    });

    toast.success("Obiectivul a fost creat cu succes.");
    healthGoalForm.value?.resetForm();
  } catch {
    error.value = "A apărut o eroare la crearea obiectivului.";
    toast.error("A apărut o eroare la crearea obiectivului.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <HealthGoalForm
    ref="health-goal-form"
    :loading="loading"
    :error="error"
    @submit="createHealthGoal"
  >
    <template #title> Creează obiectiv </template>

    <template #buttonName>
      {{ loading ? "Se salvează..." : "Salvează" }}
    </template>
  </HealthGoalForm>
</template>
