import { View, Text, Input, Textarea, Button, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import imageIcon from '../../assets/icons/image.png'
import videoIcon from '../../assets/icons/video.png'
import { useStore } from "../../store/useStore";
import { getNoteById, updateNote } from "../../api/services";

const baseUrl = process.env.TARO_APP_API;

export default function Edit() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<any>(null);
  const [noteId, setNoteId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, accessToken } = useStore() as {
    isLoggedIn: boolean;
    accessToken: string;
    user: any;
  };

  // 获取游记ID并加载游记数据
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const id = instance.router?.params.id || '';
    
    if (id) {
      setNoteId(id);
      loadNoteData(id);
    } else {
      Taro.showToast({
        title: "游记ID不存在",
        icon: "none",
        duration: 2000
      });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/myNote/index' });
      }, 1500);
    }
  }, []);

  // 加载游记数据
  const loadNoteData = async (id: string) => {
    try {
      setLoading(true);
      const res = await getNoteById(id);
      
      // 设置标题和内容
      setTitle(res.title);
      setContent(res.content);
      
      // 处理媒体资源
      const imageMedia = res.media.filter(item => item.type === 'IMAGE');
      const videoMedia = res.media.find(item => item.type === 'VIDEO');
      
      // 保存原有的图片URL
      setImageUrls(imageMedia);
      
      // 保存原有的视频URL
      if (videoMedia) {
        setVideoUrl(videoMedia);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("获取游记数据失败", error);
      Taro.showToast({
        title: "获取游记数据失败",
        icon: "none",
        duration: 2000
      });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/myNote/index' });
      }, 1500);
    }
  };

  // 选择图片
  const chooseImage = () => {
    Taro.chooseImage({
      count: 9 - (images.length + imageUrls.length), // 最多9张图片
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        setImages([...images, ...res.tempFilePaths]);
      }
    });
  };

  // 选择视频
  const chooseVideo = () => {
    // 如果已有视频，先删除
    if (videoUrl || video.length > 0) {
      removeVideo();
    }
    
    Taro.chooseVideo({
      sourceType: ["album", "camera"], 
      maxDuration: 60, 
      camera: "back", 
      success: function (res) {
        setVideo([res.tempFilePath]);
      }
    });
  };

  // 删除新选择的图片
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 删除原有的图片
  const removeImageUrl = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  // 删除视频
  const removeVideo = () => {
    setVideo([]);
    setVideoUrl(null);
  };

  // 表单验证
  const validate = () => {
    const newErrors: {
      title?: string;
      content?: string;
      media?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = "标题不能为空";
    }
    
    if (!content.trim()) {
      newErrors.content = "内容不能为空";
    }
    
    if (images.length === 0 && video.length === 0 && imageUrls.length === 0 && !videoUrl) {
      newErrors.media = "请至少上传一张图片或一个视频";
    }
    
    if (Object.keys(newErrors).length > 0) {
      const errorMsg = Object.values(newErrors).join(', ');
      Taro.showToast({
        title: errorMsg,
        icon: "none"
      });
      return false;
    }
    
    return true;
  };

  // 更新游记
  const handleUpdate = async () => {
    // 检查用户是否登录
    if (!isLoggedIn) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
      return;
    }
    
    if (!validate()) {
      return;
    }

    Taro.showLoading({ title: "更新中..." });

    try {
      // 处理媒体资源，保留原有的和上传新的
      const media = [...imageUrls];
      
      // 1. 上传新选择的图片
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const res = await Taro.uploadFile({
            url: `${baseUrl}/upload/image`,
            filePath: images[i],
            name: "file",
            header: {
              "content-Type": "multipart/form-data",
              'Authorization': `Bearer ${accessToken}`
            }
          });
          if (res.statusCode === 201) {
            const data = JSON.parse(res.data);
            const imageUrl = data.url;
            media.push({
              type: "IMAGE",
              url: imageUrl,
            });
          } else {
            throw new Error("图片上传失败");
          }
        }
      }

      // 2. 处理视频，如果有新的视频则上传  
      if (video.length > 0) {
        const res = await Taro.uploadFile({
          url: `${baseUrl}/upload/video`,
          filePath: video[0],
          name: "file",
          header: {
            "content-Type": "multipart/form-data",
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (res.statusCode === 201) {
          const data = JSON.parse(res.data);
          const videoPost = {
            type: "VIDEO", 
            url: data.url.videoUrl,
            thumbnail: data.url.thumbnailUrl,
          };
          media.push(videoPost);
        } else {
          throw new Error("视频上传失败");
        }
      } else if (videoUrl) {
        // 如果保留原有视频
        media.push(videoUrl);
      }
      
      // 3. 更新游记内容
      const updateData = {
        title,
        content,
        media,
      };
      
      await updateNote(noteId, updateData);
      
      Taro.showToast({
        title: "更新成功",
        icon: "success",
        duration: 2000,
      });
      
      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/myNote/index',
        });
      }, 1500);
    } catch (error) {
      console.error("更新失败", error);
      Taro.showToast({
        title: "更新失败",
        icon: "none",
        duration: 2000
      });
    } finally {
      Taro.hideLoading();
    }
  };

  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="edit-page">
      <View className="edit-content">
        <View className="media-section">
          {(images.length > 0 || imageUrls.length > 0 || video.length > 0 || videoUrl) ? (
            <View className="image-list">
              {/* 显示原有图片 */}
              {imageUrls.map((img, index) => (
                <View key={`url-${index}`} className="image-item">
                  <Image src={baseUrl + img.url} className="preview-image" mode="aspectFill" />
                  <View className="remove-btn" onClick={() => removeImageUrl(index)}>
                    ×
                  </View>
                </View>
              ))}
              
              {/* 显示新选择的图片 */}
              {images.map((img, index) => (
                <View key={`new-${index}`} className="image-item">
                  <Image src={img} className="preview-image" mode="aspectFill" />
                  <View className="remove-btn" onClick={() => removeImage(index)}>
                    ×
                  </View>
                </View>
              ))}
              
              {/* 添加图片按钮 */}
              {(images.length + imageUrls.length) < 9 && (
                <View className="upload-item" onClick={chooseImage}>
                  <View className="upload-icon">+</View>
                  <Text className="upload-text">添加图片</Text>
                </View>
              )}

              {/* 显示原有视频 */}
              {videoUrl && !video.length && (
                <View className="image-item">
                  <Image src={videoUrl.thumbnail} className="preview-image" mode="aspectFill" />
                  <View className="remove-btn" onClick={removeVideo}>
                    ×
                  </View>
                </View>
              )}

              {/* 显示新选择的视频 */}
              {video.length > 0 && (
                <View className="image-item">
                  <Image src={video[0]} className="preview-image" mode="aspectFill" />
                  <View className="remove-btn" onClick={removeVideo}>
                    ×
                  </View>
                </View>
              )}
              
              {/* 添加视频按钮 */}
              {!videoUrl && video.length === 0 && (
                <View className="upload-item" onClick={chooseVideo}>
                  <View className="upload-icon">+</View>
                  <Text className="upload-text">添加视频</Text>
                </View>
              )}
            </View>
          ) : (
            <View className="upload-section">
              <View className="upload-item" onClick={chooseImage}>
                <View className="upload-icon">
                  <Image src={imageIcon} className="icon-image" />
                </View>
                <Text className="upload-text">添加图片</Text>
              </View>
              
              <View className="upload-item" onClick={chooseVideo}>
                <View className="upload-icon">
                  <Image src={videoIcon} className="icon-video" />
                </View>
                <Text className="upload-text">添加视频</Text>
              </View>
            </View>
          )}
        </View>

        <View className="title-section">
          <Input 
            className="title-input" 
            placeholder="输入游记标题" 
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />
        </View>

        <View className="content-section">
          <Textarea
            className="content-textarea"
            placeholder="分享你的旅行故事，最多3000字"
            value={content}
            maxlength={3000}
            onInput={(e) => setContent(e.detail.value)}
          />
        </View>
      </View>

      <View className="edit-footer">
        <Button 
          className="update-btn" 
          onClick={handleUpdate}
        >
          更新游记
        </Button>
      </View>
    </View>
  );
} 