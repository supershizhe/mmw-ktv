# 妙妙屋狂欢夜 · 官方网站

在线地址：https://supershizhe.github.io/mmw-ktv/

纯静态网页，由 GitHub Pages 从 `main` 分支根目录发布，无需 API Key 或前端框架。

## 内容维护

`guide.md` 是 Google Doc 的原文导出，完整保留简介、使用说明和 Release Note。文档更改后重新导出覆盖此文件，运行 `node build.mjs` 生成 `index.html`，提交后 Pages 自动部署。Google Doc 的后续修改不会自动同步到网站。

`style.css` 控制排版；`app.js` 提供章节分页、浏览器前进后退和下载页文件夹列表的加载。

下载页使用 Google Drive 的嵌入文件夹列表，每次进入下载页重新请求文件夹内容，不维护文件快照。文件夹须保持允许访客查看；浏览器或 Drive 限制嵌入时，可使用同页文件夹链接。已经打开的页面不会实时推送变化，重新进入下载页或刷新可加载更新。

## 本地查看

直接打开 `index.html`，或使用任意静态 HTTP 服务器。`assets/icon.png` 来自软件原有图标的缩小版本。

## 提交与发布

每次修改完成后仅创建本地 commit，不自动 push。明确要求 push 时，再一次上传待发布的 commits；GitHub Pages 随该次 push 构建发布。

## 最新版下载按钮

`latest-release.json` 保存最新版的版本号及 Google Drive 文件链接。更新后运行 `node build.mjs` 并提交；等待明确要求 push 后再发布。该按钮链接由人工维护，不会自动判断 Drive 文件夹中的最新版；下方“下载其他版本”继续通过 Drive 嵌入列表自动加载。
