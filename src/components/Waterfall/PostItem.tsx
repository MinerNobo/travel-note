import { Image, View, Text } from "@tarojs/components"

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
    return (
        <View className="waterfall-item">
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