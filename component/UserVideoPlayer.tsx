/**
 * Komponen Pemutar Video Utama dengan Stealth Play Button Ad-Gate (component/UserVideoPlayer.tsx)
 */

export function renderUserVideoPlayer(): string {
  return `
    <!-- PEMUTAR VIDEO UTAMA (MUNCUL SAAT SALAH SATU VIDEO DIKLIK) -->
    <section id="playerSection" class="hidden space-y-4 pt-2 pb-4 border-b border-[#22133d]">
      <div class="flex items-center justify-between gap-4">
        <h2 id="activeVideoTitle" class="text-base sm:text-xl font-bold text-white truncate">
          Judul Video
        </h2>
        <button
          onclick="closePlayerView(event)"
          class="px-3 py-1.5 rounded-lg bg-[#1d1136] hover:bg-[#2a194d] text-xs font-semibold text-purple-300 transition flex-shrink-0"
        >
          ✕ Tutup Player
        </button>
      </div>

      <!-- Kotak Video 16:9 dengan Tombol Play (Stealth Ad-Gate Tanpa Pemberitahuan Iklan) -->
      <div class="relative max-w-4xl mx-auto rounded-2xl overflow-hidden bg-black border border-[#2a194d] shadow-2xl aspect-video select-none">
        <video
          id="mainVideoPlayer"
          class="w-full h-full object-contain bg-black"
          playsinline
          preload="metadata"
        ></video>

        <!-- OVERLAY SAMPUL 3-PANEL & TOMBOL PLAY (TANPA KETERANGAN IKLAN) -->
        <div
          id="playGateOverlay"
          class="absolute inset-0 z-20 flex items-center justify-center overflow-hidden cursor-pointer group/player"
        >
          <!-- Sampul 3-Panel di Belakang Tombol Play -->
          <div id="playerCollageBg" class="absolute inset-0 grid grid-cols-3 gap-[2px] bg-black">
            <img id="playerFrame1" src="" class="w-full h-full object-cover object-left brightness-90" />
            <img id="playerFrame2" src="" class="w-full h-full object-cover object-center scale-110" />
            <img id="playerFrame3" src="" class="w-full h-full object-cover object-right brightness-90" />
          </div>

          <div class="absolute inset-0 bg-black/35 group-hover/player:bg-black/25 transition"></div>

          <!-- Tombol Play Tengah -->
          <button
            id="stealthPlayBtn"
            type="button"
            aria-label="Putar Video"
            class="play-pulse relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 text-white flex items-center justify-center transform group-hover/player:scale-110 active:scale-95 transition duration-200 shadow-2xl border-2 border-white/80 focus:outline-none"
          >
            <svg class="w-10 h-10 sm:w-12 sm:h-12 ml-1 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <!-- Badge Pojok Kiri Bawah & Durasi Pojok Kanan Bawah -->
          <div class="absolute bottom-3 left-3 z-10 w-7 h-7 rounded-md bg-black/75 flex items-center justify-center">
            <svg class="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7v8l10-12h-7z"/>
            </svg>
          </div>
          <span id="playerDurationBadge" class="absolute bottom-3 right-3 z-10 px-2.5 py-0.5 rounded bg-black/80 text-white text-xs font-semibold">
            03:30
          </span>
        </div>
      </div>
    </section>`;
}

