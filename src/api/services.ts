import request from "../utils/request";

// 登录
export const login = (username: string, password: string) => request({
    url: "/api/auth/login",
    method: "POST",
    data: {
        username,
        password,
    },
});

export const register = (username: string, password: string) => request({
    url: "/api/auth/register",
    method: "POST",
    data: {
        username,
        password,
    },
})

export const createNote = (data: any) => request({
    url: "/api/notes",
    method: "POST",
    data,
})

export const getNoteById = (id: string) => request({
    url: `/api/notes/${id}`,
})

export const getApprovedNotes = (page: number, pageSize: number, keyword: string) => {
    const query = keyword ? `?keyword=${keyword}` : '';
    return request({
        url: `/api/notes/approved?page=${page}&pageSize=${pageSize}${query}`,
    })
}

export const getMyNotes = () => request({
    url: `/api/notes/my`,
})

export const updateNote = (id: string, data: any) => request({
    url: `/api/notes/${id}`,
    method: "PATCH", 
    data,
})

// 点赞游记
export const likeNote = (noteId: string) => request({
    url: `/api/notes/${noteId}/like`,
    method: "POST",
});

// 收藏游记
export const setFavoriteNote = (noteId: string) => request({
    url: `/api/notes/${noteId}/favorite`,
    method: "POST",
});

// 检查是否已点赞和收藏
export const getInteractionStatus = (noteId: string) => request({
    url: `/api/notes/${noteId}/interaction-status`,
    method: "GET",
});

