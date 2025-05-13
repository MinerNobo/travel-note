import { useStore } from "../../store/useStore";
import { View, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { useState, useEffect } from "react";
import { TravelMap } from "../../components";

const defaultImageUrl = '/uploads/images/default-avatar.jpg';
const baseUrl = process.env.TARO_APP_API;

export default function Mine() {
  const { isLoggedIn, logout, setUser, user, accessToken } = useStore();
  
  const [avatarUrl, setAvatarUrl] = useState('');
  const [tempImagePath, setTempImagePath] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
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
        setTempImagePath(filePath);
        Taro.showModal({
          title: '编辑头像',
          content: '您可以裁剪、旋转图片来调整头像',
          confirmText: '开始编辑',
          cancelText: '直接上传',
          success: (modalRes) => {
            if (modalRes.confirm) {
              cropImage(filePath);
            } else {
              uploadImage(filePath);
            }
          }
        });
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

  // 裁剪图片
  const cropImage = (filePath: string) => {
    Taro.editImage({
      src: filePath,
      success: (res) => {
        uploadImage(res.tempFilePath);
      },
      fail: (err) => {
        Taro.showToast({
          title: '图片裁剪失败',
          icon: 'none'
        });
        console.log(err);
      }
    });
  };

  const uploadImage = async (filePath: string) => {
    if (!user || !accessToken) return;
    if (isUploading) return; 
    
    setIsUploading(true);
    Taro.showLoading({
      title: '上传中...'
    });

    Taro.uploadFile({
      url: `${baseUrl}/api/upload/image`,
      filePath,
      name: 'file',
      header: {
        'Authorization': `Bearer ${accessToken}`
      },
      success: (res) => {
        Taro.hideLoading();
        try {
          const data = JSON.parse(res.data);
          if (!data.url) {
            throw new Error('上传失败');
          }
          
          Taro.request({
            url: `${baseUrl}/api/auth/avatar`,
            method: 'PATCH',
            header: {
              'Authorization': `Bearer ${accessToken}`
            },
            data: {
              avatarUrl: data.url
            },
            success: () => {
              setUser({
                ...user,
                avatarUrl: data.url
              });
              setAvatarUrl(data.url);
              Taro.showToast({
                title: '头像上传成功',
                icon: 'success'
              });
            },
            fail: (error) => {
              console.error('更新头像失败', error);
              Taro.showToast({
                title: '更新头像失败',
                icon: 'none'
              });
            },
            complete: () => {
              setIsUploading(false);
            }
          });
        } catch (error) {
          console.error('上传图片解析失败', error);
          Taro.showToast({
            title: '头像上传失败',
            icon: 'none'
          });
          setIsUploading(false);
        }
      },
      fail: (err) => {
        Taro.hideLoading();
        Taro.showToast({
          title: '头像上传失败',
          icon: 'none'
        });
        console.error('上传图片失败', err);
        setIsUploading(false);
      }
    });
  }

  const handleAvatarClick = () => {
    if (isUploading) {
      Taro.showToast({
        title: '正在上传中，请稍候...',
        icon: 'none'
      });
      return;
    }
    handleChooseImage();
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
  
  // 收藏页面跳转
  const handleFavorites = () => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: '请先登录！',
        icon: 'none'
      })
      return;
    }
    
    Taro.navigateTo({
      url: '/pages/favorites/index'
    })
  }

  return (
    <View className="page-container">
      {isLoggedIn && (
        <View className="top-left-button">
          <Button 
            className="favorite-corner-button"
            onClick={handleFavorites}
          >
            收藏
          </Button>
        </View>
      )}
      
      <View className="content-wrapper">
        <View className="avatar-container">
          <Image 
            src={baseUrl + avatarUrl}
            className="avatar-image"
            mode="aspectFill"
            onClick={handleAvatarClick}
          />
          {isLoggedIn && (
            <View className="avatar-tip">点击更换头像</View>
          )}
        </View>
        
        {isLoggedIn && user ? (
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
