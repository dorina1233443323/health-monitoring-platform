<script setup lang="ts">
import { toast } from 'vue-sonner'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'

const { id } = defineProps<{
    id: number
}>()

const emit = defineEmits<{
    delete: []
}>()

const loading = ref(false)

async function deleteMeasurement() {
    loading.value = true

    try {
        await $fetch(`/api/measurements/${id}`, {
            method: 'DELETE',
        })

        toast.success('Măsurătura a fost ștearsă cu succes.')
        emit('delete')
    } catch {
        toast.error('A apărut o eroare la ștergerea măsurăturii.')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive">
                Șterge
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Sunteți sigur?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Această acțiune nu poate fi anulată. Măsurătura va fi ștearsă definitiv.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel :disabled="loading">
                    Anulează
                </AlertDialogCancel>
                <AlertDialogAction asChild :disabled="loading" @click="deleteMeasurement">
                    <Button variant="destructive">
                        Continuă
                    </Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>