import apiClient from './api-client';

export const topicsService = {
  /**
   * Fetches the curated videos and problems for a specific topic hub.
   * @param topicName The URL-friendly name of the topic (e.g., 'binary-search')
   */
  getTopic: async (topicName: string) => {
    const response = await apiClient.get(`/topics/${topicName}`);
    return response.data;
  }
};