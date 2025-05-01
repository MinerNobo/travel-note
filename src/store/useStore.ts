import Taro from "@tarojs/taro";
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
    id: string;
    name: string;
    phoneNumber: string;
    avatar: string;
}

interface AuthStore {
    user: User | null;
    isLoggedIn: boolean;

    login: (userData: any) => void;
    logout: () => void;
}

export const useStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: false,
            login: (userData) => set({ user: userData, isLoggedIn: true}),
            logout: () => set({ user: null, isLoggedIn: false}), 
        }),
        {
            name: 'auth-store', // 键名
            storage: {
                getItem: (key) => Taro.getStorageSync(key),
                setItem: (key, value) => Taro.setStorageSync(key, value),
                removeItem: (key) => Taro.removeStorageSync(key),
            },
        }
    )
)