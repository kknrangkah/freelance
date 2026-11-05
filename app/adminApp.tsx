/**
 * Aplikasi Server Panel Admin — Port 3001 (app/adminApp.tsx)
 */

import express, { Request, Response } from 'express';
import path from 'path';
import ENV from '../lib/env';
import { readDb, writeDb } from '../lib/db';
import { getSharedEnvironmentInfo } from '../lib/network';
import { UPLOADS_DIR, upload } from '../lib/upload';
import { createAdminSession, removeAdminSession, requireAdmin } from '../lib/auth';
import { DEFAULT_THUMBNAIL, normalizeUrl, createVideoModel } from '../types/models';

import { renderAdminLoginAndHeader, renderAdminTopNavbar } from '../component/AdminHeader';
import { renderAdminDashboardTab } from '../component/AdminDashboardTab';

const PUBLIC_DIR = path.join(ENV.ROOT_DIR, 'public');

export const adminApp = express();

adminApp.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ENV.CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

adminApp.use(express.json({ limit: '50mb' }));
adminApp.use(express.urlencoded({ extended: true, limit: '50mb' }));
adminApp.use('/uploads', express.static(UPLOADS_DIR));
adminApp.use('/public', express.static(PUBLIC_DIR));

interface MulterFilesMap {
  videoFile?: Express.Multer.File[];
  thumbnailFile?: Express.Multer.File[];
}

// API: Login Admin
adminApp.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };
  const db = readDb();

  if (username === db.admin.username && password === db.admin.password) {
    const token = createAdminSession();
    res.json({
      success: true,
      token,
      admin: { username: db.admin.username, name: db.admin.name }
    });
    return;
  }
  res.status(401).json({ error: 'Username atau Password salah!' });
});

// API: Logout Admin
adminApp.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  removeAdminSession(token);
  res.json({ success: true });
});

// API: Update Akun Admin
adminApp.put('/api/admin/account', requireAdmin, (req: Request, res: Response) => {
  const { username, password, name } = req.body as {
    username?: string;
    password?: string;
    name?: string;
  };
  const db = readDb();
  if (username && username.trim()) db.admin.username = username.trim();
  if (password && password.trim()) db.admin.password = password.trim();
  if (name && name.trim()) db.admin.name = name.trim();
  writeDb(db);
  res.json({
    success: true,
    message: 'Akun admin berhasil diperbarui',
    admin: { username: db.admin.username, name: db.admin.name }
  });
});

// API: Data Lengkap Dashboard Admin
adminApp.get('/api/admin/dashboard', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();

  const totalAdClicks = db.adClicksLog.length;
  const totalViews = db.videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalVideos = db.videos.length;
  const activeVideos = db.videos.filter((v) => v.active !== false).length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const clicksToday = db.adClicksLog.filter(
    (c) => c.timestamp && c.timestamp.slice(0, 10) === todayStr
  ).length;

  const uniqueVisitors = new Set(db.adClicksLog.map((c) => c.visitorId)).size;

  const last7Days: Array<{ dateKey: string; label: string; count: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateKey = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
    const count = db.adClicksLog.filter(
      (c) => c.timestamp && c.timestamp.slice(0, 10) === dateKey
    ).length;
    last7Days.push({ dateKey, label, count });
  }

  res.json({
    summary: {
      totalAdClicks,
      clicksToday,
      totalViews,
      totalVideos,
      activeVideos,
      uniqueVisitors
    },
    last7Days,
    adSettings: db.adSettings,
    videos: db.videos,
    adClicksLog: db.adClicksLog,
    envInfo: getSharedEnvironmentInfo(),
    adminProfile: {
      username: db.admin.username,
      name: db.admin.name
    }
  });
});

// API: Simpan Setup Link Iklan
adminApp.put('/api/admin/ad-settings', requireAdmin, (req: Request, res: Response) => {
  const { defaultAdUrl, adName, requireClicksCount, lockMode, enabled } = req.body as {
    defaultAdUrl?: string;
    adName?: string;
    requireClicksCount?: number | string;
    lockMode?: string;
    enabled?: boolean | string;
  };
  if (!defaultAdUrl || !defaultAdUrl.trim()) {
    res.status(400).json({ error: 'Link iklan utama wajib diisi!' });
    return;
  }

  const formattedUrl = normalizeUrl(defaultAdUrl);
  const db = readDb();
  db.adSettings = {
    defaultAdUrl: formattedUrl,
    adName: (adName || 'Iklan Sponsor Utama').trim(),
    requireClicksCount: Math.max(1, Math.min(5, parseInt(String(requireClicksCount || 1), 10) || 1)),
    lockMode: lockMode === 'once_per_session' ? 'once_per_session' : 'every_load',
    enabled: enabled !== false && enabled !== 'false',
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  res.json({
    success: true,
    message: 'Setup Link Iklan berhasil disimpan!',
    adSettings: db.adSettings
  });
});

// API: Tambah Master Video Baru
adminApp.post(
  '/api/admin/videos',
  requireAdmin,
  upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
  ]),
  (req: Request, res: Response) => {
    const {
      title,
      description,
      category,
      videoSourceType,
      videoUrl,
      thumbnailUrl,
      clickbaitBadge,
      clickbaitOverlayText,
      teaserBlur,
      customAdUrl,
      duration,
      active
    } = req.body as Record<string, string | undefined>;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Judul video wajib diisi!' });
      return;
    }

    const files = (req.files || {}) as MulterFilesMap;

    let finalVideoUrl = '';
    if (files.videoFile && files.videoFile[0]) {
      finalVideoUrl = `/uploads/videos/${files.videoFile[0].filename}`;
    } else if (videoUrl && videoUrl.trim()) {
      finalVideoUrl = videoUrl.trim();
    } else {
      res.status(400).json({ error: 'Silakan pilih file video atau masukkan URL video!' });
      return;
    }

    let finalThumbUrl = DEFAULT_THUMBNAIL;
    if (files.thumbnailFile && files.thumbnailFile[0]) {
      finalThumbUrl = `/uploads/thumbnails/${files.thumbnailFile[0].filename}`;
    } else if (thumbnailUrl && thumbnailUrl.trim()) {
      finalThumbUrl = thumbnailUrl.trim();
    }

    const db = readDb();
    const newVideo = createVideoModel({
      title,
      description,
      category,
      videoSourceType: files.videoFile ? 'upload' : videoSourceType || 'url',
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbUrl,
      clickbaitBadge,
      clickbaitOverlayText,
      teaserBlur,
      customAdUrl,
      duration,
      views: 0,
      adClicks: 0,
      active
    });

    db.videos.unshift(newVideo);
    writeDb(db);

    res.json({
      success: true,
      message: 'Video berhasil diupload & langsung tayang!',
      video: newVideo
    });
  }
);

