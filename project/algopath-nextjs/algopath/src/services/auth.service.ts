import apiClient from './api-client'

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', data)
    return res.data
  },

  register: async (data: { email: string; password: string; username: string }) => {
    const res = await apiClient.post('/auth/register', data)
    return res.data
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {}
  },
}
