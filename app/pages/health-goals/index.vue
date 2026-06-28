<script setup lang="ts">
import { AlertCircleIcon } from "@lucide/vue";
import { RouterLink } from "vue-router";

import DeleteHealthGoal from "~/components/health-goals/DeleteHealthGoal.vue";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

definePageMeta({
  name: "HealthGoals",
});

interface HealthGoal {
  id: number;
  type: string;
  targetValue: number | null;
  startValue: number | null;
  unit: string | null;
  direction: "increase" | "decrease" | "maintain";
  startDate: string | null;
  endDate: string | null;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
}

const {
  data: healthGoals,
  pending: loading,
  error,
  refresh,
} = await useFetch<HealthGoal[]>("/api/health-goals");

const statusLabels = {
  active: "Activ",
  completed: "Completat",
  cancelled: "Anulat",
};

const directionLabels = {
  increase: "Creștere",
  decrease: "Scădere",
  maintain: "Menținere",
};
</script>

<template>
  <main class="mx-auto w-full max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-6">
      <h1 class="text-left text-xl font-semibold tracking-tight">
        Obiective sănătate
      </h1>

      <div v-if="loading || error" class="w-full">
        <p v-if="loading" class="max-w-md text-neutral-400">
          Se încarcă datele...
        </p>

        <Alert v-if="error" variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Eroare!</AlertTitle>
          <AlertDescription>
            <p>{{ error?.message }}</p>
          </AlertDescription>
        </Alert>
      </div>

      <div v-else class="overflow-hidden rounded-md border border-neutral-700">
        <div v-if="healthGoals?.length === 0">
          <p class="w-full p-6 text-center text-neutral-400">
            Nu există obiective create.
          </p>
        </div>

        <Table v-else class="w-full table-fixed">
          <TableHeader class="bg-neutral-900">
            <TableRow class="border-b border-neutral-700 hover:bg-transparent">
              <TableHead
                class="h-12 w-1/6 px-4 text-left text-sm font-medium text-zinc-400"
              >
                Tip
              </TableHead>

              <TableHead
                class="h-12 w-1/6 px-4 text-center text-sm font-medium text-zinc-400"
              >
                Inițial
              </TableHead>

              <TableHead
                class="h-12 w-1/6 px-4 text-center text-sm font-medium text-zinc-400"
              >
                Țintă
              </TableHead>

              <TableHead
                class="h-12 w-1/6 px-4 text-center text-sm font-medium text-zinc-400"
              >
                Direcție
              </TableHead>

              <TableHead
                class="h-12 w-1/6 px-4 text-center text-sm font-medium text-zinc-400"
              >
                Status
              </TableHead>

              <TableHead
                class="h-12 w-1/6 px-4 text-right text-sm font-medium text-zinc-400"
              >
                Acțiuni
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody class="text-start">
            <TableRow
              v-for="goal in healthGoals"
              :key="goal.id"
              class="border-b border-neutral-700/60 transition-colors hover:bg-zinc-900/30"
            >
              <TableCell class="p-4 text-sm font-medium">
                  {{ goal.type }}
              </TableCell>

              <TableCell class="p-4 text-center text-sm">
                {{ goal.startValue ?? "-" }} {{ goal.unit || "" }}
              </TableCell>

              <TableCell class="p-4 text-center text-sm">
                {{ goal.targetValue ?? "-" }} {{ goal.unit || "" }}
              </TableCell>

              <TableCell class="p-4 text-center text-sm">
                {{ directionLabels[goal.direction] }}
              </TableCell>

              <TableCell class="p-4 text-center text-sm">
                {{ statusLabels[goal.status] }}
              </TableCell>

              <TableCell class="flex items-center justify-end gap-2 p-4">
                <Button asChild>
                  <RouterLink
                    :to="{
                      name: 'EditHealthGoal',
                      params: { id: goal.id },
                    }"
                  >
                    Editează
                  </RouterLink>
                </Button>

                <ClientOnly>
                  <DeleteHealthGoal :id="goal.id" @delete="refresh" />
                </ClientOnly>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div class="flex gap-2 text-center">
        <Button asChild variant="default">
          <RouterLink :to="{ name: 'CreateHealthGoal' }"> Creează </RouterLink>
        </Button>
      </div>
    </div>
  </main>
</template>
