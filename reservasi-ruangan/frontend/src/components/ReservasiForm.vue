<script setup>
// Form reusable untuk create & edit reservasi (validasi sisi klien)
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  submitLabel: { type: String, default: 'Simpan' },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const KATEGORI = ['Ruang Kelas', 'Laboratorium', 'Ruang Rapat', 'Aula']
const STATUS = ['Menunggu', 'Disetujui', 'Ditolak']

const empty = () => ({
  nama_pemesan: '',
  nama_ruangan: '',
  kategori: 'Ruang Kelas',
  tanggal: '',
  jam_mulai: '',
  jam_selesai: '',
  keperluan: '',
  status: 'Menunggu',
})

const form = reactive(empty())
const errors = reactive({})

// Isi form saat data awal tersedia (mode edit)
watch(
  () => props.initialData,
  (val) => {
    Object.assign(form, empty(), val || {})
    // Normalisasi jam ke HH:mm jika HH:MM:SS
    if (form.jam_mulai && form.jam_mulai.length > 5) form.jam_mulai = form.jam_mulai.slice(0, 5)
    if (form.jam_selesai && form.jam_selesai.length > 5) form.jam_selesai = form.jam_selesai.slice(0, 5)
  },
  { immediate: true }
)

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.nama_pemesan.trim()) errors.nama_pemesan = 'Nama pemesan wajib diisi'
  if (!form.nama_ruangan.trim()) errors.nama_ruangan = 'Nama ruangan wajib diisi'
  if (!form.tanggal) errors.tanggal = 'Tanggal wajib diisi'
  if (!form.jam_mulai) errors.jam_mulai = 'Jam mulai wajib diisi'
  if (!form.jam_selesai) errors.jam_selesai = 'Jam selesai wajib diisi'
  if (form.jam_mulai && form.jam_selesai && form.jam_selesai <= form.jam_mulai) {
    errors.jam_selesai = 'Jam selesai harus lebih besar dari jam mulai'
  }
  return Object.keys(errors).length === 0
}

function onSubmit() {
  if (!validate()) return
  emit('submit', { ...form })
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'
</script>

<template>
  <form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Nama Pemesan *</label>
      <input v-model="form.nama_pemesan" type="text" :class="inputClass" placeholder="Contoh: Muhammad Iqbal" />
      <p v-if="errors.nama_pemesan" class="mt-1 text-xs text-red-600">{{ errors.nama_pemesan }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Nama Ruangan *</label>
      <input v-model="form.nama_ruangan" type="text" :class="inputClass" placeholder="Contoh: Lab Komputer 2" />
      <p v-if="errors.nama_ruangan" class="mt-1 text-xs text-red-600">{{ errors.nama_ruangan }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Kategori *</label>
      <select v-model="form.kategori" :class="inputClass">
        <option v-for="k in KATEGORI" :key="k" :value="k">{{ k }}</option>
      </select>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Status</label>
      <select v-model="form.status" :class="inputClass">
        <option v-for="s in STATUS" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Tanggal *</label>
      <input v-model="form.tanggal" type="date" :class="inputClass" />
      <p v-if="errors.tanggal" class="mt-1 text-xs text-red-600">{{ errors.tanggal }}</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Jam Mulai *</label>
        <input v-model="form.jam_mulai" type="time" :class="inputClass" />
        <p v-if="errors.jam_mulai" class="mt-1 text-xs text-red-600">{{ errors.jam_mulai }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Jam Selesai *</label>
        <input v-model="form.jam_selesai" type="time" :class="inputClass" />
        <p v-if="errors.jam_selesai" class="mt-1 text-xs text-red-600">{{ errors.jam_selesai }}</p>
      </div>
    </div>
    <div class="md:col-span-2">
      <label class="mb-1 block text-sm font-medium text-slate-700">Keperluan</label>
      <textarea v-model="form.keperluan" rows="3" :class="inputClass" placeholder="Opsional"></textarea>
    </div>
    <div class="md:col-span-2 flex items-center justify-end gap-3 pt-2">
      <RouterLink to="/" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
        Batal
      </RouterLink>
      <button
        type="submit"
        :disabled="loading"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {{ loading ? 'Menyimpan...' : submitLabel }}
      </button>
    </div>
  </form>
</template>
