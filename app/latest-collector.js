const LP_SOURCES=[{"id": "jacs", "label": "JACS", "name": "Journal of the American Chemical Society", "issn": "0002-7863", "feed": "https://pubs.acs.org/rss/jacsat/asap.xml"}, {"id": "chemical-science", "label": "Chemical Science", "name": "Chemical Science", "issn": "2041-6539", "feed": "https://pubs.rsc.org/rss/site_1000029/1000016.xml"}, {"id": "angew", "label": "Angewandte", "name": "Angewandte Chemie International Edition", "issn": "1521-3773", "feed": "https://onlinelibrary.wiley.com/feed/15213773/most-recent"}, {"id": "science", "label": "Science", "name": "Science", "issn": "0036-8075", "feed": "https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=science"}, {"id": "nature", "label": "Nature", "name": "Nature", "issn": "0028-0836", "feed": "https://www.nature.com/nature.rss"}, {"id": "nature-chemistry", "label": "Nature Chemistry", "name": "Nature Chemistry", "issn": "1755-4349", "feed": "https://www.nature.com/nchem.rss"}, {"id": "nature-communications", "label": "Nature Communications", "name": "Nature Communications", "issn": "2041-1723", "feed": "https://www.nature.com/ncomms.rss"}, {"id": "organic-letters", "label": "Organic Letters", "name": "Organic Letters", "issn": "1523-7060", "feed": "https://pubs.acs.org/rss/orlef7/asap.xml"}, {"id": "organic-chemistry", "label": "J. Org. Chem.", "name": "The Journal of Organic Chemistry", "issn": "0022-3263", "feed": "https://pubs.acs.org/rss/joceah/asap.xml"}, {"id": "inorganic-chemistry", "label": "Inorganic Chemistry", "name": "Inorganic Chemistry", "issn": "0020-1669", "feed": "https://pubs.acs.org/rss/inocaj/asap.xml"}, {"id": "organometallics", "label": "Organometallics", "name": "Organometallics", "issn": "0276-7333", "feed": "https://pubs.acs.org/rss/orgnd7/asap.xml"}, {"id": "chemistry-materials", "label": "Chemistry of Materials", "name": "Chemistry of Materials", "issn": "0897-4756", "feed": "https://pubs.acs.org/rss/cmatex/asap.xml"}, {"id": "acs-catalysis", "label": "ACS Catalysis", "name": "ACS Catalysis", "issn": "2155-5435", "feed": "https://pubs.acs.org/rss/accacs/asap.xml"}, {"id": "acs-nano", "label": "ACS Nano", "name": "ACS Nano", "issn": "1936-0851", "feed": "https://pubs.acs.org/rss/ancac3/asap.xml"}, {"id": "nano-letters", "label": "Nano Letters", "name": "Nano Letters", "issn": "1530-6984", "feed": "https://pubs.acs.org/rss/nalefd/asap.xml"}];
Object.assign(I18N.ja,{
 latestSourceError:'一部の雑誌で最新データを完全には取得できませんでした',latestFailed:'保存済みの最新論文を読み込めませんでした。latest-papers.json を確認してください。',latestRefresh:'出版社から最新論文を取得',latestFeedHelp:'更新ボタンで表示中の雑誌を Connector 経由で取得し、このライブラリフォルダに保存します。出版社の制限により要旨や画像を取得できない場合があります。',
 latestConnectorNeeded:'Connector 1.24 以降をインストール／更新し、本体を再読み込みしてください。ローカル版では「ファイルの URL へのアクセス」も許可してください。',
 latestFolderNeeded:'最新論文を取得するには、ライブラリフォルダを開いてください。',latestFetching:(name,n,total)=>`${name} を取得中… ${n}/${total} 誌`,latestImagesProgress:(name,n,total)=>`${name} の画像を取得中… ${n}/${total} 件`,latestUpdateDone:n=>`最新論文を更新しました（新規 ${n} 件）`,latestUpdateFailed:'取得できませんでした。以前のデータは保持しています。',latestSaveFailed:'最新論文の保存に失敗しました。フォルダの書き込み権限と空き容量を確認してください。',latestNoCache:'保存済みの最新論文がありません。雑誌を選択し、更新ボタンで取得してください。'
});
Object.assign(I18N.en,{
 latestSourceError:'Latest data could not be fully fetched for some journals',latestFailed:'Could not read saved papers. Check latest-papers.json in your library folder.',latestRefresh:'Fetch latest papers from publishers',latestFeedHelp:'The update button fetches shown journals through Connector and saves them in this library folder. Publisher restrictions may prevent fetching abstracts or images.',
 latestConnectorNeeded:'Install or update Connector to 1.24 or later, then reload the app. For local files, also enable “Allow access to file URLs”.',
 latestFolderNeeded:'Open a library folder to fetch latest papers.',latestFetching:(name,n,total)=>`Fetching ${name}… ${n}/${total} journals`,latestImagesProgress:(name,n,total)=>`Fetching ${name} images… ${n}/${total}`,latestUpdateDone:n=>`Latest papers updated (${n} new)`,latestUpdateFailed:'Could not fetch papers. Previous data has been preserved.',latestSaveFailed:'Could not save latest papers. Check folder write access and available space.',latestNoCache:'No saved latest papers. Select journals and use the update button to fetch them.'
});
const latestPendingRequests=new Map(),latestLocalUrls=new Map();
let latestUpdateToken=0,latestProgress='',latestCacheFailed=false;
function latestConnectorRequest(operation,args={},timeout=25000){
 const requestId=crypto.randomUUID();
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{latestPendingRequests.delete(requestId);reject(new Error(operation==='probe'?'connector-unavailable':'Request timed out'));},timeout);
  latestPendingRequests.set(requestId,{resolve,reject,timer});
  window.postMessage({source:'refshelf-app',action:'latest-request',requestId,operation,...args},'*');
 });
}
window.addEventListener('message',e=>{
 const d=e.data;if(e.source!==window||d?.source!=='refshelf-connector'||d.action!=='latest-response')return;
 const pending=latestPendingRequests.get(d.requestId);if(!pending)return;
 clearTimeout(pending.timer);latestPendingRequests.delete(d.requestId);
 d.result?.error?pending.reject(new Error(d.result.error)):pending.resolve(d.result);
});
function resetLatestLibrary(){
 latestUpdateToken++;latestRequest++;latestCacheFailed=false;latestLoading=false;latestProgress='';latestData=null;latestError='';latestSelectedDoi=null;
 for(const url of latestLocalUrls.values())URL.revokeObjectURL(url);latestLocalUrls.clear();
}
function lpText(value){const el=document.createElement('template');el.innerHTML=String(value||'');return (el.content.textContent||'').replace(/\s+/g,' ').trim();}
function lpHttps(value,base){if(!value)return '';try{const u=new URL(value,base);if(u.protocol==='http:')u.protocol='https:';return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch(_){return '';}}
function lpDoi(value){let decoded=String(value||'');try{decoded=decodeURIComponent(decoded);}catch(_){}const article=decoded.match(/\/article(?:-abstract)?\/doi\/(10\.\d{4,9}\/[^/\s"'<>&?#]+)/i);return (article?.[1]||decoded.match(/10\.\d{4,9}\/[^\s"'<>&?#]+/i)?.[0]||'').toLowerCase().replace(/[.,;)\]]+$/,'');}
function lpDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?'':date.toISOString().slice(0,10);}
function lpFeedPapers(text,source){
 if(/<!DOCTYPE/i.test(text))throw new Error('Unsupported XML declaration');
 const xml=new DOMParser().parseFromString(text,'application/xml');if(xml.querySelector('parsererror'))throw new Error('Invalid publisher feed');
 const all=Array.from(xml.getElementsByTagName('*'));
 const build=all.find(el=>['lastbuilddate','updated'].includes(el.localName.toLowerCase()));
 if(build&&Date.now()-new Date(build.textContent).getTime()>14*86400000)throw new Error('Publisher feed is stale');
 const papers=[];
 for(const node of all.filter(el=>['item','entry'].includes(el.localName.toLowerCase())).slice(0,60)){
  const els=[...node.getElementsByTagName('*')],values=names=>els.filter(el=>names.includes(el.localName.toLowerCase()));
  const title=lpText(values(['title'])[0]?.textContent);
  const links=values(['link']).map(el=>el.getAttribute('href')||el.textContent);
  const doi=lpDoi(values(['doi','identifier','guid','id']).map(el=>el.textContent).concat(links,node.getAttributeNS('http://www.w3.org/1999/02/22-rdf-syntax-ns#','about')||'',values(['description','summary']).map(el=>el.textContent)).join(' '));
  if(!doi||!title)continue;
  const url=links.map(value=>lpHttps(value,source.feed)).find(value=>value&&!value.includes('doi.org'))||'https://doi.org/'+doi;
  const raw=values(['description','summary','encoded','content']).map(el=>el.textContent).join('\n');
  const fragment=document.createElement('template');fragment.innerHTML=raw;
  const images=values(['thumbnail','enclosure','content']).map(el=>el.getAttribute('url')).filter(Boolean).concat([...fragment.content.querySelectorAll('img')].map(el=>el.getAttribute('src')));
  const image=images.map(value=>lpHttps(value,url)).find(value=>value&&!/logo|icon|cover|badge|license/i.test(new URL(value).pathname))||'';
  const authors=values(['creator']).map(el=>lpText(el.textContent));
  if(!authors.length)for(const el of values(['author']))authors.push(lpText([...el.getElementsByTagName('*')].find(n=>n.localName==='name')?.textContent||el.textContent));
  papers.push({doi,title,url,authors:authors.filter(Boolean),journal:source.name,source:source.id,date:lpDate(values(['date','pubdate','published','updated'])[0]?.textContent),abstract:lpText(raw),image,imageKind:'toc',imageSource:'publisher-feed'});
 }
 if(!papers.length)throw new Error('Feed contained no DOI records');return papers;
}
function lpCrossrefPapers(items,source){
 return items.map(m=>{
  const parts=(m.published||m.issued)?.['date-parts']?.[0]||[];
  return {doi:lpDoi(m.DOI),title:lpText(m.title?.[0]),authors:(m.author||[]).map(a=>[a.given,a.family].filter(Boolean).join(' ')),journal:source.name,source:source.id,date:parts.map((v,i)=>i?String(v).padStart(2,'0'):String(v)).join('-'),url:lpHttps(m.resource?.primary?.URL)||'https://doi.org/'+m.DOI,abstract:lpText(m.abstract),image:''};
 }).filter(p=>p.doi&&p.title);
}
function lpCombinePapers(feed,metadata){
 const merged=new Map(metadata.map(p=>[p.doi,p]));
 for(const p of feed){const extra=merged.get(p.doi);merged.set(p.doi,{...extra,...p,authors:p.authors.length?p.authors:extra?.authors||[],date:p.date||extra?.date||'',abstract:p.abstract||extra?.abstract||''});}
 return [...merged.values()].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
}
function lpNativeAcsImages(text){
 const doc=document.createElement('template');doc.innerHTML=text;const images=new Map();
 for(const link of doc.content.querySelectorAll('a[href]')){
  const doi=lpDoi(link.getAttribute('href'));if(!doi.startsWith('10.1021/'))continue;
  const img=link.querySelector('img');if(!img||!/^graphical abstract for:/i.test(img.getAttribute('alt')||''))continue;
  const image=lpHttps(img.getAttribute('data-src')||img.getAttribute('src'),'https://pubs.acs.org/');
  if(image)images.set(doi,image);
 }
 return images;
}
function lpArticleImage(text,p){
 const doc=document.createElement('template');doc.innerHTML=text;
 const meta=doc.content.querySelector('meta[name="citation_doi"],meta[name="publication_doi"]');
 if(meta&&lpDoi(meta.getAttribute('content'))!==p.doi)return null;
 const code=p.doi.split('/').pop();
 for(const img of doc.content.querySelectorAll('img')){
  const src=lpHttps(img.getAttribute('data-src')||img.getAttribute('src'),p.url);if(!src||/logo|icon|cover|placeholder|badge/i.test(new URL(src).pathname))continue;
  let context=img.getAttribute('alt')||'';for(let node=img,depth=0;node&&depth<5;node=node.parentElement,depth++)context+=' '+node.id+' '+node.className;
  if(/related|recommended|sidebar|references/i.test(context))continue;
  if(/graphical|\btoc\b|\bga\b|synopsis|Abs1|_Figa_HTML/i.test(context+' '+src))return {image:src,imageKind:'toc',imageSource:'publisher-graphical-abstract'};
  if(['nature','nature-chemistry','nature-communications','science'].includes(p.source)&&/c-article-section__figure|\bfig(?:ure)?[-_]?0?1\b|\bf1\b/i.test(context)&&decodeURIComponent(src).toLowerCase().includes(code))return {image:src,imageKind:'figure',imageSource:'publisher-article-figure'};
 }
 return null;
}
async function latestCachedImage(p,destination=backend){
 if(!/^[-a-z0-9]+\.(png|jpg|gif|webp)$/.test(p.imageCache||'')||!destination?.getLatestImage)return '';
 if(latestLocalUrls.has(p.imageCache))return latestLocalUrls.get(p.imageCache);
 const token=latestUpdateToken,blob=await destination.getLatestImage(p.imageCache);
 if(backend!==destination||token!==latestUpdateToken)return '';
 if(!/^image\/(png|jpeg|gif|webp)$/.test(blob.type)||blob.size>4*1024*1024)return '';
 if(!latestLocalUrls.has(p.imageCache))latestLocalUrls.set(p.imageCache,URL.createObjectURL(blob));
 return latestLocalUrls.get(p.imageCache);
}
function latestHydrateImages(pane){
 pane.querySelectorAll('[data-latest-cache-doi]').forEach(img=>{
  const p=latestData?.papers.find(p=>p.doi===img.dataset.latestCacheDoi);if(!p?.imageCache)return;
  latestCachedImage(p).then(url=>{if(url&&img.isConnected){img.src=url;img.hidden=false;if(img.nextElementSibling)img.nextElementSibling.hidden=true;}}).catch(()=>{});
 });
}
async function latestUpdatePapers(){
 if(latestLoading)return;
 if(latestCacheFailed){showToast(t('latestFailed'),true);return;}
 if(backend?.kind!=='fs'){showToast(t('latestFolderNeeded'),true);return;}
 const destination=backend,library=lib,token=++latestUpdateToken;
 const alive=()=>token===latestUpdateToken&&backend===destination&&lib===library;
 latestLoading=true;latestError='';let newCount=0,savedSources=0;
 renderLatestPapers();
 try{
  let probe;try{probe=await latestConnectorRequest('probe',{},2500);}catch(_){throw new Error('connector-unavailable');}
  if(probe?.version!==2)throw new Error('connector-unavailable');
  if(!alive())return;
  if(!latestData)latestData={version:1,sources:LP_SOURCES,papers:[],status:[]};
  const hidden=new Set(latestState().hiddenSources),sources=LP_SOURCES.filter(s=>!hidden.has(s.id));
  for(let i=0;i<sources.length;i++){
   if(!alive())return;
   const source=sources[i];latestProgress=t('latestFetching')(source.label,i+1,sources.length);renderLatestPapers();
   let papers=[],method='publisher-feed',feedError='',metadataError='';
   try{papers=lpFeedPapers((await latestConnectorRequest('feed',{id:source.id})).text,source);}
   catch(error){feedError=String(error.message);}
   // A valid RSS response may contain only a handful of items. Supplement even on success.
   try{const metadata=lpCrossrefPapers((await latestConnectorRequest('crossref',{id:source.id})).items,source);method=papers.length?'publisher-feed+crossref':'crossref';papers=lpCombinePapers(papers,metadata);}
   catch(error){metadataError=String(error.message);}
   if(!alive())return;
   if(source.feed.startsWith('https://pubs.acs.org/')){
    try{const images=lpNativeAcsImages((await latestConnectorRequest('latest-page',{id:source.id})).text);for(const p of papers)if(images.has(p.doi)){p.image=images.get(p.doi);p.imageKind='toc';p.imageSource='publisher-asap-page';}}
    catch(_){} // Metadata remains useful when the public image page is unavailable.
   }
   if(!alive())return;
   const checkedAt=new Date().toISOString(),status={id:source.id,ok:!!papers.length,count:papers.length,method,checkedAt,...(feedError?{error:feedError}:{}),...(metadataError?{metadataError}:{})};
   if(!papers.length){
    const next={...latestData,status:[...(latestData.status||[]).filter(s=>s.id!==source.id),status]};
    try{await destination.saveLatest(next);}catch(_){throw new Error('latest-save');}
    if(!alive())return;latestData=next;continue;
   }
   const merged=new Map(latestData.papers.map(p=>[p.doi,p]));
   let enriched=0;
   for(let j=0;j<papers.length;j++){
    if(!alive())return;
    const p=papers[j],old=merged.get(p.doi);
    if(old){if(!p.abstract)p.abstract=old.abstract||'';if(!p.authors.length)p.authors=old.authors||[];if(!p.image&&old.image){p.image=old.image;p.imageKind=old.imageKind;p.imageSource=old.imageSource;}if(p.image===old.image&&old.imageCache)p.imageCache=old.imageCache;}
    // Bound article-page requests; feed-supplied images are always considered.
    if(!p.image&&enriched<10&&new URL(p.url).hostname===new URL(source.feed).hostname){
     enriched++;try{const result=await latestConnectorRequest('article',{id:source.id,url:p.url});Object.assign(p,lpArticleImage(result.text,p)||{});}catch(_){}
    }
    if(!alive())return;
    if(p.image&&!p.imageCache){
     latestProgress=t('latestImagesProgress')(source.label,j+1,papers.length);
     const progress=$('#latestPapersPane [data-latest-progress]');if(progress)progress.textContent=latestProgress;
     try{
      const result=await latestConnectorRequest('image',{id:source.id,url:p.image});
      if(!alive())return;
      const blob=await (await fetch(result.data)).blob();
      const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(p.image)))).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,24);
      const ext={'image/png':'png','image/jpeg':'jpg','image/gif':'gif','image/webp':'webp'}[blob.type];
      if(!ext||blob.size>4*1024*1024)throw new Error('Invalid image');
      const name=hash+'.'+ext;await destination.putLatestImage(name,blob);p.imageCache=name;
     }catch(error){p.imageCacheError=String(error.message);}
    }
    if(!old)newCount++;merged.set(p.doi,p);
   }
   if(!alive())return;
   const next={version:1,checkedAt,sources:LP_SOURCES,status:[...(latestData.status||[]).filter(s=>s.id!==source.id),status],papers:[...merged.values()].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,1500)};
   try{await destination.saveLatest(next);}catch(_){throw new Error('latest-save');}
   if(!alive())return;latestData=next;savedSources++;renderLatestPapers();
  }
  if(alive()){latestError=latestData.status?.some(s=>!s.ok||s.metadataError)?t('latestSourceError'):'';showToast(savedSources?t('latestUpdateDone')(newCount):t('latestUpdateFailed'),!savedSources);}
 }catch(error){if(alive())latestError=t(error.message==='connector-unavailable'?'latestConnectorNeeded':error.message==='latest-save'?'latestSaveFailed':'latestUpdateFailed');}
 finally{if(alive()){latestLoading=false;latestProgress='';latestSidebar();renderLatestPapers();}}
}
