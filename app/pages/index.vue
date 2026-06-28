<script setup lang="ts">
import LandingPage from "~/components/general/LandingPage.vue";
import Dashboard from "~/components/user/Dashboard.vue";

const { loggedIn, user, isAdmin } = useAuth();

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

definePageMeta({
  name: "Home",
});

const features = [
  {
    id: 1,
    name: "Monitorizare",
    description: "Monitorizarea datelor de sănătate ale pacienților",
  },
  {
    id: 2,
    name: "Gestionarea",
    description: "Gestionarea pacienților și a dispozitivelor medicale",
  },
  {
    id: 4,
    name: "Vizualizarea",
    description: "Vizualizarea istoricului valorilor înregistrate",
  },
];
</script>

<template>
  <div v-if="!mounted" class="min-h-screen bg-neutral-950" />
  <template v-else>
    <LandingPage v-if="!loggedIn" :features="features" />
    <Dashboard v-else :user="user" :isAdmin="isAdmin" />
  </template>
</template>
