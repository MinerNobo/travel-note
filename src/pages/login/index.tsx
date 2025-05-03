import { Input, View, Text, Button } from "@tarojs/components"
import Taro from "@tarojs/taro";
import { useState } from "react"
import { useStore } from "../../store/useStore";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useStore();

    const handleClick = () => {
        Taro.navigateTo({
            url: '/pages/register/index',
        })
    }

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
            if (res.statusCode === 200) {
                const userData = res.data.data;
                login({
                    id: userData.id,
                    name: userData.name,
                    phoneNumber: userData.phoneNumber,
                    avatar: userData.avatar || '',
                })
    
                Taro.showToast({
                    title: '登录成功',
                    icon: 'success'
                })
            } else {
                Taro.showToast({
                    title: res.data.message,
                    icon: 'none'
                })
            }

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

            <Text>还没有账号?</Text>
            <Button onClick={handleClick}>注册</Button>

        </View>
    )
}

export default Login