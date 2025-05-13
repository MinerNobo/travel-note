import { Image, View, Text } from "@tarojs/components"
import Taro from '@tarojs/taro'
export interface Post {
    id: string,
    title: string,
    imageUrl: string,
    content: string,
    author: {
        id: string,
        username: string,
        avatarUrl: string,
    }
}

const baseUrl = process.env.TARO_APP_API;

interface PostItemProps {
    item: Post,
}

const PostItem = ({ item } : PostItemProps) => {
    const handleClick = () => {
        Taro.navigateTo({
            url: `/pages/detail/index?id=${item.id}`
        })
    }

    return (
        <View className="waterfall-item" onClick={handleClick}>
            <Image 
                className="item-image"
                src={baseUrl + item.imageUrl}
                mode="widthFix"
            />

            <View className="item-title">{item.title}</View>

            <View className="item-author">
                <Image 
                    className="author-avatar"
                    src={baseUrl + item.author.avatarUrl}
                />
                <Text className="author-name">{item.author.username}</Text>
            </View>
        </View>
    )
}

export default PostItem;