import './index.scss'
import { View, Text, Image, Swiper, SwiperItem, Video, Button } from '@tarojs/components';
import { getNoteById } from '../../api/services';
// 获取路由参数拿到note id
// 根据note id获取note详情
// 展示note详情， 包括作者昵称，头像等
// 图片可以左右滑动查看，可以放大查看原图
// 如果有视频的话，视频位于图片列表第一项，点击后进入全屏播放
// 支持游记分享功能，比如分享到微信

import Taro, { useShareAppMessage } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/dateFormat';

const baseUrl = 'http://localhost:40000';
const Detail = () => {
  const [post, setPost] = useState(null);
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

  // 设置分享功能
  useShareAppMessage(() => {
    if (!post) return {};
    return {
      title: post.title,
      path: `/pages/detail/index?id=${post.id}`
    };
  });

  // 处理图片点击，打开全屏预览
  const handleImageClick = (url: string) => {
    setFullscreenImage(url);
    setShowFullscreen(true);
  };

  // 关闭全屏预览
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

  // 分离视频和图片
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

      {/* 标题 */}
      <View className="title-section">
        <Text className="title">{post.title}</Text>
      </View>

      {/* 图片/视频轮播 */}
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

      {/* 内容 */}
      <View className="content-section">
        <Text className="content">{post.content}</Text>
      </View>

      {/* 全屏预览 */}
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