<script setup lang="ts">
import { AlertCircleIcon } from "@lucide/vue";
import { useRoute, useRouter } from "vue-router";

import DeleteHealthGoal from "~/components/health-goals/DeleteHealthGoal.vue";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

definePageMeta({
  name: "ViewHealthGoal",
});

interface HealthGoal {
  id: number;
  type: string;
  targetValue: number | null;
  unit: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
}

const route = useRoute();
const router = useRouter();

const {
  data: healthGoal,
  pending: loading,
  error,
} = await useFetch<HealthGoal | null>(`/api/health-goals/${route.params.id}`);

const statusLabels = {
  active: "Activ",
  completed: "Completat",
  cancelled: "Anulat",
};

function redirectHealthGoalsList() {
  router.replace({
    name: "HealthGoals",
  });
}
</script>

<template>
  <main
    class="flex min-h-dvh flex-col items-center justify-center gap-6 bg-neutral-950 p-8 text-white"
  >
    <div v-if="error || loading" class="flex w-full max-w-4xl flex-col gap-3">
      <div v-if="loading" class="max-w-md text-center text-neutral-400">
        <p>Se încarcă datele...</p>
      </div>

      <Alert v-if="error" variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Eroare!</AlertTitle>
        <AlertDescription>
          <p>{{ error?.message }}</p>
        </AlertDescription>
      </Alert>
    </div>

    <div v-else-if="healthGoal" class="flex w-full max-w-4xl flex-col gap-3">
      <h1 class="text-left text-4xl font-semibold tracking-tight">
        {{ healthGoal.type }}
      </h1>

      <Card
        class="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl"
      >
        <CardTitle
          class="px-6 pt-6 text-left text-2xl font-semibold tracking-tight"
        >
          Valoare țintă
        </CardTitle>

        <CardContent>
          <div v-if="healthGoal.targetValue !== null" class="text-lg">
            {{ healthGoal.targetValue }}
            {{ healthGoal.unit ?? "" }}
          </div>

          <div v-else class="text-base text-neutral-100/50 italic">
            Nu a fost stabilită o valoare țintă.
          </div>
        </CardContent>
      </Card>

      <Card
        class="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl"
      >
        <CardTitle
          class="px-6 pt-6 text-left text-2xl font-semibold tracking-tight"
        >
          Detalii
        </CardTitle>

        <CardContent class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div
            class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <h3 class="font-medium text-neutral-400">Status</h3>

            <p class="text-base text-neutral-100">
              {{ statusLabels[healthGoal.status] }}
            </p>
          </div>

          <div
            class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <h3 class="font-medium text-neutral-400">Unitate</h3>

            <p v-if="healthGoal.unit" class="text-base text-neutral-100">
              {{ healthGoal.unit }}
            </p>

            <p v-else class="text-base text-neutral-100/50 italic">
              Nespecificată
            </p>
          </div>

          <div
            class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <h3 class="font-medium text-neutral-400">Data de început</h3>

            <p v-if="healthGoal.startDate" class="text-base text-neutral-100">
              {{ healthGoal.startDate }}
            </p>

            <p v-else class="text-base text-neutral-100/50 italic">
              Nespecificată
            </p>
          </div>

          <div
            class="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <h3 class="font-medium text-neutral-400">Data de final</h3>

            <p v-if="healthGoal.endDate" class="text-base text-neutral-100">
              {{ healthGoal.endDate }}
            </p>

            <p v-else class="text-base text-neutral-100/50 italic">
              Nespecificată
            </p>
          </div>
        </CardContent>
      </Card>

      <div class="flex items-center justify-between gap-2">
        <Button asChild>
          <RouterLink :to="{ name: 'HealthGoals' }">
            Înapoi la listă
          </RouterLink>
        </Button>

        <div class="flex gap-2">
          <Button asChild>
            <RouterLink
              :to="{
                name: 'EditHealthGoal',
                params: { id: healthGoal.id },
              }"
            >
              Editează
            </RouterLink>
          </Button>

          <DeleteHealthGoal
            :id="healthGoal.id"
            @delete="redirectHealthGoalsList"
          />
        </div>
      </div>
    </div>
  </main>
</template>
