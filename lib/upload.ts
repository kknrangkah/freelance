/**
 * Konfigurasi Upload File Video & Sampul Thumbnail (lib/upload.ts)
 */

import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ENV from './env';

export const UPLOADS_DIR = path.join(ENV.ROOT_DIR, 'uploads');
export const VIDEOS_UPLOAD_DIR = path.join(UPLOADS_DIR, 'videos');
export const THUMBS_UPLOAD_DIR = path.join(UPLOADS_DIR, 'thumbnails');

[UPLOADS_DIR, VIDEOS_UPLOAD_DIR, THUMBS_UPLOAD_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'videoFile') {
      cb(null, VIDEOS_UPLOAD_DIR);
    } else {
      cb(null, THUMBS_UPLOAD_DIR);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    cb(null, `${Date.now()}-${safeBase}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: ENV.MAX_UPLOAD_MB * 1024 * 1024 }
});

