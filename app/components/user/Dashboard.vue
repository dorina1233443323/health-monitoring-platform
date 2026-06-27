<script setup lang="ts">
import { getLabelForType } from "~/utils/healthOptions";
import { getMeasurementAlert, getBmiAlert } from "~/utils/healthAlerts";

interface DashboardUser {
  firstName: string;
  role: "patient" | "admin";
}

interface PatientProfile {
  heightCm: number | null;
  weightKg: number | null;
}

interface Measurement {
  id: number;
  type: string;
  value: number;
  unit: string;
  measuredAt: string;
  createdAt: string;
}

interface HealthGoal {
  id: number;
  type: string;
  targetValue: number | null;
  startValue: number | null;
  unit: string | null;
  direction: "increase" | "decrease" | "maintain";
  startDate: string | null;
  endDate: string | null;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
}

defineProps<{
  user: DashboardUser | null;
  isAdmin: boolean;
}>();

const { data: profile } = await useFetch<PatientProfile | null>(
  "/api/me/patient-profile",
);
const { data: measurements, pending: measurementsLoading } =
  await useFetch<Measurement[]>("/api/measurements");
const { data: healthGoals, pending: healthGoalsLoading } =
  await useFetch<HealthGoal[]>("/api/health-goals");

const directionLabels = {
  increase: "Creștere",
  decrease: "Scădere",
  maintain: "Menținere",
};

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

