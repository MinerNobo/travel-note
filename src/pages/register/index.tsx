import { useStore } from "../../store/useStore";
import { Button, Form, Input, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const { login } = useStore();

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
        <View>
            <Form onSubmit={handleSubmit}>
                <View className="form-item">
                    <Input 
                        name="name"
                        type="text"
                        placeholder="请输入昵称"
                    />
                </View>

                <View>
                    <Input 
                        name="phoneNumber"
                        type="text"
                        maxlength={11}
                        placeholder="请输入手机号"
                    />
                </View>

                <View>
                    <Input 
                        name="password"
                        password
                        placeholder="请输入密码"
                        maxlength={16}
                    />
                </View>

                <Button formType="submit" loading={loading} disabled={loading}>
                    注册
                </Button>
            </Form>
        </View>
    )
}