/**
 * Komponen Tab 3: Master Data Video & Sampul Clickbait (component/AdminVideoMasterTab.tsx)
 */

export function renderAdminVideoMasterTab(): string {
  return `
      <!-- TAB 3: MASTER DATA VIDEO & SAMPUL CLICKBAIT -->
      <section id="tabPanel-videos" class="hidden space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          <div class="glass-card rounded-2xl p-6 space-y-5">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 id="videoFormTitle" class="text-lg font-extrabold text-white">Upload Video & Sampul Clickbait</h3>
                <p class="text-xs text-slate-400">Buat sampul yang bikin pengunjung penasaran</p>
              </div>
              <button
                id="cancelEditBtn"
                type="button"
                onclick="resetVideoForm()"
                class="hidden text-xs text-rose-400 hover:underline font-semibold"
              >
                Batal Edit
              </button>
            </div>

            <form id="videoMasterForm" class="space-y-4">
              <input type="hidden" id="editVideoId" value="" />

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Judul Video Clickbait <span class="text-amber-400">*</span></label>
                <input
                  id="vidTitle"
                  type="text"
                  required
                  placeholder="Contoh: Detik-Detik Kejadian Tak Terduga yang Lagi Viral!"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <!-- Pengaturan Elemen Clickbait Sampul -->
              <div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/30 space-y-3">
                <label class="block text-xs font-extrabold text-rose-400 uppercase">🔥 Pengaturan Sampul Bikin Penasaran (Clickbait)</label>
                <div>
                  <span class="block text-[11px] text-slate-300 mb-1">Badge Pojok Atas Sampul</span>
                  <input
                    id="vidClickbaitBadge"
                    type="text"
                    value="🔥 LAGI VIRAL #1"
                    placeholder="Contoh: 🔥 LAGI VIRAL #1 / ⚠️ JANGAN DISKIP!"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <span class="block text-[11px] text-slate-300 mb-1">Teks Besar di Atas Sampul Video (Headline Clickbait)</span>
                  <input
                    id="vidClickbaitOverlayText"
                    type="text"
                    value="DETIK-DETIK BIKIN MELONGO! JANGAN DISKIP"
                    placeholder="Contoh: PERHATIKAN DETIK TERAKHIR! BIKIN MERINDING"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <label class="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input id="vidTeaserBlur" type="checkbox" class="w-4 h-4 accent-rose-500 rounded" />
                  <span class="text-xs font-semibold text-slate-200">Aktifkan Efek Sensor / Blur Penasaran pada Sampul</span>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Kategori</label>
                  <input
                    id="vidCategory"
                    type="text"
                    value="Indo Viral"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-300 mb-1">Durasi</label>
                  <input
                    id="vidDuration"
                    type="text"
                    value="03:47"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <label class="block text-xs font-bold text-amber-400">Sumber File Video</label>
                <div>
                  <span class="block text-[11px] text-slate-300 mb-1">Opsi 1: Upload File Video (.mp4 / .webm)</span>
                  <input
                    id="vidFileInput"
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/*"
                    class="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400"
                  />
                </div>
                <div class="text-center text-[11px] text-slate-500 font-semibold">— ATAU —</div>
                <div>
                  <span class="block text-[11px] text-slate-300 mb-1">Opsi 2: URL File Video MP4</span>
                  <input
                    id="vidUrlInput"
                    type="text"
                    placeholder="https://.../video.mp4"
                    class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <!-- Gambar Sampul / Thumbnail -->
              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <label class="block text-xs font-bold text-slate-300">Gambar Sampul / Thumbnail Video</label>
                <input
                  id="thumbFileInput"
                  type="file"
                  accept="image/*"
                  class="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                />
                <input
                  id="thumbUrlInput"
                  type="text"
                  placeholder="Atau pilih preset di bawah / tempel URL gambar..."
                  class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <div class="pt-1">
                  <span class="block text-[10px] text-slate-400 mb-1.5">Klik Cepat Preset Gambar Sampul Penasaran:</span>
                  <div class="grid grid-cols-4 gap-1.5">
                    <img
                      onclick="pickPresetThumb('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85')"
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=60"
                      class="h-11 w-full object-cover rounded cursor-pointer border border-slate-700 hover:border-amber-400"
                      title="Preset Misterius 1"
                    />
                    <img
                      onclick="pickPresetThumb('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=85')"
                      src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=60"
                      class="h-11 w-full object-cover rounded cursor-pointer border border-slate-700 hover:border-amber-400"
                      title="Preset Dramatis 2"
                    />
                    <img
                      onclick="pickPresetThumb('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=85')"
                      src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=60"
                      class="h-11 w-full object-cover rounded cursor-pointer border border-slate-700 hover:border-amber-400"
                      title="Preset Rahasia 3"
                    />
                    <img
                      onclick="pickPresetThumb('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=85')"
                      src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=200&q=60"
                      class="h-11 w-full object-cover rounded cursor-pointer border border-slate-700 hover:border-amber-400"
                      title="Preset Kamera 4"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Link Iklan Khusus Video Ini (Opsional)</label>
                <input
                  id="vidCustomAdUrl"
                  type="text"
                  placeholder="Kosongkan jika memakai Link Iklan Utama"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Deskripsi Video</label>
                <textarea
                  id="vidDescription"
                  rows="2"
                  placeholder="Tulis kalimat yang membuat penonton penasaran..."
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                id="submitVideoBtn"
                type="submit"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition"
              >
                ⬆️ Simpan Video & Sampul Clickbait
              </button>
            </form>
          </div>

          <div class="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 class="text-lg font-extrabold text-white">Daftar Master Data Video</h3>
                <p class="text-xs text-slate-400">Kelola video, sampul clickbait, efek blur sensor, dan link iklannya</p>
              </div>
              <span id="masterVideoCountBadge" class="px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-bold">
                0 Video
              </span>
            </div>

            <div id="masterVideosList" class="space-y-3"></div>
            <div id="masterVideosPagination" class="pt-2"></div>
          </div>
        </div>
      </section>`;
}

