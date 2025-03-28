import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  organizationId: string;
};

export interface UserStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const userIds = ["user001", "user002"];
export const names = ["Nany", "Mary"];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
