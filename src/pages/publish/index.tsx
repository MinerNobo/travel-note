import { View, Text, Input, Textarea, Button, Image, Video } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import imageIcon from '../../assets/icons/image.png'
import videoIcon from '../../assets/icons/video.png'
import { useStore } from "../../store/useStore";
import { createNote } from "../../api/services";

const baseUrl = process.env.TARO_APP_API;

interface MediaItem {
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl?: string;
}

export default function Publish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, isLoggedIn, accessToken } = useStore();

  useEffect(() => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
    }
  }, [isLoggedIn]);

  const chooseImage = () => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
      return;
    }
    Taro.chooseImage({
      count: 9 - images.length, 
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        setImages([...images, ...res.tempFilePaths]);
      }
    });
  };

  const chooseVideo = () => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
      return;
    }
    Taro.chooseVideo({
      sourceType: ["album", "camera"], 
      maxDuration: 60, 
      success: function (res) {
        setVideo([...video, res.tempFilePath]);
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeVideo = () => {
    setVideo([]);
  };

  const validate = () => {
    const newErrors: {
      title?: string;
      content?: string;
      images?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = "标题不能为空";
    }
    
    if (!content.trim()) {
      newErrors.content = "内容不能为空";
    }
    
    if (images.length === 0 && video.length === 0) {
      newErrors.images = "请至少上传一张图片或一个视频";
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
      return;
    }
    
    if (!validate()) {
      Taro.showToast({
        title: "请完善发布信息",
        icon: "none"
      });
      return;
    }

    setLoading(true);
    Taro.showLoading({ title: "发布中..." });

    try {
      const imagePosts: MediaItem[] = [];
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const res = await Taro.uploadFile({
            url: `${baseUrl}/api/upload/image`,
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
            imagePosts.push({
              type: "IMAGE",
              url: imageUrl,
            });
          } else {
            throw new Error("图片上传失败");
          }
        }
      }
 
      let videoPost: MediaItem | undefined;
      if (video.length > 0) {
        const res = await Taro.uploadFile({
          url: `${baseUrl}/api/upload/video`,
          filePath: video[0],
          name: "file",
          header: {
            "content-Type": "multipart/form-data",
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (res.statusCode === 201) {
          const data = JSON.parse(res.data);
          videoPost = {
            type: "VIDEO", 
            url: data.url.videoUrl,
            thumbnailUrl: data.url.thumbnailUrl,
          };
        } else {
          throw new Error("视频上传失败");
        }
      }
      
      const media: MediaItem[] = [...imagePosts];
      if (videoPost) {
        media.push(videoPost);
      }

      const postData = {
        title,
        content,
        media,
      }
      const res = await createNote(postData);
      Taro.showToast({
        title: "发布成功",
        icon: "success",
        duration: 2000,
      })
      setTitle("");
      setAgreed(false);
      setContent("");
      setImages([]);
      setVideo([]);
      Taro.switchTab({
        url: '/pages/myNote/index',
      })
    } catch (error) {
      console.error("发布失败", error);
    } finally {
      Taro.hideLoading();
      setLoading(false);
    }
  };

  return (
    <View className="publish-page">

      <View className="publish-content">
        <View className="media-section">
          {images.length > 0 || video.length > 0 ? (
            <View className="image-list">
              {images.map((img, index) => (
                <View key={index} className="image-item">
                  <Image src={img} className="preview-image" mode="aspectFill" />
                  <View className="remove-btn" onClick={() => removeImage(index)}>
                    ×
                  </View>
                </View>
              ))}
              {images.length < 9 && (
                <View className="upload-item" onClick={chooseImage}>
                  <View className="upload-icon">+</View>
                  <Text className="upload-text">添加图片</Text>
                </View>
              )}

              {video.length === 0 ? (
                <View className="upload-item" onClick={chooseVideo}>
                  <View className="upload-icon">+</View>
                  <Text className="upload-text">添加视频</Text>
                </View>
              ) : (
                <View className="image-item">
                  <Video src={video[0]} className="preview-image" />
                  <View className="remove-btn" onClick={removeVideo}>
                    ×
                  </View>
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
            placeholder="给你的笔记起一个吸引人的名字吧～" 
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />
        </View>

        <View className="content-section">
          <Textarea
            className="content-textarea"
            placeholder="分享你的旅行故事，最多300字"
            value={content}
            maxlength={300}
            onInput={(e) => setContent(e.detail.value)}
          />
        </View>
      </View>

      <View className="publish-footer">
        <View className="agreement-section">
          <View className={`checkbox ${agreed ? 'checked' : ''}`} onClick={() => setAgreed(!agreed)}></View>
          <Text className="agreement-text">勾选表示已阅读并同意</Text>
          <Text className="agreement-link">《携程社区发布规则》</Text>
        </View>
        
        <Button 
          className={`publish-btn ${(!agreed || loading) ? 'disabled' : ''}`} 
          onClick={(agreed && !loading) ? handlePublish : undefined}
        >
          {loading ? '发布中...' : '发游记'}
        </Button>
      </View>
    </View>
  );
}
