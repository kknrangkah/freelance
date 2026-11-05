/**
 * Komponen Tab 4: Pengaturan Akun Admin (component/AdminAccountTab.tsx)
 */

export function renderAdminAccountTab(): string {
  return `
      <!-- TAB 4: PENGATURAN AKUN ADMIN -->
      <section id="tabPanel-account" class="hidden">
        <div class="max-w-lg mx-auto glass-card rounded-2xl p-6 sm:p-8 space-y-5">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="text-xl font-extrabold text-white">Pengaturan Akun Admin</h2>
            <p class="text-xs text-slate-400 mt-1">Perbarui username atau password login administrator</p>
          </div>
          <form id="accountForm" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Nama Tampilan Admin</label>
              <input
                id="accName"
                type="text"
                required
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Username Login</label>
              <input
                id="accUsername"
                type="text"
                required
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Password Baru (Kosongkan jika tidak diubah)</label>
              <input
                id="accPassword"
                type="password"
                placeholder="Masukkan password baru..."
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition"
            >
              Simpan Perubahan Akun
            </button>
          </form>
        </div>
      </section>`;
}

