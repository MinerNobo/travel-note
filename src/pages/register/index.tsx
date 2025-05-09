import { useStore } from "../../store/useStore";
import { Button, Form, Input, View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import './index.scss';
import { register } from "../../api/services";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAccessToken, setIsLoggedIn, setUser } = useStore();

    const handleLogin = () => {
        Taro.navigateTo({
            url: '/pages/login/index',
        });
    }

    const handleSubmit = async (e) => {
        const { username, password } = e.detail.value;

        try {
            setLoading(true);

            const res = await register(username, password);

            setAccessToken(res.access_token);
            setIsLoggedIn(true);
            setUser(res.user);

            Taro.showToast({
                title: "注册成功",
                icon: 'success',
            })

            setTimeout(() => {
                Taro.switchTab({ url: '/pages/mine/index' })
            }, 1000);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="register-container">
            <View className="register-content">
                <Text className="register-title">创建账号</Text>
                <Text className="register-subtitle">欢迎加入我们!</Text>

                <Form onSubmit={handleSubmit} className="form-container">
                    <View className="form-item">
                        <Input 
                            className="input-item"
                            name="username"
                            type="text"
                            placeholder="昵称"
                            value={username}
                            onInput={e => setUsername(e.detail.value)}
                        />
                    </View>

                    <View className="form-item">
                        <Input 
                            className="input-item"
                            name="password"
                            password
                            placeholder="密码"
                            maxlength={16}
                            value={password}
                            onInput={e => setPassword(e.detail.value)}
                        />
                    </View>

                    <Button 
                        className={`register-button ${(loading || !username || !password) ? 'button-disabled' : ''}`}
                        formType="submit" 
                        loading={loading} 
                        disabled={loading || !username || !password}>
                        注册
                    </Button>
                </Form>

                <View className="login-section">
                    <Text className="login-text" onClick={handleLogin}>已有账号? 返回登录</Text>
                </View>
            </View>
        </View>
    )
}