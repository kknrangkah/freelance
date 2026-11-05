/**
 * Script CLI Informasi Environment & Jaringan Akses Bersama TypeScript (scripts/network-info.ts)
 */

import { getSharedEnvironmentInfo } from '../lib/network';
import { readDb } from '../lib/db';

const env = getSharedEnvironmentInfo();
const db = readDb();

console.log('====================================================================');
console.log('🌐 INFORMASI ENVIRONMENT & JARINGAN AKSES BERSAMA');
console.log('====================================================================');
console.log(`Host Binding                 : ${env.host}`);
console.log(`Web Video Pelanggan (Lokal)  : ${env.localUserUrl}`);
env.userLanUrls.forEach((u) => {
  console.log(`Web Video Pelanggan (LAN/HP) : ${u}`);
});
console.log('--------------------------------------------------------------------');
console.log(`Panel Admin (Lokal)          : ${env.localAdminUrl}`);
env.adminLanUrls.forEach((u) => {
  console.log(`Panel Admin (LAN/HP)         : ${u}`);
});
console.log('--------------------------------------------------------------------');
console.log(`Total Video Tersimpan        : ${db.videos.length} video`);
console.log(`Total Riwayat Klik Iklan     : ${db.adClicksLog.length} klik`);
console.log('====================================================================');

