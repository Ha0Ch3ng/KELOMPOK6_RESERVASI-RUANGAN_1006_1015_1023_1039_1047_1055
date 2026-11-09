<script setup>
// Layout utama: navbar responsif + area konten
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div class="min-h-screen">
    <nav class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="text-lg font-semibold text-indigo-700">Reservasi Ruangan</RouterLink>
        <button class="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" @click="open = !open" aria-label="Menu">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="hidden items-center gap-2 md:flex">
          <RouterLink to="/" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Daftar</RouterLink>
          <RouterLink to="/tambah" class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ Tambah</RouterLink>
        </div>
      </div>
      <div v-if="open" class="border-t border-slate-100 px-4 py-2 md:hidden">
        <RouterLink to="/" class="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" @click="open = false">Daftar</RouterLink>
        <RouterLink to="/tambah" class="mt-1 block rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white" @click="open = false">+ Tambah</RouterLink>
      </div>
    </nav>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
