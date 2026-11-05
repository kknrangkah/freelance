/**
 * State & Context Panel Admin (context/AdminContext.tsx)
 */

export type AdminTabName = 'dashboard' | 'adsetup' | 'videos' | 'account';

export interface AdminState {
  activeTab: AdminTabName;
  adminLogsPage: number;
  adminLogsPerPage: number;
  adminVideosPage: number;
  adminVideosPerPage: number;
}

export const defaultAdminState: AdminState = {
  activeTab: 'dashboard',
  adminLogsPage: 1,
  adminLogsPerPage: 8,
  adminVideosPage: 1,
  adminVideosPerPage: 5
};

export function getAdminInitialConfig(): AdminState {
  return JSON.parse(JSON.stringify(defaultAdminState)) as AdminState;
}

