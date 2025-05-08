import { View, Text, Image, Swiper, SwiperItem, Video, Button } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { AtIcon } from 'taro-ui'
import './index.scss'

// 模拟数据，实际应该从API获取
const mockDetails = {
  1: {
    id: 1,
    title: '香港迪士尼正确游玩路线',
    author: '娜娜在港漂流记',
    avatar: require('../../assets/avatarImages/avatar01.jpg'),
    createTime: '2023-05-15',
    content: '香港迪士尼乐园是亚洲第二个、全球第五个、中国第一个迪士尼主题乐园。乐园由七个主题园区组成，分别是：美国小镇大街、探险世界、幻想世界、明日世界、玩具总动员大本营、灰熊山谷及迷离庄园。以下是我整理的一日游最佳路线...',
    images: [
      require('../../assets/cardImages/card01.jpg'),
      require('../../assets/cardImages/card02.jpg'),
      require('../../assets/cardImages/card03.jpg'),
    ],
    hasVideo: false,
  },
  2: {
    id: 2,
    title: '深圳大南山',
    author: '猫猫的城市日记',
    avatar: require('../../assets/avatarImages/avatar02.jpg'),
    createTime: '2023-06-20',
    content: '深圳大南山位于深圳市南山区西部，是深圳八景之一，也是深圳最高的山峰之一。登山路线主要有东线、中线和西线三条。东线路程较短，适合大多数游客；中线风景优美，但路程较长；西线最为陡峭，适合有经验的登山者。我推荐大家走中线，沿途可以欣赏到...',
    images: [
      require('../../assets/cardImages/card02.jpg'),
      require('../../assets/cardImages/card03.jpg'),
      require('../../assets/cardImages/card04.jpg'),
    ],
    hasVideo: false,
  },
  3: {
    id: 3,
    title: '本地人吐血整理超全攻略',
    author: '花花美宿记',
    avatar: require('../../assets/avatarImages/avatar03.jpg'),
    createTime: '2023-07-10',
    content: '作为一个土生土长的本地人，我走遍了城市的每一个角落，今天就为大家分享一份超全攻略。首先，最佳游览时间是每年的4-5月和9-10月，此时天气宜人，是旅游的黄金季节。其次，交通方面建议以地铁为主，出行便捷且省钱。美食方面，一定不要错过...',
    images: [
      require('../../assets/cardImages/card03.jpg'),
      require('../../assets/cardImages/card04.jpg'),
      require('../../assets/cardImages/card05.jpg'),
    ],
    hasVideo: false,
  },
  4: {
    id: 4,
    title: '✨ 上海外滩｜一键get氛围感大片，超绝拍照打卡点，快来打卡吧！',
    author: '鹤顶红',
    avatar: require('../../assets/avatarImages/avatar04.jpg'),
    createTime: '2023-08-05',
    content: '上海外滩是上海的地标之一，也是拍照打卡的绝佳地点。这里有世界建筑博览群，有美丽的黄浦江，还有迷人的夜景。我为大家整理了外滩最佳拍照点：1. 外滩观光平台：可以拍到对岸的东方明珠和陆家嘴全景；2. 外白渡桥：可以拍出复古感十足的照片；3. 外滩万国建筑群：可以拍出欧洲风情的大片。最佳拍摄时间是黄昏和夜晚，此时光线柔和，夜景璀璨...',
    images: [
      require('../../assets/cardImages/card04.jpg'),
      require('../../assets/cardImages/card01.jpg'),
      require('../../assets/cardImages/card05.jpg'),
    ],
    video: 'https://example.com/video.mp4', // 模拟视频链接
    hasVideo: true,
  },
  5: {
    id: 5,
    title: '深圳梧桐山徒步攻略',
    author: '猫猫的城市日记',
    avatar: require('../../assets/avatarImages/avatar02.jpg'),
    createTime: '2023-09-12',
    content: '梧桐山是深圳最高的山，海拔943.7米，被誉为"深圳第一峰"。徒步梧桐山有多条路线，最受欢迎的是大梧桐线和小梧桐线。大梧桐线较为平缓，适合初次徒步的游客；小梧桐线较为陡峭，但风景更佳。我建议准备充足的水和食物，穿着舒适的徒步鞋，带上登山杖。最佳徒步时间为秋冬季节，此时天气凉爽，视野开阔...',
    images: [
      require('../../assets/cardImages/card05.jpg'),
      require('../../assets/cardImages/card02.jpg'),
      require('../../assets/cardImages/card03.jpg'),
    ],
    hasVideo: false,
  },
};

const Detail = () => {
  const router = useRouter();
  const { id } = router.params;
  const [detail, setDetail] = useState<any>(null);
  const [imgCurrent, setImgCurrent] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImg, setFullscreenImg] = useState('');

  useEffect(() => {
    // 实际项目中应该通过API获取详情
    if (id && mockDetails[id]) {
      setDetail(mockDetails[id]);
    }
  }, [id]);

  if (!detail) {
    return <View className='loading'>加载中...</View>;
  }

  const handleSwiperChange = (e) => {
    setImgCurrent(e.detail.current);
  };

  const handleImgClick = (img) => {
    setFullscreenImg(img);
    setShowFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
  };

  return (
    <View className='detail-container'>
      {/* 头部作者信息 */}
      <View className='author-section'>
        <Image className='author-avatar' src={detail.avatar} />
        <View className='author-info'>
          <Text className='author-name'>{detail.author}</Text>
          <Text className='post-time'>{detail.createTime}</Text>
        </View>
        <Button className='follow-btn'>关注</Button>
      </View>

      {/* 标题 */}
      <View className='title-section'>
        <Text className='title'>{detail.title}</Text>
      </View>

      {/* 图片轮播 */}
      <View className='image-section'>
        <Swiper
          className='swiper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          onChange={handleSwiperChange}
        >
          {detail.hasVideo && (
            <SwiperItem>
              <View className='video-wrapper'>
                <Video
                  src={detail.video}
                  controls
                  autoplay={false}
                  poster={detail.images[0]}
                  className='video'
                />
              </View>
            </SwiperItem>
          )}
          {detail.images.map((img, index) => (
            <SwiperItem key={index}>
              <Image 
                className='slide-image' 
                src={img} 
                mode='aspectFill' 
                onClick={() => handleImgClick(img)}
              />
            </SwiperItem>
          ))}
        </Swiper>
        <Text className='image-counter'>{imgCurrent + 1}/{detail.hasVideo ? detail.images.length + 1 : detail.images.length}</Text>
      </View>

      {/* 内容 */}
      <View className='content-section'>
        <Text className='content'>{detail.content}</Text>
      </View>

      {/* 全屏图片预览 */}
      {showFullscreen && (
        <View className='fullscreen-container' onClick={handleCloseFullscreen}>
          <Image 
            className='fullscreen-image' 
            src={fullscreenImg} 
            mode='aspectFit' 
          />
          <View className='close-btn'>
            <AtIcon value='close' size='30' color='#fff'></AtIcon>
          </View>
        </View>
      )}
    </View>
  );
};

export default Detail; 