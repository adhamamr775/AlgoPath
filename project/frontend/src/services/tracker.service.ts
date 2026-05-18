import apiClient from './api-client';

export const trackerService = {
  /**
   * Fetches the user's aggregate analytics profile for the dashboard.
   */
  getStats: async () => {
    const response = await apiClient.get('/tracker/stats');
    return response.data;
  },

  /**
   * Toggles completion checkmarks for ANY resource (practice or learning).
   * @param problemId The unique ID of the problem or link row
   */
  toggleProblem: async (problemId: number) => {
    // Both items map to the exact same /toggle-problem route on your backend now!
    const response = await apiClient.post('/tracker/toggle-problem', { problemId });
    return response.data;
  }
};