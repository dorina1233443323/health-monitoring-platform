<script setup lang="ts">
import Navbar from './components/general/Navbar.vue'
const { fetchUser } = useAuth()
import { Toaster } from '@/components/ui/sonner'
await fetchUser()
</script>

<template>
  <div class="min-h-screen bg-neutral-950">
    <ClientOnly>
      <Navbar />
    </ClientOnly>
    <NuxtPage />
    <Toaster position="bottom-right" />
  </div>
</template>