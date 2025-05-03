import { View } from '@tarojs/components'
import './index.scss'
import { useEffect, useState } from 'react'
import PostItem from './PostItem';
import { Post } from './PostItem';

interface WaterfallProps {
  data: Post[],
}

const Waterfall = ({ data }: WaterfallProps ) => {
  const [leftList, setLeftList] = useState<Post[]>([]);
  const [rightList, setRightList] = useState<Post[]>([]);

  useEffect(() => {
    const left: Post[] = [];
    const right: Post[] = [];

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