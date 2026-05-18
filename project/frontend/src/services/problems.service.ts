import apiClient from './api-client';

export const problemsService = {
  getProblems: async (filters: { difficulty?: string; platform?: string; topic?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.topic) params.append('topic', filters.topic);
    
    const queryString = params.toString();
    const url = queryString ? `/problems?${queryString}` : '/problems';
    
    const response = await apiClient.get(url);
    return response.data;
  }
};
