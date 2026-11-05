/**
 * Konfigurasi Environment (.env) untuk Akses Bersama (lib/env.ts)
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_FILE = path.join(ROOT_DIR, '.env');

export function loadEnvFile(): void {
  if (!fs.existsSync(ENV_FILE)) return;
  const content = fs.readFileSync(ENV_FILE, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  });
}

loadEnvFile();

export interface EnvConfig {
  ROOT_DIR: string;
  HOST: string;
  USER_PORT: number;
  ADMIN_PORT: number;
  PUBLIC_USER_URL: string;
  PUBLIC_ADMIN_URL: string;
  CORS_ORIGIN: string;
  MAX_UPLOAD_MB: number;
  ADMIN_DEFAULT_USER: string;
  ADMIN_DEFAULT_PASS: string;
  ADMIN_DEFAULT_NAME: string;
}

export const ENV: EnvConfig = {
  ROOT_DIR,
  HOST: process.env.HOST || '0.0.0.0',
  USER_PORT: parseInt(process.env.USER_PORT || '3000', 10) || 3000,
  ADMIN_PORT: parseInt(process.env.ADMIN_PORT || '3001', 10) || 3001,
  PUBLIC_USER_URL: (process.env.PUBLIC_USER_URL || '').trim(),
  PUBLIC_ADMIN_URL: (process.env.PUBLIC_ADMIN_URL || '').trim(),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  MAX_UPLOAD_MB: parseInt(process.env.MAX_UPLOAD_MB || '500', 10) || 500,
  ADMIN_DEFAULT_USER: process.env.ADMIN_DEFAULT_USER || 'admin',
  ADMIN_DEFAULT_PASS: process.env.ADMIN_DEFAULT_PASS || 'admin123',
  ADMIN_DEFAULT_NAME: process.env.ADMIN_DEFAULT_NAME || 'Administrator Utama'
};

export default ENV;

