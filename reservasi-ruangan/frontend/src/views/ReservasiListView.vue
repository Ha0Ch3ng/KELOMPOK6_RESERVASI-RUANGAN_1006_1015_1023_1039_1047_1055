<script setup>
// Halaman daftar reservasi (READ, search/filter, hapus)
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as svc from '../services/reservasiService'
import ToastNotif from '../components/ToastNotif.vue'

const router = useRouter()
const items = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')
const kategori = ref('')
const status = ref('')
const toast = ref({ message: '', type: 'success' })

const KATEGORI = ['', 'Ruang Kelas', 'Laboratorium', 'Ruang Rapat', 'Aula']
const STATUS = ['', 'Menunggu', 'Disetujui', 'Ditolak']

function showToast(message, type = 'success') {
  toast.value = { message, type }
}

function badgeClass(s) {
  if (s === 'Disetujui') return 'bg-green-100 text-green-700'
  if (s === 'Ditolak') return 'bg-red-100 text-red-700'
  return 'bg-yellow-100 text-yellow-800'
}

function formatTanggal(t) {
  if (!t) return '-'
  const d = new Date(t + 'T00:00:00')
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (search.value.trim()) params.search = search.value.trim()
    if (kategori.value) params.kategori = kategori.value
    if (status.value) params.status = status.value
    const res = await svc.getAll(params)
    items.value = res.data || []
  } catch (e) {
    error.value = e?.response?.data?.message || 'Gagal memuat data reservasi'
  } finally {
    loading.value = false
  }
}

async function onDelete(item) {
  if (!confirm(`Hapus reservasi "${item.nama_pemesan}" untuk ${item.nama_ruangan}?`)) return
  try {
    await svc.remove(item.id)
    showToast('Reservasi berhasil dihapus')
    await load()
  } catch (e) {
    showToast(e?.response?.data?.message || 'Gagal menghapus reservasi', 'error')
  }
}

// Debounce pencarian ±400 ms
let t
watch(search, () => {
  clearTimeout(t)
  t = setTimeout(load, 400)
})
watch([kategori, status], load)

onMounted(load)
</script>

<template>
  <div>
    <ToastNotif v-if="toast.message" :message="toast.message" :type="toast.type" @close="toast.message = ''" />

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-slate-800">Daftar Reservasi</h1>
        <p class="text-sm text-slate-500">Kelola peminjaman ruangan</p>
      </div>
      <RouterLink to="/tambah" class="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
        + Tambah
      </RouterLink>
    </div>

    <!-- Pencarian & filter -->
    <div class="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-3">
      <input
        v-model="search"
        type="text"
        placeholder="Cari nama, ruangan, keperluan..."
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <select v-model="kategori" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
        <option v-for="k in KATEGORI" :key="k" :value="k">{{ k || 'Semua Kategori' }}</option>
      </select>
      <select v-model="status" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
        <option v-for="s in STATUS" :key="s" :value="s">{{ s || 'Semua Status' }}</option>
      </select>
    </div>

    <!-- State error -->
    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>{{ error }}</p>
      <button @click="load" class="mt-2 rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700">Coba lagi</button>
    </div>

    <!-- State loading (skeleton) -->
    <div v-else-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-14 animate-pulse rounded-lg bg-slate-200"></div>
    </div>

    <!-- State kosong -->
    <div v-else-if="!items.length" class="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
      Belum ada reservasi.
    </div>

    <template v-else>
      <!-- Tabel (desktop) -->
      <div class="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm md:block">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th class="px-4 py-3">Pemesan</th>
              <th class="px-4 py-3">Ruangan</th>
              <th class="px-4 py-3">Tanggal</th>
              <th class="px-4 py-3">Jam</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in items" :key="r.id" class="hover:bg-slate-50">
              <td class="px-4 py-3">
                <div class="font-medium text-slate-800">{{ r.nama_pemesan }}</div>
                <div class="text-xs text-slate-500">{{ r.kategori }}</div>
              </td>
              <td class="px-4 py-3 text-slate-700">{{ r.nama_ruangan }}</td>
              <td class="px-4 py-3 text-slate-700">{{ formatTanggal(r.tanggal) }}</td>
              <td class="px-4 py-3 text-slate-700">{{ r.jam_mulai }}–{{ r.jam_selesai }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="badgeClass(r.status)">{{ r.status }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="inline-flex gap-2">
                  <button @click="router.push(`/edit/${r.id}`)" class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">Edit</button>
                  <button @click="onDelete(r)" class="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Kartu (mobile) -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        <div v-for="r in items" :key="r.id" class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div class="mb-2 flex items-start justify-between gap-2">
            <div>
              <p class="font-medium text-slate-800">{{ r.nama_pemesan }}</p>
              <p class="text-xs text-slate-500">{{ r.nama_ruangan }} · {{ r.kategori }}</p>
            </div>
            <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium" :class="badgeClass(r.status)">{{ r.status }}</span>
          </div>
          <p class="text-sm text-slate-700">{{ formatTanggal(r.tanggal) }} · {{ r.jam_mulai }}–{{ r.jam_selesai }}</p>
          <p v-if="r.keperluan" class="mt-1 text-xs text-slate-500">{{ r.keperluan }}</p>
          <div class="mt-3 flex gap-2">
            <button @click="router.push(`/edit/${r.id}`)" class="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">Edit</button>
            <button @click="onDelete(r)" class="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">Hapus</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
