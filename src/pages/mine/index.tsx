import { useStore } from "../../store/useStore";
import { View, Text, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import avaDefault from '../../assets/avatarImages/avatarDefault.png';
import { useState } from "react";

const defaultImageUrl = avaDefault;

export default function Mine() {
  const [avatarUrl, setAvatarUrl] = useState(defaultImageUrl);

  const { isLoggedIn, logout, setUser, user } = useStore(); 

  const handleChooseImage = () => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: '请先登录！',
        icon: 'none'
      })
      return;
    }

    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const filePath = res.tempFilePaths[0];
        uploadImage(filePath);
      },
      fail: (err) => {
        Taro.showToast({
          title: "图片选择失败",
          icon: 'none'
        });
        console.log(err);
      },
    });
  };

  // 上传图片到服务器
  const uploadImage = async (filePath: string) => {
    const res = await Taro.uploadFile({
      url: 'http://localhost:4000/upload/avatar',
      filePath: filePath,
      name: 'avatar',
      header: {
        'content-Type': 'multipart/form-data',
      },
      formData: {
        userId: user?.id,
      }
    })
    if (res.statusCode === 200) {
      const userData = res.data.data;
      setAvatarUrl(userData.avatar);
      setUser(userData);
      Taro.showToast({
        title: '头像上传成功',
        icon: 'success'
      });
    } else {
      Taro.showToast({
        title: '头像上传失败',
        icon: 'none'
      });
    }
  }

  const handleClick = () => {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <View className="page-container">
      <View className="content-wrapper">
        <View className="avatar-container">
          <Image 
            src={isLoggedIn ? (user?.avatar || avatarUrl) : avatarUrl}
            className="avatar-image"
            mode="aspectFill"
            onClick={handleChooseImage}
          />
        </View>
        
        {isLoggedIn ? (
          <View className="username">
            {user?.name || '用户'}
          </View>
        ) : (
          <View className="username">
            游客
          </View>
        )}
        
        {isLoggedIn ? (
          <View className="user-description">
            欢迎回来，开始您的旅行记录吧！
          </View>
        ) : (
          <View className="user-description">
            登录后体验更多功能
          </View>
        )}
        
        <View className="button-container">
          {!isLoggedIn ? (
            <Button  
              className="login-button"
              onClick={handleClick}
            >
              登录/注册
            </Button>
          ) : (
            <Button 
              className="logout-button login-button"
              onClick={handleLogout}
            >
              退出登录
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
