import { View, Text, Image, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useStore } from "../../store/useStore";
import "./index.scss";
import { getMyNotes } from "../../api/services";
import { formatDate } from "../../utils/dateFormat";

// 我的笔记页面功能：
// 1. 展示当前登录用户发布的游记列表
// 2. 游记有待审核、已通过、未通过三种状态
// 3. 未通过审核游记，需展示拒绝原因
// 4. 实现游记编辑、删除功能。待审核、未通过状态可编辑；所有状态游记可删除
// 5. 添加一个Fab，点击后跳转到发布页

const baseUrl = 'http://localhost:40000';

export default function MyNote() {
  const { isLoggedIn, user, accessToken } = useStore();
  const [notes, setNotes] = useState([]);
  
  useEffect(() => {
    if (isLoggedIn) {
      getMyNotes().then((res) => {
        setNotes(res.data);
      })
    }
  }, [isLoggedIn, user, notes]);

  // 编辑游记
  const handleEdit = (id: string) => {
    Taro.navigateTo({
      url: `/pages/edit/index?id=${id}`
    });
  };

  // 删除游记
  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这篇游记吗？',
      success: function (res) {
        if (res.confirm) {
          Taro.request({
            url: 'http://localhost:40000/notes/' + id,
            method: 'DELETE',
            header: {
              'Authorization': `Bearer ${accessToken}`
            },
            success: () => {
              Taro.showToast({
                title: '删除成功',
                icon: 'success'
              });
              // 更新游记列表
              setNotes(notes.filter(noteId => noteId !== id));
            },
            fail: () => { 
              Taro.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  };

  // 获取状态标签文本和样式类
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: '待审核', className: 'status-pending' };
      case 'APPROVED':
        return { text: '已通过', className: 'status-approved' };
      case 'REJECTED':
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
                      src={baseUrl + note.media[0].url} 
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
                    
                    <Text className="note-date">{formatDate(note.createdAt)}</Text>
                    
                    <View className="note-preview">
                      <Text className="preview-text">{note.content.substring(0, 80)}...</Text>
                    </View>
                    
                    {note.status === 'REJECTED' && (
                      <View className="reject-reason">
                        <Text className="reason-label">拒绝原因：</Text>
                        <Text className="reason-content">{note.rejectReason}</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View className="note-actions-wrapper">
                  <View className="note-actions">
                    {(note.status === 'PENDING' || note.status === 'REJECTED') && (
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
        </View>
      )}

      {/* 悬浮按钮 FAB */}
      <View 
        className="fab-button"
        onClick={() => Taro.switchTab({ url: '/pages/publish/index' })}
      >
        <Text className="fab-icon">+</Text>
      </View>
    </View>
  );
}
