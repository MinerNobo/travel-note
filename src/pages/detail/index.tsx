import './index.scss'
import { View, Text, Image, Swiper, SwiperItem, Video, Button } from '@tarojs/components';
import { getNoteById, likeNote, setFavoriteNote, getInteractionStatus } from '../../api/services';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/dateFormat';
import { useStore } from "../../store/useStore";

const baseUrl = process.env.TARO_APP_API

interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl: string | null;
}

interface Note {
  id: string;
  title: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason?: string;
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}

const Detail = () => {
  const [post, setPost] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  
  const { isLoggedIn } = useStore();

  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const id = instance.router?.params.id || '';

    if (id) {
      setLoading(true);
      getNoteById(id)
        .then(res => {
          setPost(res);
          setLocalLikeCount(res.likeCount);
          if (isLoggedIn) {
            checkInteraction(id);
          }
        })
        .catch(err => {
          console.error('获取游记详情失败:', err);
          Taro.showToast({
            title: '获取游记详情失败',
            icon: 'none'
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  useShareAppMessage(() => {
    if (!post) return {};
    return {
      title: post.title,
      path: `/pages/detail/index?id=${post.id}`
    };
  });

  const checkInteraction = async (noteId: string) => {
    try {
      const res = await getInteractionStatus(noteId);
      setIsLiked(res.liked);
      setIsFavorited(res.favorited);
    } catch (err) {
      console.error('获取交互状态失败:', err);
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    try {
      await likeNote(post!.id);
      if (isLiked) {
        setLocalLikeCount(prev => Math.max(0, prev - 1));
      } else {
        setLocalLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('点赞操作失败:', err);
      Taro.showToast({
        title: '操作失败，请稍后重试',
        icon: 'none'
      });
    }
  };

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    try {
      await setFavoriteNote(post!.id);
      setIsFavorited(!isFavorited);
      Taro.showToast({
        title: isFavorited ? '取消收藏成功' : '收藏成功',
        icon: 'success'
      });
    } catch (err) {
      console.error('收藏操作失败:', err);
      Taro.showToast({
        title: '操作失败，请稍后重试',
        icon: 'none'
      });
    }
  };

  const handleImageClick = (url: string) => {
    setFullscreenImage(url);
    setShowFullscreen(true);
  };

  const handleVideoClick = (url: string) => {
    Taro.navigateTo({
      url: `/pages/videoPlayer/index?url=${encodeURIComponent(baseUrl + url)}`
    });
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
  };

  if (loading) {
    return (
      <View className="loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="loading">
        <Text>游记不存在或已被删除</Text>
      </View>
    );
  }

  const videoMedia = post.media.find(item => item.type === 'VIDEO');
  const imageMedia = post.media.filter(item => item.type === 'IMAGE');
  const allMedia = videoMedia ? [videoMedia, ...imageMedia] : imageMedia;

  return (
    <View className="detail-container">
      <View className="author-section">
        <Image 
          className="author-avatar" 
          src={post.author.avatarUrl ? baseUrl + post.author.avatarUrl : ''}
          mode="aspectFill" 
        />
        <View className="author-info">
          <Text className="author-name">{post.author.username}</Text>
          <Text className="post-time">{formatDate(post.createdAt)}</Text>
        </View>
      </View>

      <View className="title-section">
        <Text className="title">{post.title}</Text>
      </View>

      {allMedia.length > 0 && (
        <View className="image-section">
          <Swiper
            className="swiper"
            indicatorDots
            autoplay={false}
            current={currentIndex}
            onChange={(e) => setCurrentIndex(e.detail.current)}
          >
            {allMedia.map((item, index) => (
              <SwiperItem key={index}>
                {item.type === 'VIDEO' ? (
                  <View className="video-wrapper" onClick={() => handleVideoClick(item.url)}>
                    <Image
                      className="video-thumbnail"
                      src={item.thumbnailUrl ? baseUrl + item.thumbnailUrl : ''}
                      mode="aspectFill"
                    />
                    <View className="play-button">▶</View>
                  </View>
                ) : (
                  <Image
                    className="slide-image"
                    src={baseUrl + item.url}
                    mode="aspectFill"
                    onClick={() => handleImageClick(baseUrl + item.url)}
                  />
                )}
              </SwiperItem>
            ))}
          </Swiper>
          <View className="image-counter">
            {currentIndex + 1}/{allMedia.length}
          </View>
        </View>
      )}

      <View className="content-section">
        <Text className="content">{post.content}</Text>
      </View>

      <View className="interaction-section">
        <View 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <View className="like-icon">❤</View>
          <Text className="like-count">{localLikeCount}</Text>
        </View>
        
        <View 
          className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavorite}
        >
          <View className="favorite-icon">★</View>
          <Text className="favorite-text">{isFavorited ? '已收藏' : '收藏'}</Text>
        </View>
      </View>

      {showFullscreen && (
        <View className="fullscreen-container" onClick={handleCloseFullscreen}>
          <Image
            className="fullscreen-image"
            src={fullscreenImage}
            mode="aspectFit"
          />
          <View className="close-btn">
            <Text style={{ color: '#fff', fontSize: '24px' }}>✕</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Detail; 