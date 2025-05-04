import { View } from '@tarojs/components'
import { Waterfall } from '../../components'
import './index.scss'
import { AtSearchBar } from 'taro-ui'

import card01 from '../../assets/cardImages/card01.jpg'
import card02 from '../../assets/cardImages/card02.jpg'
import card03 from '../../assets/cardImages/card03.jpg'
import card04 from '../../assets/cardImages/card04.jpg'
import card05 from '../../assets/cardImages/card05.jpg'

import ava01 from '../../assets/avatarImages/avatar01.jpg'
import ava02 from '../../assets/avatarImages/avatar02.jpg'
import ava03 from '../../assets/avatarImages/avatar03.jpg'
import ava04 from '../../assets/avatarImages/avatar04.jpg'
import { useEffect, useState } from 'react'

// 示例数据
const mockData = [
  {
    id: 1,
    imageUrl: card01,
    title: '香港迪士尼正确游玩路线',
    avatar: ava01,
    author: '娜娜在港漂流记',
  },
  {
    id: 2,
    imageUrl: card02,
    title: '深圳大南山',
    avatar: ava02,
    author: '猫猫的城市日记',
  },
  {
    id: 3,
    imageUrl: card03,
    title: '本地人吐血整理超全攻略',
    avatar: ava03,
    author: '花花美宿记',
  },
  {
    id: 4,
    imageUrl: card04,
    title: '✨ 上海外滩｜一键get氛围感大片',
    avatar: ava04,
    author: '鹤顶红',
  },
  {
    id: 5,
    imageUrl: card05,
    title: '深圳梧桐山徒步攻略',
    avatar: ava02,
    author: '猫猫的城市日记',
  },
  {
    id: 6,
    imageUrl: card03,
    title: '广州一日游推荐路线',
    avatar: ava01,
    author: '娜娜在港漂流记',
  },
  {
    id: 7,
    imageUrl: card04,
    title: '北京胡同探秘之旅',
    avatar: ava03,
    author: '花花美宿记',
  },
  {
    id: 8,
    imageUrl: card01,
    title: '青岛崂山徒步全攻略',
    avatar: ava04,
    author: '鹤顶红',
  },
]

export default function Index() {
  const [searchValue, setSearchValue] = useState('');
  const [postData, setPostData] = useState(mockData);

  const handleChange = (value: string) => {
    setSearchValue(value);
  }

  const handleClick = () => {
    setPostData(mockData.filter((item) => item.title.includes(searchValue) || item.author.includes(searchValue)));
  }

  return (
    <View className='index'>

      <AtSearchBar 
        value={searchValue}
        onChange={handleChange}
        onActionClick={handleClick}
      />

      <View className='content'>
        <Waterfall data={postData} />
      </View>
    </View>
  )
}
