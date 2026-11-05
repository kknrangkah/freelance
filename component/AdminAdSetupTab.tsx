/**
 * Komponen Tab 2: Setup Link Iklan Tertanam di Play Button (component/AdminAdSetupTab.tsx)
 */

export function renderAdminAdSetupTab(): string {
  return `
      <!-- TAB 2: SETUP LINK IKLAN -->
      <section id="tabPanel-adsetup" class="hidden space-y-6">
        <div class="max-w-3xl mx-auto glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <span class="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 text-xs font-bold">KONFIGURASI IKLAN PLAY BUTTON (SILENT / TANPA PEMBERITAHUAN)</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-2">Setup Link Iklan Tertanam</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Link ini ditanam di balik Sampul Clickbait & tombol Play tanpa menampilkan keterangan iklan apa pun kepada pelanggan.
            </p>
          </div>

          <form id="adSetupForm" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-200 mb-1.5">
                Link / URL Iklan Utama (Wajib) <span class="text-amber-400">*</span>
              </label>
              <div class="flex gap-2">
                <input
                  id="setupDefaultAdUrl"
                  type="url"
                  required
                  placeholder="https://s.shopee.co.id/..."
                  class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onclick="testOpenAdUrl()"
                  class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-400 whitespace-nowrap"
                >
                  ↗ Test Link
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-200 mb-1.5">Nama Catatan Kampanye</label>
                <input
                  id="setupAdName"
                  type="text"
                  placeholder="Contoh: Shopee Affiliate"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-200 mb-1.5">Jumlah Klik Play Sebelum Video Berputar</label>
                <select
                  id="setupRequireClicksCount"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="1">1x Klik Play (Langsung Putar Video)</option>
                  <option value="2">2x Klik Play (Harus Klik 2 Kali)</option>
                  <option value="3">3x Klik Play (Harus Klik 3 Kali)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-200 mb-1.5">Mode Penguncian Play Button</label>
                <select
                  id="setupLockMode"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="every_load">Setiap Kali Memilih / Memuat Video</option>
                  <option value="once_per_session">1x per Video Selama Sesi Browser</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <p class="text-sm font-bold text-white">Aktifkan Link Iklan pada Tombol Play</p>
                <p class="text-xs text-slate-400">Pelanggan tetap melihat sampul & tombol Play standar tanpa tahu ada iklan yang tertanam</p>
              </div>
              <label class="inline-flex items-center cursor-pointer">
                <input id="setupAdEnabled" type="checkbox" checked class="sr-only peer" />
                <div class="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all relative peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div class="pt-2 flex items-center justify-end">
              <button
                type="submit"
                class="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition"
              >
                💾 Simpan Setup Link Iklan
              </button>
            </div>
          </form>
        </div>
      </section>`;
}

