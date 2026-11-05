/**
 * Komponen Navbar Atas & Menu Kategori (component/UserNavbar.tsx)
 */

export function renderUserNavbar(): string {
  return `
  <!-- TOP NAVBAR -->
  <header class="sticky top-0 z-40 bg-[#120824]/95 backdrop-blur-md border-b border-[#22133d]">
    <div class="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Logo Kiri (Ikon Mahkota Ungu + Nama) -->
      <a href="/" onclick="closePlayerView(event)" class="flex items-center gap-2.5 flex-shrink-0">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-md shadow-purple-600/30">
          <svg class="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
          </svg>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-white">King<span class="text-purple-400">Stream</span></span>
      </a>

      <!-- Menu Navigasi Kanan -->
      <nav id="topCategoryNav" class="flex items-center gap-5 sm:gap-7 overflow-x-auto text-xs sm:text-sm font-medium text-gray-300 no-scrollbar">
        <button data-cat="Semua" onclick="filterByCategory('Semua')" class="nav-cat-link text-purple-400 font-bold hover:text-purple-300 transition whitespace-nowrap">Home</button>
        <button data-cat="Indo Viral" onclick="filterByCategory('Indo Viral')" class="nav-cat-link hover:text-purple-400 transition whitespace-nowrap">Indo Viral</button>
        <button data-cat="Viral & Trending" onclick="filterByCategory('Viral & Trending')" class="nav-cat-link hover:text-purple-400 transition whitespace-nowrap">Trending</button>
        <button data-cat="Eksklusif" onclick="filterByCategory('Eksklusif')" class="nav-cat-link hover:text-purple-400 transition whitespace-nowrap">Eksklusif</button>
        <button data-cat="Terbaru" onclick="filterByCategory('Terbaru')" class="nav-cat-link hover:text-purple-400 transition whitespace-nowrap">Terbaru</button>
        <button data-cat="Populer" onclick="filterByCategory('Populer')" class="nav-cat-link hover:text-purple-400 transition whitespace-nowrap">Populer</button>
      </nav>
    </div>
  </header>`;
}

