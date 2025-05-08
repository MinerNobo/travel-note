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