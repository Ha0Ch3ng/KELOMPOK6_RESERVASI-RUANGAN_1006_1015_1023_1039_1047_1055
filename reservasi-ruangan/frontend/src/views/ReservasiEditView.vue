<script setup>
// Halaman ubah reservasi (UPDATE, load by id)
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ReservasiForm from '../components/ReservasiForm.vue'
import ToastNotif from '../components/ToastNotif.vue'
import * as svc from '../services/reservasiService'

const route = useRoute()
const router = useRouter()
const initialData = ref(null)
const loading = ref(false)
const pageLoading = ref(true)
const notFound = ref(false)
const toast = ref({ message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { message, type }
}

async function load() {
  pageLoading.value = true
  try {
    const res = await svc.getById(route.params.id)
    initialData.value = res.data
  } catch (e) {
    if (e?.response?.status === 404) notFound.value = true
    else showToast(e?.response?.data?.message || 'Gagal memuat data', 'error')
  } finally {
    pageLoading.value = false
  }
}

async function onSubmit(data) {
  loading.value = true
  try {
    await svc.update(route.params.id, data)
    showToast('Reservasi berhasil diperbarui')
    setTimeout(() => router.push('/'), 600)
  } catch (e) {
    const msg = e?.response?.data?.message || 'Gagal memperbarui reservasi'
    const errs = e?.response?.data?.errors
    showToast(errs ? `${msg}: ${errs.join(', ')}` : msg, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <ToastNotif v-if="toast.message" :message="toast.message" :type="toast.type" @close="toast.message = ''" />

    <div v-if="pageLoading" class="rounded-lg border border-slate-200 bg-white p-6 shadow">
      <div class="mb-4 h-6 w-40 animate-pulse rounded bg-slate-200"></div>
      <div class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-10 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>

    <div v-else-if="notFound" class="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      <p>Reservasi tidak ditemukan.</p>
      <RouterLink to="/" class="mt-3 inline-block rounded-md bg-indigo-600 px-3 py-1.5 text-white">Kembali ke daftar</RouterLink>
    </div>

    <div v-else class="rounded-lg border border-slate-200 bg-white p-5 shadow sm:p-6">
      <h1 class="mb-1 text-xl font-semibold text-slate-800">Edit Reservasi</h1>
      <p class="mb-5 text-sm text-slate-500">Perbarui data peminjaman ruangan</p>
      <ReservasiForm submit-label="Update" :loading="loading" :initial-data="initialData" @submit="onSubmit" />
    </div>
  </div>
</template>
