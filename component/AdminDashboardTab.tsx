/**
 * Komponen Utama All-in-One Panel Admin (component/AdminDashboardTab.tsx)
 * Desain User-Friendly & Tanpa Banyak Klik:
 * 1. Statistik Ringkas
 * 2. Edit Link Iklan Langsung 1-Klik (Tanpa pindah tab)
 * 3. Upload Video Cepat (Cukup Judul + File Video, Durasi otomatis terdeteksi)
 * 4. Daftar Video & Riwayat Klik Iklan Langsung Terlihat dalam 1 Layar
 */

import { PortConfigProps } from '../types';

export function renderAdminDashboardTab({ USER_PORT, ADMIN_PORT }: PortConfigProps): string {
  return `
      <div class="space-y-6">

        <!-- 1. BARIS STATISTIK RINGKAS (4 KARTU UTAMA) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div class="glass-card rounded-2xl p-4 border-l-4 border-l-amber-500 flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Total Klik Iklan</p>
              <p id="statTotalClicks" class="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5">0</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 text-lg">⚡</div>
          </div>

          <div class="glass-card rounded-2xl p-4 border-l-4 border-l-emerald-500 flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Klik Hari Ini</p>
              <p id="statClicksToday" class="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">0</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-lg">📈</div>
          </div>

          <div class="glass-card rounded-2xl p-4 border-l-4 border-l-sky-500 flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Pelanggan Unik</p>
              <p id="statUniqueVisitors" class="text-2xl sm:text-3xl font-black text-sky-400 mt-0.5">0</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 text-lg">👥</div>
          </div>

          <div class="glass-card rounded-2xl p-4 border-l-4 border-l-purple-500 flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Video Tayang</p>
              <p id="statActiveVideos" class="text-2xl sm:text-3xl font-black text-purple-400 mt-0.5">0</p>
              <span id="statTotalViews" class="hidden">0</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 text-lg">🎬</div>
          </div>
        </div>

        <!-- 2. BAR SETUP LINK IKLAN LANGSUNG (1-KLIK SIMPAN TANPA PINDAH TAB) -->
        <form
          id="adSetupForm"
          class="glass-card rounded-2xl p-4 sm:p-5 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-slate-900/90"
        >
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 flex-shrink-0">
              <span class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black uppercase">
                🔗 Link Iklan Play Button
              </span>
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input id="setupAdEnabled" type="checkbox" checked class="w-4 h-4 accent-emerald-500 rounded" />
                <span id="dashAdStatusBadge" class="text-xs font-bold text-emerald-400">Aktif</span>
              </label>
            </div>

            <div class="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                id="setupDefaultAdUrl"
                type="url"
                required
                placeholder="Tempel link iklan di sini (contoh: https://s.shopee.co.id/...)"
                class="flex-1 bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-amber-500"
              />
              <!-- Hidden defaults agar tidak perlu banyak klik -->
              <input id="setupAdName" type="hidden" value="Iklan Sponsor Utama" />
              <input id="setupRequireClicksCount" type="hidden" value="1" />
              <input id="setupLockMode" type="hidden" value="every_load" />
              <span id="dashCurrentAdUrl" class="hidden"></span>

              <div class="flex items-center gap-2">
                <button
                  type="submit"
                  class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-md shadow-amber-500/20 whitespace-nowrap"
                >
                  💾 Simpan Link
                </button>
                <button
                  type="button"
                  onclick="testOpenAdUrl()"
                  class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition whitespace-nowrap"
                >
                  ↗ Tes
                </button>
              </div>
            </div>
          </div>
        </form>

        <!-- 3. WORKSPACE UTAMA 2 KOLOM: KIRI (UPLOAD VIDEO CEPAT) & KANAN (DAFTAR VIDEO + RIWAYAT KLIK) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- KOLOM KIRI (4 KOLOM): FORM UPLOAD VIDEO 1-KLIK (SIMPEL & CEPAT) -->
          <div class="lg:col-span-5 glass-card rounded-2xl p-5 space-y-4 border border-slate-800">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 id="videoFormTitle" class="text-base font-extrabold text-white">⚡ Upload Video Cepat</h2>
                <p class="text-[11px] text-slate-400">Cukup isi judul & pilih video — langsung tayang!</p>
              </div>
              <button
                id="cancelEditBtn"
                type="button"
                onclick="resetVideoForm()"
                class="hidden px-2.5 py-1 rounded-lg bg-rose-500/15 text-xs text-rose-300 font-bold"
              >
                ✕ Batal Edit
              </button>
            </div>

            <form id="videoMasterForm" class="space-y-3.5">
              <input type="hidden" id="editVideoId" value="" />

              <!-- Langkah 1: Judul Video -->
              <div>
                <label class="block text-xs font-bold text-slate-200 mb-1">
                  1. Judul Video <span class="text-amber-400">*</span>
                </label>
                <input
                  id="vidTitle"
                  type="text"
                  required
                  placeholder="Ketik judul video yang menarik..."
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <!-- Langkah 2: Pilih File Video (Durasi Otomatis Terbaca) -->
              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-amber-400">2. Pilih File Video (.mp4 / .webm)</label>
                  <span id="autoDurationHint" class="text-[11px] text-emerald-400 font-semibold hidden"></span>
                </div>
                <input
                  id="vidFileInput"
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/*"
                  class="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
                <input
                  id="vidUrlInput"
                  type="text"
                  placeholder="Atau tempel link URL video .mp4 (jika tidak upload file)..."
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <!-- Langkah 3: Sampul / Thumbnail (Klik Cepat Preset 1-Klik atau Upload) -->
              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <label class="block text-xs font-bold text-slate-200">
                  3. Sampul Video (Opsional — Klik Preset atau Upload)
                </label>
                <div class="grid grid-cols-4 gap-1.5">
                  <img
                    onclick="pickPresetThumb('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80')"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=60"
                    class="h-11 w-full object-cover rounded-lg cursor-pointer border-2 border-slate-700 hover:border-amber-400 transition"
                    title="Klik untuk pakai sampul ini"
                  />
                  <img
                    onclick="pickPresetThumb('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80')"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=60"
                    class="h-11 w-full object-cover rounded-lg cursor-pointer border-2 border-slate-700 hover:border-amber-400 transition"
                    title="Klik untuk pakai sampul ini"
                  />
                  <img
                    onclick="pickPresetThumb('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80')"
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60"
                    class="h-11 w-full object-cover rounded-lg cursor-pointer border-2 border-slate-700 hover:border-amber-400 transition"
                    title="Klik untuk pakai sampul ini"
                  />
                  <img
                    onclick="pickPresetThumb('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80')"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=60"
                    class="h-11 w-full object-cover rounded-lg cursor-pointer border-2 border-slate-700 hover:border-amber-400 transition"
                    title="Klik untuk pakai sampul ini"
                  />
                </div>
                <input
                  id="thumbFileInput"
                  type="file"
                  accept="image/*"
                  class="w-full text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-slate-700 file:text-white"
                />
                <input id="thumbUrlInput" type="hidden" value="" />
              </div>

              <!-- Opsi Tambahan (Disembunyikan agar tidak ribet, bisa dibuka 1 klik bila perlu) -->
              <details class="rounded-xl bg-slate-900/60 border border-slate-800/80 px-3.5 py-2">
                <summary class="text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  ⚙️ Opsi Tambahan (Kategori, Durasi, Link Iklan Khusus)
                </summary>
                <div class="pt-3 space-y-2.5">
                  <div class="grid grid-cols-2 gap-2.5">
                    <div>
                      <label class="block text-[11px] text-slate-400 mb-1">Kategori</label>
                      <select
                        id="vidCategory"
                        class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="Indo Viral">Indo Viral</option>
                        <option value="Viral & Trending">Trending</option>
                        <option value="Eksklusif">Eksklusif</option>
                        <option value="Terbaru">Terbaru</option>
                        <option value="Populer">Populer</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[11px] text-slate-400 mb-1">Durasi</label>
                      <input
                        id="vidDuration"
                        type="text"
                        value="03:47"
                        class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-400 mb-1">Link Iklan Khusus Video Ini (Opsional)</label>
                    <input
                      id="vidCustomAdUrl"
                      type="text"
                      placeholder="Kosongkan jika memakai Link Iklan Utama"
                      class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <input id="vidClickbaitBadge" type="hidden" value="🔥 VIRAL" />
                  <input id="vidClickbaitOverlayText" type="hidden" value="" />
                  <input id="vidTeaserBlur" type="checkbox" class="hidden" />
                  <input id="vidDescription" type="hidden" value="" />
                </div>
              </details>

              <button
                id="submitVideoBtn"
                type="submit"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition"
              >
                ⬆️ Upload & Tayangkan Sekarang
              </button>
            </form>
          </div>

          <!-- KOLOM KANAN (7 KOLOM): DAFTAR VIDEO & RIWAYAT KLIK IKLAN LANGSUNG TERLIHAT -->
          <div class="lg:col-span-7 space-y-6">

            <!-- BAGIAN A: DAFTAR MASTER VIDEO (KELOLA 1-KLIK) -->
            <div class="glass-card rounded-2xl p-5 space-y-3.5 border border-slate-800">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <h3 class="text-base font-extrabold text-white">🎬 Daftar Video Anda</h3>
                  <p class="text-[11px] text-slate-400">Klik tombol di samping video untuk Edit, Sembunyikan, atau Hapus</p>
                </div>
                <span id="masterVideoCountBadge" class="px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-extrabold">
                  0 Video
                </span>
              </div>

              <div id="masterVideosList" class="space-y-2.5"></div>
              <div id="masterVideosPagination" class="pt-1"></div>
            </div>

            <!-- BAGIAN B: RIWAYAT PELANGGAN YANG MENGKLIK IKLAN (AUTO-REFRESH) -->
            <div class="glass-card rounded-2xl p-5 space-y-3.5 border border-slate-800">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="text-base font-extrabold text-white">📊 Riwayat Pelanggan Klik Iklan (Live)</h3>
                  <p class="text-[11px] text-slate-400">Otomatis bertambah saat pelanggan menekan Play di Web User</p>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    id="logSearchInput"
                    type="text"
                    placeholder="Cari pelanggan / video..."
                    class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 w-40 sm:w-48"
                  />
                  <button
                    type="button"
                    onclick="exportClicksCsv()"
                    class="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition"
                  >
                    📥 CSV
                  </button>
                  <button
                    type="button"
                    onclick="clearClickLogs()"
                    class="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold text-rose-300 transition"
                  >
                    🗑️ Reset
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto rounded-xl border border-slate-800">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-slate-900/95 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                      <th class="py-2.5 px-3.5">Waktu</th>
                      <th class="py-2.5 px-3.5">Pelanggan & IP</th>
                      <th class="py-2.5 px-3.5">Video Diputar</th>
                      <th class="py-2.5 px-3.5">Perangkat</th>
                    </tr>
                  </thead>
                  <tbody id="adClicksTableBody" class="divide-y divide-slate-800/70"></tbody>
                </table>
              </div>
              <div id="adClicksPagination" class="pt-1"></div>
            </div>

          </div>
        </div>
      </div>`;
}
