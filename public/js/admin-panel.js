/**
 * Script Interaktif Panel Admin All-in-One (public/js/admin-panel.js)
 * Fitur Ramah Pengguna & Minim Klik:
 * - Semua kontrol dalam 1 layar (tanpa pindah tab)
 * - Deteksi durasi video otomatis saat pilih file .mp4
 * - Simpan link iklan 1 klik langsung di atas
 * - Auto-refresh riwayat klik iklan setiap 5 detik secara otomatis
 */

let adminToken = localStorage.getItem('streambiz_admin_token') || '';
let dashboardState = null;
let adminLogsPage = 1;
const adminLogsPerPage = 6;
let adminVideosPage = 1;
const adminVideosPerPage = 5;
let autoRefreshTimer = null;

function buildAdminPaginationHtml(currentPage, totalPages, totalItems, perPage, onPageFnName) {
  if (totalItems <= perPage) return '';
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(totalItems, currentPage * perPage);

  let pages = [];
  if (totalPages <= 7) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    pages = [1];
    if (currentPage > 3) pages.push('...');
    const s = Math.max(2, currentPage - 1);
    const e = Math.min(totalPages - 1, currentPage + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btns = pages
    .map((p) => {
      if (p === '...') {
        return '<span class="px-2 py-1 text-xs text-slate-500">...</span>';
      }
      const active = p === currentPage;
      return `
        <button
          type="button"
          onclick="${onPageFnName}(${p})"
          class="min-w-[30px] h-7 px-2 rounded-lg text-xs font-bold transition ${
            active
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }"
        >
          ${p}
        </button>
      `;
    })
    .join('');

  return `
    <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
      <span class="text-[11px] text-slate-400">
        <strong class="text-slate-200">${startItem}–${endItem}</strong> dari <strong class="text-amber-400">${totalItems}</strong>
      </span>
      <div class="flex items-center gap-1">
        <button
          type="button"
          onclick="${onPageFnName}(${currentPage - 1})"
          ${currentPage <= 1 ? 'disabled' : ''}
          class="h-7 px-2.5 rounded-lg text-xs font-semibold border transition ${
            currentPage <= 1
              ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
          }"
        >
          ‹
        </button>
        ${btns}
        <button
          type="button"
          onclick="${onPageFnName}(${currentPage + 1})"
          ${currentPage >= totalPages ? 'disabled' : ''}
          class="h-7 px-2.5 rounded-lg text-xs font-semibold border transition ${
            currentPage >= totalPages
              ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
          }"
        >
          ›
        </button>
      </div>
    </div>
  `;
}

window.goToAdminLogsPage = function (p) {
  adminLogsPage = p;
  renderAdClicksTable();
};

window.goToAdminVideosPage = function (p) {
  adminVideosPage = p;
  renderMasterVideosList();
};

window.toggleAccountModal = function (show) {
  const modal = document.getElementById('accountModal');
  if (!modal) return;
  if (show) modal.classList.remove('hidden');
  else modal.classList.add('hidden');
};

function showToast(message, type = 'success') {
  const box = document.getElementById('toastBox');
  const inner = document.getElementById('toastInner');
  const text = document.getElementById('toastText');

  text.textContent = message;
  if (type === 'error') {
    inner.className =
      'px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-semibold bg-rose-950/95 border-rose-500/50 text-rose-200';
  } else {
    inner.className =
      'px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-semibold bg-emerald-950/95 border-emerald-500/50 text-emerald-200';
  }

  box.classList.remove('hidden');
  setTimeout(() => box.classList.add('hidden'), 3000);
}

window.pickPresetThumb = function (url) {
  document.getElementById('thumbUrlInput').value = url;
  showToast('Sampul dipilih (1-Klik)!');
};

// Deteksi Durasi Video & Judul Otomatis saat memilih file video .mp4
const vidFileInputEl = document.getElementById('vidFileInput');
if (vidFileInputEl) {
  vidFileInputEl.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Jika judul masih kosong, isi otomatis dari nama file
    const titleInput = document.getElementById('vidTitle');
    if (titleInput && !titleInput.value.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
      titleInput.value = cleanName;
    }

    // Baca durasi otomatis menggunakan elemen video sementara
    const tempVid = document.createElement('video');
    tempVid.preload = 'metadata';
    tempVid.onloadedmetadata = () => {
      window.URL.revokeObjectURL(tempVid.src);
      const sec = Math.round(tempVid.duration || 0);
      if (sec > 0) {
        const mins = String(Math.floor(sec / 60)).padStart(2, '0');
        const secs = String(sec % 60).padStart(2, '0');
        const formatted = `${mins}:${secs}`;
        const durInput = document.getElementById('vidDuration');
        if (durInput) durInput.value = formatted;
        const hint = document.getElementById('autoDurationHint');
        if (hint) {
          hint.textContent = `✓ Durasi otomatis: ${formatted}`;
          hint.classList.remove('hidden');
        }
      }
    };
    tempVid.src = URL.createObjectURL(file);
  });
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Gagal login!', 'error');
      return;
    }
    adminToken = data.token;
    localStorage.setItem('streambiz_admin_token', adminToken);
    showToast('Login berhasil!');
    enterAdminView();
  } catch (err) {
    showToast('Gagal menghubungi server', 'error');
  }
});

