import { View } from '@tarojs/components'
import './index.scss'
import { useEffect, useState } from 'react'
import PostItem from './PostItem';

interface PostItem {
  id: number,
  imageUrl: string,
  title: string,
  author: string,
  avatar: string,
  likes: number,
}

interface WaterfallProps {
  data: PostItem[],
}

const Waterfall = ({ data }: WaterfallProps ) => {
  const [leftList, setLeftList] = useState<PostItem[]>([]);
  const [rightList, setRightList] = useState<PostItem[]>([]);

  useEffect(() => {
    const left: PostItem[] = [];
    const right: PostItem[] = [];

    data.forEach((item, index) => {
      if (index % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    })

    setLeftList(left);
    setRightList(right);
  }, [data]);

  return (
    <View className='waterfall-container'>

      <View className='waterfall-column left-column'>
        {
          leftList.map((item) => (
            <PostItem key={item.id} item={item} />
          ))
        }
      </View>

      <View className='waterfall-column right-column'>
        {
          rightList.map((item) => (
            <PostItem key={item.id} item={item} />
          ))
        }
      </View>
    </View>
  )
}

export default Waterfall;