// API: Edit Master Video
adminApp.put(
  '/api/admin/videos/:id',
  requireAdmin,
  upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
  ]),
  (req: Request, res: Response) => {
    const id = String(req.params.id || '');
    const db = readDb();
    const video = db.videos.find((v) => v.id === id);
    if (!video) {
      res.status(404).json({ error: 'Video tidak ditemukan' });
      return;
    }

    const {
      title,
      description,
      category,
      videoUrl,
      thumbnailUrl,
      clickbaitBadge,
      clickbaitOverlayText,
      teaserBlur,
      customAdUrl,
      duration,
      active
    } = req.body as Record<string, string | boolean | undefined>;

    if (typeof title === 'string' && title.trim()) video.title = title.trim();
    if (typeof description === 'string') video.description = description.trim();
    if (typeof category === 'string' && category.trim()) video.category = category.trim();
    if (typeof duration === 'string' && duration.trim()) video.duration = duration.trim();
    if (typeof clickbaitBadge === 'string' && clickbaitBadge.trim()) {
      video.clickbaitBadge = clickbaitBadge.trim();
    }
    if (typeof clickbaitOverlayText === 'string') {
      video.clickbaitOverlayText = clickbaitOverlayText.trim();
    }
    if (teaserBlur !== undefined) {
      video.teaserBlur = teaserBlur === 'true' || teaserBlur === true;
    }
    if (active !== undefined) {
      video.active = active !== 'false' && active !== false;
    }

    const files = (req.files || {}) as MulterFilesMap;

    if (files.videoFile && files.videoFile[0]) {
      video.videoUrl = `/uploads/videos/${files.videoFile[0].filename}`;
      video.videoSourceType = 'upload';
    } else if (typeof videoUrl === 'string' && videoUrl.trim()) {
      video.videoUrl = videoUrl.trim();
    }

    if (files.thumbnailFile && files.thumbnailFile[0]) {
      video.thumbnailUrl = `/uploads/thumbnails/${files.thumbnailFile[0].filename}`;
    } else if (typeof thumbnailUrl === 'string' && thumbnailUrl.trim()) {
      video.thumbnailUrl = thumbnailUrl.trim();
    }

    if (typeof customAdUrl === 'string') {
      video.customAdUrl = normalizeUrl(customAdUrl);
    }

    writeDb(db);
    res.json({
      success: true,
      message: 'Data video berhasil diperbarui!',
      video
    });
  }
);

// API: Hapus Master Video
adminApp.delete('/api/admin/videos/:id', requireAdmin, (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  const db = readDb();
  const index = db.videos.findIndex((v) => v.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Video tidak ditemukan' });
    return;
  }

  db.videos.splice(index, 1);
  writeDb(db);
  res.json({ success: true, message: 'Video berhasil dihapus' });
});

// API: Reset Riwayat Klik Iklan
adminApp.delete('/api/admin/clicks-log', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  db.adClicksLog = [];
  db.videos.forEach((v) => {
    v.adClicks = 0;
  });
  writeDb(db);
  res.json({ success: true, message: 'Riwayat klik iklan berhasil direset' });
});

// Halaman Utama Panel Admin (Port 3001) — All-in-One 1 Layar
adminApp.get('/', (_req: Request, res: Response) => {
  const ports = { USER_PORT: ENV.USER_PORT, ADMIN_PORT: ENV.ADMIN_PORT };
  const html = `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KingStream Admin — 1-Click Dashboard & Upload Video</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/admin-panel.css" />
</head>
<body class="min-h-screen flex flex-col">
  ${renderAdminLoginAndHeader(ports)}
  <div id="adminMainView" class="hidden flex-1 flex flex-col">
    ${renderAdminTopNavbar(ports)}
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
      ${renderAdminDashboardTab(ports)}
    </main>
  </div>
  <script src="/public/js/admin-panel.js"></script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

export default adminApp;
