import fs from 'node:fs';
import {createHash} from 'node:crypto';

// Keep the original export; apply the requested website-specific edits below.
const source = fs.readFileSync(new URL('./guide.md', import.meta.url), 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function inline(text) {
  const tokens = [];
  text = text.replace(/\\([:*~\-])/g, '$1').replace(/\s*\{#[^}]+\}/g, '');
  text = text.replace(/\[([^\]]+)\]\(([^)]+(?:\)[^)]*)?)\)/g, (match, label, href) => {
    if (href.startsWith('#')) href = '#api';
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
  .replace('[二、申请并设置 API Key', '[申请并设置 API Key');
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
const tabs = [['intro','简介','01'],['download','下载与启动','02'],['api','API Key','03'],['faq','常见问题','04'],['author','作者简介','05'],['releases','Release Note','06']];
const page = (id, title, body, extra = '') => `<section class="page" id="${id}" aria-labelledby="${id}-title"${id === 'intro' ? '' : ' hidden'}><h1 id="${id}-title">${title}</h1>${body}${extra}</section>`;
const assetVersion = name => createHash('sha256').update(fs.readFileSync(new URL(name, import.meta.url))).digest('hex').slice(0,10);
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#14121c"><meta name="description" content="妙妙屋狂欢夜：软件下载、使用说明、API Key 设置与版本记录。"><title>妙妙屋狂欢夜 · 使用说明</title><link rel="icon" href="assets/icon.png"><link rel="stylesheet" href="style.css?v=${assetVersion('./style.css')}"><script src="app.js?v=${assetVersion('./app.js')}" defer></script></head>
<body><a class="skip" href="#content">跳到正文</a><div class="shell"><aside class="sidebar"><a class="brand" href="#intro"><img src="assets/icon.png" width="54" height="54" alt="妙妙屋狂欢夜图标"><span>妙妙屋<br>狂欢夜<span class="brand-small">MMW KTV</span></span></a><div class="nav-label">使用说明</div><nav aria-label="章节">${tabs.map(([id,title,n]) => `<a href="#${id}"${id === 'intro' ? ' aria-current="page"' : ''}><span>${n}</span>${title}<b aria-hidden="true">↗</b></a>`).join('')}</nav><div class="sidebar-footer"><span class="status-dot"></span>让今晚，尽兴一点。</div></aside>
<div class="main-wrap"><header><span>妙妙屋狂欢夜 <span class="breadcrumb">/ <span id="current-page-title">简介</span></span></span></header><main id="content">
${page('intro','把客厅，<br>变成你的主场。',`<div class="intro-copy">${markdown(intro)}</div><a class="primary" href="#download">下载与启动 <span>→</span></a><div class="stage" aria-hidden="true"><div class="stage-orbit"></div><div class="record"><div class="record-label"><img src="assets/icon.png" alt=""></div></div><div class="stage-caption">MMW KTV <span>LET THE NIGHT PLAY</span></div><div class="equalizer">${Array.from({length:22},(_,i)=>`<i style="--h:${18+((i*37)%70)}%;--delay:${i*-.13}s"></i>`).join('')}</div></div>`)}
${page('download','下载与启动',`<div class="prose">${markdown(download)}</div>`,`<div class="downloads-panel"><div class="panel-title"><h2>下载文件</h2><a href="${folder}" target="_blank" rel="noopener noreferrer">打开 Google Drive ↗</a></div><p class="panel-note">请选择最新版本以防止bug</p><iframe title="Google Drive 下载文件列表" data-src="https://drive.google.com/embeddedfolderview?id=1_f63PFUtn2ncrug4iolHpe56gbZ49L1w#list" referrerpolicy="no-referrer"></iframe></div>`)}
${page('api','申请并设置 API Key<br><span class="title-sub">（用于程序内搜索）</span>',`<div class="prose steps">${markdown(apiBody)}</div>`)}
${page('faq','常见问题',`<div class="prose faq-copy">${markdown(faq)}</div>`)}
${page('author','作者简介',`<div class="prose author-copy"><p><strong>黑螺丝HiLos</strong>，西雅图独立音乐人、Poppin Dancer、程序员。</p><p>曾担任 206Music 厂牌主理人、创立 Step Up Dance Crew，并在 Step Up Dance Studio 任教。</p></div><a class="author-image-link" href="assets/author-platforms.png" target="_blank" rel="noopener noreferrer" aria-label="查看黑螺丝HiLos音乐平台原图"><img class="author-image" src="assets/author-platforms.png" width="2720" height="1530" alt="黑螺丝HiLos音乐平台，包括网易云音乐、YouTube二维码及Spotify、哔哩哔哩、YouTube Music标志"></a>`)}
${page('releases','Release Note',`<div class="prose release-copy">${markdown(releases)}</div>`)}
<div class="page-navigation"><a id="previous-page" href="#intro">← 上一页</a><span id="page-count">01 / 06</span><a id="next-page" href="#download">下一页 →</a></div></main><footer>妙妙屋狂欢夜 <span>为每一场尽兴的相聚。</span></footer></div></div></body></html>`;
fs.writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('Built all six sections from guide.md.');
