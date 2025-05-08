import { Image, View, Text } from "@tarojs/components"
import Taro from '@tarojs/taro'

export interface Post {
    id: number,
    imageUrl: string,
    title: string,
    author: string,
    avatar: string,
}

interface PostItemProps {
    item: Post,
}

const PostItem = ({ item } : PostItemProps) => {
    const handleClick = () => {
        // 跳转到详情页，并传递id参数
        Taro.navigateTo({
            url: `/pages/detail/index?id=${item.id}`
        })
    }

    return (
        <View className="waterfall-item" onClick={handleClick}>
            <Image 
                className="item-image"
                src={item.imageUrl}
                mode="widthFix"
            />

            <View className="item-title">{item.title}</View>

            <View className="item-author">
                <Image 
                    className="author-avatar"
                    src={item.avatar}
                />
                <Text className="author-name">{item.author}</Text>
            </View>
        </View>
    )
}

export default PostItem;