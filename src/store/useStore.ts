import Taro from "@tarojs/taro";
import { create } from "zustand"

interface User {
    id: string;
    username: string;
    role: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface StoreState {
    accessToken: string | null;
    user: User | null;
    isLoggedIn: boolean;
    setAccessToken: (accessToken: string) => void;
    setUser: (user: User) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
    accessToken: Taro.getStorageSync('accessToken') || null,
    user: Taro.getStorageSync('user') || null,
    isLoggedIn: Taro.getStorageSync('isLoggedIn') || false,

    setAccessToken: (accessToken: string) => {
        Taro.setStorageSync('accessToken', accessToken);
        set({ accessToken });
    },
    setUser: (user: User) => {
        Taro.setStorageSync('user', user);
        set({ user });
    },
    setIsLoggedIn: (isLoggedIn: boolean) => {
        Taro.setStorageSync('isLoggedIn', isLoggedIn);
        set({ isLoggedIn });
    },

    logout: () => {
        Taro.removeStorageSync('accessToken');
        Taro.removeStorageSync('user');
        Taro.removeStorageSync('isLoggedIn');
        set({
            accessToken: null,
            user: null,
            isLoggedIn: false,
        });
    },
}))