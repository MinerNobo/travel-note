import { View, Text, Map, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import './index.scss';
import locationIcon from '../../assets/icons/locationIcon.png'; // 请确保这个图标文件存在

interface TravelMapProps {
  userId: string;
  accessToken: string;
}

interface CheckInRecord {
  id: string;
  userId: string;
  cityName: string;
  latitude: number;
  longitude: number;
  checkInTime: string;
}

const TravelMap: React.FC<TravelMapProps> = ({ userId, accessToken }) => {
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [location, setLocation] = useState({ latitude: 39.908823, longitude: 116.397470 });
  const [loading, setLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState('');
  const [showCheckInButton, setShowCheckInButton] = useState(false);

  // 获取用户足迹记录
  useEffect(() => {
    if (userId) {
      fetchCheckInRecords();
      getCurrentLocation();
    }
  }, [userId]);

  // 获取用户当前位置
  const getCurrentLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: function (res) {
        const { latitude, longitude } = res;
        setLocation({ latitude, longitude });
        
        // 逆地理编码，获取城市名称
        Taro.request({
          url: `http://localhost:40000/map/geocode?latitude=${latitude}&longitude=${longitude}`,
          header: {
            'Authorization': `Bearer ${accessToken}`
          },
          success: function (res) {
            if (res.statusCode === 200 && res.data.city) {
              setCurrentCity(res.data.city);
              setShowCheckInButton(true);
            }
          },
          fail: function () {
            Taro.showToast({
              title: '获取位置信息失败',
              icon: 'none'
            });
          }
        });
      },
      fail: function () {
        Taro.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    });
  };

  // 获取用户足迹记录
  const fetchCheckInRecords = () => {
    setLoading(true);
    Taro.request({
      url: `http://localhost:40000/checkin/user/${userId}`,
      header: {
        'Authorization': `Bearer ${accessToken}`
      },
      success: function (res) {
        if (res.statusCode === 200) {
          setCheckInRecords(res.data);
        }
      },
      fail: function () {
        Taro.showToast({
          title: '获取足迹记录失败',
          icon: 'none'
        });
      },
      complete: function () {
        setLoading(false);
      }
    });
  };

  // 处理打卡
  const handleCheckIn = () => {
    Taro.showLoading({ title: '打卡中...' });
    
    Taro.request({
      url: 'http://localhost:40000/checkin',
      method: 'POST',
      data: {
        cityName: currentCity,
        latitude: location.latitude,
        longitude: location.longitude
      },
      header: {
        'Authorization': `Bearer ${accessToken}`
      },
      success: function (res) {
        if (res.statusCode === 201) {
          Taro.showToast({
            title: `成功打卡 ${currentCity}`,
            icon: 'success'
          });
          
          // 刷新足迹记录
          fetchCheckInRecords();
          setShowCheckInButton(false);
        } else {
          Taro.showToast({
            title: res.data.message || '打卡失败',
            icon: 'none'
          });
        }
      },
      fail: function () {
        Taro.showToast({
          title: '打卡失败',
          icon: 'none'
        });
      },
      complete: function () {
        Taro.hideLoading();
      }
    });
  };

  // 查看打卡详情
  const viewCheckInDetail = (record: CheckInRecord) => {
    Taro.showModal({
      title: record.cityName,
      content: `打卡时间: ${new Date(record.checkInTime).toLocaleString()}`,
      showCancel: false
    });
  };

  // 处理地图加载错误
  const handleMapError = () => {
    Taro.showToast({
      title: '地图加载失败',
      icon: 'none'
    });
  };

  return (
    <View className='travel-map-container'>
      <View className='map-header'>
        <Text className='map-title'>我的足迹地图</Text>
        {showCheckInButton && (
          <View className='checkin-prompt'>
            <Text>您当前在: {currentCity}</Text>
            <View className='checkin-button' onClick={handleCheckIn}>打卡</View>
          </View>
        )}
      </View>
      
      {/* 成就展示 */}
      <View className='achievement-simple'>
        <Text>您已经打卡了 <Text className='achievement-count'>{checkInRecords.length}</Text> 个城市</Text>
      </View>
      
      <View className='map-wrapper'>
        <Map
          className='map'
          longitude={location.longitude}
          latitude={location.latitude}
          scale={5}
          showLocation
          markers={checkInRecords.map((record, index) => ({
            id: index,
            latitude: record.latitude,
            longitude: record.longitude,
            iconPath: locationIcon,
            width: 24,
            height: 24
          } as any))}
          onError={handleMapError as any}
        />
      </View>
      
      <View className='checkin-list'>
        <Text className='section-title'>打卡城市</Text>
        <View className='city-list'>
          {checkInRecords.length > 0 ? (
            checkInRecords.map(record => (
              <View 
                key={record.id} 
                className='city-item'
                onClick={() => viewCheckInDetail(record)}
              >
                <Text className='city-name'>{record.cityName}</Text>
                <Text className='checkin-date'>{new Date(record.checkInTime).toLocaleDateString()}</Text>
              </View>
            ))
          ) : (
            <Text className='empty-tip'>暂无打卡记录</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default TravelMap; 