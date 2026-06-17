<script setup lang="ts">
import Navbar from './components/general/Navbar.vue'
const { fetchUser } = useAuth()
await fetchUser()
</script>

<template>
  <div class="min-h-screen bg-neutral-950">
    <Navbar />
    <NuxtPage />
  </div>
</template>