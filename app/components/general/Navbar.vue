<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
const { user, loggedIn, logout } = useAuth()
</script>

<template>
  <div class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink :to="{ name: 'Home' }"
        class="flex items-center gap-2 text-lg font-bold tracking-tight transition-colors hover:text-primary">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-emerald-400 ">
          V
        </div>
        <span>VitalCare</span>
      </NuxtLink>

      <NavigationMenu :viewport="false" class="flex-1">
        <NavigationMenuList class="flex items-center gap-2">
          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <NuxtLink :to="{ name: 'Home' }"
                class="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                Acasă</NuxtLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <template v-if="!loggedIn">
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <NuxtLink :to="{ name: 'Login' }">
                  Logare
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <NuxtLink :to="{ name: 'Register' }">
                  Înregistrare
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </template>

          <template v-else>
            <NavigationMenuItem v-if="user?.role === 'admin'">
              <NavigationMenuLink as-child>
                <NuxtLink :to="{ name: 'AdminUsers' }">
                  Utilizatori
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <span class="px-4 py-2 text-sm text-muted-foreground">
                {{ user?.firstName }}
              </span>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" @click="logout">
                Ieșire
              </Button>
            </NavigationMenuItem>
          </template>
        </NavigationMenuList>

      </NavigationMenu>
    </nav>
  </div>
</template>
