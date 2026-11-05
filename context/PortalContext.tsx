/**
 * State & Context Portal Video Pelanggan (context/PortalContext.tsx)
 */

import { LockMode, PublicVideoItem } from '../types';

export interface PortalGateConfig {
  requireClicksCount: number;
  lockMode: LockMode;
  enabled: boolean;
  defaultTargetUrl: string;
}

export interface PortalState {
  gateConfig: PortalGateConfig;
  allVideos: PublicVideoItem[];
  activeVideo: PublicVideoItem | null;
  selectedCategory: string;
  currentVideoClicksDone: number;
  isCurrentVideoUnlocked: boolean;
  currentPage: number;
  videosPerPage: number;
}

export const defaultPortalState: PortalState = {
  gateConfig: {
    requireClicksCount: 1,
    lockMode: 'every_load',
    enabled: true,
    defaultTargetUrl: 'https://s.shopee.co.id/LlyjAypJt'
  },
  allVideos: [],
  activeVideo: null,
  selectedCategory: 'Semua',
  currentVideoClicksDone: 0,
  isCurrentVideoUnlocked: false,
  currentPage: 1,
  videosPerPage: 8
};

export function getPortalInitialConfig(): PortalState {
  return JSON.parse(JSON.stringify(defaultPortalState)) as PortalState;
}

