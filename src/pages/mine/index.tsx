import { useStore } from "../../store/useStore";
import { View, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import avaDefault from '../../assets/avatarImages/avatarDefault.png';
import { useState, useEffect } from "react";
import { TravelMap } from "../../components";

const defaultImageUrl = avaDefault;
const baseUrl = 'http://localhost:40000';

export default function Mine() {
  const { isLoggedIn, logout, setUser, user, accessToken } = useStore();
  
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      setAvatarUrl(user.avatarUrl);
    } else {
      setAvatarUrl(defaultImageUrl);
    }
  }, [isLoggedIn, user, avatarUrl]);

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
        try {
          Taro.request({
            url: 'http://localhost:40000/auth/avatar',
            method: 'PATCH',
            header: {
              'Authorization': `Bearer ${accessToken}`
            },
            data: {
              avatarUrl: data.url
            }
          })
          setUser({
            ...user,
            avatarUrl: data.url
          });
          setAvatarUrl(data.url);
          Taro.showToast({
            title: '头像上传成功',
            icon: 'success'
          });

        } catch (error) {
          console.log(error);
        }

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
    setAvatarUrl(defaultImageUrl);
  }

  return (
    <View className="page-container">
      <View className="content-wrapper">
        <View className="avatar-container">
          <Image 
            src={baseUrl + avatarUrl}
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

        {/* 足迹地图组件 */}
        {isLoggedIn && user && accessToken && (
          <TravelMap 
            userId={user.id} 
            accessToken={accessToken}
          />
        )}
      </View>
    </View>
  );
}
