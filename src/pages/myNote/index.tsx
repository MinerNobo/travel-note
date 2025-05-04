import { View, Text, Image, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useStore } from "../../store/useStore";
import "./index.scss";

// 导入图片资源
import card01 from '../../assets/cardImages/card01.jpg'
import card02 from '../../assets/cardImages/card02.jpg'
import card03 from '../../assets/cardImages/card03.jpg'
import card04 from '../../assets/cardImages/card04.jpg'
import card05 from '../../assets/cardImages/card05.jpg'

// 我的笔记页面功能：
// 1. 展示当前登录用户发布的游记列表
// 2. 游记有待审核、已通过、未通过三种状态
// 3. 未通过审核游记，需展示拒绝原因
// 4. 实现游记编辑、删除功能。待审核、未通过状态可编辑；所有状态游记可删除

// 模拟数据
const mockData = [
  {
    id: 1,
    title: "香港迪士尼正确游玩路线",
    imageUrl: card01,
    content: "香港迪士尼乐园位于大屿山，交通便利。建议早上9点前到达，避开人流高峰。首先游玩热门项目如小熊维尼历险记、米奇幻想曲等...",
    status: "pending", // 待审核
    createdAt: "2023-05-15",
  },
  {
    id: 2,
    title: "深圳大南山徒步攻略",
    imageUrl: card02,
    content: "大南山是深圳西部的一座海拔高度超过500米的山脉，视野开阔，是俯瞰深圳湾和香港的绝佳地点...",
    status: "approved", // 已通过
    createdAt: "2023-06-20",
  },
  {
    id: 3,
    title: "北京胡同探秘之旅",
    imageUrl: card03,
    content: "北京的胡同承载着老北京的历史与文化，南锣鼓巷、烟袋斜街等都是游客必去的胡同...",
    status: "rejected", // 未通过
    rejectReason: "内容不符合规范，请修改后重新提交",
    createdAt: "2023-07-10",
  },
  {
    id: 4,
    title: "✨ 上海外滩｜一键get氛围感大片",
    imageUrl: card04,
    content: "上海外滩是上海的标志性景点，这里汇集了各种风格的建筑，是拍照打卡的绝佳地点...",
    status: "approved", // 已通过
    createdAt: "2023-08-05",
  },
  {
    id: 5,
    title: "广州一日游推荐路线",
    imageUrl: card05,
    content: "广州是一座历史悠久的城市，这里有美食、有文化、有现代化的都市风光...",
    status: "pending", // 待审核
    createdAt: "2023-09-01",
  }
];

export default function MyNote() {
  const { isLoggedIn, user } = useStore();
  const [notes, setNotes] = useState(mockData);
  
  useEffect(() => {
    // 从API获取用户的游记列表
    if (isLoggedIn && user) {
      // API调用
      
      setNotes([]);
    } else {
      // 未登录时跳转到登录页
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      
      // setTimeout(() => {
      //   Taro.navigateTo({
      //     url: '/pages/login/index'
      //   });
      // }, 2000);
    }
  }, [isLoggedIn, user]);

  // 编辑游记
  const handleEdit = (id: number) => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  // 删除游记
  const handleDelete = (id: number) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这篇游记吗？',
      success: function (res) {
        if (res.confirm) {
          // 调用API删除游记
          // deleteNote(id).then(() => {
          //   // 删除成功后更新列表
          //   setNotes(notes.filter(note => note.id !== id));
          // });
          
          // 模拟删除
          setNotes(notes.filter(note => note.id !== id));
          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  };

  // 获取状态标签文本和样式类
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '待审核', className: 'status-pending' };
      case 'approved':
        return { text: '已通过', className: 'status-approved' };
      case 'rejected':
        return { text: '未通过', className: 'status-rejected' };
      default:
        return { text: '未知状态', className: '' };
    }
  };

  return (
    <View className="my-note-container">
      
      {notes.length > 0 ? (
        <View className="notes-list">
          {notes.map(note => {
            const statusInfo = getStatusInfo(note.status);
            return (
              <View key={note.id} className="note-item">
                <View className="note-info">
                  <View className="note-cover">
                    <Image 
                      className="cover-image" 
                      src={note.imageUrl} 
                      mode="aspectFill" 
                    />
                  </View>
                  
                  <View className="note-content">
                    <View className="note-header">
                      <Text className="note-title">{note.title}</Text>
                      <Text className={`note-status ${statusInfo.className}`}>
                        {statusInfo.text}
                      </Text>
                    </View>
                    
                    <Text className="note-date">{note.createdAt}</Text>
                    
                    <View className="note-preview">
                      <Text className="preview-text">{note.content.substring(0, 80)}...</Text>
                    </View>
                    
                    {note.status === 'rejected' && (
                      <View className="reject-reason">
                        <Text className="reason-label">拒绝原因：</Text>
                        <Text className="reason-content">{note.rejectReason}</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View className="note-actions-wrapper">
                  <View className="note-actions">
                    {(note.status === 'pending' || note.status === 'rejected') && (
                      <Button 
                        className="action-button edit-button" 
                        onClick={() => handleEdit(note.id)}
                      >
                        编辑
                      </Button>
                    )}
                    <Button 
                      className="action-button delete-button" 
                      onClick={() => handleDelete(note.id)}
                    >
                      删除
                    </Button>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View className="empty-notes">
          <Text className="empty-text">您还没有发布任何游记</Text>
          <Button 
            className="create-button"
            onClick={() => Taro.navigateTo({ url: '/pages/publish/index' })}
          >
            去发布
          </Button>
        </View>
      )}
    </View>
  );
}
