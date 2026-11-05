/**
 * Script CLI Utilitas Database TypeScript (scripts/reset-db.ts)
 *
 * Penggunaan:
 *   npm run db:reset       -> Reset database menjadi bersih (video & log klik dikosongkan)
 *   npm run db:clear-logs  -> Hanya mengosongkan riwayat klik iklan
 *   npm run db:seed        -> Mengisi database dengan video contoh (sample data)
 *   npm run db:restore     -> Mengembalikan database dari data/db.backup.json
 */

import fs from 'fs';
import ENV from '../lib/env';
import { DB_FILE, BACKUP_FILE, readDb, writeDb } from '../lib/db';
import { DatabaseSchema, VideoItem } from '../types';

const args = process.argv.slice(2);
const isSeed = args.includes('--seed');
const isLogsOnly = args.includes('--logs-only');
const isRestore = args.includes('--restore');

const currentDb = readDb();

if (isRestore) {
  if (!fs.existsSync(BACKUP_FILE)) {
    console.log('⚠️ File backup (data/db.backup.json) tidak ditemukan.');
    process.exit(1);
  }
  fs.copyFileSync(BACKUP_FILE, DB_FILE);
  console.log('✅ Database berhasil dikembalikan dari data/db.backup.json!');
  process.exit(0);
}

// Simpan backup otomatis sebelum mengubah db.json
if (currentDb) {
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(currentDb, null, 2), 'utf8');
}

const adminConfig = (currentDb && currentDb.admin) || {
  username: ENV.ADMIN_DEFAULT_USER,
  password: ENV.ADMIN_DEFAULT_PASS,
  name: ENV.ADMIN_DEFAULT_NAME
};

const adSettingsConfig = (currentDb && currentDb.adSettings) || {
  defaultAdUrl: 'https://s.shopee.co.id/LlyjAypJt',
  adName: 'Iklan Sponsor Utama',
  adButtonText: 'Klik Iklan & Putar Video',
  requireClicksCount: 1,
  lockMode: 'every_load' as const,
  enabled: true,
  updatedAt: new Date().toISOString()
};

if (isLogsOnly && currentDb) {
  currentDb.adClicksLog = [];
  if (Array.isArray(currentDb.videos)) {
    currentDb.videos.forEach((v) => {
      v.adClicks = 0;
    });
  }
  writeDb(currentDb);
  console.log('✅ Riwayat klik iklan berhasil direset (daftar video tetap dipertahankan).');
  process.exit(0);
}

const sampleVideos: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Koleksi Video Viral Pilihan Terbaik Minggu Ini',
    description: 'Rekaman eksklusif yang sedang ramai diperbincangkan hari ini.',
    category: 'Indo Viral',
    videoSourceType: 'url',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    clickbaitBadge: '🔥 TRENDING',
    clickbaitOverlayText: 'KOLEKSI VIRAL PILIHAN',
    teaserBlur: false,
    customAdUrl: '',
    duration: '03:47',
    views: 0,
    adClicks: 0,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'vid-2',
    title: 'Kompilasi Momen Spesial Terpopuler Full HD',
    description: 'Video kompilasi pilihan dengan kualitas jernih.',
    category: 'Viral & Trending',
    videoSourceType: 'url',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    clickbaitBadge: '🚨 EKSKLUSIF',
    clickbaitOverlayText: 'KOMPILASI TERPOPULER FULL HD',
    teaserBlur: false,
    customAdUrl: '',
    duration: '14:22',
    views: 0,
    adClicks: 0,
    active: true,
    createdAt: new Date().toISOString()
  }
];

const newDb: DatabaseSchema = {
  admin: adminConfig,
  adSettings: {
    ...adSettingsConfig,
    updatedAt: new Date().toISOString()
  },
  videos: isSeed ? sampleVideos : [],
  adClicksLog: []
};

writeDb(newDb);

console.log('========================================================');
if (isSeed) {
  console.log('✅ Database berhasil di-reset dan diisi dengan video contoh (seed)!');
} else {
  console.log('✅ Database (data/db.json) berhasil di-reset menjadi bersih!');
  console.log('   - Daftar Video       : 0 video (Kosong / Siap upload baru)');
  console.log('   - Riwayat Klik Iklan : 0 klik');
  console.log('   - Akun Admin         : ' + adminConfig.username);
  console.log('   - Link Iklan Utama   : ' + adSettingsConfig.defaultAdUrl);
  console.log('   - Backup Data Lama   : Tersimpan di data/db.backup.json');
}
console.log('========================================================');

