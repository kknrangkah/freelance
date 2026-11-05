/**
 * Aplikasi Server Web Video Pelanggan — Port 3000 (app/userApp.tsx)
 */

import express, { Request, Response } from 'express';
import path from 'path';
import ENV from '../lib/env';
import { readDb, writeDb } from '../lib/db';
import { parseUserAgent, getClientIp } from '../lib/network';
import { UPLOADS_DIR } from '../lib/upload';
import { DEFAULT_THUMBNAIL, createAdClickLogModel } from '../types/models';
import { PublicVideoItem } from '../types';

import { renderUserNavbar } from '../component/UserNavbar';
import { renderUserSearchAndBanner } from '../component/UserSearchAndBanner';
import { renderUserVideoPlayer } from '../component/UserVideoPlayer';
import { renderUserVideoGrid, renderUserFooterAndFloating } from '../component/UserVideoGrid';

const PUBLIC_DIR = path.join(ENV.ROOT_DIR, 'public');

export const userApp = express();

userApp.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ENV.CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

userApp.use(express.json());
userApp.use('/uploads', express.static(UPLOADS_DIR));
userApp.use('/public', express.static(PUBLIC_DIR));

// API: Ambil daftar video aktif & pengaturan tombol Play
userApp.get('/api/public/videos', (_req: Request, res: Response) => {
  const db = readDb();
  const activeVideos: PublicVideoItem[] = db.videos
    .filter((v) => v.active !== false)
    .map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      category: v.category,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl || DEFAULT_THUMBNAIL,
      clickbaitBadge: v.clickbaitBadge || '🔥 LAGI VIRAL',
      clickbaitOverlayText: v.clickbaitOverlayText || 'TONTON SAMPAI HABIS! JANGAN DISKIP',
      teaserBlur: Boolean(v.teaserBlur),
      duration: v.duration || '03:47',
      views: v.views || 0,
      targetUrl:
        v.customAdUrl && v.customAdUrl.trim() ? v.customAdUrl.trim() : db.adSettings.defaultAdUrl
    }));

  res.json({
    gateConfig: {
      requireClicksCount: db.adSettings.requireClicksCount || 1,
      lockMode: db.adSettings.lockMode || 'every_load',
      enabled: db.adSettings.enabled !== false,
      defaultTargetUrl: db.adSettings.defaultAdUrl
    },
    videos: activeVideos
  });
});

// API: Catat klik iklan saat pelanggan menekan tombol Play
userApp.post('/api/public/track-ad-click', (req: Request, res: Response) => {
  const { videoId, visitorId, adUrlClicked } = req.body as {
    videoId?: string;
    visitorId?: string;
    adUrlClicked?: string;
  };
  const db = readDb();

  const video = db.videos.find((v) => v.id === videoId);
  const resolvedAdUrl =
    adUrlClicked || (video && video.customAdUrl ? video.customAdUrl : db.adSettings.defaultAdUrl);

  const { device, browser } = parseUserAgent(String(req.headers['user-agent'] || ''));
  const ip = getClientIp(req);

  const clickEntry = createAdClickLogModel({
    videoId: video ? video.id : videoId || 'unknown',
    videoTitle: video ? video.title : 'Video Umum',
    adUrl: resolvedAdUrl,
    visitorId,
    ip,
    device,
    browser
  });

  db.adClicksLog.unshift(clickEntry);
  if (video) {
    video.adClicks = (video.adClicks || 0) + 1;
  }

  writeDb(db);
  res.json({ success: true });
});

// API: Catat jumlah tayangan video setelah terbuka
userApp.post('/api/public/track-view', (req: Request, res: Response) => {
  const { videoId } = req.body as { videoId?: string };
  const db = readDb();
  const video = db.videos.find((v) => v.id === videoId);
  if (video) {
    video.views = (video.views || 0) + 1;
    writeDb(db);
  }
  res.json({ success: true, views: video ? video.views : 0 });
});

// Halaman Utama Portal Video Pelanggan (Port 3000)
userApp.get('/', (_req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KingStream - Nonton Video Terbaru 2026</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/user-portal.css" />
</head>
<body class="min-h-screen flex flex-col selection:bg-purple-600 selection:text-white">
  ${renderUserNavbar()}
  <main class="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 py-5 space-y-6">
    ${renderUserSearchAndBanner()}
    ${renderUserVideoPlayer()}
    ${renderUserVideoGrid()}
  </main>
  ${renderUserFooterAndFloating()}
  <script src="/public/js/user-portal.js"></script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

export default userApp;

