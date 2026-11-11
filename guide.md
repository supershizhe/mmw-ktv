# ﻿妙妙屋狂欢夜

# 简介

**妙妙屋狂欢夜**是一款支持 YouTube 与本地伴奏播放、手机扫码点歌、多人排队和自定义歌单的电脑 KTV 软件。 

# 使用说明

### 一、下载与启动

下载地址：[Releases](https://drive.google.com/drive/folders/1_f63PFUtn2ncrug4iolHpe56gbZ49L1w)

* 请选择最新版本以防止bug。  
* 适用于 Windows 10/11 64 位电脑（需 .NET Framework 4.8），以及运行 macOS 13.5 或更新版本的 Apple Silicon 和 Intel Mac。
  * Mac 版暂不支持扫码加入 Wi-Fi，也不能通过应用旁的端口文件临时覆盖端口。扫码点歌仍可使用。
  * 在 Mac 上打开「苹果菜单 → 关于本机」。若「芯片」显示 Apple M 系列，下载 Apple Silicon（ARM64）版。若「处理器」显示 Intel，下载 Intel（x64）版。
* Windows 双击运行 EXE。Mac 打开 DMG，把应用拖入「应用程序」后启动。启动后浏览器会自动打开。
  * *当前软件为作者个人开发，有可能遇到无法打开或软件被拦截的情况。解决办法详见[常见问题](#faq)。*
* 默认电脑地址：http\://localhost:11449/  
* 电脑需能访问 YouTube。如需使用搜索点歌功能，**首次运行时需要设置YouTube API Key。**详见 [二、申请并设置 YouTube API Key（用于程序内搜索）](#二、申请并设置-api-key（用于程序内搜索）)。仅使用本地伴奏和直接提供YouTube链接点歌可跳过这一步。
* 手机扫码点歌时需要与电脑连接同一个Wifi。

### 二、申请并设置 YouTube API Key（用于程序内搜索） {#二、申请并设置-api-key（用于程序内搜索）}

1. 登录 [Google Cloud 控制台](https://console.cloud.google.com/)。点顶部的「选择项目（Select a project）」或当前项目名，再点「新建项目（New Project）」。填写「项目名称（Project name）」，点「创建（Create）」。创建完成后，在顶部项目选择器切换到这个项目。已有专用项目时，直接选择它。
2. 打开「API 和服务（APIs & Services）」→「库（Library）」，搜索 **YouTube Data API v3**。打开同名结果后点「启用（Enable）」。若页面显示「管理（Manage）」，说明该项目已启用此 API。
3. 回到「API 和服务（APIs & Services）」→「凭据（Credentials）」，点「创建凭据（Create credentials）」→「API 密钥（API key）」。在「创建 API 密钥（Create API key）」窗口填写「名称（Name）」，在「选择 API 限制条件（Select API restrictions）」中选中 **YouTube Data API v3**。「应用限制条件（Application restrictions）」保留「无（None）」，然后点「创建（Create）」。
4. 创建成功后，在「已创建 API 密钥（API key created）」弹窗里点密钥旁的「复制（Copy）」图标。如果已经关闭弹窗，回到「凭据（Credentials）」页，在「API 密钥（API Keys）」列表中找到对应的密钥，点「显示密钥（Show key）」再复制。
5. 首次启动程序时，在电脑页面的「设置（Settings）」中粘贴准备好的 YouTube API Key 并点击「保存（Save）」。下次启动会自动加载。之后需要更换时，在电脑页面右上角打开「设置（Settings）」，输入新密钥并保存。

**\* 不要把自己的密钥或配置文件上传到公共下载文件夹。**

### 三、常见问题

1. 软件默认运行在11449端口。如需临时更换软件运行端口或端口已占用，可退出程序，在 EXE 所在文件夹中创建 UTF-8 文本文件 *mmwktv-port.txt*，仅填入 1–65535 的可用端口号，保存后重新启动。  
2. Windows启动时，当软件被 Smart App Control 阻拦时：确认软件来源可信后，可尝试在 Windows 安全中心设置中关闭（disable）Smart App Control。关闭会降低对其他不受信任应用的防护，并非只允许本软件运行；请先阅读[微软官方说明](https://support.microsoft.com/en-us/windows/security/threat-malware-protection/smart-app-control-frequently-asked-questions#bkmk_unknown)，再自行决定。
3. Mac 启动时，如果系统提示无法验证开发者或软件是否安全是否有病毒，导致无法打开时：先确认安装包来源可信。尝试打开应用后，进入「系统设置（System Settings）」→「隐私与安全性（Privacy & Security）」，向下滚动到页面底部的「安全性（Security）」区域，找到被拦截的「妙妙屋狂欢夜」软件，点击「仍要打开（Open Anyway）」，按提示验证身份并确认后重新尝试打开软件。该按钮通常在尝试打开应用后约一小时内可用。参见 [Apple 官方说明](https://support.apple.com/en-us/102445)。
4. 如有更多问题请在 [ContactMe](https://docs.google.com/document/d/19CPxHBLVA2JO-ZCQRuz-JMoyLHn3nUnB1-cINCvvXuI/edit?tab=t.0) 中记录，作者会不定期查看、回复和更新\~

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
