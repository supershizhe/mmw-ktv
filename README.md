# 妙妙屋狂欢夜 · 官方网站

在线地址：https://supershizhe.github.io/mmw-ktv/

纯静态网页，由 GitHub Pages 从 `main` 分支根目录发布，无需 API Key 或前端框架。

## 内容维护

`guide.md` 是 Google Doc 的原文导出，完整保留简介、使用说明和 Release Note。文档更改后重新导出覆盖此文件，运行 `node build.mjs` 生成 `index.html`，提交后 Pages 自动部署。Google Doc 的后续修改不会自动同步到网站。

`style.css` 控制排版；`app.js` 提供章节分页、浏览器前进后退和下载页文件夹列表的加载。

下载页使用 Google Drive 的嵌入文件夹列表，每次进入下载页重新请求文件夹内容，不维护文件快照。文件夹须保持允许访客查看；浏览器或 Drive 限制嵌入时，可使用同页文件夹链接。已经打开的页面不会实时推送变化，重新进入下载页或刷新可加载更新。

## 本地查看

直接打开 `index.html`，或使用任意静态 HTTP 服务器。`assets/icon.png` 来自软件原有图标的缩小版本。
