import request from "../utils/request";

// 登录
export const login = (username: string, password: string) => request({
    url: "/auth/login",
    method: "POST",
    data: {
        username,
        password,
    },
});

export const register = (username: string, password: string) => request({
    url: "/auth/register",
    method: "POST",
    data: {
        username,
        password,
    },
})

export const createNote = (data: any) => request({
    url: "/notes",
    method: "POST",
    data,
})