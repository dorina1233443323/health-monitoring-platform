<script setup lang="ts">
interface DashboardUser {
    firstName: string
    role: 'patient' | 'admin'
}

defineProps<{
    user: DashboardUser | null
    isAdmin: boolean
}>()
</script>

<template>
    <main class="min-h-screen bg-neutral-950 text-white">
        <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div class="mb-8">
                <p class="text-sm font-medium uppercase tracking-wide text-emerald-400">
                    VitalCare
                </p>

                <h1 class="mt-2 text-3xl font-bold tracking-tight">
                    Bun venit, {{ user?.firstName }}!
                </h1>

                <p class="mt-2 text-neutral-400">
                    Acesta este panoul tău principal.
                </p>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
                <div class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow">
                    <h2 class="text-lg font-semibold">Profil pacient</h2>
                    <p class="mt-2 text-sm text-neutral-400">
                        Vizualizează și actualizează datele personale.
                    </p>

                    <NuxtLink :to="{ name: 'PatientProfile' }"
                        class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline">
                        Deschide profilul
                    </NuxtLink>
                </div>

                <div class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow">
                    <h2 class="text-lg font-semibold">Măsurători</h2>
                    <p class="mt-2 text-sm text-neutral-400">
                        Adaugă și urmărește valorile medicale.
                    </p>

                    <NuxtLink :to="{ name: 'Measurements' }"
                        class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline">
                        Vezi măsurători
                    </NuxtLink>
                </div>

                <div class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow">
                    <h2 class="text-lg font-semibold">Obiective sănătate</h2>
                    <p class="mt-2 text-sm text-neutral-400">
                        Gestionează obiectivele tale de sănătate.
                    </p>

                    <NuxtLink :to="{ name: 'HealthGoals' }"
                        class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline">
                        Vezi obiective
                    </NuxtLink>
                </div>
            </div>

            <div v-if="isAdmin" class="mt-6 rounded-xl border border-emerald-800 bg-emerald-950/30 p-6">
                <h2 class="text-lg font-semibold text-emerald-400">
                    Admin
                </h2>

                <p class="mt-2 text-sm text-neutral-300">
                    Ai acces la administrarea utilizatorilor.
                </p>

                <NuxtLink :to="{ name: 'AdminUsers' }"
                    class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline">
                    Administrează utilizatorii
                </NuxtLink>
            </div>
        </section>
    </main>
</template>