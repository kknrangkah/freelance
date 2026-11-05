/**
 * Model & Factory Objek Data TypeScript (types/models.ts)
 */

import { VideoItem, AdClickLog } from './index';

export const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80';

export function normalizeUrl(rawUrl: string = ''): string {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return 'https://' + trimmed;
  }
  return trimmed;
}

export interface CreateVideoPayload {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  videoSourceType?: 'upload' | 'url' | string;
  videoUrl?: string;
  thumbnailUrl?: string;
  clickbaitBadge?: string;
  clickbaitOverlayText?: string;
  teaserBlur?: boolean | string;
  customAdUrl?: string;
  duration?: string;
  views?: number | string;
  adClicks?: number | string;
  active?: boolean | string;
  createdAt?: string;
}

export function createVideoModel(payload: CreateVideoPayload = {}): VideoItem {
  return {
    id: payload.id || 'vid-' + Date.now(),
    title: String(payload.title || 'Judul Video').trim(),
    description: String(payload.description || '').trim(),
    category: String(payload.category || 'Indo Viral').trim(),
    videoSourceType: payload.videoSourceType === 'upload' ? 'upload' : 'url',
    videoUrl: String(payload.videoUrl || '').trim(),
    thumbnailUrl: String(payload.thumbnailUrl || DEFAULT_THUMBNAIL).trim(),
    clickbaitBadge: String(payload.clickbaitBadge || '🔥 LAGI VIRAL #1').trim(),
    clickbaitOverlayText: String(
      payload.clickbaitOverlayText || 'TONTON SAMPAI HABIS! JANGAN DISKIP'
    ).trim(),
    teaserBlur: payload.teaserBlur === true || payload.teaserBlur === 'true',
    customAdUrl: normalizeUrl(payload.customAdUrl || ''),
    duration: String(payload.duration || '03:47').trim(),
    views: Number(payload.views) || 0,
    adClicks: Number(payload.adClicks) || 0,
    active: payload.active !== false && payload.active !== 'false',
    createdAt: payload.createdAt || new Date().toISOString()
  };
}

export interface CreateAdClickLogPayload {
  id?: string;
  videoId?: string;
  videoTitle?: string;
  adUrl?: string;
  visitorId?: string;
  ip?: string;
  device?: string;
  browser?: string;
  timestamp?: string;
}

export function createAdClickLogModel(payload: CreateAdClickLogPayload = {}): AdClickLog {
  return {
    id: payload.id || 'clk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    videoId: payload.videoId || 'unknown',
    videoTitle: payload.videoTitle || 'Video Umum',
    adUrl: payload.adUrl || '',
    visitorId: payload.visitorId || 'PLG-' + Math.floor(1000 + Math.random() * 9000),
    ip: payload.ip || '127.0.0.1',
    device: payload.device || 'Desktop PC',
    browser: payload.browser || 'Browser',
    timestamp: payload.timestamp || new Date().toISOString()
  };
}