window.handleLogout = async function () {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  } catch (e) {}
  adminToken = '';
  localStorage.removeItem('streambiz_admin_token');
  document.getElementById('adminMainView').classList.add('hidden');
  document.getElementById('loginView').classList.remove('hidden');
};

async function enterAdminView() {
  const ok = await fetchDashboardData(false);
  if (ok) {
    document.getElementById('loginView').classList.add('hidden');
    document.getElementById('adminMainView').classList.remove('hidden');
    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    autoRefreshTimer = setInterval(() => {
      fetchDashboardData(false, true);
    }, 5000);
  } else {
    document.getElementById('adminMainView').classList.add('hidden');
    document.getElementById('loginView').classList.remove('hidden');
  }
}

async function fetchDashboardData(notify = false, isSilentBackground = false) {
  if (!adminToken) return false;
  try {
    const res = await fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status === 401) {
      localStorage.removeItem('streambiz_admin_token');
      adminToken = '';
      return false;
    }
    dashboardState = await res.json();
    renderAllAdminSections(isSilentBackground);
    if (notify) showToast('Data diperbarui!');
    return true;
  } catch (err) {
    return false;
  }
}

window.copySharedUrl = function (elemId) {
  const el = document.getElementById(elemId);
  if (!el) return;
  const text = el.textContent.trim();
  navigator.clipboard
    .writeText(text)
    .then(() => showToast('Link disalin: ' + text))
    .catch(() => showToast('Link: ' + text));
};

function renderAllAdminSections(isSilentBackground = false) {
  if (!dashboardState) return;
  const { summary, adSettings, adminProfile, envInfo } = dashboardState;

  if (envInfo) {
    const dynamicUserUrl =
      envInfo.publicUserUrl ||
      (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? `${window.location.protocol}//${window.location.hostname}:${envInfo.userPort}`
        : envInfo.primaryUserUrl);

    const openUserBtn = document.getElementById('openUserWebBtn');
    if (openUserBtn) openUserBtn.href = dynamicUserUrl;

    const userUrlEl = document.getElementById('sharedUserUrlLink');
    if (userUrlEl) {
      userUrlEl.href = dynamicUserUrl;
      userUrlEl.textContent = dynamicUserUrl;
    }
  }

  document.getElementById('statTotalClicks').textContent = summary.totalAdClicks;
  document.getElementById('statClicksToday').textContent = summary.clicksToday;
  document.getElementById('statUniqueVisitors').textContent = summary.uniqueVisitors;
  document.getElementById('statActiveVideos').textContent = summary.activeVideos;

  const statusBadge = document.getElementById('dashAdStatusBadge');
  if (statusBadge) {
    if (adSettings.enabled !== false) {
      statusBadge.textContent = 'Aktif';
      statusBadge.className = 'text-xs font-bold text-emerald-400';
    } else {
      statusBadge.textContent = 'Nonaktif';
      statusBadge.className = 'text-xs font-bold text-rose-400';
    }
  }

  // Jangan timpa input link iklan jika admin sedang mengetik di dalamnya
  const adInput = document.getElementById('setupDefaultAdUrl');
  if (!isSilentBackground || document.activeElement !== adInput) {
    if (adInput) adInput.value = adSettings.defaultAdUrl || '';
    const adCheck = document.getElementById('setupAdEnabled');
    if (adCheck) adCheck.checked = adSettings.enabled !== false;
  }

  renderMasterVideosList();
  renderAdClicksTable();

  if (!isSilentBackground && adminProfile) {
    const accNameEl = document.getElementById('accName');
    const accUserEl = document.getElementById('accUsername');
    if (accNameEl) accNameEl.value = adminProfile.name || '';
    if (accUserEl) accUserEl.value = adminProfile.username || '';
  }
}

