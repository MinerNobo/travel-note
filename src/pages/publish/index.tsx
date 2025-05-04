import { View, Text, Input, Textarea, Button, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import imageIcon from '../../assets/icons/image.png'
import videoIcon from '../../assets/icons/video.png'
import { useStore } from "../../store/useStore";
// 发布页的功能
// 1. 选择图片（图片可上传多张），视频（最多上传一个）
// 2. 输入标题
// 3. 输入内容
// 4. 发布
// 5. 发布成功后，跳转到游记详情页
// 6. 对发布的内容必须做校验，标题，内容， 图片是必须的
// 7. 接口上，先上传照片和视频，拿到imageUrls和videoUrl，然后发布游记

export default function Publish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const { user, isLoggedIn } = useStore();

  // 页面加载时检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
      
      // 延迟跳转到登录页面
      setTimeout(() => {
        Taro.navigateTo({
          url: '/pages/login/index',
        });
      }, 1500);
    }
  }, [isLoggedIn]);

  // 选择图片
  const chooseImage = () => {
    Taro.chooseImage({
      count: 9 - images.length, // 最多9张图片
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        setImages([...images, ...res.tempFilePaths]);
      }
    });
  };

  // 选择视频
  const chooseVideo = () => {
    Taro.chooseVideo({
      sourceType: ["album", "camera"], // 相册或者相机拍摄
      maxDuration: 60, // 最大时长60秒
      camera: "back", // 默认使用后置摄像头
      success: function (res) {
        setVideo([...video, res.tempFilePath]);
      }
    });
  };

  // 删除图片
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 删除视频
  const removeVideo = () => {
    setVideo([]);
  };

  // 表单验证
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

  // 发布
  const handlePublish = async () => {
    // 检查用户是否登录
    if (!isLoggedIn) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
      
      // 延迟跳转到登录页面
      setTimeout(() => {
        Taro.navigateTo({
          url: '/pages/login/index',
        });
      }, 1500);
      
      return;
    }
    
    if (!validate()) {
      Taro.showToast({
        title: "请完善发布信息",
        icon: "none"
      });
      return;
    }

    Taro.showLoading({ title: "发布中..." });

    try {
      // 1. 先上传图片，拿到imageUrls
      const imageUrls = [];
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const imageRes = await Taro.uploadFile({
            url: "http://localhost:4000/upload/image",
            filePath: images[i],
            name: "image",
            header: {
              "content-Type": "multipart/form-data"
            }
          });
          
          if (imageRes.statusCode === 200) {
            const data = imageRes.data;
            imageUrls.push(data.url);
          } else {
            throw new Error("图片上传失败");
          }
        }
      }

      // 2. 上传视频，拿到videoUrl  
      let videoUrl = "";
      if (video.length > 0) {
        const videoRes = await Taro.uploadFile({
          url: "http://localhost:4000/upload/video",
          filePath: video[0],
          name: "video",
          header: {
            "content-Type": "multipart/form-data"
          }
        });

        if (videoRes.statusCode === 200) {
          const data = videoRes.data;
          videoUrl = data.url;
        } else {
          throw new Error("视频上传失败");
        }
      }

      // 3. 发布游记内容
      const postRes = await Taro.request({
        url: "http://localhost:4000/travel-notes",
        method: "POST",
        data: {
          title,
          content,
          userId: user.id,
          images: imageUrls,
          video: videoUrl
        },
        header: {
          "content-type": "application/json"
        }
      });

      if (postRes.statusCode === 200) {
        const travelNoteId = postRes.data.id;
        
        Taro.hideLoading();
        Taro.showToast({
          title: "发布成功",
          icon: "success",
          duration: 2000,
          success: () => {
            // 发布成功后跳转到首页
            setTimeout(() => {
              Taro.navigateTo({
                url: '/pages/index/index',
              });
            }, 1000);
          }
        });
      } else {
        throw new Error(postRes.data.message || "发布失败");
      }
    } catch (error: Error | unknown) {
      Taro.hideLoading();
      Taro.showToast({
        title: error instanceof Error ? error.message : "发布失败，请重试",
        icon: "none",
        duration: 2000
      });
    }
  };

  const handleRuleClick = () => {
    Taro.showToast({
      title: '《规则123》',
      icon: 'none',
      duration: 2000,
    })
  }

  return (
    <View className="publish-page">

      <View className="publish-content">
        <View className="media-section">
          {images.length > 0 || video.length > 0 ? (
            <View className="image-list">
              {/* 已上传的图片列表, 可以删除 */}
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
                  <Image src={video[0]} className="preview-image" mode="aspectFill" />
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
            placeholder="你的笔记离火就差个标题了~" 
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

      <View className="publish-footer">
        <View className="agreement-section">
          <View className={`checkbox ${agreed ? 'checked' : ''}`} onClick={() => setAgreed(!agreed)}></View>
          <Text className="agreement-text">勾选表示已阅读并同意</Text>
          <Text className="agreement-link" onClick={handleRuleClick}>《携程社区发布规则》</Text>
        </View>
        
        <Button 
          className={`publish-btn ${!agreed ? 'disabled' : ''}`} 
          onClick={agreed ? handlePublish : undefined}
        >
          发游记
        </Button>
      </View>
    </View>
  );
}
