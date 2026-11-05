/**
 * Utilitas Jaringan, Deteksi IP LAN/Wi-Fi & Identifikasi Perangkat (lib/network.ts)
 */

import os from 'os';
import { Request } from 'express';
import ENV from './env';
import { LanIpItem, SharedEnvironmentInfo } from '../types';

export function getLocalNetworkIps(): LanIpItem[] {
  const interfaces = os.networkInterfaces();
  const ips: LanIpItem[] = [];
  Object.keys(interfaces).forEach((ifname) => {
    (interfaces[ifname] || []).forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({ interface: ifname, address: iface.address });
      }
    });
  });
  return ips;
}

export function getSharedEnvironmentInfo(): SharedEnvironmentInfo {
  const lanIps = getLocalNetworkIps();
  const primaryLanIp = lanIps.length > 0 ? lanIps[0].address : 'localhost';
  const userLanUrls = lanIps.map((item) => `http://${item.address}:${ENV.USER_PORT}`);
  const adminLanUrls = lanIps.map((item) => `http://${item.address}:${ENV.ADMIN_PORT}`);

  return {
    host: ENV.HOST,
    userPort: ENV.USER_PORT,
    adminPort: ENV.ADMIN_PORT,
    maxUploadMb: ENV.MAX_UPLOAD_MB,
    corsOrigin: ENV.CORS_ORIGIN,
    lanIps,
    primaryUserUrl: ENV.PUBLIC_USER_URL || `http://${primaryLanIp}:${ENV.USER_PORT}`,
    primaryAdminUrl: ENV.PUBLIC_ADMIN_URL || `http://${primaryLanIp}:${ENV.ADMIN_PORT}`,
    localUserUrl: `http://localhost:${ENV.USER_PORT}`,
    localAdminUrl: `http://localhost:${ENV.ADMIN_PORT}`,
    userLanUrls,
    adminLanUrls,
    publicUserUrl: ENV.PUBLIC_USER_URL,
    publicAdminUrl: ENV.PUBLIC_ADMIN_URL
  };
}

export function parseUserAgent(uaString: string = ''): { device: string; browser: string } {
  let device = 'Desktop PC';
  if (/android/i.test(uaString)) device = 'Android Mobile';
  else if (/iphone|ipad|ipod/i.test(uaString)) device = 'iPhone / iOS';
  else if (/windows/i.test(uaString)) device = 'Windows Desktop';
  else if (/macintosh|mac os x/i.test(uaString)) device = 'MacOS Desktop';
  else if (/linux/i.test(uaString)) device = 'Linux Desktop';

  let browser = 'Browser';
  if (/edg/i.test(uaString)) browser = 'Microsoft Edge';
  else if (/opr|opera/i.test(uaString)) browser = 'Opera';
  else if (/chrome|crios/i.test(uaString)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(uaString)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(uaString)) browser = 'Safari';

  return { device, browser };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const rawIp = req.socket?.remoteAddress || '127.0.0.1';
  return rawIp === '::1' ? '127.0.0.1 (Lokal)' : rawIp.replace('::ffff:', '');
}

