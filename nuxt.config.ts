import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["shadcn-nuxt", "@vee-validate/nuxt"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "~/components/"
     */
    componentDir: "~/components/ui",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      ErrorMessage: "VeeErrorMessage",
    },
  },
});
