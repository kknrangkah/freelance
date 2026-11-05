/**
 * Definisi Tipe Data TypeScript (types/index.ts)
 */

export interface AdminAccount {
  username: string;
  password?: string;
  name: string;
}

export type LockMode = 'every_load' | 'once_per_session';

export interface AdSettings {
  defaultAdUrl: string;
  adName: string;
  adButtonText?: string;
  requireClicksCount: number;
  lockMode: LockMode;
  enabled: boolean;
  updatedAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  videoSourceType: 'upload' | 'url';
  videoUrl: string;
  thumbnailUrl: string;
  clickbaitBadge: string;
  clickbaitOverlayText: string;
  teaserBlur: boolean;
  customAdUrl: string;
  duration: string;
  views: number;
  adClicks: number;
  active: boolean;
  createdAt: string;
}

export interface PublicVideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  clickbaitBadge: string;
  clickbaitOverlayText: string;
  teaserBlur: boolean;
  duration: string;
  views: number;
  targetUrl: string;
}

export interface AdClickLog {
  id: string;
  videoId: string;
  videoTitle: string;
  adUrl: string;
  visitorId: string;
  ip: string;
  device: string;
  browser: string;
  timestamp: string;
}

export interface DatabaseSchema {
  admin: Required<AdminAccount>;
  adSettings: AdSettings;
  videos: VideoItem[];
  adClicksLog: AdClickLog[];
}

export interface LanIpItem {
  interface: string;
  address: string;
}

export interface SharedEnvironmentInfo {
  host: string;
  userPort: number;
  adminPort: number;
  maxUploadMb: number;
  corsOrigin: string;
  lanIps: LanIpItem[];
  primaryUserUrl: string;
  primaryAdminUrl: string;
  localUserUrl: string;
  localAdminUrl: string;
  userLanUrls: string[];
  adminLanUrls: string[];
  publicUserUrl: string;
  publicAdminUrl: string;
}

export interface PortConfigProps {
  USER_PORT: number;
  ADMIN_PORT: number;
}

