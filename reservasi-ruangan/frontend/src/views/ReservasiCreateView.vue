<script setup>
// Halaman tambah reservasi (CREATE)
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ReservasiForm from '../components/ReservasiForm.vue'
import ToastNotif from '../components/ToastNotif.vue'
import * as svc from '../services/reservasiService'

const router = useRouter()
const loading = ref(false)
const toast = ref({ message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { message, type }
}

async function onSubmit(data) {
  loading.value = true
  try {
    await svc.create(data)
    showToast('Reservasi berhasil ditambahkan')
    setTimeout(() => router.push('/'), 600)
  } catch (e) {
    const msg = e?.response?.data?.message || 'Gagal menambah reservasi'
    const errs = e?.response?.data?.errors
    showToast(errs ? `${msg}: ${errs.join(', ')}` : msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <ToastNotif v-if="toast.message" :message="toast.message" :type="toast.type" @close="toast.message = ''" />
    <div class="rounded-lg border border-slate-200 bg-white p-5 shadow sm:p-6">
      <h1 class="mb-1 text-xl font-semibold text-slate-800">Tambah Reservasi</h1>
      <p class="mb-5 text-sm text-slate-500">Isi data peminjaman ruangan</p>
      <ReservasiForm submit-label="Simpan" :loading="loading" @submit="onSubmit" />
    </div>
  </div>
</template>
