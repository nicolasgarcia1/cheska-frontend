import api from './axiosClient'
import type { TokenResponse } from '../types'

export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<TokenResponse>('/auth/login', data).then((r) => r.data),
}
