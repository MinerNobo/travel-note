import './index.scss'
import { View, Text, Image, Swiper, SwiperItem, Video, Button } from '@tarojs/components';
import { getNoteById } from '../../api/services';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/dateFormat';

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

  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const id = instance.router?.params.id || '';

    if (id) {
      setLoading(true);
      getNoteById(id)
        .then(res => {
          setPost(res);
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
  }, []);

  useShareAppMessage(() => {
    if (!post) return {};
    return {
      title: post.title,
      path: `/pages/detail/index?id=${post.id}`
    };
  });

  const handleImageClick = (url: string) => {
    setFullscreenImage(url);
    setShowFullscreen(true);
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
      {/* 作者信息 */}
      <View className="author-section">
        <Image 
          className="author-avatar" 
          src={baseUrl + post.author.avatarUrl} 
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
                  <View className="video-wrapper">
                    <Video
                      className="video"
                      src={baseUrl + item.url}
                      controls
                      showFullscreenBtn
                      poster={baseUrl + item.thumbnailUrl}
                    />
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