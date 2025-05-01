import { Input, View, Text, Button } from "@tarojs/components"
import Taro from "@tarojs/taro";
import { useState } from "react"
import { useStore } from "../../store/useStore";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useStore();

    const handleSubmit = async () => {
        if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
            Taro.showToast({
                title: "请输入正确手机号",
                icon: "none",
            })
            return;
        }

        try {
            setLoading(true);

            const res = await Taro.request({
                url: "http://localhost:4000/auth/login",
                method: "POST",
                data: { phoneNumber, password},
            });

            // 成功后修改全局状态
            login({
                id: res.data.id,
                name: res.data.name,
                phoneNumber: res.data.phone,
                avatar: res.data.avatar || '',
            })

            Taro.showToast({
                title: '登录成功',
                icon: 'success'
            })

            // 登录成功后跳转到我的那页
            setTimeout(() => {
                Taro.switchTab({ url: '/pages/mine/index' })
            }, 1000);

        } catch (error) {
            Taro.showToast({
                title: '验证失败，请重试',
                icon: 'none'
            })
        } finally {
            setLoading(false);
        }

    }

    return (
        <View>
            <Text>登录</Text>

            <Input 
                type="text"
                maxlength={11}
                placeholder="请输入手机号"
                value={phoneNumber}
                onInput={e => setPhoneNumber(e.detail.value)}
            />

            <Input
                password
                maxlength={16}
                placeholder="请输入密码"
                value={password}
                onInput={e => setPassword(e.detail.value)}
            />

            <Button 
                loading={loading}
                disabled={loading || !phoneNumber || !password}
                onClick={handleSubmit}>
                登录
            </Button>

        </View>
    )
}

export default Login