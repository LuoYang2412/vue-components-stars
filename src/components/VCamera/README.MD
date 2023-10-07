### VCamera

拍照组件，参考[Demo.vue](./Demo.vue)

#### 安装依赖

```shell
npm install hammerjs
```

#### 导入

```javascript
import VCamera from '@/components/VCamera/VCamera.vue'
```

#### 一、props

> width: 相机宽度，默认 window.innerWidth;  
> height: 相机高度,默认 window.innerHeight;

#### 二、emits

> 1. shutterClick 快门按下时触发事件；
> 2. done 拍照完成事件，返回 base64 图片数据；
