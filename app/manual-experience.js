'use strict';

/* Production manual: a fixed outer guide rail controls an interactive virtual
   screen, followed by the full legacy reference text. */
(() => {
  const topics = [
    {id:'overview', ja:'はじめに', en:'Getting started', icon:'folderOpen'},
    {id:'import', ja:'インポート等', en:'Import & export', icon:'download'},
    {id:'add', ja:'文献を追加・削除する', en:'Add & delete references', icon:'plus'},
    {id:'connector', ja:'Chrome拡張機能', en:'Chrome Connector', icon:'book', action:'connector'},
    {id:'researchers', ja:'研究者', en:'Researchers', icon:'users'},
    {id:'organize', ja:'整理・編集する', en:'Organize & edit', icon:'folder'},
    {id:'search', ja:'探す・並べ替える', en:'Search and sort', icon:'search'},
    {id:'graph', ja:'論文相関図', en:'Related-paper map', icon:'graph'},
    {id:'maintenance', ja:'更新・メンテナンス', en:'Maintenance', icon:'retry'},
    {id:'word', ja:'Wordアドイン', en:'Word add-in', icon:'book', action:'word'},
    {id:'changelog', ja:'更新履歴', en:'Changelog', icon:'retry', noGuide:true},
    {id:'contact', ja:'お問い合わせ', en:'Contact', icon:'message', action:'contact', noGuide:true}
  ];

  openManual = function(initial){
    const dialog = document.getElementById('dlgManual');
    const tabs = document.getElementById('manualTabs');
    const content = document.getElementById('manualContent');
    const isJapanese = (document.documentElement.lang || 'ja').toLowerCase().startsWith('ja');
    const language = isJapanese ? 'ja' : 'en';
    const startIndex = typeof initial === 'number' && initial >= 0 ? Math.min(initial, topics.length - 1) : 0;

    dialog.classList.add('manualScenarioMode');
    tabs.hidden = false;
    tabs.innerHTML = topics.map((topic,index) => '<button type="button" data-scenario-topic="'+topic.id+'">' +
      (typeof ic === 'function' ? ic(topic.icon) : '<span class="manualScenarioNumber">'+String(index+1).padStart(2,'0')+'</span>') +
      '<span>'+esc(isJapanese ? topic.ja : topic.en)+'</span></button>').join('');
    content.innerHTML = '<div class="manualScenarioShell">' +
      '<div class="manualScenarioActions" id="manualScenarioActions"></div>' +
      '<iframe class="manualScenarioFrame" id="manualScenarioFrame" title="'+
      esc(isJapanese ? 'Paper Library 項目別操作マニュアル' : 'Paper Library task walkthrough')+
      '" loading="eager"></iframe>' +
      '<section class="manualScenarioDetails" id="manualScenarioDetails" aria-label="'+
      esc(isJapanese ? '詳しい説明' : 'Detailed instructions')+'"></section></div>';

    const frame = document.getElementById('manualScenarioFrame');
    const actionBar = document.getElementById('manualScenarioActions');
    const details = document.getElementById('manualScenarioDetails');
    let activeTopic = topics[startIndex];
    let guide = {
      label: isJapanese ? activeTopic.ja : activeTopic.en,
      title: isJapanese ? '操作ガイドを読み込み中…' : 'Loading walkthrough…',
      text: isJapanese ? '仮想画面の操作手順を準備しています。' : 'Preparing the walkthrough.',
      step: 0,
      total: 0,
      canGoBack: false,
      isLast: false
    };

    const rich = value => esc(value)
      .replace(/\bchrome:\/\/extensions\b/g, '<code class="manual-code">chrome://extensions</code>')
      .replace(/\[\[code:([^\]]+)\]\]/g, (_, value) => '<code class="manual-code">'+value+'</code>')
      .replace(/\[\[ic:(\w+)\]\]/g, (_, name) => typeof ic === 'function' ? ic(name) : '');

    const renderDetails = topic => {
      const section = typeof MANUAL !== 'undefined' && MANUAL[language] ? MANUAL[language][topics.indexOf(topic)] : null;
      if(!section){ details.replaceChildren(); return; }
      details.innerHTML =
        '<article class="manualScenarioDetailsBody"><h3>'+esc(section.h)+'</h3>'+section.blocks.map(block =>
          block.fig ? '<div class="manual-fig">'+MANUAL_FIGS[block.fig](language)+'</div>' :
          block.sub ? '<h4>'+esc(block.sub)+'</h4>' :
          block.contact ? '<p><a href="mailto:aaths.takumi@gmail.com">aaths.takumi@gmail.com</a></p>' :
          block.changelog ? renderChangelogHtml() :
          block.dl ? '<p><button class="tbtn primary" data-connector-dl>'+ (typeof ic === 'function' ? ic('download') : '') +esc(block.dl)+'</button></p>' :
          block.dlword ? '<p><button class="tbtn primary" data-wordaddin-dl>'+ (typeof ic === 'function' ? ic('download') : '') +esc(block.dlword)+'</button></p>' :
          block.dict ? '<p><button class="tbtn primary" data-journaldict-open>'+ (typeof ic === 'function' ? ic('book') : '') +esc(block.dict)+'</button></p>' :
          block.p ? '<p>'+rich(block.p)+'</p>' :
          block.ul ? '<ul>'+block.ul.map(item=>'<li>'+rich(item)+'</li>').join('')+'</ul>' : ''
        ).join('')+'</article>';
    };

    const sendCommand = command => {
      frame.contentWindow?.postMessage({type:'paper-library-manual-command', command}, '*');
    };

    const renderGuideRail = () => {
      const stepLabel = guide.total ? `${guide.step} / ${guide.total}` : '—';
      const nextLabel = guide.isLast
        ? (isJapanese ? '最初に戻る' : 'Start over')
        : (isJapanese ? '次へ' : 'Next');
      let utility = '';
      if(activeTopic.action === 'connector') utility = '<button type="button" class="tbtn" data-connector-dl>'+ (typeof ic === 'function' ? ic('download') : '') +esc(isJapanese ? '拡張機能をダウンロード' : 'Download extension')+'</button>';
      if(activeTopic.action === 'word') utility = '<button type="button" class="tbtn" data-wordaddin-dl>'+ (typeof ic === 'function' ? ic('download') : '') +esc(isJapanese ? 'manifest.xmlをダウンロード' : 'Download manifest.xml')+'</button>';
      if(activeTopic.action === 'contact') utility = '<button type="button" class="tbtn" id="manualContactAction">'+esc(isJapanese ? 'メールを作成' : 'Compose email')+'</button>';
      actionBar.innerHTML = '<div class="manualScenarioGuideCopy"><span class="manualScenarioGuideKicker">'+esc(isJapanese ? '操作ガイド' : 'Walkthrough')+' · '+esc(guide.label)+' · '+stepLabel+'</span><strong>'+esc(guide.title)+'</strong><p>'+esc(guide.text)+'</p></div>'+
        '<div class="manualScenarioGuideActions"><button type="button" class="tbtn" id="manualGuidePrevious"'+(guide.canGoBack ? '' : ' disabled')+'>'+esc(isJapanese ? '戻る' : 'Back')+'</button><button type="button" class="tbtn primary" id="manualGuideNext">'+esc(nextLabel)+'</button>'+utility+'</div>';
      document.getElementById('manualGuidePrevious').addEventListener('click',()=>sendCommand('previous'));
      document.getElementById('manualGuideNext').addEventListener('click',()=>sendCommand(guide.isLast ? 'restart' : 'next'));
      document.getElementById('manualContactAction')?.addEventListener('click',()=>{location.href='mailto:aaths.takumi@gmail.com';});
      actionBar.classList.add('show');
    };

    const messageHandler = event => {
      if(event.source !== frame.contentWindow) return;
      if(event.data?.type === 'paper-library-manual-close'){
        dialog.close();
        return;
      }
      if(event.data?.type !== 'paper-library-manual-guide') return;
      guide = event.data.guide;
      renderGuideRail();
    };
    if(window.__paperLibraryManualGuideHandler) window.removeEventListener('message', window.__paperLibraryManualGuideHandler);
    window.__paperLibraryManualGuideHandler = messageHandler;
    window.addEventListener('message', messageHandler);

    const shell = content.querySelector('.manualScenarioShell');
    const show = index => {
      const topic = topics[index] || topics[0];
      tabs.querySelectorAll('button').forEach((button,i)=>button.classList.toggle('active',i===index));
      activeTopic = topic;
      renderDetails(topic);
      shell.classList.toggle('manualScenarioShell--plain', !!topic.noGuide);
      if(topic.noGuide){
        // Some topics (Changelog, Contact) are plain reference text with
        // nothing to click through — skip the walkthrough rail/iframe
        // entirely rather than showing an empty or pointless guide.
        actionBar.classList.remove('show');
        actionBar.replaceChildren();
        frame.removeAttribute('src');
      }else{
        guide = {label:isJapanese ? topic.ja : topic.en, title:isJapanese ? '操作ガイドを読み込み中…' : 'Loading walkthrough…', text:isJapanese ? '仮想画面の操作手順を準備しています。' : 'Preparing the walkthrough.', step:0, total:0, canGoBack:false, isLast:false};
        renderGuideRail();
        frame.onload = () => { content.scrollTop = 0; };
        frame.src = 'manual-virtual-screen.html?v=20260823r7&lang='+language+'#'+topic.id;
      }
      content.scrollTop = 0;
    };

    tabs.querySelectorAll('button').forEach((button,index)=>button.addEventListener('click',()=>show(index)));
    show(startIndex);
    if(!dialog.open) dialog.showModal();
  };
})();
