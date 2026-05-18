import { create } from 'zustand';

interface User {
  user_id: number;
  username: string;
  system_role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('algopath_token', token);
      localStorage.setItem('algopath_user', JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('algopath_token');
      localStorage.removeItem('algopath_user');
    }
    set({ user: null, isAuthenticated: false });
  },
}));

// Initialize from local storage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('algopath_token');
  const user = localStorage.getItem('algopath_user');
  if (token && user) {
    useAuthStore.setState({ user: JSON.parse(user), isAuthenticated: true });
  }
}
