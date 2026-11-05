/**
 * Komponen Login & Header Ringkas Panel Admin (component/AdminHeader.tsx)
 * Desain User-Friendly: Tanpa banyak tab, semua fitur utama dalam 1 layar
 */

import { PortConfigProps } from '../types';

export function renderAdminLoginAndHeader({ USER_PORT, ADMIN_PORT }: PortConfigProps): string {
  return `
  <!-- Toast Notification -->
  <div id="toastBox" class="fixed top-5 right-5 z-50 hidden transform transition-all duration-300">
    <div id="toastInner" class="px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-semibold">
      <span id="toastText">Notifikasi</span>
    </div>
  </div>

  <!-- MODAL AKUN ADMIN (Hanya muncul jika tombol Akun diklik) -->
  <div id="accountModal" class="fixed inset-0 z-50 hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="w-full max-w-md glass-card rounded-2xl p-6 space-y-4 border border-slate-700 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-extrabold text-white">👤 Pengaturan Akun Admin</h3>
        <button type="button" onclick="toggleAccountModal(false)" class="text-slate-400 hover:text-white text-sm font-bold">✕</button>
      </div>
      <form id="accountForm" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Nama Tampilan</label>
          <input id="accName" type="text" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Username Login</label>
          <input id="accUsername" type="text" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Password Baru (Opsional)</label>
          <input id="accPassword" type="password" placeholder="Kosongkan jika tidak diubah" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="toggleAccountModal(false)" class="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300">Batal</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs">Simpan Akun</button>
        </div>
      </form>
    </div>
  </div>

  <!-- LOGIN VIEW -->
  <div id="loginView" class="flex-1 flex items-center justify-center p-4">
    <div class="w-full max-w-md glass-card rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
      <div class="text-center space-y-2">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
          <svg class="w-8 h-8 text-slate-950" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-extrabold text-white">Login Admin Panel</h1>
        <p class="text-xs sm:text-sm text-slate-400">
          Port Admin (${ADMIN_PORT}) • Terpisah dari Web Pelanggan (${USER_PORT})
        </p>
      </div>

      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">Username Admin</label>
          <input
            id="loginUsername"
            type="text"
            required
            value="admin"
            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
          <input
            id="loginPassword"
            type="password"
            required
            value="admin123"
            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition"
        >
          Masuk ke Dashboard (1-Klik)
        </button>
      </form>
    </div>
  </div>`;
}

export function renderAdminTopNavbar({ USER_PORT, ADMIN_PORT }: PortConfigProps): string {
  return `
    <header class="sticky top-0 z-30 glass-card border-b border-slate-800/90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <!-- Brand & Live Status -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            A
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base font-extrabold text-white leading-tight">KingStream <span class="text-amber-400">Admin</span></h1>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Auto-Sync
              </span>
            </div>
            <p class="text-[11px] text-slate-400">Semua kontrol dalam 1 layar • Tanpa pindah tab</p>
          </div>
        </div>

        <!-- Quick Share Link & Actions -->
        <div class="flex items-center gap-2">
          <!-- 1-Click Copy Shared User URL -->
          <div class="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
            <span class="text-[11px] text-slate-400">Link Pelanggan:</span>
            <a id="sharedUserUrlLink" href="http://localhost:${USER_PORT}" target="_blank" class="text-xs font-extrabold text-sky-400 hover:underline">
              http://localhost:${USER_PORT}
            </a>
            <button
              type="button"
              onclick="copySharedUrl('sharedUserUrlLink')"
              class="px-2 py-0.5 rounded-md bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-bold transition"
            >
              Salin
            </button>
          </div>

          <a
            id="openUserWebBtn"
            href="http://localhost:${USER_PORT}"
            target="_blank"
            class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition shadow-md shadow-amber-500/15"
          >
            🌐 Buka Web User
          </a>

          <button
            type="button"
            onclick="toggleAccountModal(true)"
            class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            title="Pengaturan Akun Admin"
          >
            👤 Akun
          </button>

          <button
            type="button"
            onclick="handleLogout()"
            class="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 transition"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>`;
}
