<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";

const { id } = defineProps<{
  id: number;
}>();

const emit = defineEmits<{
  delete: [];
}>();

const loading = ref(false);

async function deleteHealthGoal() {
  const confirmed = window.confirm(
    "Sunteți sigur? Această acțiune nu poate fi anulată.",
  );

  if (!confirmed) return;

  loading.value = true;

  try {
    await $fetch(`/api/health-goals/${id}`, {
      method: "DELETE",
    });
    toast.success("Obiectivul a fost șters cu succes.");
    emit("delete");
  } catch (error) {
    console.error(error);
    toast.error("A apărut o eroare la ștergerea obiectivului.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Button variant="destructive" :disabled="loading" @click="deleteHealthGoal">
    {{ loading ? "Se șterge..." : "Șterge" }}
  </Button>
</template>
