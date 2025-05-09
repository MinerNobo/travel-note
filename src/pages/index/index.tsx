import { View } from '@tarojs/components'
import { Waterfall } from '../../components'
import './index.scss'
import { AtSearchBar } from 'taro-ui'
import { useEffect, useState } from 'react'
import { getApprovedNotes } from '../../api/services'

export default function Index() {
  const [searchValue, setSearchValue] = useState('');
  const [postData, setPostData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    loadData(1);
  }, [])

  const loadData = (pageNum: number) => {
    getApprovedNotes(pageNum, pageSize).then((res) => {
      const newData = res.data || [];
      if (newData.length < pageSize) {
        setHasMore(false);
      }
      
      if (pageNum === 1) {
        setPostData(newData);
      } else {
        setPostData([...postData, ...newData]);
      }
    })
  }

  const handleChange = (value: string) => {
    setSearchValue(value);
  }

  const handleClick = () => {
    setPostData(postData.filter((item) => item.title.includes(searchValue) || item.author.username.includes(searchValue)));
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
