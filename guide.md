# ﻿妙妙屋狂欢夜

# 简介

**妙妙屋狂欢夜**是一款支持 YouTube 与本地伴奏播放、手机扫码点歌、多人排队和自定义歌单的电脑 KTV 软件。 

# 使用说明

### 一、下载与启动

下载地址：[Releases](https://drive.google.com/drive/folders/1_f63PFUtn2ncrug4iolHpe56gbZ49L1w)

* 请选择最新版本以防止bug。  
* 适用于 Windows 10/11 64 位电脑，使用 Windows 自带的 .NET Framework 4.8。  
* 双击运行EXE文件，浏览器会自动打开。  
* 默认电脑地址：http\://localhost:11449/  
* 电脑需能访问 YouTube。如需使用搜索点歌功能，**首次运行时需要设置YouTube API Key。**详见 [二、申请并设置 API Key（用于程序内搜索）](#二、申请并设置-api-key（用于程序内搜索）)。仅使用本地伴奏和直接提供YouTube链接点歌可跳过这一步。  
* 手机扫码点歌时需要与电脑连接同一个Wifi。

### 二、申请并设置 API Key（用于程序内搜索） {#二、申请并设置-api-key（用于程序内搜索）}

1. 打开 [https\://console.cloud.google.com/](https://console.cloud.google.com/) ，创建或选择项目。  
2. 在“API 和服务 → 库”中启用 YouTube Data API v3。  
3. 进入“API 和服务 → 凭据 → 创建凭据 → API 密钥”。无需创建 OAuth 客户端或服务账号。  
4. 将 API 限制为 YouTube Data API v3。本程序从电脑后端发起请求，不要配置成只接受网站 Referer 的密钥。  
5. 首次启动程序时填写准备好的API Key，下次启动会自动加载，无需重复填写。之后需要更改时，在电脑页面右上角“设置”中输入新的 Key 并保存。

**\* 不要把自己的密钥或配置文件上传到公共下载文件夹。**

### 三、常见问题

1. 软件默认运行在11449端口。如需临时更换软件运行端口或端口已占用，可退出程序，在 EXE 所在文件夹中创建 UTF-8 文本文件 *mmwktv-port.txt*，仅填入 1–65535 的可用端口号，保存后重新启动。  
2. 当软件被 Smart App Control 阻拦时：确认软件来源可信后，可尝试在 Windows 安全中心设置中关闭（disable）Smart App Control。关闭会降低对其他不受信任应用的防护，并非只允许本软件运行；请先阅读[微软官方说明](https://support.microsoft.com/en-us/windows/security/threat-malware-protection/smart-app-control-frequently-asked-questions#bkmk_unknown)，再自行决定。  
3. 如有更多问题请在 [ContactMe](https://docs.google.com/document/d/19CPxHBLVA2JO-ZCQRuz-JMoyLHn3nUnB1-cINCvvXuI/edit?tab=t.0) 中记录，作者会不定期查看、回复和更新\~

# 

# Release Note

### 测试版

- 0.0.1  
  - 本地KTV运行  
  - Youtube search \- by api key directly  
  - 手机扫码点歌台  
  - 已点队列、重新排序、置顶、删除  
  - 歌曲屏幕全屏  
  - 重新加载视频  
  - Youtube视频链接直接加入队列  
  - 设置页面  
- 0.0.2  
  - 全局全屏  
  - 空列表点歌时自动播放  
  - 已唱列表和重唱  
  - 预载歌单、新建歌单  
  - Bug fixes 和 UI 优化  
- 0.1.0  
  - 配置和数据文件现在存在APP data文件夹，而不是新建文件  
  - 支持使用本地MP3或MP4伴奏  
  - 支持歌单管理移除歌曲

### 正式版

- 1.0.0  
  - 加入帮助页面  
  - 加入port override功能以防止端口占用  
  - Minor bug fixes 和 UI优化  
- 1.0.1  
  - 优化了UI界面
- 1.0.4  
  - 二维码加入WiFi  
  - 更新说明和帮助页面  
  - Minor UI bug fixes
