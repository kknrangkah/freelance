/**
 * Manajemen Database JSON Bersama (lib/db.ts)
 */

import fs from 'fs';
import path from 'path';
import ENV from './env';
import { DatabaseSchema } from '../types';

export const DATA_DIR = path.join(ENV.ROOT_DIR, 'data');
export const DB_FILE = path.join(DATA_DIR, 'db.json');
export const BACKUP_FILE = path.join(DATA_DIR, 'db.backup.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const defaultDb: DatabaseSchema = {
  admin: {
    username: ENV.ADMIN_DEFAULT_USER,
    password: ENV.ADMIN_DEFAULT_PASS,
    name: ENV.ADMIN_DEFAULT_NAME
  },
  adSettings: {
    defaultAdUrl: 'https://s.shopee.co.id/LlyjAypJt',
    adName: 'Iklan Sponsor Utama',
    adButtonText: 'Klik Iklan & Putar Video',
    requireClicksCount: 1,
    lockMode: 'every_load',
    enabled: true,
    updatedAt: new Date().toISOString()
  },
  videos: [],
  adClicksLog: []
};

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(defaultDb)) as DatabaseSchema;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) as DatabaseSchema;
  } catch (err) {
    console.error('Gagal membaca database:', err);
    return JSON.parse(JSON.stringify(defaultDb)) as DatabaseSchema;
  }
}

export function writeDb(data: DatabaseSchema): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

