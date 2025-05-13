import { View, Text, Image, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useStore } from "../../store/useStore";
import "./index.scss";
import { getMyNotes } from "../../api/services";
import { formatDate } from "../../utils/dateFormat";

const baseUrl = process.env.TARO_APP_API;

interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl: string | null;
}

interface Note {
  id: string;
  title: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason?: string;
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
}

export default function MyNote() {
  const { isLoggedIn, user, accessToken } = useStore();
  const [notes, setNotes] = useState<Note[]>([]);
  
  useEffect(() => {
    if (isLoggedIn) {
      getMyNotes().then((res) => {
        setNotes(res.data);
      })
    }
  }, [isLoggedIn, user, notes]);

  const handleEdit = (id: string) => {
    Taro.navigateTo({
      url: `/pages/edit/index?id=${id}`
    });
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这篇游记吗？',
      success: function (res) {
        if (res.confirm) {
          Taro.request({
            url: `${baseUrl}/api/notes/${id}`,
            method: 'DELETE',
            header: {
              'Authorization': `Bearer ${accessToken}`
            },
            success: () => {
              Taro.showToast({
                title: '删除成功',
                icon: 'success'
              });
              setNotes(notes.filter(note => note.id !== id));
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

      <View 
        className="fab-button"
        onClick={() => Taro.switchTab({ url: '/pages/publish/index' })}
      >
        <Text className="fab-icon">+</Text>
      </View>
    </View>
  );
}
