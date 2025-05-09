import { Input, View, Text, Button } from "@tarojs/components"
import Taro from "@tarojs/taro";
import { useState } from "react"
import { useStore } from "../../store/useStore";
import './index.scss';
import { login } from "../../api/services";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { setAccessToken, setIsLoggedIn, setUser } = useStore();

    const handleRegister = () => {
        Taro.navigateTo({
            url: '/pages/register/index',
        })
    }

    const handleForgotPassword = () => {
        Taro.showToast({
            title: '忘记密码功能开发中',
            icon: 'none'
        })
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await login(username, password);
            setAccessToken(res.access_token);
            setIsLoggedIn(true);
            setUser(res.user);
            console.log(res);
            console.log("登录成功");

            // 登录成功后跳转到我的那页
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
        <View className="login-container">
            <View className="login-content">
                <Text className="login-title">登录账号</Text>
                <Text className="login-subtitle">欢迎回来!</Text>
                
                <View className="input-group">
                    <Input 
                        className="input-item"
                        type="text"
                        maxlength={16}
                        placeholder="用户名"
                        value={username}
                        onInput={e => setUsername(e.detail.value)}
                    />

                    <Input
                        className="input-item"
                        password
                        maxlength={16}
                        placeholder="密码"
                        value={password}
                        onInput={e => setPassword(e.detail.value)}
                    />
                </View>

                <Text className="forgot-password" onClick={handleForgotPassword}>忘记密码?</Text>

                <Button 
                    className={`login-button ${(loading || !username || !password) ? 'button-disabled' : ''}`}
                    loading={loading}
                    disabled={loading || !username || !password}
                    onClick={handleSubmit}>
                    登录
                </Button>

                <View className="register-section">
                    <Text className="register-text" onClick={handleRegister}>创建新账号</Text>
                </View>
            </View>
        </View>
    )
}

export default Login