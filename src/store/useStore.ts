import Taro from "@tarojs/taro";
import { create } from "zustand"

interface User {
    id: string;
    name: string;
    phoneNumber: string;
    avatar: string;
}

export const useStore = create((set) => ({
    accessToken: Taro.getStorageSync('accessToken') || null,
    user: Taro.getStorageSync('user') || null,
    isLoggedIn: Taro.getStorageSync('isLoggedIn') || false,

    setAccessToken: (accessToken: string) => {
        Taro.setStorageSync('accessToken', accessToken);
    },
    setUser: (user: User) => {
        Taro.setStorageSync('user', user);
    },
    setIsLoggedIn: (isLoggedIn: boolean) => {
        Taro.setStorageSync('isLoggedIn', isLoggedIn);
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