import { View } from '@tarojs/components'
import { Waterfall } from '../../components'
import './index.scss'
import { AtSearchBar, AtLoadMore } from 'taro-ui'
import { useEffect, useState } from 'react'
import { getApprovedNotes } from '../../api/services'
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { Post } from '../../components/Waterfall/PostItem'

export default function Index() {
  const [keyword, setKeyword] = useState('');
  const [postData, setPostData] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    loadData(1);
  }, [])

  useReachBottom(() => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  });

  usePullDownRefresh(() => {
    loadData(1);
    Taro.stopPullDownRefresh();
  });

  const loadData = (page: number) => {
    setIsLoading(true);
    getApprovedNotes(page, pageSize, keyword).then((res) => {
      const newData = res.data || [] as Post[];
      
      if (newData.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (JSON.stringify(newData) === JSON.stringify(postData)) {
        const filteredData = postData.filter(item => 
          item.title.includes(keyword) || 
          (item.author.username.includes(keyword))
        );
        setPostData(filteredData);
        setHasMore(false);
        setPageNum(1);
        setIsLoading(false);
        return;
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
    setKeyword(value);
  }

  const handleClick = () => {
    // 搜索时重置分页状态
    loadData(1);
  }

  return (
    <View className='index'>

      <AtSearchBar 
        value={keyword}
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
