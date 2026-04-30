import api from './axiosClient'
import type { Sale, DashboardStats } from '../types'

export const salesApi = {
  getAll: () => api.get<Sale[]>('/sales').then((r) => r.data),
  create: (data: object) => api.post<Sale>('/sales', data).then((r) => r.data),
  getDashboard: () => api.get<DashboardStats>('/dashboard').then((r) => r.data),
  exportCsv: (type: 'sales' | 'products') =>
    api.get(`/export/${type}/csv`, { responseType: 'blob' }),
  exportExcel: () => api.get('/export/sales/excel', { responseType: 'blob' }),
}
