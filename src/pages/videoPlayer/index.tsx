import { View, Video, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import './index.scss';

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const url = router.params.url || '';
    if (url) {
      setVideoUrl(decodeURIComponent(url));
    } else {
      Taro.showToast({
        title: '视频加载失败',
        icon: 'none'
      });
      goBack();
    }
  }, [router.params]);
  
  const goBack = () => {
    Taro.navigateBack();
  };
  
  return (
    <View className="video-player-page">
      <Video 
        src={videoUrl}
        className="video-player"
        autoplay
        controls
        showFullscreenBtn
        showPlayBtn
        showCenterPlayBtn
        enableProgressGesture
        objectFit="contain"
      />
      <Button className="back-button" onClick={goBack}>返回</Button>
    </View>
  );
} 