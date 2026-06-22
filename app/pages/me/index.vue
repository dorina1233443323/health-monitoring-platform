<script setup lang="ts">
definePageMeta({
    name: 'PatientProfile',
})

const { data: profile, pending } = await useFetch('/api/me/patient-profile')
</script>

<template>
    <main class="min-h-screen bg-neutral-950 text-white">
        <section class="mx-auto max-w-3xl px-4 py-10">
            <p class="text-sm font-medium uppercase tracking-wide text-emerald-400">
                VitalCare
            </p>

            <h1 class="mt-2 text-3xl font-bold">
                Profil pacient
            </h1>

            <div v-if="pending" class="mt-8 text-neutral-400">
                Se încarcă...
            </div>

            <div v-else-if="!profile" class="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <h2 class="text-xl font-semibold">
                    Completați profilul de pacient
                </h2>

                <p class="mt-2 text-neutral-400">
                    Nu aveți încă un profil de pacient.
                </p>

                <NuxtLink :to="{ name: 'PatientProfileCreate' }"
                    class="mt-4 inline-block rounded-lg bg-emerald-500 px-4 py-2 font-medium text-neutral-950 hover:bg-emerald-400">
                    Creează profil
                </NuxtLink>
            </div>

            <div v-else class="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <h2 class="text-xl font-semibold">
                    Profilul dvs.
                </h2>

                <div class="mt-4 space-y-2 text-neutral-300">
                    <p>Data nașterii: {{ profile.birthDate }}</p>
                    <p>Sex: {{ profile.sex === 'female' ? 'Feminin' : profile.sex === 'male' ? 'Masculin' : 'Altul' }}
                    </p>
                    <p>Înălțime: {{ profile.heightCm ?? '-' }} cm</p>
                    <p>Greutate: {{ profile.weightKg ?? '-' }} kg</p>
                    <p>Telefon: {{ profile.phone }}</p>
                    <p>Adresă: {{ profile.address || '-' }}</p>
                    <p>Contact urgență: {{ profile.emergencyContactName || '-' }}</p>
                    <p>Telefon urgență: {{ profile.emergencyContactPhone || '-' }}</p>
                </div>

                <NuxtLink :to="{ name: 'PatientProfileEdit' }"
                    class="mt-6 inline-block rounded-lg bg-emerald-500 px-4 py-2 font-medium text-neutral-950 hover:bg-emerald-400">
                    Editează profil
                </NuxtLink>
            </div>
        </section>
    </main>
</template>