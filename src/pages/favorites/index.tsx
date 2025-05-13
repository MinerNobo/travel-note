import { View, Text, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useStore } from "../../store/useStore";
import "./index.scss";

const baseUrl = process.env.TARO_APP_API;

interface Author {
  id: string;
  username: string;
  avatarUrl: string;
}

interface FavoriteNote {
  id: string;
  title: string;
  content: string;
  author: Author;
  firstImage: string;
  favoriteId: string;
}

export default function Favorites() {
  const { isLoggedIn, accessToken } = useStore();
  const [favorites, setFavorites] = useState<FavoriteNote[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isLoggedIn && accessToken) {
      getFavorites();
    } else {
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      });
    }
  }, [isLoggedIn, accessToken]);

  const getFavorites = async () => {
    setLoading(true);
    try {
      const res = await Taro.request({
        url: `${baseUrl}/api/notes/favorites`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (res.statusCode === 200) {
        setFavorites(res.data);
      } else {
        Taro.showToast({
          title: '获取收藏失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取收藏失败', error);
      Taro.showToast({
        title: '获取收藏失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  return (
    <View className="favorites-container">
      
      {loading ? (
        <View className="loading-container">
          <Text className="loading-text">加载中...</Text>
        </View>
      ) : favorites.length > 0 ? (
        <View className="notes-list">
          {favorites.map(note => (
            <View key={note.id} className="note-item" onClick={() => handleNoteClick(note.id)}>
              <View className="note-info">
                <View className="note-cover">
                  <Image 
                    className="cover-image" 
                    src={baseUrl + (note.firstImage)}
                    mode="aspectFill" 
                  />
                </View>
                
                <View className="note-content">
                  <View className="note-header">
                    <Text className="note-title">{note.title}</Text>
                  </View>
                  
                  <View className="note-preview">
                    <Text className="preview-text">{note.content.substring(0, 80)}...</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="empty-notes">
          <Text className="empty-text">您还没有收藏任何游记</Text>
        </View>
      )}
    </View>
  );
} 