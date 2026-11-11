import fs from 'node:fs';
import {createHash} from 'node:crypto';

// Keep the original export; apply the requested website-specific edits below.
const source = fs.readFileSync(new URL('./guide.md', import.meta.url), 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function inline(text) {
  const tokens = [];
  text = text.replace(/\\([:*~\-])/g, '$1').replace(/\s*\{#[^}]+\}/g, '');
  text = text.replace(/\[([^\]]+)\]\(([^)]+(?:\)[^)]*)?)\)/g, (match, label, href) => {
    if (href.startsWith('#二、')) href = '#api';
    if (!/^(https?:|#)/.test(href)) return escape(label);
    tokens.push(`<a href="${escape(href)}"${href.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}>${escape(label)}</a>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  return escape(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>').replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[i]);
}
function markdown(text) {
  const result = [], lists = [];
  function close(depth = -1) { while (lists.length && lists.at(-1).depth >= depth) { result.push('</li></' + lists.pop().type + '>'); } }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const heading = line.match(/^(#{1,6})\s+(.+)/);
    if (heading) { close(); result.push(`<h${Math.min(heading[1].length, 3)}>${inline(heading[2])}</h${Math.min(heading[1].length, 3)}>`); continue; }
    const item = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)/);
    if (item) {
      const depth = item[1].length, type = /\d/.test(item[2]) ? 'ol' : 'ul';
      while (lists.length && lists.at(-1).depth > depth) close(lists.at(-1).depth);
      if (!lists.length || lists.at(-1).depth < depth) { lists.push({depth, type}); result.push('<' + type + '>'); }
      else result.push('</li>');
      result.push('<li>' + inline(item[3])); continue;
    }
    close(); result.push('<p>' + inline(line) + '</p>');
  }
  close(); return result.join('\n');
}
const intro = source.split('# 简介')[1].split('# 使用说明')[0];
const instructions = source.split('# 使用说明')[1].split('# Release Note')[0];
const download = instructions.split('### 一、下载与启动')[1].split('### 二、')[0]
  .replace(/^下载地址：.*$/m, '')
  .replace(/^\* 请选择最新版本以防止bug。\s*$/m, '')
  .replace('[二、申请并设置 YouTube API Key', '[申请并设置 YouTube API Key');
const api = instructions.split('### 二、')[1].split('### 三、')[0];
const apiBody = api.slice(api.indexOf('\n'));
const faq = instructions.split('### 三、常见问题')[1].replace(/\n#\s*$/,'');
const releaseSource = source.split('# Release Note')[1];
const releaseGroups = [...releaseSource.matchAll(/^### (.+)\r?\n([\s\S]*?)(?=^### |$(?![\s\S]))/gm)];
const releases = releaseGroups.sort((a,b) => (a[1] === '正式版' ? -1 : 1) - (b[1] === '正式版' ? -1 : 1)).map(group => {
  const versions = [...group[2].matchAll(/^- (\d+(?:\.\d+)+)[^\S\r\n]*\r?\n([\s\S]*?)(?=^- \d|$(?![\s\S]))/gm)];
  versions.sort((a,b) => {
    const av = a[1].split('.').map(Number), bv = b[1].split('.').map(Number);
    for (let i=0; i<Math.max(av.length,bv.length); i++) { const diff=(bv[i]||0)-(av[i]||0); if(diff) return diff; }
    return 0;
  });
  return `### ${group[1]}\n\n${versions.map(version => version[0]).join('\n')}`;
}).join('\n\n');
const folder = 'https://drive.google.com/drive/folders/1_f63PFUtn2ncrug4iolHpe56gbZ49L1w';
const macFolder = 'https://drive.google.com/drive/folders/1uSI_zFo3oD9i5ZDfkqc2JgjCPs2gN6BA';
const latestRelease = JSON.parse(fs.readFileSync(new URL('./latest-release.json', import.meta.url),'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(latestRelease.version) || new URL(latestRelease.url).origin !== 'https://drive.google.com') throw Error('Invalid latest release configuration');
const macReleaseUrl = arch => escape(latestRelease.mac?.[arch]?.url || macFolder);
const tabs = [['intro','简介','01'],['features','功能介绍','02'],['download','下载与启动','03'],['api','API Key','04'],['faq','常见问题','05'],['author','作者简介','06'],['releases','Release Note','07']];
const page = (id, title, body, extra = '') => `<section class="page" id="${id}" aria-labelledby="${id}-title"${id === 'intro' ? '' : ' hidden'}><h1 id="${id}-title">${title}</h1>${body}${extra}</section>`;
const assetVersion = name => createHash('sha256').update(fs.readFileSync(new URL(name, import.meta.url))).digest('hex').slice(0,10);
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#14121c"><meta name="description" content="妙妙屋狂欢夜：软件下载、使用说明、API Key 设置与版本记录。"><title>妙妙屋狂欢夜 · 使用说明</title><link rel="icon" href="assets/icon.png"><link rel="stylesheet" href="style.css?v=${assetVersion('./style.css')}"><script src="app.js?v=${assetVersion('./app.js')}" defer></script></head>
<body><a class="skip" href="#content">跳到正文</a><div class="shell"><aside class="sidebar"><a class="brand" href="#intro"><img src="assets/icon.png" width="54" height="54" alt="妙妙屋狂欢夜图标"><span>妙妙屋<br>狂欢夜<span class="brand-small">MMW KTV</span></span></a><div class="nav-label">使用说明</div><nav aria-label="章节">${tabs.map(([id,title,n]) => `<a href="#${id}"${id === 'intro' ? ' aria-current="page"' : ''}><span>${n}</span>${title}<b aria-hidden="true">↗</b></a>`).join('')}</nav><div class="sidebar-footer"><span class="status-dot"></span>让今晚，尽兴一点。</div></aside>
<div class="main-wrap"><header><span>妙妙屋狂欢夜 <span class="breadcrumb">/ <span id="current-page-title">简介</span></span></span></header><main id="content">
${page('intro','把客厅，<br>变成你的主场。',`<div class="intro-copy">${markdown(intro)}</div><a class="primary" href="#download">下载与启动 <span>→</span></a><div class="stage" aria-hidden="true"><div class="stage-orbit"></div><div class="record"><div class="record-label"><img src="assets/icon.png" alt=""></div></div><div class="stage-caption">MMW KTV <span>LET THE NIGHT PLAY</span></div><div class="equalizer">${Array.from({length:22},(_,i)=>`<i style="--h:${18+((i*37)%70)}%;--delay:${i*-.13}s"></i>`).join('')}</div></div>`)}
${page('features','功能介绍',`<figure class="feature-overview"><a href="assets/features-overview.png" target="_blank" rel="noopener noreferrer" aria-label="查看软件界面大图"><img src="assets/features-overview.png" alt="妙妙屋狂欢夜电脑界面：左侧播放伴奏，右侧点歌、扫码、队列与歌单。示例二维码已虚化。" loading="lazy"></a><figcaption>软件界面示例 · 二维码已虚化，点歌时请扫描自己电脑页面上的二维码。</figcaption></figure><div class="prose feature-guide"><h2>点歌</h2><ul><li><strong>搜索：</strong>在“点一首歌”输入歌名或歌手，点击“搜索”。程序会在 YouTube 查找伴奏版本，选择合适的视频后点击“点歌”。搜索需要先在电脑端“设置”中填写自己的 YouTube API Key，搜索和点歌不会打断当前播放。</li><li><strong>YouTube 链接直接点：</strong>展开“已有 YouTube 链接？直接点歌”，粘贴视频链接后点击“点歌”。不填歌名时会尝试读取视频标题；此方式无需 API Key。</li><li><strong>本地 MP3 或 MP4：</strong>在电脑端点击“使用本地伴奏”，选择文件即可加入已点队列。MP4 播放视频；MP3 显示歌曲名。程序直接读取原文件，不复制或上传文件。</li><li><strong>手机点歌：</strong>手机与电脑连接同一局域网后，扫描电脑页面上的二维码。多人可分别搜索、点歌和调整队列，伴奏在电脑播放。电脑通过网线连接同一路由器也可以。</li><li><strong>视频预览：</strong>搜索结果和歌单中的“预览”可静音查看视频，确认版本后点击“点歌”；预览窗口中的“点歌”会加入当前曲目并关闭预览。MP3 不提供视频预览。</li></ul><h2>重新排序歌曲</h2><ul><li><strong>置顶：</strong>点击已点歌曲右侧的“↑”，将它移到队列最前面，作为下一首播放。</li><li><strong>拖动：</strong>在“已点”列表中上下拖动歌曲以调整顺序。手机请按住歌曲左侧的拖动柄（⠿）拖动；队列每页显示五首，跨页置顶可使用“↑”。</li><li><strong>乱序：</strong>点击“打乱”，随机重新排列已点歌曲。排序会同步到所有设备，不影响当前正在播放的歌曲。</li></ul><h2>创建歌单</h2><ul><li><strong>新建与管理：</strong>电脑端右上角的“歌单管理”可创建空歌单、删除歌单，也可管理歌单内的歌曲。扫码手机不提供歌单管理。</li><li><strong>收藏歌曲：</strong>在“已点”或“已唱”中点击“♡”，或在当前播放器下方点击“加入歌单”，再选择一个已有歌单即可保存。同一视频或本地文件路径在同一歌单内不会重复添加。</li><li><strong>从歌单点歌：</strong>点击歌单名，在歌单区域展开歌曲列表，再点击“点歌”。歌单保存在当前电脑，重启后仍可使用；收藏的本地歌曲只记录原路径，请保留原文件，路径失效时会跳过该曲目。</li></ul><h2>播放与重唱</h2><ul><li><strong>自动播放与切歌：</strong>没有歌曲正在播放时，新点的第一首会自动开始；一首结束后会继续播放队列中的下一首。也可点击“开始 / 切歌 →”手动切换。如果浏览器拦截自动播放，请先在电脑播放器中点击播放。</li><li><strong>已唱与重唱：</strong>切换到“已唱”可以查看唱过的歌曲，再次点击“点歌”即可重新排队。已点队列和已唱记录会在程序服务退出后清空。</li><li><strong>播放控制与全屏：</strong>使用播放器自带的按钮播放、暂停或全屏视频；右上角“全屏 / 退出全屏”控制整个网页的全屏显示。</li></ul></div>`)}
${page('download','下载与启动',`<div class="prose">${markdown(download)}</div>`,`<h2>下载最新版</h2><div class="latest-download"><a class="primary" href="${escape(latestRelease.url)}" target="_blank" rel="noopener noreferrer">Windows · ${escape(latestRelease.version)} ↗</a><a class="primary" href="${macReleaseUrl('arm64')}" target="_blank" rel="noopener noreferrer">Mac · Apple Silicon ↗</a><a class="primary" href="${macReleaseUrl('x64')}" target="_blank" rel="noopener noreferrer">Mac · Intel ↗</a></div><div class="downloads-panel"><div class="panel-title"><h2>下载其他版本</h2><label>系统 <select id="download-platform"><option value="windows">Windows</option><option value="mac">Mac</option></select></label></div><a class="drive-folder" id="drive-folder" href="${folder}" data-windows="${folder}" data-mac="${macFolder}" target="_blank" rel="noopener noreferrer">打开 Google Drive ↗</a><iframe id="download-list" title="Windows 下载文件列表" referrerpolicy="no-referrer"></iframe></div>`)}
${page('api','申请并设置 YouTube API Key<br><span class="title-sub">（用于程序内搜索）</span>',`<div class="prose steps">${markdown(apiBody)}</div>`)}
${page('faq','常见问题',`<div class="prose faq-copy">${markdown(faq)}</div>`)}
${page('author','作者简介',`<div class="prose author-copy"><p><strong>黑螺丝HiLos</strong>，西雅图独立音乐人、Poppin Dancer、程序员。</p><p>曾担任 206Music 厂牌主理人、创立 Step Up Dance Crew，并在 Step Up Dance Studio 任教。</p><ul class="author-links"><li><a href="https://music.163.com/#/playlist?app_version=9.4.50&amp;id=906319337&amp;userid=247367965&amp;dlt=0846&amp;creatorId=247367965" target="_blank" rel="noopener noreferrer">网易云音乐</a></li><li><a href="https://www.youtube.com/playlist?list=PL0e09WhamR_xcn5i-uTzw0DyZImgv_qE2" target="_blank" rel="noopener noreferrer">YouTube</a></li><li><a href="https://space.bilibili.com/1546548/lists/7329530" target="_blank" rel="noopener noreferrer">Bilibili</a></li></ul></div><a class="author-image-link" href="assets/author-platforms.png" target="_blank" rel="noopener noreferrer" aria-label="查看黑螺丝HiLos音乐平台原图"><img class="author-image" src="assets/author-platforms.png" width="2720" height="1530" alt="黑螺丝HiLos音乐平台，包括网易云音乐、YouTube二维码及Spotify、哔哩哔哩、YouTube Music标志"></a>`)}
${page('releases','Release Note',`<div class="prose release-copy">${markdown(releases)}</div>`)}
<div class="page-navigation"><a id="previous-page" href="#intro">← 上一页</a><span id="page-count">01 / 07</span><a id="next-page" href="#download">下一页 →</a></div></main><footer>妙妙屋狂欢夜 <span>为每一场尽兴的相聚。</span></footer></div></div></body></html>`;
fs.writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('Built all seven sections from guide.md.');
