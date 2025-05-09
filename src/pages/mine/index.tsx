import { useStore } from "../../store/useStore";
import { View, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import avaDefault from '../../assets/avatarImages/avatarDefault.png';
import { useState } from "react";

const defaultImageUrl = avaDefault;

export default function Mine() {
  const { isLoggedIn, logout, setUser, user, accessToken } = useStore();
  
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || defaultImageUrl);

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
    Taro.uploadFile({
      url: 'http://localhost:40000/upload/image',
      filePath,
      name: 'file',
      header: {
        'Authorization': `Bearer ${accessToken}`
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        setAvatarUrl(data.url);
        Taro.showToast({
          title: '头像上传成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        Taro.showToast({
          title: '头像上传失败',
          icon: 'none'
        });
      }
  })
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
            src={avatarUrl}
            className="avatar-image"
            mode="aspectFill"
            onClick={handleChooseImage}
          />
        </View>
        
        {isLoggedIn ? (
          <View className="username">
            {user.username || '用户'}
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
