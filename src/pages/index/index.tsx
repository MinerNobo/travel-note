import { View } from '@tarojs/components'
import { Waterfall } from '../../components'
import './index.scss'
import { AtSearchBar, AtLoadMore } from 'taro-ui'
import { useEffect, useState } from 'react'
import { getApprovedNotes } from '../../api/services'
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'

export default function Index() {
  const [searchValue, setSearchValue] = useState('');
  const [postData, setPostData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    loadData(1);
  }, [])

  // 使用Taro的钩子函数监听页面触底
  useReachBottom(() => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  });

  // 下拉刷新
  usePullDownRefresh(() => {
    loadData(1);
    Taro.stopPullDownRefresh();
  });

  const loadData = (page: number) => {
    setIsLoading(true);
    getApprovedNotes(page, pageSize).then((res) => {
      const newData = res.data || [];
      if (newData.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (page === 1) {
        setPostData(newData);
      } else {
        setPostData([...postData, ...newData]);
      }
      setPageNum(page);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }

  // 加载更多数据
  const loadMore = () => {
    if (hasMore && !isLoading) {
      loadData(pageNum + 1);
    }
  }

  const handleChange = (value: string) => {
    setSearchValue(value);
  }

  const handleClick = () => {
    // 搜索时重置分页状态
    if (searchValue.trim()) {
      setPostData(postData.filter((item) => item.title.includes(searchValue) || item.author.username.includes(searchValue)));
      setHasMore(false); // 搜索结果不需要继续加载
    } else {
      // 搜索框为空时，重新加载第一页数据
      loadData(1);
    }
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
        
        {/* 加载状态提示 */}
        {postData.length > 0 && (
          <AtLoadMore
            status={isLoading ? 'loading' : hasMore ? 'more' : 'noMore'}
            onClick={loadMore}
          />
        )}
      </View>
    </View>
  )
}
