import Taro from "@tarojs/taro";

const baseUrl = process.env.TARO_APP_API;

const request = async (options) => {
    const { url, method = 'GET', data={}, header = {} } = options;
    const token = Taro.getStorageSync('accessToken');

    const headers = {
        ...header,
        ...(token && { Authorization: `Bearer ${token}` }),
    }

    try {
        const res = await Taro.request({
            url: `${baseUrl}${url}`,
            method,
            data,
            header: headers,
        });

        if (res.statusCode >= 200 && res.statusCode < 300) {
            return res.data;
        } else {
            throw new Error(`请求失败: ${res.statusCode}`);
        }
    } catch (error) {
        Taro.showToast({
            title: error.message || '请求失败，请稍后重试',
            icon: 'none',
            duration: 2000
        });
        throw error;
    }
}

export default request;


