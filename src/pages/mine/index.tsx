import { useStore } from "../../store/useStore";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

export default function Mine() {
  const { isLoggedIn, logout } = useStore(); 

  const handleClick = () => {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <View>
      <Text>我的页面</Text>
      <Button className={isLoggedIn ? 'hidden' : 'btn'} onClick={handleClick}>登录</Button>
      <Button className={isLoggedIn ? 'btn' : 'hidden'} onClick={handleLogout}>退出登录</Button>
    </View>
  );
}
