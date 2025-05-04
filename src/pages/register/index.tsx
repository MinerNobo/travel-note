import { useStore } from "../../store/useStore";
import { Button, Form, Input, View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import './index.scss';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useStore();

    const handleLogin = () => {
        Taro.navigateBack();
    }

    const handleSubmit = async (e) => {
        const { name, phoneNumber, password } = e.detail.value;

        if (!name || !phoneNumber || !password) {
            Taro.showToast({
                title: "请填写所有字段",
                icon: "none"
            })
            return;
        }

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
                url: "http://localhost:4000/auth/register",
                method: "POST",
                data: { name, phoneNumber, password},
            });

            if (res.statusCode === 200) {
                const userData = res.data.data;

                login({
                    id: userData.id,
                    name: userData.name,
                    phoneNumber: userData.phoneNumber,
                    avatar: userData.avatar || '',
                })

                Taro.showToast({
                    title: "注册成功",
                    icon: 'success',
                })

                Taro.switchTab({
                    url: '/pages/mine/index',
                })
            }
            
        } catch (error) {
            Taro.showToast({
                title: "注册失败请重试",
                icon: 'none',
            })
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
                            name="name"
                            type="text"
                            placeholder="昵称"
                            value={name}
                            onInput={e => setName(e.detail.value)}
                        />
                    </View>

                    <View className="form-item">
                        <Input 
                            className="input-item"
                            name="phoneNumber"
                            type="text"
                            maxlength={11}
                            placeholder="手机号码"
                            value={phoneNumber}
                            onInput={e => setPhoneNumber(e.detail.value)}
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
                        className={`register-button ${(loading || !name || !phoneNumber || !password) ? 'button-disabled' : ''}`}
                        formType="submit" 
                        loading={loading} 
                        disabled={loading || !name || !phoneNumber || !password}>
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