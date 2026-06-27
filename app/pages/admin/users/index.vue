<script setup lang="ts">
import { AlertCircleIcon } from "@lucide/vue";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

definePageMeta({
  name: "AdminUsers",
});

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "patient" | "admin";
  createdAt: string;
}

const {
  data: users,
  pending: loading,
  error,
} = await useFetch<User[]>("/api/admin/users");

function formatDate(date: string) {
  return new Date(date).toLocaleString("ro-RO");
}
</script>

<template>
  <main class="mx-auto w-full max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
    <div class="flex flex-col gap-6">
      <div>
        <p class="text-sm font-medium uppercase tracking-wide text-emerald-400">
          Admin
        </p>

        <h1 class="mt-2 text-2xl font-semibold tracking-tight">
          Administrare utilizatori
        </h1>

        <p class="mt-2 text-sm text-neutral-400">
          Vizualizează utilizatorii înregistrați în platformă.
        </p>
      </div>

      <div v-if="loading || error">
        <p v-if="loading" class="text-neutral-400">
          Se încarcă utilizatorii...
        </p>

        <Alert v-if="error" variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Eroare!</AlertTitle>
          <AlertDescription>
            {{ error.message }}
          </AlertDescription>
        </Alert>
      </div>

      <div v-else class="overflow-hidden rounded-md border border-neutral-700">
        <div v-if="!users?.length">
          <p class="p-6 text-center text-neutral-400">Nu există utilizatori.</p>
        </div>

        <Table v-else class="w-full table-fixed">
          <TableHeader class="bg-neutral-900">
            <TableRow class="border-b border-neutral-700 hover:bg-transparent">
              <TableHead
                class="h-12 w-1/4 px-4 text-left text-sm font-medium text-zinc-400"
              >
                Nume
              </TableHead>

              <TableHead
                class="h-12 w-1/4 px-4 text-left text-sm font-medium text-zinc-400"
              >
                Email
              </TableHead>

              <TableHead
                class="h-12 w-1/4 px-4 text-center text-sm font-medium text-zinc-400"
              >
                Rol
              </TableHead>

              <TableHead
                class="h-12 w-1/4 px-4 text-right text-sm font-medium text-zinc-400"
              >
                Creat la
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="user in users"
              :key="user.id"
              class="border-b border-neutral-700/60 transition-colors hover:bg-zinc-900/30"
            >
              <TableCell class="p-4 text-sm font-medium">
                {{ user.firstName }} {{ user.lastName }}
              </TableCell>

              <TableCell class="truncate p-4 text-sm text-neutral-300">
                {{ user.email }}
              </TableCell>

              <TableCell class="p-4 text-center text-sm">
                <span
                  class="rounded-full px-3 py-1 text-xs font-medium"
                  :class="
                    user.role === 'admin'
                      ? 'bg-emerald-950 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-300'
                  "
                >
                  {{ user.role === "admin" ? "Admin" : "Pacient" }}
                </span>
              </TableCell>

              <TableCell class="p-4 text-right text-sm text-neutral-300">
                {{ formatDate(user.createdAt) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </main>
</template>
