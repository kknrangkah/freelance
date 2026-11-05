/**
 * Script Interaktif Portal Video Pelanggan — 1-Klik Langsung Putar (public/js/user-portal.js)
 * Fitur User-Friendly & Minim Klik:
 * - Klik tombol Play pada kartu video di daftar langsung membuka link iklan & langsung memutar video (1-Klik)
 * - Tanpa teks/pemberitahuan iklan
 */

function getVisitorId() {
  let vid = localStorage.getItem('streambiz_visitor_id');
  if (!vid) {
    vid = 'PLG-' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('streambiz_visitor_id', vid);
  }
  return vid;
}

const visitorId = getVisitorId();

let gateConfig = {
  requireClicksCount: 1,
  lockMode: 'every_load',
  enabled: true,
  defaultTargetUrl: 'https://www.google.com'
};
let allVideos = [];
let activeVideo = null;
let selectedCategory = 'Semua';
let currentVideoClicksDone = 0;
let isCurrentVideoUnlocked = false;
let currentPage = 1;
let videosPerPage = 8;

const unlockedSessionVideos = new Set(
  JSON.parse(sessionStorage.getItem('streambiz_unlocked_videos') || '[]')
);

const playerSection = document.getElementById('playerSection');
const videoEl = document.getElementById('mainVideoPlayer');
const playGateOverlay = document.getElementById('playGateOverlay');

async function loadPortalData() {
  try {
    const res = await fetch('/api/public/videos');
    const data = await res.json();
    gateConfig = data.gateConfig || gateConfig;
    allVideos = data.videos || [];
    renderVideoCatalog();
  } catch (err) {
    console.error('Gagal memuat video:', err);
  }
}

function getTargetUrl(video) {
  if (video && video.targetUrl && video.targetUrl.trim()) {
    return video.targetUrl.trim();
  }
  return gateConfig.defaultTargetUrl || 'https://www.google.com';
}

function triggerAdClickAndTrack(video) {
  const targetUrl = getTargetUrl(video);
  window.open(targetUrl, '_blank', 'noopener,noreferrer');

  fetch('/api/public/track-ad-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoId: video ? video.id : 'banner',
      visitorId,
      adUrlClicked: targetUrl
    })
  }).catch(() => {});
}

function trackVideoView(video) {
  if (!video) return;
  fetch('/api/public/track-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId: video.id })
  }).catch(() => {});
}

window.openMainBannerAd = function () {
  triggerAdClickAndTrack(activeVideo || allVideos[0]);
};

