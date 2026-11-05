/**
 * Komponen Grid Video 4 Kolom, Pagination & Tombol Mengambang (component/UserVideoGrid.tsx)
 */

export function renderUserVideoGrid(): string {
  return `
    <!-- JUDUL HALAMAN & PILIHAN JUMLAH PER HALAMAN -->
    <div id="catalogSection" class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
      <div class="space-y-1">
        <h1 class="text-lg sm:text-[22px] font-bold text-white tracking-tight">
          KingStream - Nonton Video Terbaru 2026
        </h1>
        <p class="text-xs sm:text-sm text-[#9ca3af]">
          KingStream adalah situs streaming video viral, koleksi terbaru, dan video terupdate setiap hari
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-end">
        <label for="perPageSelect" class="text-xs text-gray-400">Tampilkan:</label>
        <select
          id="perPageSelect"
          onchange="changeVideosPerPage(this.value)"
          class="bg-[#180d2e] border border-[#2d1a52] text-gray-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
        >
          <option value="8" selected>8 Video / Halaman</option>
          <option value="12">12 Video / Halaman</option>
          <option value="16">16 Video / Halaman</option>
          <option value="24">24 Video / Halaman</option>
        </select>
      </div>
    </div>

    <!-- GRID VIDEO 4 KOLOM & PAGINATION -->
    <section class="space-y-8">
      <div id="videoGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7"></div>
      <div id="paginationContainer" class="pt-2"></div>
    </section>`;
}

export function renderUserFooterAndFloating(): string {
  return `
  <!-- FLOATING BUTTON POJOK KANAN BAWAH -->
  <div
    onclick="openMainBannerAd()"
    class="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 cursor-pointer group"
  >
    <span class="text-xs sm:text-sm font-medium text-gray-200 bg-[#160b2b]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-purple-500/30 shadow-lg group-hover:text-white transition">
      Channel Tele KingStream
    </span>
    <div class="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-600/40 group-hover:scale-105 transition">
      <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
      </svg>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-[#1f1138] py-6 mt-14 text-center text-xs text-gray-500">
    <div class="max-w-[1360px] mx-auto px-4">
      <p>© 2026 KingStream. Seluruh hak cipta dilindungi.</p>
    </div>
  </footer>`;
}

