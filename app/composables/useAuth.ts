interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "patient" | "admin";
}

export const useAuth = () => {
  const user = useState<AuthUser | null>("auth-user", () => null);
  const loading = useState<boolean>("auth-loading", () => false);

  const loggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isPatient = computed(() => user.value?.role === "patient");

  async function fetchUser() {
    loading.value = true;

    try {
      user.value = await $fetch<AuthUser>("/api/auth/me");
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });

    user.value = null;
    await navigateTo({ name: "Home" });
  }

  return {
    user,
    loading,
    loggedIn,
    isAdmin,
    isPatient,
    fetchUser,
    logout,
  };
};
