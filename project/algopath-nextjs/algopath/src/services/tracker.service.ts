import apiClient from './api-client'

export const trackerService = {
  getStats: async () => {
    const res = await apiClient.get('/tracker/stats')
    return res.data
  },

  toggleProblem: async (problemId: number) => {
    const res = await apiClient.post('/tracker/toggle-problem', { problemId })
    return res.data
  },

  toggleVideo: async (videoId: number) => {
    const res = await apiClient.post('/tracker/toggle-video', { videoId })
    return res.data
  },
}
