<script setup lang="ts">
import LandingPage from '~/components/general/LandingPage.vue'
import Dashboard from '~/components/user/Dashboard.vue';

const { loggedIn, user, isAdmin } = useAuth()

definePageMeta({
    name: 'Home'
})

const features = [
    { id: 1, name: 'Monitorizare', description: 'Monitorizarea datelor de sănătate ale pacienților' },
    { id: 2, name: 'Gestionarea', description: 'Gestionarea pacienților și a dispozitivelor medicale' },
    { id: 4, name: 'Vizualizarea', description: 'Vizualizarea istoricului valorilor înregistrate' }

]
</script>

<template>
    <LandingPage v-if="!loggedIn" :features="features" />
    <Dashboard v-else :user="user" :isAdmin="isAdmin"/>
</template>