// 1-KLIK LANGSUNG PUTAR: Saat pelanggan klik tombol Play pada video di katalog,
// langsung buka link iklan di tab baru & langsung putar videonya tanpa perlu klik ke-2!
window.selectVideo = function (videoId) {
  const found = allVideos.find((v) => v.id === videoId);
  if (!found) return;
  activeVideo = found;

  playerSection.classList.remove('hidden');

  videoEl.pause();
  videoEl.src = found.videoUrl;
  videoEl.load();

  const thumb =
    found.thumbnailUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  document.getElementById('playerFrame1').src = thumb;
  document.getElementById('playerFrame2').src = thumb;
  document.getElementById('playerFrame3').src = thumb;
  document.getElementById('playerDurationBadge').textContent = found.duration || '03:47';
  document.getElementById('activeVideoTitle').textContent = found.title;

  const gateActive = gateConfig.enabled !== false;
  const alreadyUnlocked =
    gateConfig.lockMode === 'once_per_session' && unlockedSessionVideos.has(found.id);
  const reqCount = Math.max(1, parseInt(gateConfig.requireClicksCount, 10) || 1);

  if (gateActive && !alreadyUnlocked) {
    // Klik pertama langsung dihitung saat memilih kartu video
    triggerAdClickAndTrack(found);
    currentVideoClicksDone = 1;

    if (currentVideoClicksDone >= reqCount) {
      unlockVideoPlayer(true);
      trackVideoView(found);
    } else {
      lockVideoPlayer();
    }
  } else {
    currentVideoClicksDone = reqCount;
    unlockVideoPlayer(true);
    trackVideoView(found);
  }

  renderVideoCatalog();
  playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.closePlayerView = function (e) {
  if (e) e.preventDefault();
  videoEl.pause();
  playerSection.classList.add('hidden');
  activeVideo = null;
  renderVideoCatalog();
};

function lockVideoPlayer() {
  isCurrentVideoUnlocked = false;
  videoEl.removeAttribute('controls');
  videoEl.pause();
  playGateOverlay.classList.remove('hidden');
}

function unlockVideoPlayer(autoPlay = true) {
  isCurrentVideoUnlocked = true;
  playGateOverlay.classList.add('hidden');
  videoEl.setAttribute('controls', 'controls');

  if (activeVideo) {
    unlockedSessionVideos.add(activeVideo.id);
    sessionStorage.setItem('streambiz_unlocked_videos', JSON.stringify([...unlockedSessionVideos]));
  }

  if (autoPlay) {
    videoEl.play().catch(() => {});
  }
}

videoEl.addEventListener('play', () => {
  if (!isCurrentVideoUnlocked) {
    videoEl.pause();
    lockVideoPlayer();
  }
});

videoEl.addEventListener('ended', () => {
  if (gateConfig.enabled !== false && gateConfig.lockMode === 'every_load') {
    currentVideoClicksDone = 0;
    lockVideoPlayer();
  }
});

playGateOverlay.addEventListener('click', () => {
  if (!activeVideo) return;

  currentVideoClicksDone += 1;
  const reqCount = Math.max(1, parseInt(gateConfig.requireClicksCount, 10) || 1);

  triggerAdClickAndTrack(activeVideo);

  if (currentVideoClicksDone >= reqCount) {
    unlockVideoPlayer(true);
    trackVideoView(activeVideo);
  }
});

window.filterByCategory = function (cat) {
  selectedCategory = cat;
  currentPage = 1;

  document.querySelectorAll('#topCategoryNav .nav-cat-link').forEach((btn) => {
    if (btn.getAttribute('data-cat') === cat) {
      btn.className =
        'nav-cat-link text-purple-400 font-bold hover:text-purple-300 transition whitespace-nowrap';
    } else {
      btn.className = 'nav-cat-link text-gray-300 hover:text-purple-400 transition whitespace-nowrap';
    }
  });

  renderVideoCatalog();
};

window.handleSearchSubmit = function (e) {
  e.preventDefault();
  currentPage = 1;
  renderVideoCatalog();
};

window.changeVideosPerPage = function (val) {
  videosPerPage = Math.max(4, parseInt(val, 10) || 8);
  currentPage = 1;
  renderVideoCatalog();
};

window.goToPage = function (page) {
  currentPage = page;
  renderVideoCatalog();
  const catEl = document.getElementById('catalogSection');
  if (catEl) {
    catEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function getPaginationPages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [1];
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

function renderPaginationBar(totalItems, totalPages) {
  const container = document.getElementById('paginationContainer');
  if (!container) return;

  if (totalItems === 0) {
    container.innerHTML = '';
    return;
  }

  const startItem = (currentPage - 1) * videosPerPage + 1;
  const endItem = Math.min(totalItems, currentPage * videosPerPage);
  const pages = getPaginationPages(currentPage, totalPages);

  const pageButtonsHtml = pages
    .map((p) => {
      if (p === '...') {
        return `<span class="px-2.5 py-2 text-xs font-semibold text-gray-500 select-none">...</span>`;
      }
      const isActive = p === currentPage;
      return `
        <button
          type="button"
          onclick="goToPage(${p})"
          class="min-w-[38px] h-[38px] px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center ${
            isActive
              ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-600/35 border border-purple-400/50'
              : 'bg-[#180d2e] hover:bg-[#241445] text-gray-300 hover:text-white border border-[#2b1852]'
          }"
        >
          ${p}
        </button>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#1f1138]">
      <div class="text-xs sm:text-sm text-gray-400">
        Menampilkan <span class="text-white font-semibold">${startItem}–${endItem}</span> dari <span class="text-purple-400 font-semibold">${totalItems}</span> video
        <span class="text-gray-500 ml-1">(Halaman ${currentPage} dari ${totalPages})</span>
      </div>

      <div class="flex items-center flex-wrap justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onclick="goToPage(${currentPage - 1})"
          ${currentPage <= 1 ? 'disabled' : ''}
          class="h-[38px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border ${
            currentPage <= 1
              ? 'bg-[#130a24] text-gray-600 border-[#1d1036] cursor-not-allowed'
              : 'bg-[#180d2e] hover:bg-[#241445] text-gray-200 hover:text-white border-[#2b1852]'
          }"
        >
          ‹ Prev
        </button>

        ${pageButtonsHtml}

        <button
          type="button"
          onclick="goToPage(${currentPage + 1})"
          ${currentPage >= totalPages ? 'disabled' : ''}
          class="h-[38px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border ${
            currentPage >= totalPages
              ? 'bg-[#130a24] text-gray-600 border-[#1d1036] cursor-not-allowed'
              : 'bg-[#180d2e] hover:bg-[#241445] text-gray-200 hover:text-white border-[#2b1852]'
          }"
        >
          Next ›
        </button>
      </div>
    </div>
  `;
}

function renderVideoCatalog() {
  const searchVal = (document.getElementById('searchInput').value || '').toLowerCase().trim();

  const filtered = allVideos.filter((v) => {
    const matchesCat =
      selectedCategory === 'Semua' ||
      selectedCategory === 'Terbaru' ||
      selectedCategory === 'Populer' ||
      (v.category || '').toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      !searchVal ||
      v.title.toLowerCase().includes(searchVal) ||
      (v.description || '').toLowerCase().includes(searchVal) ||
      (v.category || '').toLowerCase().includes(searchVal);

    return matchesCat && matchesSearch;
  });

  const grid = document.getElementById('videoGrid');
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-14 text-center text-gray-400 text-sm">
        Belum ada video yang ditampilkan.
      </div>
    `;
    renderPaginationBar(0, 0);
    return;
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / videosPerPage));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * videosPerPage;
  const paginatedVideos = filtered.slice(startIndex, startIndex + videosPerPage);

  grid.innerHTML = paginatedVideos
    .map((v) => {
      const isCurrent = activeVideo && activeVideo.id === v.id;
      const thumb =
        v.thumbnailUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

      return `
        <div
          onclick="selectVideo('${v.id}')"
          class="group cursor-pointer flex flex-col"
        >
          <!-- THUMBNAIL 3-PANEL COLLAGE DENGAN TOMBOL PLAY 1-KLIK -->
          <div class="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#180d2e] ${
            isCurrent ? 'ring-2 ring-purple-500' : ''
          }">
            <div class="w-full h-full grid grid-cols-3 gap-[1.5px] bg-[#0d061a] group-hover:scale-[1.03] transition duration-300">
              <div class="overflow-hidden h-full">
                <img
                  src="${thumb}"
                  alt="${v.title}"
                  class="w-full h-full object-cover object-left scale-125"
                  onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'"
                />
              </div>
              <div class="overflow-hidden h-full">
                <img
                  src="${thumb}"
                  alt="${v.title}"
                  class="w-full h-full object-cover object-center scale-110"
                  onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'"
                />
              </div>
              <div class="overflow-hidden h-full">
                <img
                  src="${thumb}"
                  alt="${v.title}"
                  class="w-full h-full object-cover object-right scale-125"
                  onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'"
                />
              </div>
            </div>

            <!-- Overlay Tombol Play Tengah (1-Klik Langsung Putar) -->
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition flex items-center justify-center">
              <div class="w-11 h-11 rounded-full bg-purple-600/90 group-hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition border border-white/70">
                <svg class="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            <!-- Ikon Petir Merah Pojok Kiri Bawah -->
            <div class="absolute bottom-2 left-2 w-6 h-6 rounded bg-black/75 flex items-center justify-center shadow">
              <svg class="w-3.5 h-3.5 text-rose-500 fill-current" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l10-12h-7z"/>
              </svg>
            </div>

            <!-- Durasi Pojok Kanan Bawah -->
            <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-semibold tracking-tight">
              ${v.duration || '08:39'}
            </span>
          </div>

          <!-- JUDUL RATA TENGAH DI BAWAH THUMBNAIL -->
          <h3 class="mt-2.5 px-2 text-center text-[13px] sm:text-[14px] font-medium text-[#b8a9d9] group-hover:text-white transition leading-snug line-clamp-2">
            ${v.title}
          </h3>
        </div>
      `;
    })
    .join('');

  renderPaginationBar(totalItems, totalPages);
}

document.getElementById('searchInput').addEventListener('input', () => {
  currentPage = 1;
  renderVideoCatalog();
});

loadPortalData();
