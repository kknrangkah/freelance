/**
 * ============================================================================
 * STREAMBIZ / KINGSTREAM — MAIN TYPESCRIPT ENTRY POINT (server.ts)
 *
 * Struktur Folder Modular (TypeScript & TSX):
 *   - app/        : Express App & Routes (userApp.tsx [Port 3000], adminApp.tsx [Port 3001])
 *   - component/  : Komponen UI TSX (User Portal & Admin Panel)
 *   - context/    : Konfigurasi State & Context TSX (PortalContext.tsx, AdminContext.tsx)
 *   - lib/        : Utilitas Inti TS (env.ts, db.ts, network.ts, upload.ts, auth.ts)
 *   - public/     : Aset Statis Frontend (CSS & JavaScript)
 *   - scripts/    : Script CLI TS (reset-db.ts, network-info.ts)
 *   - types/      : Definisi Tipe Data & Model TS (index.ts, models.ts)
 * ============================================================================
 */

import ENV from './lib/env';
import { readDb } from './lib/db';
import { getSharedEnvironmentInfo } from './lib/network';
import userApp from './app/userApp';
import adminApp from './app/adminApp';

const db = readDb();
const sharedEnv = getSharedEnvironmentInfo();

userApp.listen(ENV.USER_PORT, ENV.HOST, () => {
  console.log(`====================================================================`);
  console.log(`🌐 ENVIRONMENT AKSES BERSAMA AKTIF (HOST: ${ENV.HOST} | TypeScript/TSX)`);
  console.log(`--------------------------------------------------------------------`);
  console.log(`🎬 Web Video Pelanggan (Lokal)    : ${sharedEnv.localUserUrl}`);
  if (sharedEnv.userLanUrls.length > 0) {
    sharedEnv.userLanUrls.forEach((url) => {
      console.log(`📱 Web Video Pelanggan (Jaringan) : ${url}  <-- Bagikan ke HP/Laptop lain`);
    });
  }
});

adminApp.listen(ENV.ADMIN_PORT, ENV.HOST, () => {
  console.log(`--------------------------------------------------------------------`);
  console.log(`🔐 Panel Admin (Lokal)            : ${sharedEnv.localAdminUrl}`);
  if (sharedEnv.adminLanUrls.length > 0) {
    sharedEnv.adminLanUrls.forEach((url) => {
      console.log(`💻 Panel Admin (Jaringan)         : ${url}`);
    });
  }
  console.log(
    `👤 Login Admin Default            : username "${db.admin.username}" | password "${db.admin.password}"`
  );
  console.log(`====================================================================`);
});

