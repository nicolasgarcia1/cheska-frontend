import api from './axiosClient'
import type { Product } from '../types'

export const productsApi = {
  getAll: () => api.get<Product[]>('/Products').then((r) => r.data),
  getById: (id: number) => api.get<Product>(`/Products/${id}`).then((r) => r.data),
  getAllAdmin: () => api.get<Product[]>('/Products/admin').then((r) => r.data),
  create: (data: FormData) => api.post<Product>('/Products', data).then((r) => r.data),
  update: (id: number, data: FormData) => api.put<Product>(`/Products/${id}`, data).then((r) => r.data),
  replenishStock: (
    id: number,
    data: { quantity: number; cost: number; price?: number }
  ) => api.patch<Product>(`/Products/${id}/stock/replenish`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/Products/${id}`),
}