function getDaysUntil(date: string | null) {
  if (!date) return null;

  const today = new Date();
  const end = new Date(date);

  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getDeadlineText(date: string | null) {
  const days = getDaysUntil(date);

  if (days === null) return "Fără termen limită";
  if (days < 0) return `Depășit cu ${Math.abs(days)} zile`;
  if (days === 0) return "Termenul este astăzi";
  if (days === 1) return "1 zi rămasă";

  return `${days} zile rămase`;
}

const bmi = computed(() => {
  if (!profile.value?.heightCm || !profile.value?.weightKg) return null;

  const heightM = profile.value.heightCm / 100;
  return Number((profile.value.weightKg / (heightM * heightM)).toFixed(1));
});

const bmiStatus = computed(() => {
  if (!bmi.value) return "Date insuficiente";
  if (bmi.value < 18.5) return "Subponderal";
  if (bmi.value < 25) return "Normal";
  if (bmi.value < 30) return "Supraponderal";

  return "Obezitate";
});

const latestMeasurements = computed(() => {
  const grouped = new Map<string, Measurement>();

  for (const measurement of measurements.value ?? []) {
    const key = `${normalize(measurement.type)}:${normalize(measurement.unit)}`;
    const existing = grouped.get(key);

    if (
      !existing ||
      new Date(measurement.measuredAt).getTime() >
        new Date(existing.measuredAt).getTime()
    ) {
      grouped.set(key, measurement);
    }
  }

  return Array.from(grouped.values()).sort(
    (a, b) =>
      new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
  );
});

const activeGoals = computed(() => {
  return (healthGoals.value ?? []).filter((goal) => goal.status === "active");
});

const completedGoals = computed(() => {
  return (healthGoals.value ?? []).filter(
    (goal) => goal.status === "completed",
  );
});

const goalProgress = computed(() => {
  return activeGoals.value.map((goal) => {
    const matchingMeasurement = latestMeasurements.value.find(
      (measurement) =>
        normalize(measurement.type) === normalize(goal.type) &&
        normalize(measurement.unit) === normalize(goal.unit),
    );

    if (!matchingMeasurement) {
      return {
        goal,
        progressText: "Nu există măsurătoare pentru acest obiectiv",
        progressPercent: 0,
        isCompleted: false,
        deadlineText: getDeadlineText(goal.endDate),
      };
    }

    if (goal.targetValue === null || goal.startValue === null) {
      return {
        goal,
        progressText: "Lipsește valoarea inițială sau ținta",
        progressPercent: 0,
        isCompleted: false,
        deadlineText: getDeadlineText(goal.endDate),
      };
    }

    const current = matchingMeasurement.value;
    const target = goal.targetValue;
    const start = goal.startValue;

    let rawProgress = 0;

    if (target === start) {
      rawProgress = current === target ? 100 : 0;
    } else if (goal.direction === "increase") {
      rawProgress = ((current - start) / (target - start)) * 100;
    } else if (goal.direction === "decrease") {
      rawProgress = ((start - current) / (start - target)) * 100;
    }
    if (goal.direction === "maintain") {
      const tolerance = Math.abs(target * 0.05);
      const difference = Math.abs(current - target);
      rawProgress = difference <= tolerance ? 100 : 0;
    }

    const progressPercent = clampProgress(rawProgress);
    return {
      goal,
      progressText: `${current} / ${target} ${goal.unit ?? ""}`,
      progressPercent,
      isCompleted: progressPercent >= 100,
      deadlineText: getDeadlineText(goal.endDate),
    };
  });
});

const healthAlerts = computed(() => {
  const alerts: string[] = [];

  for (const measurement of latestMeasurements.value) {
    const alert = getMeasurementAlert(measurement);

    if (alert) {
      alerts.push(`${alert}: ${measurement.value} ${measurement.unit}`);
    }
  }

  const bmiAlert = getBmiAlert(bmi.value);

  if (bmiAlert) {
    alerts.push(`${bmiAlert}: ${bmi.value}`);
  }

  for (const item of goalProgress.value) {
    if (item.deadlineText.startsWith("Depășit")) {
      alerts.push(`${getLabelForType(item.goal.type)}: ${item.deadlineText}`);
    }
  }

  return alerts;
});

const dismissedAlerts = ref<string[]>([]);
const visibleAlerts = computed(() =>
  healthAlerts.value.filter((alert) => !dismissedAlerts.value.includes(alert)),
);
function dismissAlert(alert: string) {
  dismissedAlerts.value.push(alert);
}
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
          Monitorizează măsurătorile recente, obiectivele și starea generală.
        </p>
      </div>

      <div
        v-if="visibleAlerts.length > 0"
        class="mb-8 rounded-xl border border-red-800 bg-red-950/30 p-6"
      >
        <h2 class="flex items-center gap-2 text-lg font-semibold text-red-400">
        Alerte sănătate
        </h2>

        <div class="mt-4 space-y-3">
          <div
            v-for="alert in visibleAlerts"
            :key="alert"
            class="flex items-center justify-between rounded-lg border border-red-900/50 bg-black/20 p-3"
          >
            <p class="text-sm text-red-200">
              {{ alert }}
            </p>

            <Button
              variant="ghost"
              size="sm"
              class="text-red-300 hover:text-white"
              @click="dismissAlert(alert)"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-4 p-3">
        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <p class="text-sm text-neutral-400">Măsurători</p>
          <h2 class="mt-2 text-3xl font-bold">
            {{ measurements?.length ?? 0 }}
          </h2>
          <p class="mt-2 text-sm text-neutral-500">Total valori salvate</p>
        </div>

        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <p class="text-sm text-neutral-400">Obiective active</p>
          <h2 class="mt-2 text-3xl font-bold text-emerald-400">
            {{ activeGoals.length }}
          </h2>
          <p class="mt-2 text-sm text-neutral-500">În monitorizare</p>
        </div>

        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <p class="text-sm text-neutral-400">Obiective finalizate</p>
          <h2 class="mt-2 text-3xl font-bold">{{ completedGoals.length }}</h2>
          <p class="mt-2 text-sm text-neutral-500">Marcate ca atinse</p>
        </div>

        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <p class="text-sm text-neutral-400">IMC</p>
          <h2 class="mt-2 text-3xl font-bold">
            {{ bmi ?? "-" }}
          </h2>
          <p class="mt-2 text-sm text-neutral-500">
            {{ bmiStatus }}
          </p>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold">Ultimele măsurători</h2>

            <NuxtLink
              :to="{ name: 'Measurements' }"
              class="text-sm font-medium text-emerald-400 hover:underline"
            >
              Vezi toate
            </NuxtLink>
          </div>

          <div v-if="measurementsLoading" class="mt-6 text-sm text-neutral-400">
            Se încarcă...
          </div>

          <div
            v-else-if="latestMeasurements.length === 0"
            class="mt-6 text-sm text-neutral-400"
          >
            Nu există măsurători încă.
          </div>

          <div v-else class="mt-6 space-y-4">
            <div
              v-for="measurement in latestMeasurements.slice(0, 4)"
              :key="measurement.id"
              class="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-medium">
                    {{ getLabelForType(measurement.type) }}
                  </p>

                  <p class="mt-1 text-sm text-neutral-400">
                    {{ measurement.measuredAt }}
                  </p>
                </div>

                <p class="text-xl font-semibold text-emerald-400">
                  {{ measurement.value }} {{ measurement.unit }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold">Progres obiective</h2>

            <NuxtLink
              :to="{ name: 'HealthGoals' }"
              class="text-sm font-medium text-emerald-400 hover:underline"
            >
              Vezi toate
            </NuxtLink>
          </div>

          <div v-if="healthGoalsLoading" class="mt-6 text-sm text-neutral-400">
            Se încarcă...
          </div>

          <div
            v-else-if="goalProgress.length === 0"
            class="mt-6 text-sm text-neutral-400"
          >
            Nu există obiective active.
          </div>

          <div v-else class="mt-6 space-y-4">
            <div
              v-for="item in goalProgress"
              :key="item.goal.id"
              class="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-medium">
                    {{ getLabelForType(item.goal.type) }}
                  </p>

                  <p class="mt-1 text-sm text-neutral-400">
                    {{ item.progressText }}
                  </p>

                  <p class="mt-1 text-xs text-neutral-500">
                    Direcție: {{ directionLabels[item.goal.direction] }}
                  </p>

                  <p class="mt-1 text-xs text-neutral-500">
                    {{ item.deadlineText }}
                  </p>

                  <p
                    v-if="item.isCompleted"
                    class="mt-2 text-sm font-medium text-emerald-400"
                  >
                    Obiectiv atins
                  </p>
                </div>

                <p
                  class="text-sm font-semibold"
                  :class="
                    item.isCompleted ? 'text-emerald-400' : 'text-neutral-300'
                  "
                >
                  {{ item.progressPercent }}%
                </p>
              </div>

              <div class="mt-3 h-2 overflow-hidden rounded-full bg-neutral-800">
                <div
                  class="h-full rounded-full bg-emerald-500"
                  :style="{ width: `${item.progressPercent}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <h2 class="text-lg font-semibold">Profil pacient</h2>
          <p class="mt-2 text-sm text-neutral-400">
            Vizualizează și actualizează datele personale.
          </p>

          <NuxtLink
            :to="{ name: 'PatientProfile' }"
            class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline"
          >
            Deschide profilul
          </NuxtLink>
        </div>

        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <h2 class="text-lg font-semibold">Măsurători</h2>
          <p class="mt-2 text-sm text-neutral-400">
            Adaugă și urmărește valorile medicale.
          </p>

          <NuxtLink
            :to="{ name: 'Measurements' }"
            class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline"
          >
            Vezi măsurători
          </NuxtLink>
        </div>

        <div
          class="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow"
        >
          <h2 class="text-lg font-semibold">Obiective sănătate</h2>
          <p class="mt-2 text-sm text-neutral-400">
            Gestionează obiectivele tale de sănătate.
          </p>

          <NuxtLink
            :to="{ name: 'HealthGoals' }"
            class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline"
          >
            Vezi obiective
          </NuxtLink>
        </div>
      </div>

      <div
        v-if="isAdmin"
        class="mt-6 rounded-xl border border-emerald-800 bg-emerald-950/30 p-6"
      >
        <h2 class="text-lg font-semibold text-emerald-400">Admin</h2>

        <p class="mt-2 text-sm text-neutral-300">
          Ai acces la administrarea utilizatorilor.
        </p>

        <NuxtLink
          :to="{ name: 'AdminUsers' }"
          class="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline"
        >
          Administrează utilizatorii
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