function renderAdClicksTable() {
  if (!dashboardState) return;
  const logs = dashboardState.adClicksLog || [];
  const q = (document.getElementById('logSearchInput').value || '').toLowerCase().trim();

  const filtered = logs.filter((item) => {
    if (!q) return true;
    return (
      (item.visitorId || '').toLowerCase().includes(q) ||
      (item.videoTitle || '').toLowerCase().includes(q) ||
      (item.ip || '').toLowerCase().includes(q) ||
      (item.device || '').toLowerCase().includes(q) ||
      (item.browser || '').toLowerCase().includes(q)
    );
  });

  const tbody = document.getElementById('adClicksTableBody');
  const pagEl = document.getElementById('adClicksPagination');
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="py-6 text-center text-slate-500 text-xs">
          Belum ada riwayat klik iklan.
        </td>
      </tr>
    `;
    if (pagEl) pagEl.innerHTML = '';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / adminLogsPerPage));
  if (adminLogsPage > totalPages) adminLogsPage = totalPages;
  if (adminLogsPage < 1) adminLogsPage = 1;

  const startIdx = (adminLogsPage - 1) * adminLogsPerPage;
  const paginatedLogs = filtered.slice(startIdx, startIdx + adminLogsPerPage);

  tbody.innerHTML = paginatedLogs
    .map((c) => {
      const dt = new Date(c.timestamp);
      const formattedTime = dt.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const formattedDate = dt.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short'
      });

      return `
        <tr class="hover:bg-slate-900/60 transition">
          <td class="py-2.5 px-3.5 whitespace-nowrap">
            <span class="font-bold text-white">${formattedTime}</span>
            <span class="text-[10px] text-slate-400 ml-1">${formattedDate}</span>
          </td>
          <td class="py-2.5 px-3.5 whitespace-nowrap">
            <span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold text-[11px]">${
              c.visitorId || 'Pelanggan'
            }</span>
            <span class="text-[11px] text-slate-400 ml-1">${c.ip || ''}</span>
          </td>
          <td class="py-2.5 px-3.5">
            <span class="font-semibold text-slate-100 line-clamp-1">${c.videoTitle}</span>
          </td>
          <td class="py-2.5 px-3.5 whitespace-nowrap text-[11px] text-slate-300">
            ${c.device || 'Desktop'} • ${c.browser || 'Browser'}
          </td>
        </tr>
      `;
    })
    .join('');

  if (pagEl) {
    pagEl.innerHTML = buildAdminPaginationHtml(
      adminLogsPage,
      totalPages,
      filtered.length,
      adminLogsPerPage,
      'goToAdminLogsPage'
    );
  }
}

document.getElementById('logSearchInput').addEventListener('input', () => {
  adminLogsPage = 1;
  renderAdClicksTable();
});

// Simpan Link Iklan 1-Klik (dan juga otomatis simpan saat checkbox aktif/nonaktif diubah)
async function saveAdSettingsInline() {
  const payload = {
    defaultAdUrl: document.getElementById('setupDefaultAdUrl').value.trim(),
    adName: 'Iklan Sponsor Utama',
    requireClicksCount: 1,
    lockMode: 'every_load',
    enabled: document.getElementById('setupAdEnabled').checked
  };

  try {
    const res = await fetch('/api/admin/ad-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Gagal menyimpan link iklan', 'error');
      return;
    }
    showToast('Link Iklan tersimpan!');
    fetchDashboardData(false);
  } catch (err) {
    showToast('Kesalahan jaringan', 'error');
  }
}

document.getElementById('adSetupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  saveAdSettingsInline();
});

document.getElementById('setupAdEnabled').addEventListener('change', () => {
  saveAdSettingsInline();
});

window.testOpenAdUrl = function () {
  let url = document.getElementById('setupDefaultAdUrl').value.trim();
  if (!url) {
    showToast('Masukkan URL iklan terlebih dahulu', 'error');
    return;
  }
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  window.open(url, '_blank', 'noopener,noreferrer');
};

document.getElementById('videoMasterForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = document.getElementById('editVideoId').value.trim();
  const submitBtn = document.getElementById('submitVideoBtn');

  const formData = new FormData();
  formData.append('title', document.getElementById('vidTitle').value.trim());
  formData.append('category', document.getElementById('vidCategory').value.trim());
  formData.append('duration', document.getElementById('vidDuration').value.trim());
  formData.append('videoUrl', document.getElementById('vidUrlInput').value.trim());
  formData.append('thumbnailUrl', document.getElementById('thumbUrlInput').value.trim());
  formData.append('customAdUrl', document.getElementById('vidCustomAdUrl').value.trim());

  const vidFile = document.getElementById('vidFileInput').files[0];
  if (vidFile) formData.append('videoFile', vidFile);
  const thumbFile = document.getElementById('thumbFileInput').files[0];
  if (thumbFile) formData.append('thumbnailFile', thumbFile);

  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Mengupload...';

  try {
    const endpoint = editId ? `/api/admin/videos/${editId}` : '/api/admin/videos';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Gagal menyimpan video', 'error');
    } else {
      showToast(data.message || 'Video berhasil disimpan!');
      resetVideoForm();
      fetchDashboardData(false);
    }
  } catch (err) {
    showToast('Gagal mengupload video', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '⬆️ Upload & Tayangkan Sekarang';
  }
});

function renderMasterVideosList() {
  const videos = (dashboardState && dashboardState.videos) || [];
  document.getElementById('masterVideoCountBadge').textContent = `${videos.length} Video`;

  const container = document.getElementById('masterVideosList');
  const pagEl = document.getElementById('masterVideosPagination');
  if (videos.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl text-xs">
        Belum ada video. Silakan isi <strong>Judul</strong> & pilih <strong>File Video</strong> di sebelah kiri untuk langsung menayangkan.
      </div>
    `;
    if (pagEl) pagEl.innerHTML = '';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(videos.length / adminVideosPerPage));
  if (adminVideosPage > totalPages) adminVideosPage = totalPages;
  if (adminVideosPage < 1) adminVideosPage = 1;

  const startIdx = (adminVideosPage - 1) * adminVideosPerPage;
  const paginatedVideos = videos.slice(startIdx, startIdx + adminVideosPerPage);

  container.innerHTML = paginatedVideos
    .map((v) => {
      return `
        <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <img
              src="${v.thumbnailUrl}"
              alt="${v.title}"
              class="w-20 h-12 rounded-lg object-cover bg-slate-800 flex-shrink-0 border border-slate-700"
              onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'"
            />
            <div class="min-w-0 flex-1">
              <h4 class="text-xs sm:text-sm font-bold text-white truncate">${v.title}</h4>
              <div class="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                <span class="text-amber-400 font-bold">⚡ ${v.adClicks || 0} klik</span>
                <span>•</span>
                <span>⏱️ ${v.duration || '03:47'}</span>
                <span>•</span>
                <span class="${v.active !== false ? 'text-emerald-400' : 'text-rose-400'} font-semibold">
                  ${v.active !== false ? '● Tayang' : '○ Sembunyi'}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button
              onclick="toggleVideoActive('${v.id}', ${v.active !== false ? 'false' : 'true'})"
              class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 transition"
              title="Tampilkan / Sembunyikan (1-Klik)"
            >
              ${v.active !== false ? 'Sembunyikan' : 'Tayangkan'}
            </button>
            <button
              onclick="startEditVideo('${v.id}')"
              class="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-[11px] font-bold text-amber-300 transition"
            >
              Edit
            </button>
            <button
              onclick="deleteVideo('${v.id}')"
              class="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-[11px] font-bold text-rose-300 transition"
            >
              ✕
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  if (pagEl) {
    pagEl.innerHTML = buildAdminPaginationHtml(
      adminVideosPage,
      totalPages,
      videos.length,
      adminVideosPerPage,
      'goToAdminVideosPage'
    );
  }
}

window.startEditVideo = function (id) {
  const videos = (dashboardState && dashboardState.videos) || [];
  const v = videos.find((item) => item.id === id);
  if (!v) return;

  document.getElementById('editVideoId').value = v.id;
  document.getElementById('vidTitle').value = v.title || '';
  document.getElementById('vidCategory').value = v.category || 'Indo Viral';
  document.getElementById('vidDuration').value = v.duration || '03:47';
  document.getElementById('vidUrlInput').value = v.videoUrl || '';
  document.getElementById('thumbUrlInput').value = v.thumbnailUrl || '';
  document.getElementById('vidCustomAdUrl').value = v.customAdUrl || '';

  document.getElementById('videoFormTitle').textContent = '✏️ Edit Video';
  document.getElementById('submitVideoBtn').textContent = '💾 Simpan Perubahan';
  document.getElementById('cancelEditBtn').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.resetVideoForm = function () {
  document.getElementById('videoMasterForm').reset();
  document.getElementById('editVideoId').value = '';
  document.getElementById('thumbUrlInput').value = '';
  const hint = document.getElementById('autoDurationHint');
  if (hint) hint.classList.add('hidden');
  document.getElementById('videoFormTitle').textContent = '⚡ Upload Video Cepat';
  document.getElementById('submitVideoBtn').textContent = '⬆️ Upload & Tayangkan Sekarang';
  document.getElementById('cancelEditBtn').classList.add('hidden');
};

window.toggleVideoActive = async function (id, newActiveState) {
  try {
    const res = await fetch(`/api/admin/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ active: newActiveState })
    });
    if (res.ok) {
      showToast('Status video diperbarui!');
      fetchDashboardData(false);
    }
  } catch (e) {}
};

