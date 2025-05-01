import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";

export default function Mine() {
  const handleClick = () => {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }

  return (
    <View>
      <Text>我的页面</Text>
      <Button onClick={handleClick}>登录/注册</Button>
    </View>
  );
}
