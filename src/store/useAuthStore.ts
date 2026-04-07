import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  name: string;
  email: string;
  password?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        set({ user, isAuthenticated: true });
      },
      signup: (user) => {
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: "tuf-auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
