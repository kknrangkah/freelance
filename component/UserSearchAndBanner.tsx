/**
 * Komponen Pencarian Full-Width & Banner Promo Tengah (component/UserSearchAndBanner.tsx)
 */

export function renderUserSearchAndBanner(): string {
  return `
    <!-- FULL-WIDTH SEARCH BAR DENGAN TOMBOL "CARI" -->
    <form id="searchForm" onsubmit="handleSearchSubmit(event)" class="search-box rounded-xl p-1.5 flex items-center gap-2 transition">
      <div class="pl-3 pr-1 text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
        </svg>
      </div>
      <input
        id="searchInput"
        type="text"
        placeholder="Pencarian Video..."
        class="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-400 focus:outline-none py-1.5"
      />
      <button
        type="submit"
        class="px-5 py-2 rounded-lg bg-[#252836] hover:bg-[#32364a] text-gray-200 text-xs sm:text-sm font-semibold transition"
      >
        Cari
      </button>
    </form>

    <!-- BANNER PROMO TENGAH (KLIK MEMBUKA LINK IKLAN) -->
    <div class="flex justify-center pt-1">
      <div
        onclick="openMainBannerAd()"
        class="w-full max-w-[430px] h-[105px] rounded-xl overflow-hidden border-2 border-emerald-500/80 bg-gradient-to-r from-[#1a0f2e] via-[#122b24] to-[#0a1f17] shadow-lg shadow-emerald-950/40 flex items-center justify-between cursor-pointer group relative"
      >
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
          alt="Promo Banner"
          class="w-44 h-full object-cover object-center group-hover:scale-105 transition duration-300"
        />
        <div class="flex-1 px-3 py-2 text-center flex flex-col items-center justify-center">
          <span class="text-white font-black text-base sm:text-lg tracking-wide leading-none uppercase">BONUS SPESIAL</span>
          <span class="text-gray-200 font-bold text-xs tracking-wider uppercase mt-0.5">ANTI ZONK HARI INI</span>
          <span class="mt-1 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-extrabold uppercase">KLIK PROMO AKTIF</span>
          <span class="mt-1.5 text-emerald-400 font-black text-xs tracking-wide uppercase">⚡ PROMO VIP RESMI</span>
        </div>
      </div>
    </div>`;
}

