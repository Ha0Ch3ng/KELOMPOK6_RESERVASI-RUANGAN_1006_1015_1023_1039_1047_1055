<script setup>
// Komponen toast notifikasi (sukses/error), hilang otomatis
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'success' }, // success | error
  duration: { type: Number, default: 3000 },
})
const emit = defineEmits(['close'])

let timer
onMounted(() => {
  timer = setTimeout(() => emit('close'), props.duration)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div
    v-if="message"
    class="fixed top-4 right-4 z-50 max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg"
    :class="type === 'error' ? 'bg-red-600' : 'bg-green-600'"
    role="alert"
  >
    {{ message }}
  </div>
</template>
