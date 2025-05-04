import { View, Text, Input, Textarea, Button, Image } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import imageIcon from '../../assets/icons/image.png'
import videoIcon from '../../assets/icons/video.png'

// 发布页的功能
// 1. 选择图片（图片可上传多张），视频（最多上传一个）
// 2. 输入标题
// 3. 输入内容
// 4. 发布
// 5. 发布成功后，跳转到游记详情页
// 6. 对发布的内容必须做校验，标题，内容， 图片是必须的

export default function Publish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

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
  const handlePublish = () => {
    if (!validate()) {
      Taro.showToast({
        title: "请完善发布信息",
        icon: "none"
      });
      return;
    }

    // 这里应该是上传图片、视频和发布内容的逻辑
    Taro.showLoading({ title: "发布中..." });
    
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: "发布成功",
        icon: "success",
        duration: 2000,
        success: () => {
          // 假设发布成功后需要生成一个唯一的id
          const travelNoteId = "123";
          // 发布成功后跳转到游记详情页
          setTimeout(() => {
            Taro.navigateTo({
              url: '/pages/travelNote/index/index'
            });
          }, 1000);
        }
      });
    }, 1500);
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
      <View className="publish-header">
        <Text className="header-title">分享你的游记吧</Text>
      </View>

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
