/* Publisher TOC browser. Shared feed data is public; reading state stays in library.json. */
Object.assign(I18N.ja, {
 latestUnreadCount:n=>`未読 ${n}件`,latestTotalCount:n=>`全 ${n}件`,latestUnreadCountTip:'全雑誌の未読合計',latestSelectJournal:'この雑誌だけを表示',latestSelectGroup:'この分類の全誌を表示',latestTotalCountTip:'全雑誌の取得済み記事数（確認済みを含む）',
 latestOverview:'概要',latestFigure:'本文図',latestThumbnail:'記事サムネイル',latestTocImage:'TOC画像',
 latestAllJournals:'すべての雑誌',latestGeneralChemistry:'総合化学',latestGeneralScience:'総合科学',latestOrganic:'有機・合成',latestMaterials:'無機・材料・触媒',latestOther:'その他',latestShowJournal:'クリックして表示',latestHideJournal:'クリックして非表示',latestJournalSelection:(n,total)=>`${n} / ${total} 雑誌を表示`,
 latestPapers:'最新論文', latestRefresh:'一覧を再読込', latestStatusFilter:'論文の状態', latestUnread:'未読', latestRead:'確認済み', latestSaved:'登録済み', latestAll:'すべて', latestAdd:'ライブラリに登録', latestOpen:'論文を開く', latestNoImage:'画像なし', latestImageFailed:'画像を読み込めません', latestSourceCoverage:n=>`${n}件`, latestEmpty:'表示する論文はありません', latestLoading:'新着論文を読み込んでいます…', latestFailed:'新着データを取得できませんでした。一覧を再読込して再試行してください。', latestHint:'出版社の公開フィード・論文ページから取得したTOC画像を表示します。画像が配信されていない論文もあります。', latestSearch:'タイトル・著者・DOIで検索', latestColumns:'カードの列数', latestGrid:'グリッド', latestRows:'リスト', latestMarkAll:'表示中を確認済みに', latestBackUnread:'未読に戻す', latestSourceError:'一部の出版社フィードを取得できませんでした', latestChecked:'データ取得', latestImageZoom:'画像を拡大', latestNoAbstract:'要旨は配信されていません', latestAbstract:'要旨', latestImageCredit:'出版社配信のTOC画像', latestAddFailed:'文献の登録に失敗しました。再試行してください。', latestRegistered:'ライブラリに登録しました', latestFeedHelp:'データは公開フィードの取得時点のものです。「一覧を再読込」は配信済みの新着データを再読み込みします。', latestMore:'さらに表示', latestCount:n=>`${n} 件`, latestSources:'表示する雑誌', latestSaveImage:'登録時にTOC画像も保存', latestImageSaveFailed:'文献は登録しましたが、TOC画像を保存できませんでした。出版社の画像を画面から確認できます。'
});
Object.assign(I18N.en, {
 latestUnreadCount:n=>`Unread ${n}`,latestTotalCount:n=>`Total ${n}`,latestUnreadCountTip:'Unread articles across all journals',latestSelectJournal:'Show only this journal',latestSelectGroup:'Show all journals in this category',latestTotalCountTip:'Collected articles across all journals, including reviewed articles',
 latestOverview:'Overview',latestFigure:'Article figure',latestThumbnail:'Article thumbnail',latestTocImage:'TOC image',
 latestAllJournals:'All journals',latestGeneralChemistry:'General chemistry',latestGeneralScience:'General science',latestOrganic:'Organic & synthesis',latestMaterials:'Inorganic, materials & catalysis',latestOther:'Other',latestShowJournal:'Click to show',latestHideJournal:'Click to hide',latestJournalSelection:(n,total)=>`${n} / ${total} journals shown`,
 latestPapers:'Latest papers', latestRefresh:'Reload papers', latestStatusFilter:'Paper status', latestUnread:'Unread', latestRead:'Reviewed', latestSaved:'In library', latestAll:'All', latestAdd:'Add to library', latestOpen:'Open paper', latestNoImage:'No image supplied', latestImageFailed:'Image could not be loaded', latestSourceCoverage:n=>`${n} ${n===1?'paper':'papers'}`, latestEmpty:'No papers to display', latestLoading:'Loading latest papers…', latestFailed:'Could not load the feed. Reload papers to try again.', latestHint:'Actual TOC images from public publisher feeds and article pages. Some articles have no image supplied.', latestSearch:'Search titles, authors or DOIs', latestColumns:'Card columns', latestGrid:'Grid', latestRows:'List', latestMarkAll:'Mark shown as reviewed', latestBackUnread:'Mark unread', latestSourceError:'Some publisher feeds could not be fetched', latestChecked:'Data collected', latestImageZoom:'Enlarge image', latestNoAbstract:'No abstract supplied', latestAbstract:'Abstract', latestImageCredit:'TOC image supplied by the publisher', latestAddFailed:'Could not add the paper. Please try again.', latestRegistered:'Added to library', latestFeedHelp:'Papers reflect the last publisher-feed collection. Reload papers reloads the latest published feed data.', latestMore:'Show more', latestCount:n=>`${n} ${n===1?'paper':'papers'}`, latestSources:'Shown journals', latestSaveImage:'Save TOC image when adding', latestImageSaveFailed:'Paper added, but the TOC image could not be saved. You can still view the publisher image.'
});
// Distinct from the uncategorized inbox and collection folders.
if(typeof ICONS!=='undefined'){
 ICONS.latestNews='<path d="M13 2 5 13h6l-1 9 9-12h-6z"/>';
 ICONS.journal='<path d="M6 3h9l4 4v14H6zM15 3v5h4"/>';
}
let latestData=null, latestLoading=false, latestError='', latestScope='unread', latestJournal='all', latestQuery='', latestLayout='grid', latestLimit=60;
let latestRequest=0, latestSelectedDoi=null, latestScrollObserver=null;
const latestAdding=new Set();
function latestState(){
 if(!lib.latestPapers || typeof lib.latestPapers!=='object' || Array.isArray(lib.latestPapers)) lib.latestPapers={};
 const s=lib.latestPapers;
 if(!Array.isArray(s.read))s.read=[];
 if(!Array.isArray(s.hiddenSources))s.hiddenSources=[];
 if(latestData?.sources.length){
  const sources=latestData.sources;
  const valid=s.selection&&(s.selection.kind==='journal'?sources.some(x=>x.id===s.selection.id):s.selection.kind==='group'&&latestGroups().some(g=>g.id===s.selection.id));
  if(!valid){
   const shown=sources.filter(x=>!s.hiddenSources.includes(x.id)).map(x=>x.id);
   const group=latestGroups().find(g=>g.sources.length===shown.length&&g.sources.every(x=>shown.includes(x.id)));
   s.selection=group?{kind:'group',id:group.id}:shown.length===1?{kind:'journal',id:shown[0]}:{kind:'group',id:latestGroups()[0]?.id||'general-science'};
  }
  const ids=s.selection.kind==='journal'?[s.selection.id]:(latestGroups().find(g=>g.id===s.selection.id)?.sources||[]);
  s.hiddenSources=sources.filter(x=>!ids.includes(x.id)).map(x=>x.id);
 }
 return s;
}
function latestUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch(_){return '';}}
function latestImage(p){
 const local=/^data\/latest-images\/[a-f0-9]{24}\.(?:png|jpg|gif|webp)$/.test(p.imageLocal||'')?p.imageLocal:'';
 if(local&&location.protocol==='file:'){
  const embedded=latestData?.offlineImages?.[local];
  if(typeof embedded==='string'&&embedded.length<6*1024*1024&&/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(embedded))return embedded;
 }
 return local||latestUrl(p.image);
}
function latestSourceDisplay(source){return source?journalDisplay({journal:source.name||source.label}):'';}
function latestImageLabel(p){return t(p.imageKind==='figure'?'latestFigure':p.imageKind==='thumbnail'?'latestThumbnail':'latestTocImage');}
function latestStored(p){return lib.items.find(it=>normDoi(it.doi)===normDoi(p.doi));}
function latestMatching(){
 const read=new Set(latestState().read),q=latestQuery.trim().toLowerCase();
 return (latestData?.papers||[]).filter(p=>(latestScope==='all'||latestScope==='saved'&&latestStored(p)||latestScope==='read'&&read.has(p.doi)||latestScope==='unread'&&!read.has(p.doi))&&(!q||[p.title,(p.authors||[]).join(' '),p.doi,p.journal].join(' ').toLowerCase().includes(q)));
}
function latestVisible(){
 const hidden=new Set(latestState().hiddenSources);
 return latestMatching().filter(p=>!hidden.has(p.source)&&(latestJournal==='all'||p.source===latestJournal));
}
function latestSidebar(){
 const el=$('#latestPapersFilter');if(!el)return;
 const read=new Set(latestState().read);
 const count=(latestData?.papers||[]).filter(p=>!read.has(p.doi)).length;
 el.innerHTML=`<button type="button" class="sideItem ${currentView==='latest'?'active':''}" data-view="latest">${ic('latestNews')}<span class="sideName">${esc(t('latestPapers'))}</span>${latestData?`<span class="cnt" title="${esc(t('latestUnreadCountTip'))}">${count}</span>`:''}</button>${latestJournalFolders()}`;
}
async function loadLatestPapers(){
 if(latestLoading)return;
 latestLoading=true;latestError='';const request=++latestRequest;renderLatestPapers();
 try{
  let data;
  if(location.protocol==='file:'){
   data=await new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    const finish=(error)=>{clearTimeout(timer);script.remove();error?reject(error):resolve(window.PaperLibraryLatestSnapshot);};
    const timer=setTimeout(()=>finish(new Error('Snapshot load timed out')),10000);
    script.onload=()=>finish();script.onerror=()=>finish(new Error('Snapshot unavailable'));
    script.src=new URL('data/latest-papers.js?at='+Date.now(),document.baseURI).href;
    document.head.appendChild(script);
   });
  }else{
   const r=await fetch('data/latest-papers.json?at='+Date.now(),{cache:'no-store'});
   if(!r.ok)throw new Error('HTTP '+r.status);
   data=await r.json();
  }
  if(!Array.isArray(data.papers)||!Array.isArray(data.sources))throw new Error('Invalid feed');
  if(request!==latestRequest)return;
  latestData={...data,papers:data.papers.filter(p=>p&&typeof p.doi==='string'&&typeof p.title==='string').map(p=>({...p,doi:normDoi(p.doi),authors:Array.isArray(p.authors)?p.authors:[]}))};
 }catch(e){latestError=t('latestFailed');console.warn('Latest papers:',e);}
 finally{latestLoading=false;latestSidebar();if(currentView==='latest')renderLatestPapers();}
}
function latestItem(p){
 return latestStored(p)||newItem({doi:p.doi,title:p.title,authors:parseAuthorListText(p.authors.join('; ')),journal:p.journal,year:(p.date||'').slice(0,4),url:latestUrl(p.url),abstract:p.abstract||''});
}
function latestCardHtml(p){
 const image=latestImage(p),it=latestItem(p),selected=p.doi===latestSelectedDoi;
 return `<article class="cardRow galCard latestCard ${selected?'sel':''}" role="button" tabindex="0" aria-pressed="${selected}" aria-label="${esc(p.title)}" data-latest-doi="${esc(p.doi)}">
 <div class="galThumb">${image?`<img class="cardImg" src="${esc(image)}" alt="${esc(p.title)} — ${esc(latestImageLabel(p))}" loading="lazy" referrerpolicy="no-referrer"><div class="cardNoimg latestImageFallback" hidden><span>${esc(t('latestImageFailed'))}</span></div>`:`<div class="cardNoimg"><div class="latestNoImage">${ic('journal')}<span>${esc(journalDisplay(it))}</span><span>${esc(t('latestNoImage'))}</span></div></div>`}${image&&p.imageKind?`<span class="latestImageKind">${esc(latestImageLabel(p))}</span>`:''}</div>
 <div class="galBody"><div class="galTitle" title="${esc(p.title)}">${esc(p.title)}</div><div class="galAuth">${esc(tableAuthorsText(it.authors,it.correspondingAuthors))}</div><div class="galMeta"><span class="galJournal" title="${esc(p.journal)}">${esc(journalDisplay(it))}</span><span class="galYear">${esc(it.year)}</span></div></div></article>`;
}
function renderLatestPapers(){
 const pane=$('#latestPapersPane');if(!pane||currentView!=='latest')return;
 latestScrollObserver?.disconnect();latestScrollObserver=null;
 // Rebuilding the filtered cards must preserve the journal chooser and keyboard focus.
 const state=latestState(),papers=latestVisible(),shown=papers.slice(0,latestLimit);
 if(latestSelectedDoi&&!papers.some(p=>p.doi===latestSelectedDoi))latestSelectedDoi=null;
 const scopes=['unread','read','saved','all'];
 pane.innerHTML=`
 ${latestError?`<div class="latestWarning" role="alert">${esc(latestError)}</div>`:''}
 <div class="latestScroll scroll-y" tabindex="0"><div class="latestCards latest-${latestLayout}" style="--latestCols:${galleryCols}">${shown.map(p=>{
 return latestCardHtml(p);
 }).join('')}</div>${latestLoading&&!latestData?`<div class="latestEmpty" role="status">${esc(t('latestLoading'))}</div>`:!shown.length?`<div class="latestEmpty">${esc(t('latestEmpty'))}</div>`:''}${papers.length>shown.length?'<div class="latestScrollSentinel" aria-hidden="true"></div>':''}</div>
 <div class="listStatusBar latestStatus"><span class="latestStatusCount" title="${esc(t('latestJournalSelection')((latestData?.sources||[]).filter(s=>!state.hiddenSources.includes(s.id)).length,(latestData?.sources||[]).length))}">${esc(t('latestCount')(papers.length))}</span><div class="latestTabs" role="group" aria-label="${esc(t('latestStatusFilter'))}">${scopes.map(s=>`<button class="lsbtn" data-latest-scope="${s}" aria-pressed="${latestScope===s}">${esc(t({unread:'latestUnread',read:'latestRead',saved:'latestSaved',all:'latestAll'}[s]))}</button>`).join('')}</div><details class="latestStatusInfo"><summary class="lsbtn">${esc(t('latestChecked'))}${latestData?.status?.some(s=>!s.ok)?' ⚠':''}${ic('chevron')}</summary><div>${latestData?.checkedAt?esc(new Date(latestData.checkedAt).toLocaleString(lang==='ja'?'ja-JP':'en-US')):''}<p>${esc(t('latestFeedHelp'))}</p>${latestData?.status?.some(s=>!s.ok)?`<p>${esc(t('latestSourceError'))}: ${latestData.status.filter(s=>!s.ok).map(s=>esc(latestSourceDisplay(latestData.sources.find(x=>x.id===s.id))||s.id)).join(', ')}</p>`:''}</div></details>
 <button class="lsbtn" data-latest-read-all ${!shown.length?'disabled':''}>${esc(t('latestMarkAll'))}</button><select class="lsbtn" id="latestColumns" aria-label="${esc(t('latestColumns'))}">${['2','3','4'].map(n=>`<option value="${n}" ${galleryCols===n?'selected':''}>${n}</option>`).join('')}</select><button class="lsbtn" data-latest-layout="${latestLayout==='grid'?'rows':'grid'}" aria-label="${esc(t(latestLayout==='grid'?'latestRows':'latestGrid'))}">${ic(latestLayout==='grid'?'rows':'grid')}</button><button class="lsbtn" data-latest-refresh ${latestLoading?'disabled':''} title="${esc(t('latestRefresh'))}">${ic('retry')}</button></div>`;
 latestWireImages(pane);renderLatestDetail();latestSidebar();latestObserveScroll(pane);
}
function latestObserveScroll(pane){
 const root=pane.querySelector('.latestScroll'),sentinel=root?.querySelector('.latestScrollSentinel');
 if(!sentinel)return;
 const append=()=>{
  if(currentView!=='latest'||!root.isConnected||!root.clientHeight)return;
  const grid=root.querySelector('.latestCards'),papers=latestVisible(),count=grid.children.length;
  const next=papers.slice(count,count+60);if(!next.length){sentinel.remove();latestScrollObserver?.disconnect();return;}
  const fragment=document.createElement('template');fragment.innerHTML=next.map(latestCardHtml).join('');
  latestWireImages(fragment.content);grid.append(fragment.content);latestLimit=count+next.length;
  if(latestLimit>=papers.length){sentinel.remove();latestScrollObserver?.disconnect();}
  else if(latestScrollObserver){latestScrollObserver.unobserve(sentinel);latestScrollObserver.observe(sentinel);}
 };
 if(typeof IntersectionObserver==='function'){
  latestScrollObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))append();},{root,rootMargin:'0px 0px 240px 0px'});
  latestScrollObserver.observe(sentinel);
 }else{
  root.addEventListener('scroll',()=>{if(root.scrollHeight-root.scrollTop-root.clientHeight<240)append();},{passive:true});
 }
}
function latestWireImages(pane){
 pane.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const fallback=img.nextElementSibling;if(fallback)fallback.hidden=false;}));
}
function latestAbstractParts(value){
 const text=String(value||'').trim();
 // Split only a publisher's standalone heading, never the word inside a sentence.
 const heading=/(?:^|\r?\n)[ \t]*ABSTRACT[ \t]*:?[ \t]*(?:\r?\n|$)/i.exec(text);
 if(!heading)return {overview:'',abstract:text};
 const abstract=text.slice(heading.index+heading[0].length).trim();
 return abstract?{overview:text.slice(0,heading.index).trim(),abstract}:{overview:'',abstract:text};
}
function renderLatestDetail(){
 if(currentView!=='latest')return;
 const pane=$('#detail'),p=(latestData?.papers||[]).find(p=>p.doi===latestSelectedDoi);
 if(!p){pane.innerHTML=`<div class="noselect">${esc(t('noSelect'))}</div>`;return;}
 const it=latestItem(p),image=latestImage(p),stored=latestStored(p),read=latestState().read.includes(p.doi),url=latestUrl(p.url)||'https://doi.org/'+encodeURIComponent(p.doi),parts=latestAbstractParts(it.abstract||p.abstract);
 pane.innerHTML=`<div class="latestDetailActions"><button class="lsbtn ${stored?'':'primary'}" data-latest-add="${esc(p.doi)}" ${stored||latestAdding.has(p.doi)?'disabled':''}>${ic(stored?'check':'plus')}${esc(t(stored?'latestSaved':'latestAdd'))}</button><a class="lsbtn" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-latest-open="${esc(p.doi)}">${ic('link')}${esc(t('latestOpen'))}</a><button class="lsbtn" data-latest-read="${esc(p.doi)}">${ic('check')}${esc(t(read?'latestBackUnread':'latestRead'))}</button></div>
 <div class="refDetailTitle">${esc(p.title)}</div>${detailBibliographyHtml(it)}<div id="refBody">
 ${image?`<div class="refBlock refHero"><button class="latestDetailZoom" data-latest-zoom="${esc(p.doi)}" aria-label="${esc(t('latestImageZoom'))}"><img class="refFig" src="${esc(image)}" alt="${esc(p.title)} — ${esc(latestImageLabel(p))}" referrerpolicy="no-referrer"><span class="latestImageFallback" hidden>${esc(t('latestImageFailed'))}</span></button><div class="latestImageCredit">${esc(latestImageLabel(p))}</div></div>`:''}
 ${detailReadBlockHtml(it,'authors')}
 <section class="refBlock citePreview"><div class="refLabel">${esc(t('citePreview'))}</div><div class="cpText">${itemToCitationHtml(it,citationPrefs)}</div></section>
 <section class="refBlock refSection"><div class="refLabel">${esc(journalDisplay(it))}</div><div class="refProse">${esc(p.date||'')}<br><a href="https://doi.org/${esc(encodeURIComponent(p.doi))}" target="_blank" rel="noopener noreferrer">${esc(p.doi)}</a></div></section>
 ${parts.overview?`<section class="refBlock refSection latestOverview"><div class="refLabel">${esc(t('latestOverview'))}</div><div class="refProse">${esc(parts.overview)}</div></section>`:''}
 <section class="refBlock refSection latestAbstract"><div class="refLabel">${esc(t('abstract'))}</div><div class="refProse">${esc(parts.abstract||t('latestNoAbstract'))}</div></section></div>`;
 latestWireImages(pane);
}
function latestRead(doi,value){const state=latestState(),set=new Set(state.read);value?set.add(doi):set.delete(doi);state.read=Array.from(set);touch();latestSidebar();}
async function latestAddPaper(doi,btn){
 const library=lib,destination=backend,p=(latestData?.papers||[]).find(p=>p.doi===doi);if(!p||latestStored(p)||latestAdding.has(doi))return;
 latestAdding.add(doi);
 btn.disabled=true;
 try{
  // Retrieve full structured authors, pagination and journal metadata before registration.
  let item;
  try{const response=await fetch('https://api.crossref.org/works/'+encodeURIComponent(doi),{signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Crossref HTTP '+response.status);item=crossrefMsgToItem((await response.json()).message);}catch(_){item=newItem({doi:p.doi,title:p.title,authors:parseAuthorListText(p.authors.join('; ')),journal:p.journal,year:(p.date||'').slice(0,4),url:latestUrl(p.url),abstract:p.abstract||''});applyCanonicalJournal(item);}
  if(lib!==library)return;
  if(latestStored(p)){renderLatestPapers();return;}
  if(!item.title)item.title=p.title;
  if(!item.abstract)item.abstract=p.abstract||'';
  item.latestPaperSource={image:latestUrl(p.image),imageKind:p.imageKind||'toc',url:latestUrl(p.url),collectedAt:latestData.checkedAt};
  let imageFailed=false;
  if(latestImage(p)&&destination){
   try{
    const response=await fetch(latestImage(p),{signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('Image HTTP '+response.status);
    const blob=await response.blob();
    if(!/^image\/(png|jpeg|gif|webp)$/.test(blob.type)||blob.size>4*1024*1024)throw new Error('Invalid image');
    if(lib!==library||backend!==destination)return;
    const name=uniqueAttachmentName('toc-'+p.doi.replace(/[^a-z0-9]/gi,'_'),imageExtFromType(blob.type,''));
    await destination.putAttachment(name,blob);item.image={name};
   }catch(_){imageFailed=true;}
  }
  if(lib!==library||backend!==destination)return;
  const result=addItems([item]);
  if(result.added){showToast(t(imageFailed?'latestImageSaveFailed':'latestRegistered'),imageFailed);}
  renderSidebar();renderLatestPapers();
 }catch(e){showToast(t('latestAddFailed'),true);}
 finally{latestAdding.delete(doi);if(lib===library)renderLatestPapers();}
}
$('#latestPapersPane').addEventListener('change',e=>{
 if(e.target.id==='latestColumns'){galleryCols=e.target.value;localStorage.setItem('refshelf.galleryCols',galleryCols);}
 latestLimit=60;renderLatestPapers();
});
function latestHandleClick(e){
 if(currentView!=='latest')return;
 const card=e.target.closest('[data-latest-doi]');
 if(card){latestSelectedDoi=card.dataset.latestDoi;$('#latestPapersPane').querySelectorAll('[data-latest-doi]').forEach(el=>{const selected=el.dataset.latestDoi===latestSelectedDoi;el.classList.toggle('sel',selected);el.setAttribute('aria-pressed',String(selected));});renderLatestDetail();return;}
 const b=e.target.closest('button,a');if(!b)return;const d=b.dataset;
 if('latestRefresh' in d){loadLatestPapers();return;}
 if(d.latestScope){latestScope=d.latestScope;latestLimit=60;renderLatestPapers();return;}
 if(d.latestLayout){latestLayout=d.latestLayout;renderLatestPapers();return;}
 if('latestReadAll' in d){const s=latestState();s.read=Array.from(new Set([...s.read,...latestVisible().slice(0,latestLimit).map(p=>p.doi)]));touch();latestSidebar();renderLatestPapers();return;}
 if(d.latestRead){latestRead(d.latestRead,!latestState().read.includes(d.latestRead));renderLatestPapers();return;}
 if(d.latestOpen){latestRead(d.latestOpen,true);return;}
 if(d.latestAdd){latestAddPaper(d.latestAdd,b);return;}
 if(d.latestZoom){e.preventDefault();e.stopPropagation();const p=latestData.papers.find(p=>p.doi===d.latestZoom);if(p)openImageViewer(latestImage(p),p.title);return;}
}
$('#latestPapersPane').addEventListener('click',latestHandleClick);
$('#detail').addEventListener('click',latestHandleClick);
$('#latestPapersPane').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-latest-doi]')){e.preventDefault();e.target.click();}});
const LATEST_JOURNAL_GROUPS=[
 {id:'general-science',label:'latestGeneralScience',sources:['science','nature','nature-communications']},
 {id:'general',label:'latestGeneralChemistry',sources:['jacs','chemical-science','angew','nature-chemistry']},
 {id:'organic',label:'latestOrganic',sources:['organic-letters','organic-chemistry','organometallics']},
 {id:'materials',label:'latestMaterials',sources:['inorganic-chemistry','chemistry-materials','acs-catalysis','acs-nano','nano-letters']}
];
function latestGroups(){
 const sources=latestData?.sources||[];
 const groups=LATEST_JOURNAL_GROUPS.map(g=>({...g,sources:g.sources.filter(id=>sources.some(s=>s.id===id))})).filter(g=>g.sources.length);
 const other=sources.filter(s=>!LATEST_JOURNAL_GROUPS.some(g=>g.sources.includes(s.id))).map(s=>s.id);
 if(other.length)groups.push({id:'other',label:'latestOther',sources:other});
 return groups;
}
function latestJournalFolders(){
 const state=latestState(),sources=latestData?.sources||[],hidden=new Set(state.hiddenSources),selection=state.selection;
 const counts=new Map();for(const p of latestMatching())counts.set(p.source,(counts.get(p.source)||0)+1);
 const status=t({unread:'latestUnread',read:'latestRead',saved:'latestSaved',all:'latestAll'}[latestScope]);
 return `<nav class="latestJournalTree" aria-label="${esc(t('latestSources'))}" ${currentView==='latest'?'':'hidden'}>${latestGroups().map(g=>{
 const selected=selection?.kind==='group'&&selection.id===g.id;
 return `<div class="latestJournalGroup"><button type="button" class="sideItem latestJournalGroupButton ${selected?'selected':''}" data-latest-group="${g.id}" aria-pressed="${selected}" title="${esc(t('latestSelectGroup'))}"><span class="sideName">${esc(t(g.label))}</span><span class="cnt" title="${esc(status)}">${g.sources.reduce((n,id)=>n+(counts.get(id)||0),0)}</span></button><div class="latestJournalChildren">${g.sources.map(id=>{
 const source=sources.find(s=>s.id===id),shown=!hidden.has(id),name=latestSourceDisplay(source);
 return `<button type="button" class="sideItem latestJournalFolder ${shown?'selected':''}" data-latest-journal-toggle="${esc(id)}" aria-pressed="${shown}" title="${esc(name+' · '+t('latestSelectJournal'))}">${ic('journal')}<span class="sideName" title="${esc(name)}">${esc(name)}</span><span class="cnt" title="${esc(status)}">${counts.get(id)||0}</span></button>`;
 }).join('')}</div></div>`;
 }).join('')}</nav>`;
}
$('#sidebar')?.addEventListener('click',()=>{const nav=$('#latestPapersFilter .latestJournalTree');if(nav)nav.hidden=currentView!=='latest';});
$('#latestPapersFilter')?.addEventListener('click',e=>{
 const b=e.target.closest('[data-latest-group],[data-latest-journal-toggle]');if(!b)return;
 const state=latestState(),group=b.hasAttribute('data-latest-group'),attr=group?'data-latest-group':'data-latest-journal-toggle',value=b.getAttribute(attr);
 state.selection={kind:group?'group':'journal',id:value};latestState();latestJournal='all';latestLimit=60;
 touch();latestSidebar();renderLatestPapers();
 Array.from($('#latestPapersFilter').querySelectorAll(`[${attr}]`)).find(el=>el.getAttribute(attr)===value)?.focus({preventScroll:true});
});

latestSidebar();