// Hapus 1-Klik langsung tanpa dialog bertumpuk yang mengganggu
window.deleteVideo = async function (id) {
  try {
    const res = await fetch(`/api/admin/videos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok) {
      showToast('Video dihapus!');
      fetchDashboardData(false);
    }
  } catch (e) {}
};

window.clearClickLogs = async function () {
  try {
    const res = await fetch('/api/admin/clicks-log', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok) {
      showToast('Riwayat klik iklan direset!');
      fetchDashboardData(false);
    }
  } catch (e) {}
};

window.exportClicksCsv = function () {
  const logs = (dashboardState && dashboardState.adClicksLog) || [];
  if (logs.length === 0) {
    showToast('Belum ada data klik iklan untuk diexport', 'error');
    return;
  }

  const headers = [
    'Waktu Klik',
    'ID Pelanggan',
    'IP Address',
    'Judul Video',
    'Link Iklan',
    'Perangkat',
    'Browser'
  ];
  const rows = logs.map((c) => [
    new Date(c.timestamp).toLocaleString('id-ID'),
    c.visitorId || '',
    c.ip || '',
    `"${(c.videoTitle || '').replace(/"/g, '""')}"`,
    `"${(c.adUrl || '').replace(/"/g, '""')}"`,
    c.device || '',
    c.browser || ''
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `laporan-klik-iklan-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

document.getElementById('accountForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('accName').value.trim();
  const username = document.getElementById('accUsername').value.trim();
  const password = document.getElementById('accPassword').value.trim();

  try {
    const res = await fetch('/api/admin/account', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name, username, password })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('accPassword').value = '';
      toggleAccountModal(false);
      showToast(data.message || 'Akun admin diperbarui');
    } else {
      showToast(data.error || 'Gagal memperbarui akun', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan', 'error');
  }
});

if (adminToken) {
  enterAdminView();
}
