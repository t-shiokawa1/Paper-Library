'use strict';
/* =====================================================================
   Paper Library — GitHub Pages reference manager
   Storage: local folder via File System Access API (library.json + attachments/)
   ===================================================================== */

/* ---------------------------------------------------------------
   Icon set — bespoke line icons (24×24, stroke = currentColor).
   ic('name') returns an inline <svg>; static markup uses
   <span class="ic" data-ic="name"></span> filled by renderIcons().
---------------------------------------------------------------- */
const ICONS = {
  library:'<path d="M4 5.5v14M8.5 5v14"/><path d="M13.2 4.6l-2.1 14.2 4.4.7 2.1-14.3-4.4-.6z"/><path d="M3 20h18"/>',
  inbox:'<path d="M20 12h-4l-1.5 2.5h-5L8 12H4"/><path d="M6.2 5.3 4 12v5.5A1.5 1.5 0 0 0 5.5 19h13a1.5 1.5 0 0 0 1.5-1.5V12l-2.2-6.7A1.5 1.5 0 0 0 16.4 4H7.6a1.5 1.5 0 0 0-1.4 1.3z"/>',
  folder:'<path d="M4 19.5A1.5 1.5 0 0 1 2.5 18V6A1.5 1.5 0 0 1 4 4.5h4.3a1.5 1.5 0 0 1 1.2.6l1 1.3a1.5 1.5 0 0 0 1.2.6h6.6A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5z"/>',
  folderOpen:'<path d="M4.5 19.5 6.4 12a1.5 1.5 0 0 1 1.45-1.1H21a1 1 0 0 1 .96 1.26l-1.6 6a1.5 1.5 0 0 1-1.45 1.1z"/><path d="M4.5 19.5A1.5 1.5 0 0 1 3 18V6a1.5 1.5 0 0 1 1.5-1.5h3.8a1.5 1.5 0 0 1 1.2.6l1 1.3a1.5 1.5 0 0 0 1.2.6h5.6A1.5 1.5 0 0 1 19.8 9v1.9"/>',
  folders:'<path d="M5.5 4V3.7A1.2 1.2 0 0 1 6.7 2.5h3.7a1.3 1.3 0 0 1 1 .5l.9 1.1a1.3 1.3 0 0 0 1 .5h5.2A1.5 1.5 0 0 1 20 6.1v.5" opacity=".68" stroke-width="1.55"/><path d="M4 19.5A1.5 1.5 0 0 1 2.5 18V6A1.5 1.5 0 0 1 4 4.5h4.3a1.5 1.5 0 0 1 1.2.6l1 1.3a1.5 1.5 0 0 0 1.2.6h6.6A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5z"/>',
  paperclip:'<path d="M20.4 11.5 12 19.9a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/>',
  link:'<path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5"/><path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5"/>',
  quote:'<path d="M9.5 6.5C7 7 5.5 9 5.5 12v5.5h5V12H8c0-1.5.8-2.6 2.3-3l-.8-2.5z"/><path d="M18 6.5C15.5 7 14 9 14 12v5.5h5V12h-2.5c0-1.5.8-2.6 2.3-3L18 6.5z"/>',
  braces:'<path d="M8 4H7.5A2.5 2.5 0 0 0 5 6.5v3A2.5 2.5 0 0 1 2.5 12 2.5 2.5 0 0 1 5 14.5v3A2.5 2.5 0 0 0 7.5 20H8"/><path d="M16 4h.5A2.5 2.5 0 0 1 19 6.5v3A2.5 2.5 0 0 0 21.5 12 2.5 2.5 0 0 0 19 14.5v3A2.5 2.5 0 0 1 16.5 20H16"/>',
  trash:'<path d="M4 6.5h16"/><path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5"/><path d="M6.5 6.5 7.5 19a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-12.5"/><path d="M10 10v6M14 10v6"/>',
  pencil:'<path d="M13.5 6.5 4 16v4h4l9.5-9.5z"/><path d="M12 8 16 12"/><path d="M15.5 4.5a2.1 2.1 0 0 1 3 3l-1.5 1.5-3-3z"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  chevron:'<path d="M6 9.5 12 15l6-5.5"/>',
  clock:'<path d="M3.5 11.5a8.5 8.5 0 1 0 3-6.5"/><path d="M3.5 4.5v4h4"/><path d="M12 8v4.5l3 1.8"/>',
  flask:'<path d="M9 3.5h6"/><path d="M10 3.5v6.2L5.3 17.8A1.5 1.5 0 0 0 6.6 20h10.8a1.5 1.5 0 0 0 1.3-2.2L14 9.7V3.5"/><path d="M7.7 14.5h8.6"/>',
  file:'<path d="M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10A1.5 1.5 0 0 0 18.5 19V8.5z"/><path d="M13.5 3.5V8.5H18.5"/><path d="M9 12.5h6M9 16h6"/>',
  star:'<path d="m12 3.8 2.45 5 5.5.8-4 3.9.95 5.5L12 16.4 7.1 19l.95-5.5-4-3.9 5.5-.8z"/>',
  tag:'<path d="M4 4.5h6l9.5 9.5a1.8 1.8 0 0 1 0 2.5l-3.5 3.5a1.8 1.8 0 0 1-2.5 0L4 10.5z"/><path d="M7.5 8h.01"/>',
  search:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l4.5 4.5"/>',
  funnel:'<path d="M3.5 5h17l-6.5 8v6l-4-2v-4z"/>',
  sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  wrap:'<path d="M4 6.5h16M4 12h11.5a3 3 0 0 1 0 6H13m0 0 2-2m-2 2 2 2M4 17.5h5"/>',
  rows:'<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  table:'<path d="M4 5.5h16v13H4z"/><path d="M4 10h16M4 14.5h16M10 5.5v13M15 5.5v13"/>',
  kanban:'<rect x="3.5" y="4.5" width="5" height="15" rx="1"/><rect x="9.5" y="4.5" width="5" height="10" rx="1"/><rect x="15.5" y="4.5" width="5" height="13" rx="1"/>',
  note:'<path d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5z"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>',
  message:'<path d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3v-3A1.5 1.5 0 0 1 4 15V7a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M8 9.5h8M8 13h5"/>',
  palette:'<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-.8 2-1.7 0-.8-.6-1.2-.6-2 0-1 .8-1.8 2-1.8h1.6c2 0 3.5-1.4 3.5-3.4C20.5 6.8 16.7 3.5 12 3.5z"/><circle cx="7.8" cy="10.2" r="1.2"/><circle cx="12" cy="7.6" r="1.2"/><circle cx="16.2" cy="10.2" r="1.2"/>',
  folderPlus:'<path d="M4 19.5A1.5 1.5 0 0 1 2.5 18V6A1.5 1.5 0 0 1 4 4.5h4.3a1.5 1.5 0 0 1 1.2.6l1 1.3a1.5 1.5 0 0 0 1.2.6h6.6A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5z"/><path d="M12 10.5v5M9.5 13h5"/>',
  alert:'<path d="M12 4 2.5 20.5h19z"/><path d="M12 10v4.5M12 17.6h.01"/>',
  retry:'<path d="M20 11a8 8 0 1 0-1.5 5.5"/><path d="M20 5v5h-5"/>',
  zoom:'<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5 5"/><path d="M8.5 10.5h4M10.5 8.5v4"/>',
  text:'<path d="M5 6h14M12 6v12M8.5 18h7"/>',
  citations:'<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="9" r="2.4"/><circle cx="8.5" cy="18" r="2.4"/><path d="M8.3 7 15.6 8.6M7.7 15.7 6.6 8.3M10.2 16.6 16.1 10.9"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3.8 19a5.2 5.2 0 0 1 10.4 0"/><circle cx="17" cy="9.5" r="2.3"/><path d="M14.8 15.5a4.2 4.2 0 0 1 5.4 3.5"/>',
  graph:'<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="17" r="2.2"/><circle cx="19" cy="16" r="2.2"/><circle cx="12" cy="12.5" r="1.6"/><path d="M12 7.2v3.7M10.6 13.6 6.4 15.6M13.5 13.3 17.4 15M6.8 15.5 10.6 6.6M17.2 14.9 13 6.7"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="7.2"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5 6.9 6.9M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4"/>',
  check:'<path d="M5 12.5 10 17.5 19.5 6.5"/>',
  arrowDownLeft:'<path d="M17 7 7 17M7 17h7M7 17v-7"/>',
  arrowUpRight:'<path d="M7 17 17 7M17 7h-7M17 7v7"/>',
  download:'<path d="M12 4v10m0 0 4-4m-4 4-4-4"/><path d="M5 18.5h14"/>',
  upload:'<path d="M12 15V5m0 0 4 4m-4-4-4 4"/><path d="M5 18.5h14"/>',
  moon:'<path d="M20.5 15.2A8.2 8.2 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  book:'<path d="M12 6.5C10 4.8 6.8 4.5 4.5 5.2V18c2.3-.7 5.5-.4 7.5 1.3 2-1.7 5.2-2 7.5-1.3V5.2C17.2 4.5 14 4.8 12 6.5z"/><path d="M12 6.5v12.8"/>',
};
function ic(name, attrs){
  const p = ICONS[name] || '';
  const cls = attrs && attrs.cls ? ' ' + attrs.cls : '';
  const st = attrs && attrs.style ? ` style="${attrs.style}"` : '';
  return `<span class="ic${cls}"${st}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg></span>`;
}
// Bespoke two-tone open-book logo mark.
const LOGO_SVG = `<svg class="logo brandLogoGlow" viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="plg1" x1="5" y1="7" x2="16" y2="25" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1d4ed8"/>
      <stop offset="1" stop-color="#60a5fa"/>
    </linearGradient>
    <linearGradient id="plg2" x1="27" y1="7" x2="16" y2="25" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#93c5fd"/>
    </linearGradient>
    <linearGradient id="plg3" x1="3" y1="25" x2="29" y2="25" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#bfdbfe"/>
      <stop offset=".5" stop-color="#60a5fa"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <path d="M16 8.35C13.2 5.95 8.7 5.7 4.75 6.95v16.2c3.95-1.15 8.45-.8 11.25 1.85z" fill="url(#plg1)" class="brandLogoPage left"/>
  <path d="M16 8.35C18.8 5.95 23.3 5.7 27.25 6.95v16.2c-3.95-1.15-8.45-.8-11.25 1.85z" fill="url(#plg2)" class="brandLogoPage right"/>
  <path d="M16 8.35C18.8 5.95 23.3 5.7 27.25 6.95v16.2c-3.95-1.15-8.45-.8-11.25 1.85z" fill="#dbeafe" class="brandLogoFlipPage" opacity="0"/>
  <path d="M7.8 11.15c1.85-.5 3.7-.48 5.15.06M7.8 14.55c1.85-.5 3.7-.48 5.15.06M19.05 11.15c1.85-.5 3.7-.48 5.15.06M19.05 14.55c1.85-.5 3.7-.48 5.15.06" stroke="#fff" stroke-width="1.05" stroke-linecap="round" opacity=".82" class="brandLogoLine"/>
  <path d="M16 8.5v16.25" stroke="#eff6ff" stroke-width="1.25" stroke-linecap="round" class="brandLogoCenter"/>
  <rect x="3" y="24.25" width="26" height="3.25" rx="1.6" fill="url(#plg3)"/>
  <path d="M5.1 25.9h21.8" stroke="#eff6ff" stroke-width=".7" stroke-linecap="round" opacity=".55"/>
</svg>`
function renderIcons(root){
  const r = root || document;
  r.querySelectorAll('[data-ic]:not([data-ic-done])').forEach(el=>{
    const p = ICONS[el.dataset.ic] || '';
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
    el.setAttribute('data-ic-done','1');
  });
  r.querySelectorAll('[data-logo]:not([data-logo-done])').forEach(el=>{
    el.innerHTML = LOGO_SVG;
    el.setAttribute('data-logo-done','1');
  });
}

// Final logo style: 81 Premium page turn is fixed via body.brandStyle-81.


const APP_VERSION = '1.8';
const CHANGELOG = [
  { v:'1.8', date:'2026-07-19',
    ja:[
      'コレクション整理と表表示の操作性を改善しました',
      'コレクションツリーをライブラリ読込時に折りたたむようにし、すべてのフォルダをまとめて開閉できるボタンを追加しました',
      '文献やコレクションのドラッグ＆ドロップ移動を Command / Ctrl + Z で取り消せるようにし、コレクションへの移動時の再描画を減らして動作を軽くしました',
      '表の列移動を高速化し、「メモ」列を追加しました。スター・PDF・種類・メモ列は初期状態では非表示になります',
      'コレクションの色とアイコンを左パネル・表・右パネルで統一し、ライトモードでの視認性、複数コレクションのアイコン、右パネルの表示を改善しました',
      '表のタグ列にタグアイコンを追加し、左パネルと同じタグ色を背景・枠線・文字へ反映するようにしました',
      'ScienceDirect の PII を含む論文 URL から文献を追加できない問題を修正しました',
      '引用プレビューで「et al..」になる問題を修正し、Science は「et al.,」、Nature・ACS は文末の「et al.」となるよう句読点をスタイル別に整えました',
      '右パネル上部からドラッグ＆ドロップで代替できるスター・自分の論文の操作を除き、表示を整理しました',
    ],
    en:[
      'Improved collection organisation and table-view usability',
      'Collection trees now start collapsed when a library is loaded, with a button to expand or collapse every folder at once',
      'Collection and paper moves made by drag and drop can now be undone with Command / Ctrl + Z, and collection drops are faster by avoiding unnecessary re-rendering',
      'Made table-column reordering faster and added a Notes column. Star, PDF, Category, and Notes columns are hidden by default',
      'Unified collection colours and icons across the left pane, table, and detail pane, with better light-mode contrast, a refined multiple-collection icon, and cleaner detail-pane rendering',
      'Added tag icons to the table and applied each tag colour consistently to its background, border, and text, matching the left pane',
      'Fixed adding papers from ScienceDirect article URLs containing a PII',
      'Fixed citation previews producing “et al..” and applied style-specific punctuation: “et al.,” for Science and sentence-final “et al.” for Nature and ACS',
      'Simplified the detail-pane actions by removing Star and My Publication controls that can be handled by drag and drop',
    ],
  },
  { v:'1.7', date:'2026-07-15',
    ja:[
      '相関図機能を大幅に改善しました',
      '関連論文の選び方を見直し、候補を広く集めたうえで関連度（参照文献の重なり・共引用・被引用数）でスコアリングして表示するようにしました（表示数も最大 42 件に拡大）',
      '種論文を二重リングと太字ラベルで強調し、ひと目で見つけられるようにしました',
      'ノードをダブルクリック（またはサイドパネルの「相関図」ボタン）で、その論文を中心にした相関図へ移動できるようになりました',
      'サイドパネルのアブストラクトに見出しを付け、関連論文のハイライトはホバーではなくクリックで切り替わるようにしました',
      '再取得に失敗したときはキャッシュ済みの相関図を表示するなど、動作の安定性を改善しました',
    ],
    en:[
      'Major improvements to the related-papers graph',
      'Reworked how related papers are chosen: a wider candidate pool is scored by relevance (shared references, co-citations, and citation counts), and the map now shows up to 42 papers',
      'The seed paper is now highlighted with a double ring and a bold label so it is easy to spot',
      'Double-click a node (or use the “Graph” button in the side panel) to jump to the map centred on that paper',
      'The abstract in the side panel now has a heading, and the neighbourhood highlight switches on click instead of hover',
      'Improved robustness — for example, the cached map is shown when a refetch fails',
    ],
  },
  { v:'1.0', date:'2026-07-05',
    ja:[
      'Paper Library v1.0 を公開しました',
      'ローカルフォルダに library.json と attachments/ を保存する、GitHub Pages 配信の文献管理アプリとして利用できます',
      'DOI / arXiv / URL / タイトルからの文献追加、手動追加、BibTeX / RIS / CSV / JSON インポートに対応しています',
      'コレクション、タグ、スター、検索、詳細検索、表表示 / カード表示で文献を整理できます',
      'PDF 添付、引用コピー、相関図、被引用数・責任著者の更新、重複・空データ・修正候補の確認に対応しています',
      'Chrome 拡張機能 Paper Library Connector から、論文ページを開いたまま保存先ライブラリとコレクションを選んで保存できます',
      'Word アドインにより、Word のリボンから文献を検索し、番号付き引用と文献リストを挿入できます',
    ],
    en:[
      'Release Paper Library v1.0',
      'Use it as a GitHub Pages reference manager that stores library.json and attachments/ in a local folder',
      'Add references from DOI / arXiv / URL / title, add manually, and import BibTeX / RIS / CSV / JSON',
      'Organize references with collections, tags, stars, search, advanced search, table view, and card view',
      'Attach PDFs, copy citations, open the graph view, refresh cited-by / corresponding-author data, and review duplicates, empty records, and fix suggestions',
      'Save from paper pages with the Paper Library Connector Chrome extension, choosing the destination library and collections from the popup',
      'Use the Word add-in to search references from the Word ribbon and insert numbered citations with a bibliography',
    ],
  },
];

const I18N = {
  ja: {
    add:'追加', addByIdMenu:'DOI / arXiv / URL・タイトルから（ダイアログ）',
    addById:'DOI / arXiv', addManual:'手動追加', import:'インポート', importKeywordsAsTags:'keywords をタグとして読み込む', export:'エクスポート',
    expBibShown:'表示中の文献 → BibTeX', expRisShown:'表示中の文献 → RIS', expCsvShown:'表示中の文献 → CSV', expJsonShown:'表示中の文献 → JSON', expJson:'ライブラリ全体 → JSON',
    searchPh:'検索ワードを入力して Enter', advancedSearch:'詳細検索', quickAddTitle:'この DOI / URL を取得して追加', addBoxPh:'URL を入力して Enter', addMoreTitle:'手動追加・インポート', library:'ライブラリ', collections:'コレクション', tags:'タグ',
    newCollection:'新規コレクション', searchCollTip:'コレクションを検索', collapseAllCollections:'すべてのフォルダを閉じる', expandAllCollections:'すべてのフォルダを開く', searchCollPh:'コレクション名で絞り込み', searchCollEmpty:'一致するコレクションはありません', allItems:'すべての文献', starred:'スター', starItem:'スターを付ける', unstarItem:'スターを外す', myPublication:'自分の論文', markMyPublication:'自分の論文にする', unmarkMyPublication:'自分の論文から外す', trash:'ゴミ箱', emptyTrash:'完全に削除する', trashPermanentNote:'完全削除すると元に戻せません。', restoreItem:'復元', deleteForever:'完全に削除', deleteSingle:'削除', colTrashDelete:'操作', uncategorized:'未分類',
    colStar:'スター', colPdf:'pdf', colTitle:'タイトル', colAuthors:'著者', colYear:'年', colJournal:'出版物', colCitedBy:'被引用数', colType:'種別', colCategory:'種類', colDoi:'DOI', colAdded:'追加日',
    colTrashRestore:'復元',
    columns:'列', colReset:'既定に戻す', refreshCited:'被引用数を更新', refreshCorresponding:'責任著者を更新',
    refreshAll:'更新', refreshCategory:'種類を更新', refreshModeAutoAll:'すべて更新（表示中の全件）', refreshOnlyLabel:'項目を選んで更新',
    refreshModeAuto:'自動で更新（表示中の全件）', refreshModePick:'文献を選択して更新',
    pickHintCited:'被引用数を更新する文献をクリックして選択（Shiftで範囲選択）',
    pickHintCorresponding:'責任著者を更新する文献をクリックして選択（Shiftで範囲選択）',
    pickHintAll:'更新する文献をクリックして選択（Shiftで範囲選択）',
    pickClearAll:'全解除', pickConfirm:(n)=>`選択した${n}件を更新`, pickNone:'文献を選択してください',
    updateThisItem:'更新', updateThisItemHint:'この文献の被引用数・責任著者・種類を更新',
    pickDone:(n)=>`${n} 件の更新を開始しました`,
    duplicateCandidates:'重複候補', duplicateTitle:'重複候補の確認',
    duplicateSummary:(n)=>`${n} 件の重複候補があります。内容を確認して、不要な追加分だけ削除してください。`,
    duplicateNone:'重複候補は見つかりませんでした',
    duplicateExisting:'既存', duplicateAdded:'追加分', duplicatePossible:'候補',
    duplicateReasonDoi:'DOI が一致', duplicateReasonTitle:'タイトルがほぼ一致', duplicateReasonSimilar:'タイトルが類似',
    duplicateOpenExisting:'既存を開く', duplicateOpenAdded:'追加分を開く', duplicateDeleteAdded:'追加分を削除', duplicateDeleteExisting:'既存を削除',
    duplicateReplaceExisting:'既存を置き換え', duplicateReplacedExisting:'既存を新しい情報で置き換えました',
    duplicateSkipped:'同じ DOI のため追加されませんでした',
    emptyRecords:'空データ', emptyRecordsTitle:'空データの確認',
    emptyRecordsSummary:(n)=>`${n} 件の未入力データがあります。手動追加後に内容を入れなかった文献はここから削除できます。`,
    emptyRecordsNone:'空データは見つかりませんでした',
    emptyRecordLabel:'未入力の文献', emptyRecordAdded:(d)=>`追加日: ${d || '不明'}`,
    emptyOpen:'開く', emptyDelete:'削除', deleteAllEmpty:'すべて削除',
    confirmDeleteEmpty:(n)=>`${n} 件の空データを削除しますか？`,
    fixSuggestions:'修正候補', fixSuggestionsTitle:'修正候補',
    fixSuggestionsSummary:(n)=>`${n} 件の雑誌略称に修正候補があります。`,
    fixSuggestionsNone:'修正候補は見つかりませんでした',
    fixAngewCurrent:'1998年以降は Angew. Chem. Int. Ed. が現行誌名です',
    fixAngewTypo:'Engle. は Engl. の誤記候補です',
    fixChemEurJPaperpile:'Paperpile 由来の Chemistry は Chem. Eur. J. の候補です',
    fixChemCommunCamb:'Chem. Commun. (Camb.) は Chem. Commun. に統一できます',
    currentValue:'現在', suggestedValue:'修正案', applyFix:'修正', applyAllFixes:'すべて修正',
    confirmApplyAllFixes:(n)=>`${n} 件の修正候補を適用しますか？`,
    journalDictTitle:'雑誌名の辞書',
    journalDictOpen:'雑誌名の辞書を開く',
    journalDictIntro:'取得された雑誌名の表記ゆれを、正しい正式名・略称に対応づける辞書です。ここに追加した対応は、修正候補と雑誌名の表示に反映され、library.json に保存されます（バックアップや別PCへの移行でもそのまま使えます）。標準の辞書より優先されるので、既定の対応を上書きすることもできます。',
    journalDictMatchPh:'取得される表記・別名（例: Adv. Sci. (Weinh.)）',
    journalDictFullPh:'正式名（雑誌欄・任意）',
    journalDictAbbrPh:'略称（表示・任意）',
    journalDictColMatch:'取得される表記・別名', journalDictColAlias:'表記揺れ・別名', journalDictColFull:'正式名', journalDictColAbbr:'略称',
    journalDictAdd:'辞書に追加', journalDictRemove:'削除',
    journalDictCount:(u,b)=>`自分 ${u}件 ・ 標準 ${b}件`,
    journalDictBuiltinPh:'辞書を検索（雑誌名・略称・表記揺れ）',
    journalDictBuiltinEmpty:'一致する項目はありません。',
    journalDictEmpty:'まだ辞書に登録がありません。',
    journalDictMatchReq:'「取得される表記・別名」を入力してください。',
    journalDictNeedValue:'「正式名」か「略称」のどちらかを入力してください。',
    journalDictAdded:'辞書に追加しました。',
    journalDictUpdated:'辞書を更新しました。',
    journalDictRemoved:'辞書から削除しました。',
    wrapToggle:'折り返し', newSubCollection:'サブフォルダを作成', collColor:'色を変更',
    collColorCustom:'カスタム：', collColorDefault:'既定',
    filterContains:'…を含む', filterFrom:'から', filterTo:'まで', filterClear:'クリア',
    filters:'フィルタ', viewMenu:'表示', viewStyle:'表示スタイル', cardCols:(n)=>`${n}列`, filterOptions:'候補', filterNoOptions:'候補がありません', themeDark:'Dark', themeLight:'Light',
    authorDisplay:'著者表示', authorNameStyle:'名前形式', authorLimit:'表示人数', authorSeparator:'区切り',
    authorMarkCorresponding:'責任著者に * を表示',
    authorFamily:'姓のみ', authorInitial:'姓 + イニシャル', authorFull:'フルネーム',
    authorAll:'全員', authorFirst3:'3名まで + et al.', authorFirst1:'1名のみ + et al.',
    viewCards:'カード表示', viewTable:'表表示', viewShelves:'文献棚', viewKanban:'カンバン',
    shelfRecent:'最近追加した文献', shelfStarred:'スター付き', shelfReading:'読書中', shelfPdf:'PDFあり', shelfCollections:'コレクション',
    shelfItems:(n)=>`${n} 件`, shelfMore:(n)=>`ほか ${n} 件`, shelfEmpty:'この棚に文献はありません', shelfRecentDays:'日以内',
    readingStatus:'読書状態', statusUnread:'未読', statusReading:'読書中', statusRead:'読了',
    kanbanHint:'カードをドラッグして読書状態を変更できます',
    filterTitle:(c)=>`${c} で絞り込み`,
    refreshingCited:'被引用数を取得中…', refreshedCited:(n)=>`${n} 件の被引用数を更新しました`,
    refreshedCitedPartial:(n,f)=>`${n} 件を更新しました（${f} 件は取得失敗 — 取得ログを確認）`,
    refreshedCitedS2:(n,s)=>`${n} 件を更新しました（うち ${s} 件は Semantic Scholar から補完）`,
    refreshingCorresponding:'責任著者を取得中…',
    refreshedCorresponding:(n)=>`${n} 件の責任著者を更新しました`,
    refreshedCategory:(n)=>`${n} 件の種類を更新しました`,
    refreshedCorrespondingPartial:(n,f)=>`${n} 件の責任著者を更新しました（${f} 件は取得失敗 — 取得ログを確認）`,
    noCorrespondingTargets:'更新対象の責任著者はありません',
    noCorrespondingFound:'OpenAlex に責任著者情報がありません',
    allFresh:(n)=>`${n} 件はすべて最新でした（キャッシュ利用・API 呼び出しなし）`,
    fetchLog:'更新ログ', fetchLogTitle:'更新ログ', logEmpty:'更新ログはありません',
    alerts:'通知', alertsNone:'通知はありません',
    logRetry:'再試行', logClear:'ログを消去', logRetryAll:'すべて再試行',
    logRunning:'処理中…', logUpdated:'更新済み', logNoData:'情報なし', logSkipped:'スキップ',
    logKindCited:'被引用数', logKindCorresponding:'責任著者', recentlyCheckedNoCorresponding:'最近確認済みのためスキップ',
    oaBudgetErr:'OpenAlex の1日あたりの利用上限に達しました（UTC 0時にリセット）。相関図などで多数取得すると枯渇します。時間をおいて再試行してください。',
    colHint:'ヘッダーをドラッグで並べ替え／右端をドラッグで幅調整',
    sortColumn:'この列で並べ替え',
    emptyMsg:'文献がありません。「＋ DOI / arXiv」から追加してください。',
    trashEmptyMsg:'ゴミ箱に文献はありません。',
    noSelect:'文献を選択してください',
    addByIdTitle:'DOI / arXiv ID から追加',
    addByIdHint:'DOI・arXiv ID・それらを含む URL・論文タイトル / 出版社ページ URL・または書誌情報（例: Angew. Chem. Int. Ed. 2017, 56, 3270–3274.）を入力してください。ID が無い場合は CrossRef を検索します。',
    cancel:'キャンセル', close:'閉じる', expand:'展開', collapse:'折りたたみ', fetchAdd:'取得して追加', changelog:'更新履歴', manual:'マニュアル',
    startSub:'文献管理ツール',
    openFolder:'ライブラリフォルダを開く / 作成',
    openFolderSub:'フォルダを選択します。library.json があれば読み込み、なければ新規作成します。',
    openLast:'前回のライブラリを開く', changeFolder:'作業フォルダを変更',
    demoMode:'お試しモード（保存なし）', demoModeSub:'メモリ上でのみ動作します。閉じるとデータは消えます。',
    fsWarn:'⚠ このブラウザはフォルダ保存（File System Access API）に未対応です。Chrome / Edge をご利用ください。',
    mobileTitle:'パソコンで開いてください', mobileUnsupported:'Paper Library はスマートフォンでは利用できません。Chrome または Edge を使用して、パソコンからこのページを開いてください。',
    saved:'保存済み', saving:'保存中…', unsaved:'未保存', demoLib:'お試し（保存なし）',
    itemsCount:(n)=>`${n} 件`, itemsShown:(a,b)=>`${a} / ${b} 件を表示`, showMoreItems:(a,b)=>`さらに表示（${a} / ${b} 件）`,
    type:'種別', title:'タイトル', authorsField:'著者（1行に1人: 姓, 名）', journal:'雑誌 / 出版物', journalAbbr:'出版物略称',
    year:'年', volume:'巻', issue:'号', pages:'ページ', publisher:'出版社',
    doi:'DOI', arxiv:'arXiv ID', url:'URL', citekey:'引用キー', correspondingAuthors:'責任著者', tagsField:'タグ（カンマ区切り）',
    abstract:'アブストラクト', notes:'メモ', attachments:'添付ファイル', info:'書誌情報', organize:'整理',
    addPdf:'PDF を添付', openLink:'リンクを開く', openAttachment:'開く', copyCite:'引用をコピー', copyBib:'BibTeX をコピー',
    citationStyle:'引用スタイル', citationSettings:'引用設定', authorScope:'著者', authorScopeAll:'全著者', authorScopeFirst:'ファーストオーサーのみ', authorScopeCorresponding:'責任著者のみ', includeTitle:'タイトルを含める', includeUrl:'URL を含める',
    citePreview:'引用プレビュー', citePreviewHint:'現在の設定でコピーされる引用文', copy:'コピー',
    citations:'引用関係', citationsTitle:'引用関係', citationsFor:(t)=>`「${t}」の引用関係`,
    citeReferences:'引用している文献', citeCitedBy:'引用されている文献',
    citeLoading:'OpenAlex から取得中…', citeNotFound:'OpenAlex にこの文献が見つかりませんでした',
    citeRefNone:'参照文献リストがありません', citeCitedNone:'まだ引用されていません（または未収録）',
    citeCountRef:(n)=>`${n} 件`, citeCountCited:(shown,total)=>total>shown?`上位 ${shown} 件（全 ${total.toLocaleString()} 件）`:`${total} 件`,
    citeAdd:'追加', citeInLib:'登録済み', citeSource:'データ提供: OpenAlex',
    graphView:'相関図', graphTitle:(t)=>`「${t}」の関連論文マップ`,
    graphLoading1:'関連論文を収集中…', graphLoading2:'参照文献を照合中…', graphLoading3:'レイアウト計算中…',
    graphLegendSize:'大きさ = 被引用数', graphLegendColor:'色 = 出版年', graphLegendEdge:'線 = 参照文献の重なり',
    graphSeed:'種論文', graphNotFound:'OpenAlex にこの文献が見つかりませんでした',
    graphTooFew:'関連論文が十分に見つかりませんでした（参照・被引用が少ない可能性）',
    graphHint:'ドラッグで移動 / ホイールで拡大縮小 / クリックで詳細 / ダブルクリックでその論文の相関図へ',
    graphOpenPage:'ページを開く', graphRelayout:'再レイアウト', graphRefetch:'再取得',
    graphFit:'全体表示', graphLabels:'ラベル', graphRelToSeed:'種論文との関係',
    graphSharedRefs:(n)=>`共通参照 ${n} 件`, graphDirectCites:'この論文が種論文を引用', graphDirectCitedBy:'種論文がこの論文を引用',
    graphNearest:'近い論文', graphStats:(n,e)=>`${n} 論文 / ${e} 関係`,
    graphCached:(d)=>`キャッシュ表示（${d} 取得・API 呼び出しなし）`,
    graphPartial:(n)=>`関連論文 ${n} 件を取得できませんでした（表示が不完全な可能性があります）`,
    addedFromCite:'ライブラリに追加しました',
    searchTerms:'検索語', searchMode:'条件', searchField:'対象', fieldAll:'すべて', yearFrom:'年（開始）', yearTo:'年（終了）', clear:'クリア', apply:'適用',
    deleteItem:'ゴミ箱に移動',
    confirmDelete:(t)=>`「${t}」をゴミ箱に移動しますか？`,
    confirmDeleteForever:(t)=>`「${t}」を完全に削除しますか？添付ファイルも削除されます。`,
    confirmEmptyTrash:(n)=>`ゴミ箱内の ${n} 件の文献を完全に削除しますか？

添付ファイルも削除されます。
この操作は元に戻せません。`,
    trashInfoCount:(n)=>`ゴミ箱内の文献：${n}件`,
    trashEmptied:(n)=>`ゴミ箱内の文献を完全に削除しました（${n}件）`,
    confirmDeleteColl:(n)=>`コレクション「${n}」を削除しますか？（文献自体は削除されません）`,
    deleteCollTitle:'コレクションの削除',
    collDelKeepItems:'コレクションのみ削除', collDelTrashItems:'削除＋文献をゴミ箱へ', collTrashItemsKeepColl:'文献だけゴミ箱へ', restoreAll:'すべて復元',
    deleteCollHeadOne:(name)=>`コレクション「${name}」`,
    deleteCollHeadMany:(n)=>`選択中の ${n} 個のコレクション`,
    deleteCollItemCount:(n)=> n>0 ? `このコレクション内の文献：${n} 件（サブフォルダを含む）` : 'このコレクション内に文献はありません。',
    deleteCollExplain:'操作を選んでください：',
    deleteCollOptKeep:'「コレクションのみ削除」— フォルダを消し、文献はライブラリに残します。',
    deleteCollOptTrash:'「削除＋文献をゴミ箱へ」— フォルダを消し、その文献をゴミ箱へ移動します。',
    deleteCollOptItemsOnly:'「文献だけゴミ箱へ」— フォルダは残し、その文献だけをゴミ箱へ移動します。',
    deleteCollTrashWarn:'⚠ ゴミ箱へ移動した文献は、別のコレクションにも入っている場合すべてのコレクションから外れます。ゴミ箱からいつでも復元できます。',
    collDeleted:(n)=> n===1 ? 'コレクションを削除しました。' : `${n} 個のコレクションを削除しました。`,
    collItemsTrashed:(n)=>`${n} 件の文献をゴミ箱へ移動しました。`,
    itemsRestored:(n)=>`${n} 件の文献を復元しました。`,
    confirmRestoreAll:(n)=>`ゴミ箱内の ${n} 件の文献をすべて復元しますか？`,
    promptCollName:'コレクション名：', promptRename:'新しい名前：',
    fetching:'取得中…', fetchFail:'取得に失敗しました', added:'追加しました',
    searching:'CrossRef を検索中…', searchNoHit:'該当する文献が見つかりませんでした',
    searchResults:(n)=>`検索結果（${n} 件）— クリックで追加：`, addThis:'追加',
    dupDoi:'同じ DOI の文献が既に存在します', copied:'コピーしました',
    imported:(n,s)=>`${n} 件をインポートしました（${s} 件は重複のためスキップ）`,
    connectorImported:(n)=>`拡張機能から ${n} 件を取り込みました`,
    exported:(n)=>`${n} 件をエクスポートしました`,
    pdfAttached:'PDF を添付しました', pdfAutoAttached:'Open Access PDF を自動添付しました', attDeleted:'添付を削除しました',
    confirmDeleteAtt:(n)=>`添付「${n}」を削除しますか？`,
    invalidId:'DOI または arXiv ID を認識できませんでした',
    newItem:'（無題）', libLoadFail:'ライブラリの読み込みに失敗しました', invalidLibrary:'library.json の形式が正しくありません。現在のライブラリは変更していません。', saveFail:'保存に失敗しました', invalidExternalUrl:'安全ではないリンクのため開けません',
    permDenied:'フォルダへのアクセスが許可されませんでした',
    demoWarn:'お試しモード：データは保存されません',
    typeNames:{article:'雑誌論文', preprint:'プレプリント', book:'書籍', chapter:'書籍の章', inproceedings:'会議録', thesis:'学位論文', report:'レポート', web:'Webページ', misc:'その他'},
    categoryNames:{article:'Article', communication:'Communication', review:'Review', minireview:'Minireview', perspective:'Perspective', account:'Account', highlight:'Highlight', editorial:'Editorial'}, categoryNone:'（未設定）',
    changeFolderMenuTitle:'ライブラリの切り替え・新規作成', openChangeFolder:'別のフォルダを開く / 変更', newLibrary:'新規ライブラリを作成',
    newLibOverwriteConfirm:'このフォルダには既に library.json があります。上書きして新しい空のライブラリを作成しますか？（既存のデータは失われます）',
    unsavedWarn:'未保存の変更があります。',
  },
  en: {
    add:'Add', addByIdMenu:'From DOI / arXiv / URL / title (dialog)',
    addById:'DOI / arXiv', addManual:'Add manually', import:'Import', importKeywordsAsTags:'Import keywords as tags', export:'Export',
    expBibShown:'Shown items → BibTeX', expRisShown:'Shown items → RIS', expCsvShown:'Shown items → CSV', expJsonShown:'Shown items → JSON', expJson:'Whole library → JSON',
    searchPh:'Enter search keywords and press Enter', advancedSearch:'Advanced search', quickAddTitle:'Fetch and add this DOI / URL', addBoxPh:'Enter URL and press Enter', addMoreTitle:'Manual add / import', library:'Library', collections:'Collections', tags:'Tags',
    newCollection:'New collection', searchCollTip:'Search collections', collapseAllCollections:'Collapse all folders', expandAllCollections:'Expand all folders', searchCollPh:'Filter by name', searchCollEmpty:'No matching collections', allItems:'All items', starred:'Starred', starItem:'Star', unstarItem:'Unstar', myPublication:'My publications', markMyPublication:'Mark as my publication', unmarkMyPublication:'Remove from my publications', trash:'Trash', emptyTrash:'Delete forever', trashPermanentNote:'This cannot be undone.', restoreItem:'Restore', deleteForever:'Delete forever', deleteSingle:'Delete', colTrashDelete:'Actions', uncategorized:'Uncategorized',
    colStar:'Star', colPdf:'pdf', colTitle:'Title', colAuthors:'Authors', colYear:'Year', colJournal:'Publication', colCitedBy:'Cited by', colType:'Type', colCategory:'Category', colDoi:'DOI', colAdded:'Added',
    colTrashRestore:'Restore',
    columns:'Columns', colReset:'Reset to default', refreshCited:'Refresh citations', refreshCorresponding:'Refresh corresponding authors',
    refreshAll:'Update', refreshCategory:'Refresh category', refreshModeAutoAll:'Update all (all shown)', refreshOnlyLabel:'Update one field',
    refreshModeAuto:'Refresh automatically (all shown)', refreshModePick:'Select items to refresh',
    pickHintCited:'Click items to refresh their cited-by count (Shift to select a range)',
    pickHintCorresponding:'Click items to refresh their corresponding author (Shift to select a range)',
    pickHintAll:'Click items to update (Shift to select a range)',
    pickClearAll:'Clear all', pickConfirm:(n)=>`Refresh ${n} selected`, pickNone:'Select at least one item',
    updateThisItem:'Refresh', updateThisItemHint:'Refresh cited-by count, corresponding author and category for this item',
    pickDone:(n)=>`Started refreshing ${n} item(s)`,
    duplicateCandidates:'Duplicates', duplicateTitle:'Review duplicate candidates',
    duplicateSummary:(n)=>`${n} possible duplicate${n===1?'':'s'} found. Review them and remove only the extra added records if needed.`,
    duplicateNone:'No duplicate candidates found',
    duplicateExisting:'Existing', duplicateAdded:'Added', duplicatePossible:'Candidate',
    duplicateReasonDoi:'Matching DOI', duplicateReasonTitle:'Nearly identical title', duplicateReasonSimilar:'Similar title',
    duplicateOpenExisting:'Open existing', duplicateOpenAdded:'Open added', duplicateDeleteAdded:'Delete added', duplicateDeleteExisting:'Delete existing',
    duplicateReplaceExisting:'Replace existing', duplicateReplacedExisting:'Replaced the existing record with the newer data',
    duplicateSkipped:'Not added because the DOI already exists',
    emptyRecords:'Empty data', emptyRecordsTitle:'Review empty records',
    emptyRecordsSummary:(n)=>`${n} empty record${n===1?'':'s'} found. Records left blank after manual add can be removed here.`,
    emptyRecordsNone:'No empty records found',
    emptyRecordLabel:'Blank reference', emptyRecordAdded:(d)=>`Added: ${d || 'unknown'}`,
    emptyOpen:'Open', emptyDelete:'Delete', deleteAllEmpty:'Delete all',
    confirmDeleteEmpty:(n)=>`Delete ${n} empty record${n===1?'':'s'}?`,
    fixSuggestions:'Fixes', fixSuggestionsTitle:'Fix suggestions',
    fixSuggestionsSummary:(n)=>`${n} journal abbreviation fix suggestion${n===1?'':'s'} found.`,
    fixSuggestionsNone:'No fix suggestions found',
    fixAngewCurrent:'For 1998 onward, Angew. Chem. Int. Ed. is the current journal title',
    fixAngewTypo:'Engle. looks like a typo for Engl.',
    fixChemEurJPaperpile:'Paperpile-imported Chemistry is likely Chem. Eur. J.',
    fixChemCommunCamb:'Chem. Commun. (Camb.) can be normalized to Chem. Commun.',
    currentValue:'Current', suggestedValue:'Suggested', applyFix:'Apply', applyAllFixes:'Apply all',
    confirmApplyAllFixes:(n)=>`Apply ${n} fix suggestion${n===1?'':'s'}?`,
    journalDictTitle:'Journal name dictionary',
    journalDictOpen:'Open the journal name dictionary',
    journalDictIntro:'A dictionary that maps journal-name variants to the correct full name and abbreviation. Entries you add here feed the fix suggestions and journal-name display, and are stored in library.json (so they survive backups and moving to another computer). They take precedence over the built-in dictionary, so you can override the defaults too.',
    journalDictMatchPh:'Fetched form / alias (e.g. Adv. Sci. (Weinh.))',
    journalDictFullPh:'Full name (journal field, optional)',
    journalDictAbbrPh:'Abbreviation (display, optional)',
    journalDictColMatch:'Fetched form / alias', journalDictColAlias:'Variants / aliases', journalDictColFull:'Full name', journalDictColAbbr:'Abbreviation',
    journalDictAdd:'Add to dictionary', journalDictRemove:'Remove',
    journalDictCount:(u,b)=>`Yours ${u} · Built-in ${b}`,
    journalDictBuiltinPh:'Search the dictionary (name, abbreviation, variant)',
    journalDictBuiltinEmpty:'No matching entries.',
    journalDictEmpty:'No entries in the dictionary yet.',
    journalDictMatchReq:'Please enter the fetched form / alias.',
    journalDictNeedValue:'Please enter a full name or an abbreviation.',
    journalDictAdded:'Added to the dictionary.',
    journalDictUpdated:'Dictionary updated.',
    journalDictRemoved:'Removed from the dictionary.',
    wrapToggle:'Wrap', newSubCollection:'New subfolder', collColor:'Change color',
    collColorCustom:'Custom:', collColorDefault:'Default',
    filterContains:'Contains…', filterFrom:'From', filterTo:'To', filterClear:'Clear',
    filters:'Filters', viewMenu:'View', viewStyle:'View style', cardCols:(n)=>`${n} column${n===1?'':'s'}`, filterOptions:'Options', filterNoOptions:'No options', themeDark:'Dark', themeLight:'Light',
    authorDisplay:'Author display', authorNameStyle:'Name style', authorLimit:'Authors shown', authorSeparator:'Separator',
    authorMarkCorresponding:'Show * for corresponding authors',
    authorFamily:'Family only', authorInitial:'Family + initials', authorFull:'Full name',
    authorAll:'All authors', authorFirst3:'First 3 + et al.', authorFirst1:'First author + et al.',
    viewCards:'Card view', viewTable:'Table view', viewShelves:'Literature shelves', viewKanban:'Kanban',
    shelfRecent:'Recently added', shelfStarred:'Starred', shelfReading:'Reading', shelfPdf:'PDF attached', shelfCollections:'Collections',
    shelfItems:(n)=>`${n} item${n===1?'':'s'}`, shelfMore:(n)=>`${n} more`, shelfEmpty:'No papers on this shelf', shelfRecentDays:'days',
    readingStatus:'Reading status', statusUnread:'Unread', statusReading:'Reading', statusRead:'Read',
    kanbanHint:'Drag cards between columns to update their reading status',
    filterTitle:(c)=>`Filter by ${c}`,
    refreshingCited:'Fetching citation counts…', refreshedCited:(n)=>`Updated cited-by counts for ${n} item(s)`,
    refreshedCitedPartial:(n,f)=>`Updated ${n} item(s) (${f} failed — see the fetch log)`,
    refreshedCitedS2:(n,s)=>`Updated ${n} item(s) (${s} via Semantic Scholar)`,
    refreshingCorresponding:'Fetching corresponding authors…',
    refreshedCorresponding:(n)=>`Updated corresponding authors for ${n} item(s)`,
    refreshedCategory:(n)=>`Updated category for ${n} item(s)`,
    refreshedCorrespondingPartial:(n,f)=>`Updated corresponding authors for ${n} item(s) (${f} failed — see the fetch log)`,
    noCorrespondingTargets:'No corresponding-author targets to update',
    noCorrespondingFound:'No corresponding-author data in OpenAlex',
    allFresh:(n)=>`${n} item(s) already up to date (cached, no API calls)`,
    fetchLog:'Update log', fetchLogTitle:'Update log', logEmpty:'No update log entries',
    alerts:'Alerts', alertsNone:'No alerts',
    logRetry:'Retry', logClear:'Clear log', logRetryAll:'Retry all',
    logRunning:'Processing…', logUpdated:'Updated', logNoData:'No data', logSkipped:'Skipped',
    logKindCited:'Cited by', logKindCorresponding:'Corresponding', recentlyCheckedNoCorresponding:'Skipped: recently checked',
    oaBudgetErr:'OpenAlex daily request budget exhausted (resets at 00:00 UTC). Heavy use such as the graph view can exhaust it. Please retry later.',
    colHint:'Drag headers to reorder / drag the right edge to resize',
    sortColumn:'Sort by this column',
    emptyMsg:'No items. Add one via “+ DOI / arXiv”.',
    trashEmptyMsg:'Trash is empty.',
    noSelect:'Select an item',
    addByIdTitle:'Add from DOI / arXiv ID',
    addByIdHint:'Enter a DOI, an arXiv ID, a URL containing one, a paper title / publisher-page URL, or a bibliographic citation (e.g. Angew. Chem. Int. Ed. 2017, 56, 3270–3274.). Without an ID, CrossRef is searched.',
    cancel:'Cancel', close:'Close', expand:'Expand', collapse:'Collapse', fetchAdd:'Fetch & add', changelog:'Changelog', manual:'Manual',
    startSub:'A reference manager',
    openFolder:'Open / create a library folder',
    openFolderSub:'Pick a folder. If it contains library.json it is loaded; otherwise a new library is created.',
    openLast:'Open the last library', changeFolder:'Change working folder',
    demoMode:'Trial mode (no saving)', demoModeSub:'Runs in memory only. Data is lost when the tab closes.',
    fsWarn:'⚠ This browser does not support the File System Access API. Please use Chrome / Edge.',
    mobileTitle:'Open on a computer', mobileUnsupported:'Paper Library is not available on smartphones. Open this page on a computer using Chrome or Edge.',
    saved:'Saved', saving:'Saving…', unsaved:'Unsaved', demoLib:'Trial (not saved)',
    itemsCount:(n)=>`${n} item${n===1?'':'s'}`, itemsShown:(a,b)=>`Showing ${a} of ${b}`, showMoreItems:(a,b)=>`Show more (${a} of ${b})`,
    type:'Type', title:'Title', authorsField:'Authors (one per line: Family, Given)', journal:'Journal / Publication', journalAbbr:'Publication abbreviation',
    year:'Year', volume:'Volume', issue:'Issue', pages:'Pages', publisher:'Publisher',
    doi:'DOI', arxiv:'arXiv ID', url:'URL', citekey:'Citation key', correspondingAuthors:'Corresponding authors', tagsField:'Tags (comma-separated)',
    abstract:'Abstract', notes:'Notes', attachments:'Attachments', info:'Bibliographic info', organize:'Organize',
    addPdf:'Attach PDF', openLink:'Open link', openAttachment:'Open', copyCite:'Copy citation', copyBib:'Copy BibTeX',
    citationStyle:'Citation style', citationSettings:'Citation settings', authorScope:'Authors', authorScopeAll:'All authors', authorScopeFirst:'First author only', authorScopeCorresponding:'Corresponding only', includeTitle:'Include title', includeUrl:'Include URL',
    citePreview:'Citation preview', citePreviewHint:'The citation that will be copied with the current settings', copy:'Copy',
    citations:'Citations', citationsTitle:'Citation relations', citationsFor:(t)=>`Citation relations for “${t}”`,
    citeReferences:'References (this cites)', citeCitedBy:'Cited by',
    citeLoading:'Fetching from OpenAlex…', citeNotFound:'This item was not found in OpenAlex',
    citeRefNone:'No reference list available', citeCitedNone:'Not cited yet (or not indexed)',
    citeCountRef:(n)=>`${n}`, citeCountCited:(shown,total)=>total>shown?`top ${shown} of ${total.toLocaleString()}`:`${total}`,
    citeAdd:'Add', citeInLib:'In library', citeSource:'Data: OpenAlex',
    graphView:'Graph', graphTitle:(t)=>`Related-papers map for “${t}”`,
    graphLoading1:'Collecting related papers…', graphLoading2:'Matching reference lists…', graphLoading3:'Computing layout…',
    graphLegendSize:'Size = citations', graphLegendColor:'Color = year', graphLegendEdge:'Edge = shared references',
    graphSeed:'Seed paper', graphNotFound:'This item was not found in OpenAlex',
    graphTooFew:'Not enough related papers found (few references / citations)',
    graphHint:'Drag to pan / wheel to zoom / click a node for details / double-click to map that paper',
    graphOpenPage:'Open page', graphRelayout:'Re-layout', graphRefetch:'Refetch',
    graphFit:'Fit', graphLabels:'Labels', graphRelToSeed:'Relation to seed',
    graphSharedRefs:(n)=>`${n} shared references`, graphDirectCites:'This paper cites the seed', graphDirectCitedBy:'The seed cites this paper',
    graphNearest:'Closest papers', graphStats:(n,e)=>`${n} papers / ${e} links`,
    graphCached:(d)=>`Cached (fetched ${d}, no API calls)`,
    graphPartial:(n)=>`Failed to fetch ${n} related papers (the map may be incomplete)`,
    addedFromCite:'Added to library',
    searchTerms:'Search terms', searchMode:'Mode', searchField:'Field', fieldAll:'All', yearFrom:'Year from', yearTo:'Year to', clear:'Clear', apply:'Apply',
    deleteItem:'Move to trash',
    confirmDelete:(t)=>`Move “${t}” to Trash?`,
    confirmDeleteForever:(t)=>`Permanently delete “${t}”? Its attachments will also be deleted.`,
    confirmEmptyTrash:(n)=>`Permanently delete ${n} reference${n===1?'':'s'} in Trash?

Attachments will also be deleted.
This cannot be undone.`,
    trashInfoCount:(n)=>`${n} reference${n===1?'':'s'} in Trash`,
    trashEmptied:(n)=>`Permanently deleted ${n} reference${n===1?'':'s'} from Trash`,
    confirmDeleteColl:(n)=>`Delete collection “${n}”? (Items themselves are kept.)`,
    deleteCollTitle:'Delete collection',
    collDelKeepItems:'Delete collection only', collDelTrashItems:'Delete + items to Trash', collTrashItemsKeepColl:'Items to Trash only', restoreAll:'Restore all',
    deleteCollHeadOne:(name)=>`Collection “${name}”`,
    deleteCollHeadMany:(n)=>`${n} selected collections`,
    deleteCollItemCount:(n)=> n>0 ? `References in this collection: ${n} (including subfolders)` : 'This collection contains no references.',
    deleteCollExplain:'Choose an action:',
    deleteCollOptKeep:'“Delete collection only” — removes the folder; references stay in your library.',
    deleteCollOptTrash:'“Delete + items to Trash” — removes the folder and moves its references to Trash.',
    deleteCollOptItemsOnly:'“Items to Trash only” — keeps the folder and moves just its references to Trash.',
    deleteCollTrashWarn:'⚠ References moved to Trash are removed from every collection they belong to. You can restore them from Trash at any time.',
    collDeleted:(n)=> n===1 ? 'Collection deleted.' : `${n} collections deleted.`,
    collItemsTrashed:(n)=>`Moved ${n} reference${n===1?'':'s'} to Trash.`,
    itemsRestored:(n)=>`Restored ${n} reference${n===1?'':'s'}.`,
    confirmRestoreAll:(n)=>`Restore all ${n} reference${n===1?'':'s'} in Trash?`,
    promptCollName:'Collection name:', promptRename:'New name:',
    fetching:'Fetching…', fetchFail:'Fetch failed', added:'Added',
    searching:'Searching CrossRef…', searchNoHit:'No matching item found',
    searchResults:(n)=>`Search results (${n}) — click to add:`, addThis:'Add',
    dupDoi:'An item with the same DOI already exists', copied:'Copied',
    imported:(n,s)=>`Imported ${n} item(s) (${s} duplicate(s) skipped)`,
    connectorImported:(n)=>`Imported ${n} item(s) from the browser extension`,
    exported:(n)=>`Exported ${n} item(s)`,
    pdfAttached:'PDF attached', pdfAutoAttached:'Open Access PDF attached', attDeleted:'Attachment deleted',
    confirmDeleteAtt:(n)=>`Delete attachment “${n}”?`,
    invalidId:'Could not recognize a DOI or arXiv ID',
    newItem:'(untitled)', libLoadFail:'Failed to load the library', invalidLibrary:'library.json has an invalid format. The current library was not changed.', saveFail:'Save failed', invalidExternalUrl:'This link cannot be opened safely',
    permDenied:'Folder access was not granted',
    demoWarn:'Trial mode: data will not be saved',
    typeNames:{article:'Journal article', preprint:'Preprint', book:'Book', chapter:'Book chapter', inproceedings:'Conference paper', thesis:'Thesis', report:'Report', web:'Web page', misc:'Misc'},
    categoryNames:{article:'Article', communication:'Communication', review:'Review', minireview:'Minireview', perspective:'Perspective', account:'Account', highlight:'Highlight', editorial:'Editorial'}, categoryNone:'(none)',
    changeFolderMenuTitle:'Switch / create library', openChangeFolder:'Open / change folder', newLibrary:'Create new library',
    newLibOverwriteConfirm:'This folder already contains a library.json. Overwrite it and create a new empty library? (Existing data will be lost.)',
    unsavedWarn:'There are unsaved changes.',
  },
};


/* Advanced-search icon UI candidates */
const ADV_SEARCH_UI = {
  '01': { icon:'search', title:'01：標準的な虫眼鏡アイコン' },
  '02': { icon:'funnel', title:'02：フィルターらしいファネル' },
  '03': { icon:'sliders', title:'03：条件調整らしいスライダー' },
  '04': { icon:'search', title:'04：検索＋状態ドット' },
  '05': { icon:'zoom', title:'05：強調された検索アイコン' },
  '06': { icon:'funnel', title:'06：控えめな光彩つきフィルター' },
  '07': { icon:'sliders', title:'07：最小限のフラットアイコン' },
  '08': { icon:'sliders', title:'08：ADVバッジつき' },
};
let advSearchStyle = '07';
function applyAdvSearchStyle(style){
  style = ADV_SEARCH_UI[style] ? style : '07';
  advSearchStyle = style;
  document.body.classList.remove(...Object.keys(ADV_SEARCH_UI).map(k=>'advSearchStyle-'+k));
  document.body.classList.add('advSearchStyle-'+style);
  const btn = document.getElementById('btnAdvancedSearch');
  if(btn){
    const label = btn.querySelector('[data-i18n="advancedSearch"]') || document.createElement('span');
    label.dataset.i18n = 'advancedSearch';
    label.textContent = t ? t('advancedSearch') : '詳細検索';
    btn.innerHTML = ic(ADV_SEARCH_UI[style].icon) + label.outerHTML;
    btn.title = '詳細検索 / ' + ADV_SEARCH_UI[style].title;
    btn.setAttribute('aria-label', btn.title);
  }
  document.querySelectorAll('#advUiPanel [data-adv-ui]').forEach(b=>b.classList.toggle('active', b.dataset.advUi===style));
}
function initAdvSearchStyleChooser(){
  advSearchStyle = '07';
  applyAdvSearchStyle('07');
}

let lang = localStorage.getItem('refshelf.lang') || 'ja';
let theme = localStorage.getItem('refshelf.theme') || 'light';
function t(key){ const v = I18N[lang][key]; return v !== undefined ? v : key; }
function applyI18n(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ el.placeholder = t(el.dataset.i18nPh); });
  const addBoxEl = document.getElementById('addBox');
  const searchBoxEl = document.getElementById('searchBox');
  const addWrapEl = document.getElementById('addWrap');
  const searchWrapEl = document.getElementById('searchWrap');
  if(addBoxEl && addWrapEl) addWrapEl.dataset.placeholder = addBoxEl.placeholder;
  if(searchBoxEl && searchWrapEl) searchWrapEl.dataset.placeholder = searchBoxEl.placeholder;
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{ el.title = t(el.dataset.i18nTitle); });
  document.getElementById('btnLang').textContent = lang==='ja' ? 'EN' : '日本語';
  document.getElementById('startLang').textContent = lang==='ja' ? 'EN' : '日本語';
  updateThemeButton();
  updateListViewButton();
  renderIcons();
  if(typeof applyAdvSearchStyle === 'function') applyAdvSearchStyle(advSearchStyle);
}
function toggleLang(){
  lang = lang==='ja' ? 'en' : 'ja';
  localStorage.setItem('refshelf.lang', lang);
  applyI18n(); renderAll(); updateSaveDot();
}
function updateThemeButton(){
  const btn = document.getElementById('btnTheme');
  if(!btn) return;
  btn.innerHTML = `${ic(theme==='dark'?'sun':'moon')}<span id="themeLabel">${esc(theme==='dark' ? t('themeLight') : t('themeDark'))}</span>`;
}
function applyTheme(){
  document.body.classList.toggle('dark', theme==='dark');
  updateThemeButton();
}
function toggleTheme(){
  theme = theme==='dark' ? 'light' : 'dark';
  localStorage.setItem('refshelf.theme', theme);
  applyTheme();
  if(backend){ renderSidebar(); renderList({skipBadges:true}); renderDetail(); }
}

/* ---------------------------------------------------------------
   Utilities
---------------------------------------------------------------- */
const $ = (sel)=>document.querySelector(sel);
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function showToast(msg, isErr){
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'show' + (isErr ? ' err' : '');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>{ el.className=''; }, 2600);
}
function download(filename, text, mime){
  const blob = new Blob([text], {type: mime || 'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
}
function openExternalLink(value){
  try{
    const url = new URL(String(value||'').trim());
    if(url.protocol!=='https:' && url.protocol!=='http:') throw new Error('unsupported protocol');
    window.open(url.href, '_blank', 'noopener,noreferrer');
  }catch(e){
    showToast(t('invalidExternalUrl'), true);
  }
}
function authorsToText(authors){ return (authors||[]).map(a=>a.given ? `${a.family}, ${a.given}` : a.family).join('\n'); }
function textToAuthors(text){
  return text.split('\n').map(s=>s.trim()).filter(Boolean).map(line=>{
    const m = line.split(',');
    return { family:(m[0]||'').trim(), given:(m.slice(1).join(',')||'').trim() };
  });
}
function authorsShort(authors){
  const a = authors||[];
  if(!a.length) return '';
  const names = a.map(x=>x.family || x.given);
  return names.join('; ');
}
let authorDisplayPrefs;
try{ authorDisplayPrefs = JSON.parse(localStorage.getItem('refshelf.authorDisplay') || '{}'); }
catch(e){ authorDisplayPrefs = {}; }
authorDisplayPrefs = Object.assign({style:'family', limit:'all', sep:'; ', markCorresponding:true}, authorDisplayPrefs);
function authorInitials(given){
  return String(given||'').split(/[\s.]+/).filter(Boolean).map(x=>x[0].toUpperCase()+'.').join(' ');
}
function normalizeAuthorToken(s){
  return String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
}
function authorInitialKey(given){
  return String(given||'').split(/[\s.\-]+/).filter(Boolean).map(x=>normalizeAuthorToken(x).charAt(0)).join('');
}
function parseAuthorListText(text){
  return String(text||'').split(/[;\n]+/).map(s=>s.trim()).filter(Boolean).map(name=>{
    if(name.includes(',')){
      const p = name.split(',');
      return {family:(p[0]||'').trim(), given:p.slice(1).join(',').trim()};
    }
    const p = name.split(/\s+/).filter(Boolean);
    return {family:p.pop()||'', given:p.join(' ')};
  });
}
function authorMatchesCorresponding(a, corrAuthors){
  if(!a || !corrAuthors || !corrAuthors.length) return false;
  const af = normalizeAuthorToken(a.family || a.given);
  const ag = normalizeAuthorToken(a.given);
  const ai = authorInitialKey(a.given);
  return corrAuthors.some(c=>{
    const cf = normalizeAuthorToken(c.family || c.given);
    const cg = normalizeAuthorToken(c.given);
    const ci = authorInitialKey(c.given);
    if(!af || !cf || af !== cf) return false;
    if(!cg || !ag) return true;
    return ag === cg || ai === ci || (!!ai && cg.startsWith(ai)) || (!!ci && ag.startsWith(ci));
  });
}
function formatTableAuthor(a, corrAuthors){
  let out;
  if(authorDisplayPrefs.style==='family') out = a.family || a.given || '';
  else if(authorDisplayPrefs.style==='initial'){
    const ini = authorInitials(a.given);
    out = ini && a.family ? `${a.family}, ${ini}` : (a.family || ini || a.given || '');
  }else{
    out = a.given ? `${a.family}, ${a.given}` : (a.family || a.given || '');
  }
  if(out && authorDisplayPrefs.markCorresponding && authorMatchesCorresponding(a, corrAuthors)) out += '*';
  return out;
}
function tableAuthorsText(authors, correspondingAuthors){
  const corrAuthors = authorDisplayPrefs.markCorresponding ? parseAuthorListText(correspondingAuthors) : [];
  let list = (authors||[]).map(a=>formatTableAuthor(a, corrAuthors)).filter(Boolean);
  if(authorDisplayPrefs.limit==='first1' && list.length>1) list = [list[0], 'et al.'];
  else if(authorDisplayPrefs.limit==='first3' && list.length>3) list = list.slice(0,3).concat('et al.');
  return list.join(authorDisplayPrefs.sep || '; ');
}
function textAuthorsForTable(text){
  return tableAuthorsText(parseAuthorListText(text), '');
}
function normalizeRange(s){ return String(s||'').replace(/\s*[-–—]+\s*/g, '–'); }
function normalizeJournalKey(s){
  return String(s||'')
    .toLowerCase()
    .replace(/[–—-]/g, ' ')
    .replace(/&/g, 'and')
    .replace(/\bthe\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const JOURNAL_ABBR = new Map([
  ['chemrxiv','ChemRxiv'],
  ['chempluschem','ChemPlusChem'],
  ['chem plus chem','ChemPlusChem'],
  ['journal of the american chemical society','J. Am. Chem. Soc.'],
  ['nature','Nature'],
  ['nature communications','Nat. Commun.'],
  ['nat commun','Nat. Commun.'],
  ['nature materials','Nat. Mater.'],
  ['nature chemistry','Nat. Chem.'],
  ['nature catalysis','Nat. Catal.'],
  ['nature chemical biology','Nat. Chem. Biol.'],
  ['nature structural & molecular biology','Nat. Struct. Mol. Biol.'],
  ['nature structural and molecular biology','Nat. Struct. Mol. Biol.'],
  ['nature biotechnology','Nat. Biotechnol.'],
  ['nature methods','Nat. Methods'],
  ['nature protocols','Nat. Protoc.'],
  ['nature genetics','Nat. Genet.'],
  ['nature cell biology','Nat. Cell Biol.'],
  ['nature medicine','Nat. Med.'],
  ['nature microbiology','Nat. Microbiol.'],
  ['nature plants','Nat. Plants'],
  ['nature ecology & evolution','Nat. Ecol. Evol.'],
  ['nature ecology and evolution','Nat. Ecol. Evol.'],
  ['nature sustainability','Nat. Sustain.'],
  ['nature nanotechnology','Nat. Nanotechnol.'],
  ['nature photonics','Nat. Photonics'],
  ['nature physics','Nat. Phys.'],
  ['nature electronics','Nat. Electron.'],
  ['nature energy','Nat. Energy'],
  ['nature biomedical engineering','Nat. Biomed. Eng.'],
  ['nature food','Nat. Food'],
  ['nature water','Nat. Water'],
  ['nature synthesis','Nat. Synth.'],
  ['nature reviews chemistry','Nat. Rev. Chem.'],
  ['nature reviews materials','Nat. Rev. Mater.'],
  ['communications chemistry','Commun. Chem.'],
  ['communications biology','Commun. Biol.'],
  ['communications materials','Commun. Mater.'],
  ['communications earth & environment','Commun. Earth Environ.'],
  ['communications earth and environment','Commun. Earth Environ.'],
  ['scientific reports','Sci. Rep.'],
  ['npj computational materials','npj Comput. Mater.'],
  ['proceedings of the national academy of sciences','Proc. Natl. Acad. Sci. U.S.A.'],
  ['proceedings of the national academy of sciences of the united states of america','Proc. Natl. Acad. Sci. U.S.A.'],
  ['pnas','Proc. Natl. Acad. Sci. U.S.A.'],
  ['angewandte chemie international edition','Angew. Chem. Int. Ed.'],
  ['chemistry - a european journal','Chem. Eur. J.'],
  ['chemistry a european journal','Chem. Eur. J.'],
  ['chemistry a european j','Chem. Eur. J.'],
  ['chemistry','Chem. Eur. J.'],
  ['chemical science','Chem. Sci.'],
  ['chemical communications','Chem. Commun.'],
  ['bulletin of the chemical society of japan','Bull. Chem. Soc. Jpn.'],
  ['bull chem soc jpn','Bull. Chem. Soc. Jpn.'],
  ['bcsj','Bull. Chem. Soc. Jpn.'],
  ['chem commun camb','Chem. Commun.'],
  ['chem commun cambridge','Chem. Commun.'],
  ['chemical communications camb','Chem. Commun.'],
  ['chemical communications cambridge','Chem. Commun.'],
  ['chemistry letters','Chem. Lett.'],
  ['journal of materials chemistry a','J. Mater. Chem. A'],
  ['journal of materials chemistry b','J. Mater. Chem. B'],
  ['journal of materials chemistry c','J. Mater. Chem. C'],
  ['energy & environmental science','Energy Environ. Sci.'],
  ['acs catalysis','ACS Catal.'],
  ['acs energy letters','ACS Energy Lett.'],
  ['acs materials letters','ACS Mater. Lett.'],
  ['acs nano','ACS Nano'],
  ['nano letters','Nano Lett.'],
  ['chemistry of materials','Chem. Mater.'],
  ['inorganic chemistry','Inorg. Chem.'],
  ['organic letters','Org. Lett.'],
  ['the journal of organic chemistry','J. Org. Chem.'],
  ['journal of organic chemistry','J. Org. Chem.'],
  ['organometallics','Organometallics'],
  ['dalton transactions','Dalton Trans.'],
  ['physical chemistry chemical physics','Phys. Chem. Chem. Phys.'],
  ['journal of physical chemistry letters','J. Phys. Chem. Lett.'],
  ['the journal of physical chemistry letters','J. Phys. Chem. Lett.'],
  ['journal of physical chemistry c','J. Phys. Chem. C'],
  ['the journal of physical chemistry c','J. Phys. Chem. C'],
  ['journal of physical chemistry b','J. Phys. Chem. B'],
  ['the journal of physical chemistry b','J. Phys. Chem. B'],
  ['journal of chemical physics','J. Chem. Phys.'],
  ['the journal of chemical physics','J. Chem. Phys.'],
  ['advanced materials','Adv. Mater.'],
  ['advanced energy materials','Adv. Energy Mater.'],
  ['advanced functional materials','Adv. Funct. Mater.'],
  ['advanced science','Adv. Sci.'],
  ['materials horizons','Mater. Horiz.'],
  ['small','Small'],

  ['science','Science'],
  ['cell','Cell'],
  ['molecular cell','Mol. Cell'],
  ['current biology','Curr. Biol.'],
  ['developmental cell','Dev. Cell'],
  ['accounts of chemical research','Acc. Chem. Res.'],
  ['chemical reviews','Chem. Rev.'],
  ['acs central science','ACS Cent. Sci.'],
  ['acs chemical biology','ACS Chem. Biol.'],
  ['acs sensors','ACS Sens.'],
  ['macromolecules','Macromolecules'],
  ['biochemistry','Biochemistry'],
  ['analytical chemistry','Anal. Chem.'],
  ['journal of the american society for mass spectrometry','J. Am. Soc. Mass Spectrom.'],
  ['organic chemistry frontiers','Org. Chem. Front.'],
  ['materials chemistry frontiers','Mater. Chem. Front.'],
  ['nanoscale','Nanoscale'],
  ['green chemistry','Green Chem.'],
  ['faraday discussions','Faraday Discuss.'],
  ['angewandte chemie','Angew. Chem.'],
  ['advanced optical materials','Adv. Opt. Mater.'],
  ['advanced healthcare materials','Adv. Healthc. Mater.'],
  ['advanced sustainable systems','Adv. Sustainable Syst.'],
  ['chemistry an asian journal','Chem. Asian J.'],
  ['european journal of organic chemistry','Eur. J. Org. Chem.'],
  ['european journal of inorganic chemistry','Eur. J. Inorg. Chem.'],
  ['chem','Chem'],
  ['joule','Joule'],
  ['matter','Matter'],
  ['trends in chemistry','Trends Chem.'],
  ['tetrahedron','Tetrahedron'],
  ['tetrahedron letters','Tetrahedron Lett.'],
  ['bioorganic & medicinal chemistry','Bioorg. Med. Chem.'],
  ['bioorganic and medicinal chemistry','Bioorg. Med. Chem.'],
  ['bioorganic & medicinal chemistry letters','Bioorg. Med. Chem. Lett.'],
  ['bioorganic and medicinal chemistry letters','Bioorg. Med. Chem. Lett.'],
  ['physical review letters','Phys. Rev. Lett.'],
  ['physical review b','Phys. Rev. B'],
  ['chemical physics letters','Chem. Phys. Lett.'],
  ['computational and theoretical chemistry','Comput. Theor. Chem.'],
  ['journal of computational chemistry','J. Comput. Chem.'],
  ['wiley interdisciplinary reviews computational molecular science','WIREs Comput. Mol. Sci.'],
  ['the plant cell','Plant Cell'],
  ['plant cell','Plant Cell'],
  ['plant physiology','Plant Physiol.'],
  ['plant journal','Plant J.'],
  ['the plant journal','Plant J.'],
  ['new phytologist','New Phytol.'],
  ['plant and cell physiology','Plant Cell Physiol.'],
  ['journal of experimental botany','J. Exp. Bot.'],
  ['molecular plant','Mol. Plant'],
  ['annual review of plant biology','Annu. Rev. Plant Biol.'],
  ['current opinion in plant biology','Curr. Opin. Plant Biol.'],
  ['elife','eLife'],
  ['plos biology','PLOS Biol.'],
  ['plos one','PLOS One'],
  ['bmc biology','BMC Biol.'],
  ['frontiers in plant science','Front. Plant Sci.'],
  // Journals that often arrive already abbreviated, plus OpenAlex/Weinheim
  // container-title variants. Keyed by the full name so mappedJournalAbbr(formal)
  // resolves for the "Fixes" panel, and by messy variants to clean up the display.
  ['advanced materials technologies','Adv. Mater. Technol.'],
  ['adv sci weinh','Adv. Sci.'],
  ['angew chem weinheim bergstr ger','Angew. Chem.'],
  ['asian journal of organic chemistry','Asian J. Org. Chem.'],
  ['berichte der deutschen chemischen gesellschaft','Ber. Dtsch. Chem. Ges.'],
  ['cell reports physical science','Cell Rep. Phys. Sci.'],
  ['the chemical record','Chem. Rec.'],
  ['chemical record','Chem. Rec.'],
  ['chemical society reviews','Chem. Soc. Rev.'],
  ['commun chem','Commun. Chem.'],
  ['chemphyschem','ChemPhysChem'],
  ['frontiers in chemistry','Front. Chem.'],
  ['front chem','Front. Chem.'],
  ['helvetica chimica acta','Helv. Chim. Acta'],
  ['journal of macromolecular science part a pure and applied chemistry','J. Macromol. Sci. Part A'],
  ['j macromol sci part a pure appl chem','J. Macromol. Sci. Part A'],
  ['journal of materials chemistry','J. Mater. Chem.'],
  ['j mater chem a mater energy sustain','J. Mater. Chem. A'],
  ['journal of medicinal chemistry','J. Med. Chem.'],
  ['the journal of physical chemistry a','J. Phys. Chem. A'],
  ['journal of physical chemistry a','J. Phys. Chem. A'],
  ['j phys chem c nanomater interfaces','J. Phys. Chem. C'],
  ['journal of physical organic chemistry','J. Phys. Org. Chem.'],
  ['journal of polymer science part c polymer symposia','J. Polym. Sci. C Polym. Symp.'],
  ['new journal of chemistry','New J. Chem.'],
  ['organic and biomolecular chemistry','Org. Biomol. Chem.'],
  ['organic process research and development','Org. Process Res. Dev.'],
  ['photochemical and photobiological sciences','Photochem. Photobiol. Sci.'],
  ['physical review','Phys. Rev.'],
  ['polymer chemistry','Polym. Chem.'],
  ['polymer journal','Polym. J.'],
  ['proceedings of the royal society of london','Proc. R. Soc. Lond.'],
  ['proceedings of the royal society of london series a','Proc. R. Soc. London Ser. A'],
  ['rsc advances','RSC Adv.'],
  ['solar energy materials and solar cells','Sol. Energy Mater. Sol. Cells'],
  ['structural chemistry','Struct. Chem.'],
  ['synthetic metals','Synth. Met.'],
  ['topics in current chemistry','Top. Curr. Chem.'],
  ['top curr chem j','Top. Curr. Chem.'],]);
const JOURNAL_ABBR_NORMALIZED = new Map(Array.from(JOURNAL_ABBR, ([k,v])=>[normalizeJournalKey(k), v]));
const JOURNAL_FULL_NAMES = new Map([
  ['chemrxiv','ChemRxiv'],
  ['chempluschem','ChemPlusChem'],
  ['chem plus chem','ChemPlusChem'],
  ['chemistry','Chemistry – A European Journal'],
  ['chemistry a european journal','Chemistry – A European Journal'],
  ['chem eur j','Chemistry – A European Journal'],
  ['chemical communications','Chemical Communications'],
  ['bulletin of the chemical society of japan','Bulletin of the Chemical Society of Japan'],
  ['bull chem soc jpn','Bulletin of the Chemical Society of Japan'],
  ['bcsj','Bulletin of the Chemical Society of Japan'],
  ['chem commun','Chemical Communications'],
  ['chem commun camb','Chemical Communications'],
  ['chem commun cambridge','Chemical Communications'],
  ['journal of the american chemical society','Journal of the American Chemical Society'],
  ['j am chem soc','Journal of the American Chemical Society'],
  ['european journal of organic chemistry','European Journal of Organic Chemistry'],
  ['european j org chem','European Journal of Organic Chemistry'],
  ['eur j org chem','European Journal of Organic Chemistry'],
  ['european journal of inorganic chemistry','European Journal of Inorganic Chemistry'],
  ['european j inorg chem','European Journal of Inorganic Chemistry'],
  ['eur j inorg chem','European Journal of Inorganic Chemistry'],
  ['angewandte chemie international edition','Angewandte Chemie International Edition'],
  ['angew chem int ed','Angewandte Chemie International Edition'],
  ['angew chem int ed engl','Angewandte Chemie International Edition'],
  ['angewandte chemie','Angewandte Chemie'],
  ['chem sci','Chemical Science'],
  ['chemical science','Chemical Science'],
  ['organic letters','Organic Letters'],
  ['org lett','Organic Letters'],
  ['journal of organic chemistry','The Journal of Organic Chemistry'],
  ['j org chem','The Journal of Organic Chemistry'],
  ['chemistry of materials','Chemistry of Materials'],
  ['chem mater','Chemistry of Materials'],
  ['inorganic chemistry','Inorganic Chemistry'],
  ['inorg chem','Inorganic Chemistry'],
  ['accounts of chemical research','Accounts of Chemical Research'],
  ['acc chem res','Accounts of Chemical Research'],
  ['chemical reviews','Chemical Reviews'],
  ['chem rev','Chemical Reviews'],
  ['nature communications','Nature Communications'],
  ['nat commun','Nature Communications'],
  ['nature chemistry','Nature Chemistry'],
  ['nat chem','Nature Chemistry'],
  ['proceedings of the national academy of sciences','Proceedings of the National Academy of Sciences of the United States of America'],
  ['proc natl acad sci u s a','Proceedings of the National Academy of Sciences of the United States of America'],
  // Journals that arrive already abbreviated: keyed by the abbreviation (and its
  // messy OpenAlex/Weinheim variants) so the "Fixes" panel can restore the full
  // 雑誌 name. journalDisplay still shows the abbreviation via JOURNAL_ABBR.
  ['adv funct mater','Advanced Functional Materials'],
  ['adv mater','Advanced Materials'],
  ['adv mater technol','Advanced Materials Technologies'],
  ['adv sci','Advanced Science'],
  ['adv sci weinh','Advanced Science'],
  ['angew chem','Angewandte Chemie'],
  ['angew chem weinheim bergstr ger','Angewandte Chemie'],
  ['asian j org chem','Asian Journal of Organic Chemistry'],
  ['ber dtsch chem ges','Berichte der deutschen chemischen Gesellschaft'],
  ['cell rep phys sci','Cell Reports Physical Science'],
  ['chem lett','Chemistry Letters'],
  ['chem phys lett','Chemical Physics Letters'],
  ['chem rec','The Chemical Record'],
  ['chem soc rev','Chemical Society Reviews'],
  ['commun chem','Communications Chemistry'],
  ['dalton trans','Dalton Transactions'],
  ['front chem','Frontiers in Chemistry'],
  ['helv chim acta','Helvetica Chimica Acta'],
  ['j macromol sci part a pure appl chem','Journal of Macromolecular Science, Part A: Pure and Applied Chemistry'],
  ['j comput chem','Journal of Computational Chemistry'],
  ['j mater chem','Journal of Materials Chemistry'],
  ['j mater chem a mater energy sustain','Journal of Materials Chemistry A'],
  ['j med chem','Journal of Medicinal Chemistry'],
  ['j phys chem a','The Journal of Physical Chemistry A'],
  ['j phys chem b','The Journal of Physical Chemistry B'],
  ['j phys chem c','The Journal of Physical Chemistry C'],
  ['j phys chem c nanomater interfaces','The Journal of Physical Chemistry C'],
  ['j phys chem lett','The Journal of Physical Chemistry Letters'],
  ['j phys org chem','Journal of Physical Organic Chemistry'],
  ['j polym sci c polym symp','Journal of Polymer Science Part C: Polymer Symposia'],
  ['new j chem','New Journal of Chemistry'],
  ['org biomol chem','Organic & Biomolecular Chemistry'],
  ['org chem front','Organic Chemistry Frontiers'],
  ['org process res dev','Organic Process Research & Development'],
  ['photochem photobiol sci','Photochemical & Photobiological Sciences'],
  ['phys chem chem phys','Physical Chemistry Chemical Physics'],
  ['phys rev','Physical Review'],
  ['phys rev lett','Physical Review Letters'],
  ['polym chem','Polymer Chemistry'],
  ['polym j','Polymer Journal'],
  ['proc r soc lond','Proceedings of the Royal Society of London'],
  ['proc r soc london ser a','Proceedings of the Royal Society of London, Series A'],
  ['rsc adv','RSC Advances'],
  ['sol energy mater sol cells','Solar Energy Materials and Solar Cells'],
  ['struct chem','Structural Chemistry'],
  ['synth met','Synthetic Metals'],
  ['tetrahedron lett','Tetrahedron Letters'],
  ['top curr chem j','Topics in Current Chemistry'],
  ['top curr chem','Topics in Current Chemistry'],
  ['chemphyschem','ChemPhysChem'],
  // Full names for the remaining built-in abbreviations, so every entry in the
  // built-in dictionary shows a proper journal name (keyed by the abbreviation).
  ['acs catal','ACS Catalysis'],
  ['acs cent sci','ACS Central Science'],
  ['acs chem biol','ACS Chemical Biology'],
  ['acs energy lett','ACS Energy Letters'],
  ['acs mater lett','ACS Materials Letters'],
  ['acs nano','ACS Nano'],
  ['acs sens','ACS Sensors'],
  ['adv energy mater','Advanced Energy Materials'],
  ['adv healthc mater','Advanced Healthcare Materials'],
  ['adv opt mater','Advanced Optical Materials'],
  ['adv sustainable syst','Advanced Sustainable Systems'],
  ['anal chem','Analytical Chemistry'],
  ['annu rev plant biol','Annual Review of Plant Biology'],
  ['biochemistry','Biochemistry'],
  ['bioorg med chem','Bioorganic & Medicinal Chemistry'],
  ['bioorg med chem lett','Bioorganic & Medicinal Chemistry Letters'],
  ['bmc biol','BMC Biology'],
  ['cell','Cell'],
  ['chem','Chem'],
  ['chem asian j','Chemistry – An Asian Journal'],
  ['commun biol','Communications Biology'],
  ['commun earth environ','Communications Earth & Environment'],
  ['commun mater','Communications Materials'],
  ['comput theor chem','Computational and Theoretical Chemistry'],
  ['curr biol','Current Biology'],
  ['curr opin plant biol','Current Opinion in Plant Biology'],
  ['dev cell','Developmental Cell'],
  ['elife','eLife'],
  ['energy environ sci','Energy & Environmental Science'],
  ['faraday discuss','Faraday Discussions'],
  ['front plant sci','Frontiers in Plant Science'],
  ['green chem','Green Chemistry'],
  ['j am soc mass spectrom','Journal of the American Society for Mass Spectrometry'],
  ['j chem phys','The Journal of Chemical Physics'],
  ['j exp bot','Journal of Experimental Botany'],
  ['j macromol sci part a','Journal of Macromolecular Science, Part A: Pure and Applied Chemistry'],
  ['j mater chem a','Journal of Materials Chemistry A'],
  ['j mater chem b','Journal of Materials Chemistry B'],
  ['j mater chem c','Journal of Materials Chemistry C'],
  ['joule','Joule'],
  ['macromolecules','Macromolecules'],
  ['mater chem front','Materials Chemistry Frontiers'],
  ['mater horiz','Materials Horizons'],
  ['matter','Matter'],
  ['mol cell','Molecular Cell'],
  ['mol plant','Molecular Plant'],
  ['nano lett','Nano Letters'],
  ['nanoscale','Nanoscale'],
  ['nat biomed eng','Nature Biomedical Engineering'],
  ['nat biotechnol','Nature Biotechnology'],
  ['nat catal','Nature Catalysis'],
  ['nat cell biol','Nature Cell Biology'],
  ['nat chem biol','Nature Chemical Biology'],
  ['nat ecol evol','Nature Ecology & Evolution'],
  ['nat electron','Nature Electronics'],
  ['nat energy','Nature Energy'],
  ['nat food','Nature Food'],
  ['nat genet','Nature Genetics'],
  ['nat mater','Nature Materials'],
  ['nat med','Nature Medicine'],
  ['nat methods','Nature Methods'],
  ['nat microbiol','Nature Microbiology'],
  ['nat nanotechnol','Nature Nanotechnology'],
  ['nat photonics','Nature Photonics'],
  ['nat phys','Nature Physics'],
  ['nat plants','Nature Plants'],
  ['nat protoc','Nature Protocols'],
  ['nat rev chem','Nature Reviews Chemistry'],
  ['nat rev mater','Nature Reviews Materials'],
  ['nat struct mol biol','Nature Structural & Molecular Biology'],
  ['nat sustain','Nature Sustainability'],
  ['nat synth','Nature Synthesis'],
  ['nat water','Nature Water'],
  ['nature','Nature'],
  ['new phytol','New Phytologist'],
  ['npj comput mater','npj Computational Materials'],
  ['organometallics','Organometallics'],
  ['phys rev b','Physical Review B'],
  ['plant cell','The Plant Cell'],
  ['plant cell physiol','Plant and Cell Physiology'],
  ['plant j','The Plant Journal'],
  ['plant physiol','Plant Physiology'],
  ['plos biol','PLOS Biology'],
  ['plos one','PLOS One'],
  ['sci rep','Scientific Reports'],
  ['science','Science'],
  ['small','Small'],
  ['tetrahedron','Tetrahedron'],
  ['trends chem','Trends in Chemistry'],
  ['wires comput mol sci','Wiley Interdisciplinary Reviews: Computational Molecular Science'],
]);
const JOURNAL_FULL_NORMALIZED = new Map(Array.from(JOURNAL_FULL_NAMES, ([k,v])=>[normalizeJournalKey(k), v]));
// User-defined journal dictionary, stored in library.json (lib.journalDict) so it
// travels with the library and is backed up alongside it. Each entry is
// { match, full, abbr }; `match` is normalized on lookup. User entries take
// precedence over the built-in maps above, so a user can override any of them.
let userJournalAbbr = new Map();
let userJournalFull = new Map();
function rebuildUserJournalDict(){
  userJournalAbbr = new Map();
  userJournalFull = new Map();
  const entries = (typeof lib !== 'undefined' && Array.isArray(lib.journalDict)) ? lib.journalDict : [];
  entries.forEach(e=>{
    if(!e || !e.match) return;
    const k = normalizeJournalKey(e.match);
    if(!k) return;
    if(e.abbr) userJournalAbbr.set(k, e.abbr);
    if(e.full) userJournalFull.set(k, e.full);
  });
}
function mappedJournalAbbr(s){ const k = normalizeJournalKey(s); return userJournalAbbr.get(k) || JOURNAL_ABBR_NORMALIZED.get(k) || ''; }
function mappedJournalFull(s){ const k = normalizeJournalKey(s); return userJournalFull.get(k) || JOURNAL_FULL_NORMALIZED.get(k) || ''; }
function canonicalJournalAbbr(s){ return mappedJournalAbbr(s) || String(s || ''); }
// The MDPI journal "Chemistry" (DOI 10.3390/chemistry…) collides with "Chemistry",
// the informal registration of "Chemistry – A European Journal" (Chem. Eur. J.).
// Only the DOI / publisher can tell them apart, so bare "Chemistry" is treated as
// Chem. Eur. J. EXCEPT when the item is actually the MDPI journal.
function isMdpiChemistry(item){
  if(!item) return false;
  if(/^\s*10\.3390\/chemistry\d/i.test(String(item.doi || ''))) return true;
  return /\bmdpi\b/i.test(String(item.publisher || '')) &&
    (normalizeJournalKey(item.journal) === 'chemistry' || normalizeJournalKey(item.journalAbbr) === 'chemistry');
}
function journalDisplay(item){
  const j = item.journal || '';
  // keep the bare-"Chemistry" → Chem. Eur. J. mapping from hijacking the MDPI journal
  if(isMdpiChemistry(item)) return item.journalAbbr || j || 'Chemistry';
  return mappedJournalAbbr(j) || mappedJournalAbbr(item.journalAbbr) || item.journalAbbr || j;
}
function isAngewEnglVariant(s){
  const k = normalizeJournalKey(s);
  return /\bangew chem int ed (engl(e)?|eng ed)\b/.test(k);
}
function isAngewEngleTypo(s){
  return /\bangew chem int ed (engle|eng ed)\b/.test(normalizeJournalKey(s));
}
function isChemEurJPaperpileVariant(s){
  return normalizeJournalKey(s) === 'chemistry';
}
function isChemCommunCambVariant(s){
  const k = normalizeJournalKey(s);
  return k === 'chem commun camb' || k === 'chem commun cambridge' ||
         k === 'chemical communications camb' || k === 'chemical communications cambridge';
}
function shouldUseCurrentAngew(item){
  const y = parseInt(item && item.year, 10);
  return !y || y >= 1998;
}
function fieldMatchesJournalFix(kind, value){
  if(kind === 'angew') return isAngewEnglVariant(value);
  if(kind === 'chemEurJ') return isChemEurJPaperpileVariant(value);
  if(kind === 'chemCommun') return isChemCommunCambVariant(value);
  return false;
}
function applyJournalFixSuggestion(sug){
  const it = lib.items.find(x=>x.id===sug.id);
  if(!it) return false;
  let changed = false;
  if(sug.changes && sug.changes.length){
    sug.changes.forEach(ch=>{
      if(!ch || !ch.field) return;
      if(it[ch.field] !== ch.next){
        it[ch.field] = ch.next;
        changed = true;
      }
    });
  } else {
    ['journal','journalAbbr'].forEach(k=>{
      if(fieldMatchesJournalFix(sug.kind, it[k])){
        it[k] = sug.next;
        changed = true;
      }
    });
  }
  if(changed) touch(it);
  return changed;
}
function fieldChangeLine(ch){
  return `${esc(t(ch.label || ch.field))}: ${esc(ch.current || '—')} → ${esc(ch.next || '')}`;
}
function fixSuggestionChangeHtml(s){
  if(s && s.changes && s.changes.length){
    return s.changes.map(ch=>`<div class="emptyRecMeta">${fieldChangeLine(ch)}</div>`).join('');
  }
  return `<div class="emptyRecMeta">${esc(t('currentValue'))}: ${esc(s.current)}</div>
          <div class="emptyRecMeta">${esc(t('suggestedValue'))}: ${esc(s.next)}</div>`;
}
function citationStyleKey(style){
  if(style==='wiley' || style==='angew') return 'gdch';
  if(style==='jcs') return 'csj';
  return style || 'acs';
}
function authorName(a, style){
  style = citationStyleKey(style);
  if(style==='nature' || style==='rsc' || style==='gdch' || style==='csj' || style==='science'){
    const ini = (a.given||'').split(/[\s.]+/).filter(Boolean).map(x=>x[0].toUpperCase()+'.').join(' ');
    return [ini, a.family].filter(Boolean).join(' ');
  }
  const ini = (a.given||'').split(/[\s.]+/).filter(Boolean).map(x=>x[0].toUpperCase()+'.').join(' ');
  return ini ? `${a.family}, ${ini}` : a.family;
}
function joinCitationAuthors(names, style){
  style = citationStyleKey(style);
  names = names.filter(Boolean);
  if(!names.length) return '';
  if(style==='acs') return names.join('; ');
  if(style==='rsc'){
    if(names.length===1) return names[0];
    if(names.length===2) return names[0] + ' and ' + names[1];
    return names.slice(0,-1).join(', ') + ', and ' + names[names.length-1];
  }
  if(style==='nature'){
    if(names.length===1) return names[0];
    if(names.length===2) return names[0] + ' & ' + names[1];
    return names.slice(0,-1).join(', ') + ' & ' + names[names.length-1];
  }
  return names.join(', ');
}
function citationTextToAuthors(text){
  return String(text||'').split(';').map(s=>s.trim()).filter(Boolean).map(name=>{
    if(name.includes(',')){
      const p = name.split(',');
      return {family:(p[0]||'').trim(), given:p.slice(1).join(',').trim()};
    }
    const p = name.split(/\s+/).filter(Boolean);
    return {family:p.pop()||'', given:p.join(' ')};
  });
}
function normDoi(doi){
  if(!doi) return '';
  return doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i,'').replace(/^doi:\s*/i,'').toLowerCase();
}
function stripTags(s){ const d = document.createElement('div'); d.innerHTML = s||''; return (d.textContent||'').replace(/\s+/g,' ').trim(); }
function normTitle(s){
  return String(s||'')
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9一-龯ぁ-んァ-ン]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function titleTokens(s){
  const stop = new Set(['a','an','the','of','and','or','in','on','for','to','by','with','as','from','using','via']);
  return normTitle(s).split(/\s+/).filter(w=>w.length>2 && !stop.has(w));
}
function tokenSimilarity(a, b){
  const A = new Set(titleTokens(a)), B = new Set(titleTokens(b));
  if(!A.size || !B.size) return 0;
  let hit = 0;
  A.forEach(w=>{ if(B.has(w)) hit++; });
  return hit / Math.max(A.size, B.size);
}
function yearClose(a, b){
  const ya = parseInt(a && a.year, 10), yb = parseInt(b && b.year, 10);
  if(!ya || !yb) return true;
  return Math.abs(ya - yb) <= 1;
}
function duplicateReasonKey(reason){
  if(reason==='doi') return 'duplicateReasonDoi';
  if(reason==='title') return 'duplicateReasonTitle';
  return 'duplicateReasonSimilar';
}
function duplicateMatchesForItem(item, pool){
  const out = [];
  const doi = normDoi(item.doi);
  const nt = normTitle(item.title);
  for(const other of pool || []){
    if(!other || other.id===item.id) continue;
    const otherDoi = normDoi(other.doi);
    if(doi && otherDoi && doi===otherDoi){
      out.push({item, match:other, score:100, reason:'doi'});
      continue;
    }
    if(nt.length < 18) continue;
    const ont = normTitle(other.title);
    if(ont.length < 18) continue;
    if(nt===ont){
      out.push({item, match:other, score:96, reason:'title'});
      continue;
    }
    const sim = tokenSimilarity(item.title, other.title);
    if(sim >= 0.86 && yearClose(item, other)){
      out.push({item, match:other, score:Math.round(sim * 100), reason:'similar'});
    }
  }
  return out.sort((a,b)=>b.score-a.score);
}
function findDuplicateCandidatesForItems(items, pool){
  const out = [];
  (items||[]).forEach(it=>{
    const matches = duplicateMatchesForItem(it, pool || lib.items);
    matches.slice(0, 2).forEach(m=>out.push(m));
  });
  return out;
}
function findLibraryDuplicateCandidates(limit){
  const out = [];
  const seen = new Set();
  for(let i=0;i<lib.items.length;i++){
    const a = lib.items[i];
    const matches = duplicateMatchesForItem(a, lib.items.slice(i+1));
    for(const m of matches){
      const ids = [m.item.id, m.match.id].sort().join('|');
      if(seen.has(ids)) continue;
      seen.add(ids);
      const da = m.item.dateAdded || '', db = m.match.dateAdded || '';
      if(db > da) out.push({item:m.match, match:m.item, score:m.score, reason:m.reason});
      else out.push(m);
      if(limit && out.length >= limit) return out;
    }
  }
  return out.sort((a,b)=>b.score-a.score);
}

/* ---------------------------------------------------------------
   Item model
---------------------------------------------------------------- */
const ITEM_TYPES = ['article','preprint','book','chapter','inproceedings','thesis','report','web','misc'];
function newItem(partial){
  return Object.assign({
    id: uid(), type:'article', category:'', title:'', authors:[], journal:'', journalAbbr:'', year:'',
    volume:'', issue:'', pages:'', publisher:'', doi:'', arxiv:'', url:'',
    abstract:'', notes:'', correspondingAuthors:'', correspondingCheckedAt:'', correspondingStatus:'', tags:[], collections:[], citekey:'', attachments:[],
    citedByCount:null, citedByAt:'', citedByStatus:'', starred:false, myPublication:false, readingStatus:'unread', trashed:false, trashedAt:'',
    dateAdded: new Date().toISOString(), dateModified: new Date().toISOString(),
  }, partial||{});
}
function genCitekey(item){
  const fam = (item.authors[0] && item.authors[0].family || 'anon')
    .normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-zA-Z0-9]/g,'').toLowerCase() || 'anon';
  const yr = String(item.year||'').replace(/\D/g,'') || 'nd';
  const stop = new Set(['a','an','the','on','of','in','and','for','with','to','from','by','via']);
  let word = '';
  for(const w of String(item.title||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').split(/[^a-z0-9]+/)){
    if(w && !stop.has(w)){ word = w; break; }
  }
  let base = fam + yr + (word||''), key = base, n = 0;
  const taken = new Set(lib.items.filter(x=>x.id!==item.id).map(x=>x.citekey));
  while(taken.has(key)){ n++; key = base + String.fromCharCode(96+n); }
  return key;
}

/* ---------------------------------------------------------------
   Storage backends
---------------------------------------------------------------- */
const HAS_FS = 'showDirectoryPicker' in window;

// small IndexedDB key-value store for the directory handle
function idb(){ return new Promise((res,rej)=>{
  const r = indexedDB.open('refshelf', 1);
  r.onupgradeneeded = ()=>r.result.createObjectStore('kv');
  r.onsuccess = ()=>res(r.result); r.onerror = ()=>rej(r.error);
});}
async function idbSet(k,v){ const db = await idb(); return new Promise((res,rej)=>{
  const tx = db.transaction('kv','readwrite'); tx.objectStore('kv').put(v,k);
  tx.oncomplete = res; tx.onerror = ()=>rej(tx.error);
});}
async function idbGet(k){ const db = await idb(); return new Promise((res,rej)=>{
  const tx = db.transaction('kv','readonly'); const rq = tx.objectStore('kv').get(k);
  rq.onsuccess = ()=>res(rq.result); rq.onerror = ()=>rej(rq.error);
});}

function fsBackend(dirHandle){
  const folderPath = dirHandle.path || dirHandle.fullPath || dirHandle.name;
  return {
    kind:'fs', name: dirHandle.name, path: folderPath, fullPath: folderPath,
    async load(){
      try{
        const fh = await dirHandle.getFileHandle('library.json');
        const text = await (await fh.getFile()).text();
        return JSON.parse(text);
      }catch(e){
        if(e && (e.name==='NotFoundError')) return null; // new library
        throw e;
      }
    },
    async save(data){
      const fh = await dirHandle.getFileHandle('library.json', {create:true});
      const w = await fh.createWritable();
      await w.write(typeof data === 'string' ? data : JSON.stringify(data, null, 1));
      await w.close();
    },
    async putAttachment(name, blob){
      const dir = await dirHandle.getDirectoryHandle('attachments', {create:true});
      const fh = await dir.getFileHandle(name, {create:true});
      const w = await fh.createWritable();
      await w.write(blob); await w.close();
    },
    async getAttachment(name){
      const dir = await dirHandle.getDirectoryHandle('attachments');
      const fh = await dir.getFileHandle(name);
      return await fh.getFile();
    },
    async deleteAttachment(name){
      try{
        const dir = await dirHandle.getDirectoryHandle('attachments');
        await dir.removeEntry(name);
      }catch(e){ /* already gone */ }
    },
  };
}
function memBackend(){
  const files = new Map();
  return {
    kind:'mem', name: '',
    async load(){ return null; },
    async save(){ /* no-op */ },
    async putAttachment(name, blob){ files.set(name, blob); },
    async getAttachment(name){
      if(!files.has(name)) throw new Error('not found');
      return files.get(name);
    },
    async deleteAttachment(name){ files.delete(name); },
  };
}

/* ---------------------------------------------------------------
   Global state
---------------------------------------------------------------- */
let backend = null;
let lib = { version: APP_VERSION, items: [], collections: [], tagColors: {}, journalDict: [] };
let selectedId = null;
let multiSelectedIds = new Set();
let multiSelectAnchorId = null;
let selectedCollectionIds = new Set();
let collectionSelectAnchorId = null;
let collapsedCollectionIds = new Set();
let collectionsSectionCollapsed = false;
let tagsSectionCollapsed = false;
let filter = { query:'', coll:'all', tags:new Set(), cols:{}, advanced:{ terms:'', mode:'and', field:'all', yearFrom:'', yearTo:'' } };
let sortKey = 'dateAdded', sortAsc = false;
let dirty = false, saveTimer = null, saving = false;
let changeVersion = 0, savedVersion = 0;
let saveQueue = Promise.resolve(true);
const pendingAttachmentDeletes = new Set();
let undoStack = []; // stores recent undoable operations for Cmd/Ctrl+Z

// "pick mode": lets the user click specific rows/cards to build a set of items
// to refresh (cited-by or corresponding authors), instead of always acting on
// every currently-visible item.
let pickMode = null;          // null | 'all' | 'cited' | 'corresponding' | 'category'
let pickedIds = new Set();
let pickAnchorId = null;      // for shift-click range selection

/* ---------------------------------------------------------------
   List columns — data-driven, reorderable & resizable, persisted.
---------------------------------------------------------------- */
const PDF_COL_WIDTH = 58;
function pdfCellHTML(it){
  const hasPdf = !!(it.attachments && it.attachments.length);
  const tip = esc(hasPdf ? t('attachments') : t('addPdf'));
  return `<button class="rowPdfBtn ${hasPdf?'hasPdf':'noPdf'}" data-row-addpdf="${it.id}" title="${tip}" aria-label="${tip}">${hasPdf?ic('file'):'+'}</button>`;
}
function trashRestoreCellHTML(it){
  const rtip = esc(t('restoreItem'));
  return `<button class="rowTrashRestoreBtn" data-restore-id="${esc(it.id)}" title="${rtip}" aria-label="${rtip}">${ic('arrowUpRight')}</button>`;
}
function trashDeleteCellHTML(it){
  const tip = esc(t('deleteForever'));
  return `<button class="rowTrashDeleteBtn" data-delete-forever-id="${esc(it.id)}" title="${tip}" aria-label="${tip}">${ic('trash')}</button>`;
}
function cardTrashDeleteHTML(it){
  const tip = esc(t('deleteForever'));
  const rtip = esc(t('restoreItem'));
  return `<span class="trashRowBtns"><button class="cardRestoreBtn" data-restore-id="${esc(it.id)}" title="${rtip}" aria-label="${rtip}">${ic('arrowUpRight')}<span>${esc(t('restoreItem'))}</span></button>`
    + `<button class="cardDeleteBtn" data-delete-forever-id="${esc(it.id)}" title="${tip}" aria-label="${tip}">${ic('trash')}<span>${esc(t('deleteSingle'))}</span></button></span>`;
}
function starButtonHTML(it, extraCls){
  const on = !!(it && it.starred);
  const tip = esc(t(on ? 'unstarItem' : 'starItem'));
  return `<button class="starBtn ${extraCls||''} ${on?'on':''}" data-star-id="${esc(it.id)}" title="${tip}" aria-label="${tip}">${ic('star')}</button>`;
}
function missingDataHTML(status, checkedAt){
  if(status==='fail') return `<span class="no-data fail" title="${esc(t('fetchFail'))}">!</span>`;
  if(status==='none' || checkedAt) return `<span class="no-data" title="${esc(t('logNoData'))}">—</span>`;
  return '';
}
const COLUMN_DEFS = {
  trashRestore: { i18n:'colTrashRestore', w:52, min:44, sortable:false, align:'center', noFilter:true, trashOnly:true, headerIcon:'arrowUpRight',
             cell:(it)=>trashRestoreCellHTML(it) },
  trashDelete: { i18n:'deleteSingle', w:52, min:44, sortable:false, align:'center', noFilter:true, trashOnly:true, headerIcon:'trash',
             cell:(it)=>trashDeleteCellHTML(it) },
  starred: { i18n:'colStar', w:34, min:30, sortable:true, align:'center', noFilter:true, headerIcon:'star',
             cell:(it)=>starButtonHTML(it, 'starCell') },
  pdf:     { i18n:'colPdf', w:PDF_COL_WIDTH, min:40, sortable:true, align:'center', special:'pdf', noFilter:true, headerIcon:'file',
             cell:(it)=>pdfCellHTML(it) },
  title:   { i18n:'colTitle',   w:280, min:120, sortable:true,
             cell:(it)=>`<span class="itTitle">${esc(it.title)||esc(t('newItem'))}</span>`, tip:(it)=>it.title },
  notes:   { i18n:'notes',      w:220, min:100, sortable:true,
             cell:(it)=>esc(String(it.notes||'').replace(/\s+/g, ' ').trim()), tip:(it)=>it.notes },
  authors: { i18n:'colAuthors', w:180, min:80,  sortable:true,
             cell:(it)=>esc(tableAuthorsText(it.authors, it.correspondingAuthors)), tip:(it)=>tableAuthorsText(it.authors, it.correspondingAuthors) },
  corresponding: { i18n:'correspondingAuthors', w:150, min:80, sortable:true,
             cell:(it)=> it.correspondingAuthors ? esc(textAuthorsForTable(it.correspondingAuthors)) : missingDataHTML(it.correspondingStatus, it.correspondingCheckedAt),
             tip:(it)=>it.correspondingAuthors || (it.correspondingStatus==='fail' ? t('fetchFail') : it.correspondingCheckedAt ? t('logNoData') : '') },
  tags:    { i18n:'tags', w:140, min:70, sortable:true,
             cell:(it)=>(it.tags||[]).map(tg=>`<span class="tdChip tag" ${tagChipStyle(tg)}>${ic('tag')}${esc(tg)}</span>`).join('') },
  collections: { i18n:'collections', w:140, min:70, sortable:true,
             cell:(it)=>(it.collections||[]).map(id=>{const c=lib.collections.find(x=>x.id===id); return c?`<span class="tdChip coll" ${collectionChipStyle(c)}>${ic('folder')}${esc(c.name)}</span>`:'';}).join('') },
  year:    { i18n:'colYear',    w:56,  min:40,  sortable:true, cell:(it)=>esc(it.year) },
  journal: { i18n:'colJournal', w:170, min:70,  sortable:true,
             cell:(it)=>esc(journalDisplay(it)), tip:(it)=>it.journal },
  citedBy: { i18n:'colCitedBy', w:78,  min:52,  sortable:true, align:'right',
             cell:(it)=> it.citedByCount==null ? missingDataHTML(it.citedByStatus, it.citedByAt) : String(it.citedByCount),
             tip:(it)=> it.citedByStatus==='fail' ? t('fetchFail') : it.citedByAt ? (it.citedByCount==null ? t('logNoData') : 'OpenAlex ' + it.citedByAt.slice(0,10)) : '' },
  type:    { i18n:'colType',    w:96,  min:60,  sortable:true,
             cell:(it)=>esc(I18N[lang].typeNames[it.type]||it.type), tip:(it)=>I18N[lang].typeNames[it.type] },
  category:{ i18n:'colCategory', w:96, min:60, sortable:true,
             cell:(it)=>it.category?`<span class="tdChip cat cat-${esc(it.category)}">${esc(I18N[lang].categoryNames[it.category]||it.category)}</span>`:'',
             tip:(it)=>it.category?(I18N[lang].categoryNames[it.category]||it.category):'' },
  doi:     { i18n:'colDoi',     w:150, min:80,  sortable:true, cell:(it)=>esc(it.doi), tip:(it)=>it.doi },
  added:   { i18n:'colAdded',   w:92,  min:70,  sortable:true,
             cell:(it)=>esc((it.dateAdded||'').slice(0,10)), sortVal:(it)=>it.dateAdded||'' },
};
const DEFAULT_COLUMNS = {
  order:['starred','pdf','title','notes','authors','year','journal','category','tags','collections','citedBy'],
  widths:{},
  hidden:['starred','pdf','category','notes'],
};
let columnConfig;
try{ columnConfig = JSON.parse(localStorage.getItem('refshelf.columns') || 'null'); }catch(e){ columnConfig = null; }
if(!columnConfig || !Array.isArray(columnConfig.order)){
  columnConfig = JSON.parse(JSON.stringify(DEFAULT_COLUMNS));
}else{
  // heal: keep only known keys, keep saved order as-is
  columnConfig.order = columnConfig.order.filter(k=>COLUMN_DEFS[k]);
  columnConfig.widths = columnConfig.widths || {};
  columnConfig.hidden = (columnConfig.hidden || []).filter(k=>COLUMN_DEFS[k]);
  // migrate: surface newly added default columns for configs saved before they existed
  ['tags','collections','category'].forEach(k=>{ if(!columnConfig.order.includes(k)) columnConfig.order.push(k); });
  if(!columnConfig.order.includes('notes')){
    const titleIndex = columnConfig.order.indexOf('title');
    columnConfig.order.splice(titleIndex >= 0 ? titleIndex + 1 : columnConfig.order.length, 0, 'notes');
    if(!columnConfig.hidden.includes('notes')) columnConfig.hidden.push('notes');
  }
  if(!columnConfig.order.includes('starred')) columnConfig.order.unshift('starred');
  if(!columnConfig.widths.starred || columnConfig.widths.starred <= 42) columnConfig.widths.starred = COLUMN_DEFS.starred.w;
  // the PDF column used to be a fixed first column; make it a real, movable column
  if(!columnConfig.order.includes('pdf')) columnConfig.order.unshift('pdf');
}
function saveColumns(){ localStorage.setItem('refshelf.columns', JSON.stringify(columnConfig)); }
function visibleColumnKeys(){ return columnConfig.order.filter(k=>!columnConfig.hidden.includes(k)); }
function tableColumnKeys(){
  const keys = visibleColumnKeys().filter(k=>!COLUMN_DEFS[k].trashOnly);
  return filter.coll === 'trash' ? ['trashRestore', 'trashDelete', ...keys] : keys;
}
function colWidth(key){ return columnConfig.widths[key] || COLUMN_DEFS[key].w; }

/* ---- per-column filters (funnel in the header) ---- */
const NUMERIC_FILTER_COLS = ['year','citedBy'];
const PICK_FILTER_COLS = ['tags','journal','collections','category'];
function collectionChipStyle(c){
  if(!c) return '';
  if(!c.color) return '';
  return `style="color:${esc(collectionDisplayColor(c.color))}"`;
}
function collectionLightDisplayColor(color){
  const m = String(color||'').trim().match(/^#([0-9a-f]{6})$/i);
  if(!m) return color;
  let r = parseInt(m[1].slice(0,2),16);
  let g = parseInt(m[1].slice(2,4),16);
  let b = parseInt(m[1].slice(4,6),16);
  const linear = v=>{
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const contrastOnWhite = ()=>1.05 / (0.2126*linear(r) + 0.7152*linear(g) + 0.0722*linear(b) + 0.05);
  // Darken only as much as necessary for readable text/icons on white.
  while(contrastOnWhite() < 4.5){ r *= 0.92; g *= 0.92; b *= 0.92; }
  const hex = v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}
function collectionDisplayColor(color){
  return theme==='dark' ? color : collectionLightDisplayColor(color);
}
function tagChipStyle(tg){
  const col = lib.tagColors && lib.tagColors[tg];
  if(!col) return '';
  const c = esc(col);
  return `style="color:${c};border-color:${c};background:color-mix(in srgb, ${c} 14%, transparent)"`;
}
function filterOptionStyle(key, value){
  if(key==='tags') return tagChipStyle(value);
  if(key==='collections'){
    const c = lib.collections.find(x=>x.name===value);
    return collectionChipStyle(c);
  }
  return '';
}
function filterOptionIcon(key){
  return key==='collections' ? ic('folder') : '';
}
function colFilterActive(k){
  const f = (filter.cols||{})[k];
  if(f==null) return false;
  if(typeof f==='object') return (f.from!=='' && f.from!=null) || (f.to!=='' && f.to!=null) ||
    String(f.text||'').trim()!=='' || (Array.isArray(f.selected) && f.selected.length>0);
  return String(f).trim()!=='';
}
function anyColFilterActive(){ return Object.keys(filter.cols||{}).some(colFilterActive); }
function colFilterSearch(f){ return typeof f==='object' ? String(f.text||'').trim() : String(f||'').trim(); }
function colFilterSelected(f){ return typeof f==='object' && Array.isArray(f.selected) ? f.selected : []; }
function colFilterValues(it, k){
  switch(k){
    case 'tags': return (it.tags||[]).filter(Boolean);
    case 'journal': return [journalDisplay(it)].filter(Boolean);
    case 'collections': return (it.collections||[]).map(id=>{ const c=lib.collections.find(x=>x.id===id); return c?c.name:''; }).filter(Boolean);
    case 'category': return it.category ? [I18N[lang].categoryNames[it.category]||it.category] : [];
    default: return [colFilterText(it, k)];
  }
}
function colFilterOptions(k){
  const vals = new Set();
  lib.items.forEach(it=>colFilterValues(it, k).forEach(v=>{ if(String(v).trim()) vals.add(String(v).trim()); }));
  return Array.from(vals).sort((a,b)=>a.localeCompare(b));
}
function colFilterText(it, k){
  switch(k){
    case 'title': return it.title||'';
    case 'notes': return it.notes||'';
    case 'authors': return (it.authors||[]).map(a=>a.family+' '+a.given).join(' ');
    case 'corresponding': return it.correspondingAuthors||'';
    case 'journal': return journalDisplay(it);
    case 'doi': return it.doi||'';
    case 'type': return (I18N[lang].typeNames[it.type]||it.type||'') + ' ' + (it.type||'');
    case 'category': return (I18N[lang].categoryNames[it.category]||it.category||'') + ' ' + (it.category||'');
    case 'tags': return (it.tags||[]).join(', ');
    case 'collections': return (it.collections||[]).map(id=>{const c=lib.collections.find(x=>x.id===id); return c?c.name:'';}).join(', ');
    case 'added': return (it.dateAdded||'').slice(0,10);
    default: return '';
  }
}
function colAutoFitText(it, k){
  switch(k){
    case 'authors': return authorsShort(it.authors);
    case 'journal': return journalDisplay(it);
    case 'type': return I18N[lang].typeNames[it.type] || it.type || '';
    case 'category': return I18N[lang].categoryNames[it.category] || it.category || '';
    case 'tags': return (it.tags||[]).join('  ');
    case 'collections': return (it.collections||[]).map(id=>{
      const c = lib.collections.find(x=>x.id===id);
      return c ? c.name : '';
    }).filter(Boolean).join('  ');
    case 'corresponding': return it.correspondingAuthors || '';
    case 'year': return it.year || '';
    case 'citedBy': return it.citedByCount==null ? '' : String(it.citedByCount);
    case 'added': return (it.dateAdded||'').slice(0,10);
    default: return colFilterText(it, k);
  }
}
function measureColumnText(texts){
  const span = measureColumnText._span || (measureColumnText._span = document.createElement('span'));
  if(!span.parentNode){
    span.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;white-space:nowrap;';
    document.body.appendChild(span);
  }
  const tableStyle = getComputedStyle($('#itemTable'));
  span.style.font = `${tableStyle.fontSize} ${tableStyle.fontFamily}`;
  let max = 0;
  texts.forEach(text=>{
    span.textContent = String(text||'').replace(/\s+/g, ' ').trim();
    max = Math.max(max, span.getBoundingClientRect().width);
  });
  return max;
}
function autoFitColumn(key){
  const d = COLUMN_DEFS[key];
  if(!d) return;
  const sample = visibleItems().slice(0, 300);
  const texts = [t(d.i18n)].concat(sample.map(it=>colAutoFitText(it, key)));
  const measured = measureColumnText(texts);
  const next = Math.max(d.min, Math.min(520, Math.ceil(measured + 46)));
  columnConfig.widths[key] = next;
  saveColumns();
  renderList();
}
function passesColFilters(it){
  const cols = filter.cols || {};
  for(const k in cols){
    if(!colFilterActive(k)) continue;
    const f = cols[k];
    if(NUMERIC_FILTER_COLS.includes(k)){
      const v = k==='year' ? (parseInt(it.year,10) || null) : it.citedByCount;
      if(f.from!=='' && f.from!=null && (v==null || v < +f.from)) return false;
      if(f.to!==''   && f.to!=null   && (v==null || v > +f.to))   return false;
    }else if(PICK_FILTER_COLS.includes(k)){
      const values = colFilterValues(it, k).map(v=>String(v).toLowerCase());
      const selected = colFilterSelected(f).map(v=>String(v).toLowerCase());
      const txt = colFilterSearch(f).toLowerCase();
      if(selected.length && !selected.some(v=>values.includes(v))) return false;
      if(txt && !values.some(v=>v.includes(txt))) return false;
    }else{
      if(!colFilterText(it, k).toLowerCase().includes(String(f).trim().toLowerCase())) return false;
    }
  }
  return true;
}
let citationPrefs;
try{ citationPrefs = JSON.parse(localStorage.getItem('refshelf.citationPrefs') || '{}'); }
catch(e){ citationPrefs = {}; }
citationPrefs = Object.assign({style:'acs', includeTitle:true, authorScope:'all', includeUrl:true}, citationPrefs);

function updateSaveDot(){
  const el = $('#saveDot');
  if(!backend){ el.textContent=''; return; }
  if(backend.kind==='mem'){ el.textContent = t('demoLib'); el.className='dirty'; return; }
  if(saving){ el.textContent = t('saving'); el.className='dirty'; }
  else if(dirty){ el.textContent = t('unsaved'); el.className='dirty'; }
  else { el.textContent = t('saved'); el.className=''; }
}
function touch(item){
  if(item) item.dateModified = new Date().toISOString();
  changeVersion++;
  dirty = true; updateSaveDot();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 700);
  connectorNotify();
}
async function saveNow(){
  clearTimeout(saveTimer);
  saveTimer = null;
  if(!backend || backend.kind==='mem'){
    savedVersion = changeVersion;
    dirty = false;
    updateSaveDot();
    return true;
  }
  // Freeze both the destination and the data for this save. Later edits get a
  // newer version and remain visibly unsaved until their own queued save ends.
  const targetBackend = backend;
  const targetLib = lib;
  const targetVersion = changeVersion;
  const json = JSON.stringify(targetLib, null, 1);
  const deletes = Array.from(pendingAttachmentDeletes);
  const run = async()=>{
    saving = true; updateSaveDot();
    try{
      await targetBackend.save(json);
      // Attachments are removed only after the JSON no longer refers to them.
      for(const name of deletes){
        await targetBackend.deleteAttachment(name);
        pendingAttachmentDeletes.delete(name);
      }
      if(backend===targetBackend && lib===targetLib){
        savedVersion = Math.max(savedVersion, targetVersion);
        dirty = changeVersion > savedVersion;
      }
      return true;
    }catch(e){
      console.error(e);
      if(backend===targetBackend && lib===targetLib) dirty = true;
      showToast(t('saveFail') + ': ' + e.message, true);
      return false;
    }finally{
      saving = false; updateSaveDot();
    }
  };
  saveQueue = saveQueue.then(run, run);
  return saveQueue;
}
async function ensureSavedBeforeSwitch(){
  if(!backend || backend.kind!=='fs' || !dirty) return true;
  while(dirty){
    const version = changeVersion;
    if(!await saveNow()) return false;
    if(version===changeVersion && !dirty) return true;
  }
  return true;
}
window.addEventListener('beforeunload', (e)=>{
  if(dirty && backend && backend.kind==='fs'){ e.preventDefault(); e.returnValue = t('unsavedWarn'); }
});

/* ---------------------------------------------------------------
   Metadata fetchers
---------------------------------------------------------------- */
function parseIdInput(raw){
  const s = raw.trim();
  if(!s) return null;
  // arXiv patterns
  let m = s.match(/arxiv(?:\.org\/(?:abs|pdf)\/|:)\s*([a-z\-]+(?:\.[A-Z]{2})?\/\d{7}|\d{4}\.\d{4,5})(v\d+)?/i);
  if(m) return { kind:'arxiv', id:m[1] + (m[2] || '') };
  m = s.match(/^(\d{4}\.\d{4,5})(v\d+)?$/);
  if(m) return { kind:'arxiv', id:m[1] + (m[2] || '') };
  m = s.match(/10\.48550\/arxiv\.([^\s"'<>?#]+)/i);
  if(m) return { kind:'arxiv', id:m[1].replace(/[.,;)\]]+$/,'') };
  // DOI in the string (covers most publisher URLs: ACS, Wiley, Science…)
  m = s.match(/10\.\d{4,9}\/[^\s"'<>]+/);
  if(m){
    // strip URL query/fragment (e.g. Wiley's ?af=R) and trailing punctuation,
    // otherwise the DOI lookup 404s on the extra characters
    const id = m[0].replace(/[?#].*$/,'').replace(/[.,;)\]]+$/,'');
    return { kind:'doi', id };
  }
  // Oxford Academic / Silverchair article URLs sometimes do not expose the DOI
  // in the visible URL. Example:
  // academic.oup.com/bcsj/article/99/2/uoaf119/8449836 → 10.1093/bulcsj/uoaf119
  m = s.match(/academic\.oup\.com\/([^\s\/?#]+)\/article(?:-[^\s\/?#]+)?\/(?:[^\s\/?#]+\/)*([a-z]{2,}\d+[a-z0-9]*)(?:\/\d+)?\/?(?:[?#].*)?$/i);
  if(m){
    const journalCode = ({ bcsj:'bulcsj' })[m[1].toLowerCase()] || m[1].toLowerCase();
    return { kind:'doi', id:'10.1093/' + journalCode + '/' + m[2] };
  }
  // Oxford Academic CDN/minimal pages expose only the numeric article id in the
  // URL, so they cannot be mapped deterministically to a DOI without page meta.
  // Keep those for title/metadata search fallback.
  // Nature: nature.com/articles/<accession> → 10.1038/<accession> (the slug IS the DOI suffix)
  m = s.match(/nature\.com\/articles\/([^\s/?#]+)/i);
  if(m){ const acc = m[1].replace(/\.pdf$/i,''); if(acc && !/^10\./.test(acc)) return { kind:'doi', id:'10.1038/' + acc }; }
  return null;
}
// ScienceDirect article URLs identify papers by Elsevier PII rather than DOI.
// A journal-article PII encodes the ISSN and a two-digit assignment year:
// S0079670024001096 -> ISSN 0079-6700, year 2024.
function parseScienceDirectUrl(s){
  const m = String(s||'').match(/sciencedirect\.com\/science\/article\/(?:[^\s/?#]+\/)*pii\/(S([0-9X]{8})(\d{2})[0-9X]+)(?:[/?#]|$)/i);
  if(!m) return null;
  const currentYY = new Date().getFullYear() % 100;
  const yy = Number(m[3]);
  const year = (yy > currentYY + 1 ? 1900 : 2000) + yy;
  return {
    pii:m[1].toUpperCase(),
    issn:m[2].slice(0,4) + '-' + m[2].slice(4),
    year,
  };
}
function compactPiiValue(v){ return String(v||'').toUpperCase().replace(/[^0-9A-Z]/g,''); }
function crossrefMessageHasPii(msg, pii){
  const needle = compactPiiValue(pii);
  const urls = [msg && msg.URL].concat((msg && msg.link || []).map(x=>x && x.URL));
  return urls.some(url=>compactPiiValue(url).includes(needle));
}
async function fetchScienceDirectPii(raw){
  const parsed = parseScienceDirectUrl(raw);
  if(!parsed) throw new Error('Invalid ScienceDirect PII URL');
  // The PII assignment year can differ from the final issue year around online-first
  // publication, so inspect a small surrounding window. Crossref link metadata for
  // Elsevier records contains the PII and lets us map it back to the canonical DOI.
  const fields = 'DOI,title,container-title,short-container-title,issued,author,type,volume,issue,page,publisher,URL,abstract,assertion,link';
  const filter = `from-pub-date:${parsed.year-2}-01-01,until-pub-date:${parsed.year+2}-12-31`;
  let cursor = '*';
  for(let page=0; page<5; page++){
    const url = 'https://api.crossref.org/journals/' + encodeURIComponent(parsed.issn) +
      '/works?rows=1000&select=' + encodeURIComponent(fields) +
      '&filter=' + encodeURIComponent(filter) + '&cursor=' + encodeURIComponent(cursor);
    const r = await fetch(url);
    if(!r.ok) throw new Error('CrossRef HTTP ' + r.status);
    const message = (await r.json()).message || {};
    const found = (message.items || []).find(msg=>crossrefMessageHasPii(msg, parsed.pii));
    if(found) return crossrefMsgToItem(found);
    if(!message['next-cursor'] || !(message.items || []).length) break;
    cursor = message['next-cursor'];
  }
  throw new Error('CrossRef could not resolve ScienceDirect PII ' + parsed.pii);
}
// MDPI article URLs (e.g. https://www.mdpi.com/2624-8549/6/6/103) don't contain the
// DOI, but the path /{issn}/{volume}/{issue}/{article} encodes it. The DOI is
// 10.3390/{abbrev}{volume}{issue:2}{article:4}, where {abbrev} depends on the journal.
// We resolve {abbrev} from the ISSN via CrossRef (once, then cached) since a static
// map of every MDPI journal would be large and quickly go stale.
function parseMdpiUrl(s){
  const m = String(s||'').match(/mdpi\.com\/(\d{4}-\d{3}[\dxX])\/(\d+)\/(\d+)\/(\d+)/i);
  if(!m) return null;
  return { issn:m[1], volume:m[2], issue:m[3], article:m[4] };
}
const MDPI_ABBREV_CACHE = {};
async function mdpiAbbrevFromIssn(issn){
  const key = String(issn).toLowerCase();
  if(MDPI_ABBREV_CACHE[key]) return MDPI_ABBREV_CACHE[key];
  const r = await fetch('https://api.crossref.org/journals/' + encodeURIComponent(issn) +
    '/works?rows=1&filter=prefix:10.3390&select=DOI');
  if(!r.ok) throw new Error('MDPI journal lookup failed (' + r.status + ')');
  const items = (((await r.json()).message) || {}).items || [];
  const mm = items.length && String(items[0].DOI || '').match(/^10\.3390\/([a-z]+)\d/i);
  if(!mm) throw new Error('Could not determine the MDPI journal abbreviation for ISSN ' + issn);
  return (MDPI_ABBREV_CACHE[key] = mm[1].toLowerCase());
}
async function mdpiUrlToDoi(s){
  const p = parseMdpiUrl(s);
  if(!p) return '';
  const abbrev = await mdpiAbbrevFromIssn(p.issn);
  const num = String(p.volume) + String(p.issue).padStart(2,'0') + String(p.article).padStart(4,'0');
  return '10.3390/' + abbrev + num;
}
function isChemRxivDoi(doi){
  return /^10\.26434\/chemrxiv[-_/]/i.test(normDoi(doi||''));
}
function chemRxivUrlFromDoi(doi){
  const d = normDoi(doi||'');
  return d ? 'https://chemrxiv.org/doi/full/' + d : '';
}
function normalizeRepositoryPreprintItem(it){
  if(!it) return it;
  if(isChemRxivDoi(it.doi)){
    it.type = 'preprint';
    it.journal = 'ChemRxiv';
    it.journalAbbr = 'ChemRxiv';
    // CrossRef/OpenAlex may expose ACS as the DOI registrant/host, but for the
    // user-facing publication field this is a ChemRxiv preprint. Keep the UI
    // unambiguous by using the repository as the publisher as well.
    it.publisher = 'ChemRxiv';
    it.url = it.url || chemRxivUrlFromDoi(it.doi);
    it.volume = ''; it.issue = ''; it.pages = '';
  }
  return it;
}
function normalizeArxivInput(v){
  const s = String(v||'').trim();
  if(!s) return '';
  let m = s.match(/arxiv(?:\.org\/(?:abs|pdf)\/|:)\s*([a-z\-]+(?:\.[A-Z]{2})?\/\d{7}|\d{4}\.\d{4,5})(v\d+)?/i);
  if(m) return m[1] + (m[2] || '');
  m = s.match(/^([a-z\-]+(?:\.[A-Z]{2})?\/\d{7}|\d{4}\.\d{4,5})(v\d+)?$/i);
  if(m) return m[1] + (m[2] || '');
  m = s.match(/10\.48550\/arxiv\.([^\s"'<>?#]+)/i);
  if(m) return m[1].replace(/[.,;)\]]+$/,'');
  return s;
}
const CROSSREF_TYPE_MAP = { 'journal-article':'article', 'proceedings-article':'inproceedings',
  'book':'book', 'book-chapter':'chapter', 'monograph':'book', 'report':'report',
  'dissertation':'thesis', 'posted-content':'preprint' };
// Best-effort auto-detection of the "category" (Review / Article / Perspective).
// Only section-level labels are trusted (not the title/abstract, which produce
// false positives like a research article titled "… a critical review of …").
// Perspective is a publisher-specific section that most metadata omits, so it is
// only caught when explicitly labelled. Undetected items are left blank for the
// user to set manually.
function detectCategoryFromLabel(){
  const s = Array.prototype.slice.call(arguments).filter(Boolean).join(' ').toLowerCase();
  if(!s) return '';
  // order matters: check the more specific labels first
  if(/\bperspectives?\b/.test(s)) return 'perspective';
  if(/\bmini[- ]?reviews?\b/.test(s)) return 'minireview';
  if(/\breviews?\b/.test(s)) return 'review';
  if(/\bhighlights?\b/.test(s)) return 'highlight';
  if(/\baccounts?\b/.test(s)) return 'account';
  if(/\beditorials?\b/.test(s)) return 'editorial';
  if(/\b(communications?|letters?)\b/.test(s)) return 'communication';
  return '';
}
// CrossRef exposes the journal section in `subtype` / `group-title` (e.g.
// "Reviews", "Perspectives", "Communications") for some publishers.
function crossrefCategory(msg){
  const gt = msg['group-title'];
  return detectCategoryFromLabel(msg.subtype, ...(Array.isArray(gt) ? gt : [gt]));
}
function extractCorrespondingAuthors(msg){
  const names = [];
  (msg.author||[]).forEach(a=>{
    const flags = [a.corresponding, a['corresponding-author'], a.role, a.sequence, a.note].join(' ').toLowerCase();
    if(/correspond/.test(flags)) names.push(a.given ? `${a.family}, ${a.given}` : (a.family || a.name || ''));
  });
  (msg.assertion||[]).forEach(as=>{
    const label = String(as.label || as.name || '').toLowerCase();
    if(label.includes('correspond')){
      const v = stripTags(as.value || as.explanation || '');
      if(v) names.push(v);
    }
  });
  return Array.from(new Set(names.filter(Boolean))).join('; ');
}
function crossrefMsgToItem(msg){
  const dp = (msg.issued && msg.issued['date-parts'] && msg.issued['date-parts'][0]) || [];
  const doi = normDoi(msg.DOI || '');
  const journal = (msg['container-title'] && msg['container-title'][0]) || '';
  const rawAbbr = (msg['short-container-title'] && msg['short-container-title'][0]) || '';
  const it = normalizeRepositoryPreprintItem(newItem({
    type: CROSSREF_TYPE_MAP[msg.type] || 'article',
    category: crossrefCategory(msg),
    title: stripTags((msg.title && msg.title[0]) || ''),
    authors: (msg.author||[]).map(a=>({ family:a.family||a.name||'', given:a.given||'' })),
    journal,
    journalAbbr: rawAbbr,
    year: dp[0] ? String(dp[0]) : '',
    volume: msg.volume || '', issue: msg.issue || '', pages: normalizeRange(msg.page || ''),
    publisher: msg.publisher || '',
    doi,
    url: msg.URL || (doi ? 'https://doi.org/' + doi : ''),
    abstract: stripTags(msg.abstract || ''),
    correspondingAuthors: extractCorrespondingAuthors(msg),
  }));
  // CrossRef's short-container-title often drops periods (e.g. "Nat Commun").
  // Prefer the canonical, period-correct abbreviation when we know it — but keep
  // the MDPI journal *Chemistry* as-is (its bare name must not become "Chem. Eur. J.").
  if(!isMdpiChemistry(it)){
    const canon = mappedJournalAbbr(journal) || mappedJournalAbbr(rawAbbr);
    if(canon) it.journalAbbr = canon;
  }
  return it;
}
async function fetchCrossref(doi){
  const r = await fetch('https://api.crossref.org/works/' + encodeURIComponent(doi));
  if(!r.ok) throw new Error('CrossRef HTTP ' + r.status);
  return crossrefMsgToItem((await r.json()).message);
}
// Free-text / URL search: many publisher pages (RSC, ACS, Wiley…) put no DOI in
// the URL and block cross-origin fetches, so we search CrossRef by title.
function inputToSearchQuery(raw){
  let s = raw.trim();
  if(/^https?:\/\//i.test(s)){
    try{
      const u = new URL(s);
      const segs = u.pathname.split('/').filter(Boolean);
      const filler = /^(abstract|article-abstract|fulltext|full|html|pdf|article|articlehtml|content|doi|abs|articles?|papers?|toc|epdf|full-text)$/i;
      // walk from the end, skipping filler words and pure-numeric id segments
      let slug = '';
      for(let i=segs.length-1;i>=0;i--){
        const seg = decodeURIComponent(segs[i]);
        if(filler.test(seg) || /^\d+$/.test(seg)) continue;
        slug = seg; break;
      }
      s = (slug || segs[segs.length-1] || '').replace(/[-_.]+/g,' ').replace(/\.\w+$/,'').trim();
    }catch(e){ /* fall through, use raw */ }
  }
  return s.replace(/\s+/g,' ').trim();
}
async function searchCrossref(query){
  const url = 'https://api.crossref.org/works?rows=6&select=' +
    encodeURIComponent('DOI,title,container-title,short-container-title,issued,author,type,volume,issue,page,publisher,URL,abstract,assertion') +
    '&query.bibliographic=' + encodeURIComponent(query);
  const r = await fetch(url);
  if(!r.ok) throw new Error('CrossRef HTTP ' + r.status);
  const items = ((await r.json()).message.items || []);
  return items.filter(m=>m.title && m.title[0]).map(crossrefMsgToItem);
}

/* ---------------------------------------------------------------
   OpenAlex — citation graph (references + cited-by).
   CORS-enabled (Access-Control-Allow-Origin: *), no API key.
---------------------------------------------------------------- */
const OA_MAILTO = 'refshelf@example.com'; // polite-pool contact, per OpenAlex etiquette
const OA_SELECT = 'id,doi,title,display_name,publication_year,authorships,primary_location,biblio,type,cited_by_count,referenced_works,abstract_inverted_index';
const CACHE_TTL_MS = 21 * 24 * 3600 * 1000; // metadata considered fresh for 21 days
function isFresh(iso){ return iso && (Date.now() - new Date(iso).getTime()) < CACHE_TTL_MS; }

/* ---------------------------------------------------------------
   Semantic Scholar — free, CORS-enabled fallback for cited-by counts
   when OpenAlex is rate-limited. Batch endpoint takes many DOIs at once.
---------------------------------------------------------------- */
function s2IdForItem(it){
  if(it.doi) return 'DOI:' + normDoi(it.doi);
  if(it.arxiv) return 'ARXIV:' + it.arxiv;
  return null;
}
async function s2BatchCitedBy(items){
  // returns Map(itemId -> citationCount) for items resolvable by DOI/arXiv
  const idable = items.map(it=>({it, sid:s2IdForItem(it)})).filter(x=>x.sid);
  const out = new Map();
  for(let i=0;i<idable.length;i+=100){
    const chunk = idable.slice(i, i+100);
    const r = await fetch('https://api.semanticscholar.org/graph/v1/paper/batch?fields=citationCount', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ids: chunk.map(x=>x.sid) })
    });
    if(!r.ok) throw new Error('Semantic Scholar HTTP ' + r.status);
    const arr = await r.json();
    arr.forEach((p, idx)=>{ if(p && typeof p.citationCount==='number') out.set(chunk[idx].it.id, p.citationCount); });
  }
  return out;
}
const OPENALEX_TYPE_MAP = { 'article':'article', 'journal-article':'article', 'proceedings-article':'inproceedings',
  'proceedings':'inproceedings', 'book-chapter':'chapter', 'book':'book', 'monograph':'book', 'reference-book':'book',
  'report':'report', 'dissertation':'thesis', 'preprint':'preprint', 'posted-content':'preprint', 'dataset':'misc' };
function oaId(urlOrId){ return String(urlOrId||'').split('/').pop(); }
function reconstructAbstract(inv){
  if(!inv) return '';
  const words = [];
  for(const w in inv) for(const pos of inv[w]) words[pos] = w;
  return words.join(' ').replace(/\s+/g,' ').trim();
}
function oaAuthorName(a){
  const raw = (a.author && a.author.display_name) || a.raw_author_name || '';
  if(raw.includes(',')){ const p = raw.split(','); return { family:p[0].trim(), given:p.slice(1).join(',').trim() }; }
  const p = raw.trim().split(/\s+/); return { family:p.pop()||'', given:p.join(' ') };
}
// Corresponding authors from OpenAlex authorships (is_corresponding flag) → "Family, Given; …"
function oaCorrespondingAuthors(authorships){
  return (authorships||[])
    .filter(a=>a.is_corresponding)
    .map(a=>{ const n = oaAuthorName(a); return n.given ? `${n.family}, ${n.given}` : n.family; })
    .filter(Boolean).join('; ');
}
function openAlexToItem(w){
  const authors = (w.authorships||[]).map(oaAuthorName);
  const src = (w.primary_location && w.primary_location.source) || {};
  const bib = w.biblio || {};
  const pages = bib.first_page ? (bib.last_page && bib.last_page!==bib.first_page ? `${bib.first_page}–${bib.last_page}` : bib.first_page) : '';
  const doi = normDoi(w.doi || '');
  const isArxiv = /arxiv/i.test(src.display_name||'') || /10\.48550\/arxiv/i.test(doi);
  return normalizeRepositoryPreprintItem(newItem({
    type: OPENALEX_TYPE_MAP[w.type] || 'article',
    category: detectCategoryFromLabel(w.type),
    title: stripTags(w.title || w.display_name || ''),
    authors,
    journal: stripTags(src.display_name || ''),
    year: w.publication_year ? String(w.publication_year) : '',
    volume: bib.volume || '', issue: bib.issue || '', pages,
    publisher: src.host_organization_name || '',
    doi: isArxiv ? '' : doi,
    arxiv: isArxiv ? (doi.match(/arxiv\.(\d{4}\.\d{4,5})/i)||[])[1] || '' : '',
    url: w.doi || (w.id || ''),
    abstract: reconstructAbstract(w.abstract_inverted_index),
    correspondingAuthors: oaCorrespondingAuthors(w.authorships),
  }));
}
// Auto-enrich a freshly added item with corresponding authors AND cited-by count
// from OpenAlex. Uses the single-entity (works/doi:…) endpoint, which is a
// separate, un-metered tier, so this is budget-friendly and safe to run on every
// DOI/arXiv add. Best-effort and silent: if OpenAlex has no record (or is down),
// the item is left exactly as fetched from CrossRef/arXiv.
async function autoEnrichOnAdd(it){
  const qd = it.doi ? normDoi(it.doi) : (it.arxiv ? normDoi('10.48550/arXiv.' + it.arxiv) : '');
  if(!qd) return;
  try{
    setItemUpdateState(it, 'running');
    const w = await oaFetch('works/doi:' + encodeURIComponent(qd) + '?select=authorships,cited_by_count,type');
    const corr = oaCorrespondingAuthors(w.authorships);
    if(corr) it.correspondingAuthors = corr;
    it.correspondingCheckedAt = new Date().toISOString();
    it.correspondingStatus = corr ? '' : 'none';
    applyOaCitedBy(it, w);
    // CrossRef often lacks a section label; OpenAlex may still classify reviews
    if(!it.category){ const c = detectCategoryFromLabel(w.type); if(c) it.category = c; }
    setItemUpdateState(it, 'ok');
    touch(); renderList(); renderDetail();
  }catch(e){
    setItemUpdateState(it, 'none'); // clears the running indicator; leave data as-is
  }
}
// Enrich an item's corresponding authors from OpenAlex (used for CrossRef/DOI adds).
async function enrichCorresponding(item){
  const qd = item.doi ? normDoi(item.doi) : (item.arxiv ? normDoi('10.48550/arXiv.' + item.arxiv) : '');
  if(!qd) return;
  try{
    const w = await oaFetch('works/doi:' + encodeURIComponent(qd) + '?select=authorships');
    const corr = oaCorrespondingAuthors(w.authorships);
    if(corr) item.correspondingAuthors = corr;
  }catch(e){ /* leave as-is if OpenAlex has no record */ }
}
// Fill an item's "category" (Review / Article / Perspective …) for existing items
// on demand — the equivalent of a cited-by refresh, but for the section label.
// Uses CrossRef's section fields first (best for Perspective/Highlight/Account/
// Communication), then OpenAlex's `type` (catches reviews CrossRef doesn't label).
// Only fills when empty: a manual choice is never overwritten. Best-effort/silent.
async function enrichCategory(it){
  if(!it || it.category) return false;
  let cat = '';
  if(it.doi){
    try{
      const r = await fetch('https://api.crossref.org/works/' + encodeURIComponent(normDoi(it.doi)) + '?select=subtype,group-title');
      if(r.ok) cat = crossrefCategory((await r.json()).message || {});
    }catch(e){ /* ignore — fall through to OpenAlex */ }
  }
  if(!cat && (it.doi || it.arxiv)){
    try{ cat = detectCategoryFromLabel((await fetchOneOaByItem(it, 'type')).type); }
    catch(e){ /* leave blank if OpenAlex has no record */ }
  }
  if(cat){ it.category = cat; return true; }
  return false;
}
// A 429 from OpenAlex now means the daily budget is exhausted (resets at
// midnight UTC) — retrying immediately is futile, so surface it and back off.
class RateLimitError extends Error{ constructor(msg){ super(msg); this.name='RateLimitError'; this.rateLimited=true; } }
let oaRateLimitedUntil = 0;
async function oaFetch(path){
  // Single-entity endpoints (works/doi:… , works/W…) are a separate, un-metered
  // tier and keep working even when list/filter queries hit the daily budget.
  // So the cooldown only applies to (and is only set by) list queries.
  const isList = path.startsWith('works?');
  if(isList && Date.now() < oaRateLimitedUntil) throw new RateLimitError(t('oaBudgetErr'));
  const sep = path.includes('?') ? '&' : '?';
  const url = 'https://api.openalex.org/' + path + sep + 'mailto=' + encodeURIComponent(OA_MAILTO);
  let lastErr;
  for(let attempt=0; attempt<3; attempt++){
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), 18000);
    try{
      const r = await fetch(url, {signal:controller.signal});
      clearTimeout(timer);
      if(r.status===429){
        let retryAfter = 0, msg = t('oaBudgetErr');
        try{ const j = await r.json(); if(j.retryAfter) retryAfter = j.retryAfter; if(j.message) msg = j.message; }catch(e){}
        // remember so remaining list queries in a bulk op fail fast (single-entity unaffected)
        if(isList) oaRateLimitedUntil = Date.now() + Math.min((retryAfter||60)*1000, 3600*1000);
        throw new RateLimitError(msg);
      }
      if(!r.ok){
        lastErr = new Error('OpenAlex HTTP ' + r.status);
        if(r.status<500) throw lastErr;
      }else{
        return r.json();
      }
    }catch(e){
      clearTimeout(timer);
      if(e && e.rateLimited) throw e;
      lastErr = e;
    }
    await new Promise(res=>setTimeout(res, 500 * (attempt + 1)));
  }
  throw lastErr || new Error('OpenAlex request failed');
}
/* ---------------------------------------------------------------
   Fetch log — records failed metadata fetches (with reason) so the
   cause is not lost in a toast, and offers a retry per item.
---------------------------------------------------------------- */
const fetchLog = [];   // { id, ts, label, detail, reason, kind, status, itemId }
const updateMarks = new Map(); // itemId -> running | ok | none | fail | skipped
function updateClassForItem(id){
  const st = updateMarks.get(id);
  if(st==='running') return 'updating';
  return '';
}
function setItemUpdateState(item, status){
  if(!item || !item.id) return;
  if(status==='running') updateMarks.set(item.id, status);
  else updateMarks.delete(item.id);
  document.querySelectorAll(dataIdSelector(item.id)).forEach(el=>{
    el.classList.remove('updating','updated','updateNone','updateFail');
    const cls = updateClassForItem(item.id);
    if(cls) el.classList.add(cls);
  });
}
function clearUpdateStates(){
  const ids = Array.from(updateMarks.keys());
  updateMarks.clear();
  ids.forEach(id=>document.querySelectorAll(dataIdSelector(id)).forEach(el=>{
    el.classList.remove('updating','updated','updateNone','updateFail');
  }));
}
// let the browser paint (used so batched updates flow into the table one-by-one)
function nextFrame(){ return new Promise(r=>requestAnimationFrame(()=>r())); }
// refresh only the cells that citation/corresponding updates touch, in place, so
// data appears live during a refresh without the cost of a full renderList per item
const LIVE_UPDATE_COLS = ['authors','corresponding','citedBy'];
function refreshRowCells(it){
  if(!it || !it.id) return;
  document.querySelectorAll('#itemRows tr' + dataIdSelector(it.id)).forEach(tr=>{
    LIVE_UPDATE_COLS.forEach(k=>{
      const d = COLUMN_DEFS[k];
      const td = tr.querySelector('.col-' + k);
      if(!d || !td) return;
      td.innerHTML = d.cell(it);
      const tip = d.tip ? d.tip(it) : '';
      if(tip) td.title = tip; else td.removeAttribute('title');
    });
  });
  const card = document.querySelector('#itemCards .cardRow' + dataIdSelector(it.id));
  if(card){
    const tmp = document.createElement('div');
    tmp.innerHTML = cardRowHTML(it);
    const fresh = tmp.firstElementChild;
    if(fresh){ card.replaceWith(fresh); renderIcons(fresh); }
  }
}
function logStatusText(status){
  if(status==='running') return t('logRunning');
  if(status==='ok') return t('logUpdated');
  if(status==='none') return t('logNoData');
  if(status==='skipped') return t('logSkipped');
  return '';
}
function logUpdateProgress(item, kind, status, reason, detail){
  if(!item) return;
  const key = `${kind}:${item.id}`;
  let en = fetchLog.find(x=>x.progressKey===key);
  if(!en){
    en = { id:uid(), ts:Date.now(), progressKey:key, itemId:item.id, kind,
      label:item.title || item.doi || item.arxiv, detail:item.doi || item.arxiv || '', reason:'', status };
    fetchLog.unshift(en);
  }
  en.ts = Date.now();
  en.status = status;
  en.reason = reason || logStatusText(status);
  if(detail!=null) en.detail = detail;
  if(fetchLog.length > 80) fetchLog.length = 80;
  updateFetchLogBadge();
  if($('#dlgFetchLog').open) renderFetchLog();
}
function logFetchFailure(entry){
  const key = entry.progressKey || (entry.kind && entry.itemId ? `${entry.kind}:${entry.itemId}` : '');
  const existing = key ? fetchLog.find(x=>x.progressKey===key) : null;
  if(existing){
    Object.assign(existing, entry, { ts:Date.now(), status:entry.status || 'fail', progressKey:key });
    updateFetchLogBadge();
    if($('#dlgFetchLog').open) renderFetchLog();
    return;
  }
  entry.id = uid(); entry.ts = Date.now();
  if(key) entry.progressKey = key;
  entry.status = entry.status || 'fail';
  fetchLog.unshift(entry);
  if(fetchLog.length > 80) fetchLog.length = 80;
  updateFetchLogBadge();
  if($('#dlgFetchLog').open) renderFetchLog();
}
// ---- consolidated "alerts" button (fix suggestions / empty data / duplicates /
// update log) ----------------------------------------------------------------
// The three problem counts are cached so the fetch-log tick (called per item in a
// refresh loop) can re-render cheaply without re-running duplicate detection.
let _alertCounts = { fix:0, empty:0, dup:0 };
const ALERT_DEFS = {
  fix:   { icon:'alert', label:'fixSuggestions',       open:()=>openFixSuggestionsFromAlert() },
  empty: { icon:'trash', label:'emptyRecords',         open:()=>openEmptyRecordsFromAlert() },
  dup:   { icon:'alert', label:'duplicateCandidates',  open:()=>openDuplicatesFromAlert() },
  log:   { icon:'alert', label:'fetchLog',             open:()=>{ renderFetchLog(); $('#dlgFetchLog').showModal(); } },
};
function updateAlerts(){
  _alertCounts = {
    fix:   findFixSuggestions().length,
    empty: findEmptyRecords().length,
    dup:   findLibraryDuplicateCandidates(50).length,
  };
  renderAlerts();
}
function renderAlerts(){
  const wrap = $('#alertsWrap');
  if(!wrap) return;
  const counts = { fix:_alertCounts.fix, empty:_alertCounts.empty, dup:_alertCounts.dup, log:fetchLog.length };
  const keys = Object.keys(ALERT_DEFS).filter(k=>counts[k] > 0);
  if(!keys.length){ wrap.style.display = 'none'; $('#menuAlerts').innerHTML = ''; return; }
  wrap.style.display = '';
  $('#alertsBadge').textContent = keys.reduce((s,k)=>s + counts[k], 0);
  $('#menuAlerts').innerHTML = keys.map(k=>{
    const d = ALERT_DEFS[k];
    return `<button data-alert="${k}"><span class="ic" data-ic="${d.icon}"></span><span>${esc(t(d.label))}</span><span class="logBadge alertItemBadge">${counts[k]}</span></button>`;
  }).join('');
  renderIcons($('#menuAlerts'));
}
function updateFetchLogBadge(){ renderAlerts(); }
function reasonText(e){
  if(e && e.rateLimited) return t('oaBudgetErr');
  return (e && e.message) || String(e);
}
function renderFetchLog(){
  const body = $('#fetchLogBody');
  if(!fetchLog.length){
    body.innerHTML = `<div class="logEmpty">${esc(t('logEmpty'))}</div>`;
    return;
  }
  body.innerHTML = fetchLog.map(en=>{
    const time = new Date(en.ts).toLocaleTimeString();
    const canRetry = !!en.itemId && lib.items.some(x=>x.id===en.itemId);
    const cls = en.status==='running' ? ' running' : en.status==='ok' ? ' ok' : en.status==='none' ? ' none' : '';
    const kind = en.kind==='corresponding' ? 'corresponding' : 'cited';
    const kindLabel = kind==='corresponding' ? t('logKindCorresponding') : t('logKindCited');
    return `<div class="logRow${cls}" data-log="${en.id}">
      <div class="logMain">
        <div class="logLabel"><span class="logKind ${kind}">${esc(kindLabel)}</span>${esc(en.label||'')}</div>
        <div class="logReason">${esc(en.reason||'')}</div>
        ${en.detail?`<div class="logDetail">${esc(en.detail)}</div>`:''}
      </div>
      <div class="logSide">
        <span class="logTime">${esc(time)}</span>
        ${canRetry?`<button class="tbtn logRetry" data-log-retry="${en.id}">${ic('retry')}${esc(t('logRetry'))}</button>`:''}
      </div>
    </div>`;
  }).join('');
  renderIcons(body);
}
async function retryLogEntry(en){
  const it = lib.items.find(x=>x.id===en.itemId);
  if(!it) return;
  const idx = fetchLog.indexOf(en);
  if(idx>=0) fetchLog.splice(idx,1);
  updateFetchLogBadge();
  if(en.kind==='corresponding') await refreshCorrespondingAuthors([it]);
  else await refreshCitedByCounts([it]);
  renderFetchLog();
}
bindMenu('#btnAlerts','#menuAlerts');
$('#menuAlerts').addEventListener('click', (e)=>{
  const b = e.target.closest('[data-alert]');
  if(!b) return;
  closeMenus();
  const d = ALERT_DEFS[b.dataset.alert];
  if(d) d.open();
});
$('#btnLogClear').addEventListener('click', ()=>{ fetchLog.length = 0; updateFetchLogBadge(); renderFetchLog(); });
$('#btnLogRetryAll').addEventListener('click', async ()=>{
  const citedIds = Array.from(new Set(fetchLog.filter(e=>e.kind!=='corresponding').map(e=>e.itemId).filter(Boolean)));
  const corrIds = Array.from(new Set(fetchLog.filter(e=>e.kind==='corresponding').map(e=>e.itemId).filter(Boolean)));
  const citedItems = citedIds.map(id=>lib.items.find(x=>x.id===id)).filter(Boolean);
  const corrItems = corrIds.map(id=>lib.items.find(x=>x.id===id)).filter(Boolean);
  if(!citedItems.length && !corrItems.length) return;
  fetchLog.length = 0; updateFetchLogBadge();
  if(citedItems.length) await refreshCitedByCounts(citedItems);
  if(corrItems.length) await refreshCorrespondingAuthors(corrItems);
  renderFetchLog();
});
$('#fetchLogBody').addEventListener('click', (e)=>{
  const b = e.target.closest('[data-log-retry]');
  if(!b) return;
  const en = fetchLog.find(x=>x.id===b.dataset.logRetry);
  if(en) retryLogEntry(en);
});

async function resolveOpenAlexWork(item){
  if(item.doi){
    try{ return await oaFetch('works/doi:' + encodeURIComponent(item.doi) + '?select=' + OA_SELECT); }catch(e){}
  }
  if(item.arxiv){
    try{ return await oaFetch('works/doi:' + encodeURIComponent('10.48550/arXiv.' + item.arxiv) + '?select=' + OA_SELECT); }catch(e){}
  }
  if(item.title){
    const d = await oaFetch('works?per-page=1&select=' + OA_SELECT + '&filter=title.search:' + encodeURIComponent(item.title.replace(/[:–—-]/g,' ')));
    if(d.results && d.results[0]) return d.results[0];
  }
  throw new Error(t('citeNotFound'));
}
async function fetchOpenAlexReferences(work){
  const ids = (work.referenced_works || []).map(oaId).filter(Boolean).slice(0, 60);
  const out = [];
  for(let i=0; i<ids.length; i+=50){
    const chunk = ids.slice(i, i+50);
    const d = await oaFetch('works?per-page=50&select=' + OA_SELECT + '&filter=openalex:' + chunk.join('|'));
    (d.results||[]).forEach(w=>out.push(w));
  }
  // preserve the reference order from referenced_works
  const order = new Map(ids.map((id,i)=>[id,i]));
  out.sort((a,b)=>(order.get(oaId(a.id))??0)-(order.get(oaId(b.id))??0));
  return out;
}
async function fetchOpenAlexCitedBy(work, cap){
  // Fetch every citing work via cursor pagination (not just the top page). A
  // generous safety cap keeps a pathologically-cited paper from flooding the
  // dialog / OpenAlex; the count label still reports the true total.
  const MAX = cap || 2000;
  const out = [];
  let cursor = '*', total = 0;
  while(cursor && out.length < MAX){
    const d = await oaFetch('works?per-page=200&sort=cited_by_count:desc&select=' + OA_SELECT +
      '&cursor=' + encodeURIComponent(cursor) + '&filter=cites:' + oaId(work.id));
    total = (d.meta && d.meta.count) || total;
    (d.results || []).forEach(w=>out.push(w));
    cursor = d.meta && d.meta.next_cursor;
    if(!d.results || !d.results.length) break;
  }
  return { total, works: out.slice(0, MAX) };
}

async function fetchArxiv(id){
  // The arXiv Atom API has no CORS headers, so we use DataCite (every arXiv
  // paper has a registered DOI 10.48550/arXiv.<id>).
  const r = await fetch('https://api.datacite.org/dois/' + encodeURIComponent('10.48550/arXiv.' + id));
  if(!r.ok) throw new Error(r.status===404 ? 'arXiv: entry not found' : 'DataCite HTTP ' + r.status);
  const at = (await r.json()).data.attributes;
  const authors = (at.creators||[]).map(c=>{
    if(c.familyName) return { family:c.familyName, given:c.givenName||'' };
    const name = (c.name||'').trim();
    if(name.includes(',')){ const p = name.split(','); return { family:p[0].trim(), given:p.slice(1).join(',').trim() }; }
    const p = name.split(/\s+/); return { family:p.pop()||'', given:p.join(' ') };
  });
  return newItem({
    type:'preprint',
    title: stripTags((at.titles && at.titles[0] && at.titles[0].title) || ''),
    authors,
    journal:'arXiv',
    year: at.publicationYear ? String(at.publicationYear) : '',
    arxiv: id,
    url: at.url || ('https://arxiv.org/abs/' + id),
    abstract: stripTags((at.descriptions && at.descriptions[0] && at.descriptions[0].description) || ''),
  });
}

/* ---------------------------------------------------------------
   BibTeX
---------------------------------------------------------------- */
const BIB_TYPE_OUT = { article:'article', preprint:'misc', book:'book', chapter:'incollection',
  inproceedings:'inproceedings', thesis:'phdthesis', report:'techreport', web:'misc', misc:'misc' };
const BIB_TYPE_IN = { article:'article', book:'book', incollection:'chapter', inbook:'chapter',
  inproceedings:'inproceedings', conference:'inproceedings', phdthesis:'thesis', mastersthesis:'thesis',
  techreport:'report', misc:'misc', unpublished:'misc', online:'web', electronic:'web' };

function bibEscape(s){ return String(s==null?'':s); }
function itemToBibTeX(item){
  const type = BIB_TYPE_OUT[item.type] || 'misc';
  const f = [];
  const add = (k,v)=>{ if(v) f.push(`  ${k} = {${bibEscape(v)}}`); };
  add('title', item.title);
  add('author', (item.authors||[]).map(a=>a.given ? `${a.family}, ${a.given}` : a.family).join(' and '));
  if(item.type==='inproceedings' || item.type==='chapter') add('booktitle', item.journal);
  else if(item.type!=='book') add('journal', item.journal);
  add('year', item.year);
  add('volume', item.volume);
  add('number', item.issue);
  add('pages', normalizeRange(item.pages));
  add('publisher', item.publisher);
  add('doi', item.doi);
  add('correspondingauthor', item.correspondingAuthors);
  if(item.arxiv){ add('eprint', item.arxiv); add('archiveprefix','arXiv'); }
  add('url', item.url);
  if(item.tags && item.tags.length) add('keywords', item.tags.join(', '));
  return `@${type}{${item.citekey || genCitekey(item)},\n${f.join(',\n')}\n}\n`;
}
function cleanBibValue(v){
  return v
    .replace(/\\[a-zA-Z]+\s*/g,'')  // drop latex commands
    .replace(/[{}]/g,'')
    .replace(/\s+/g,' ').trim();
}
function parseBibTeX(text, opts){
  opts = Object.assign({importKeywordsAsTags:false}, opts || {});
  const out = [];
  let i = 0;
  while(true){
    const at = text.indexOf('@', i);
    if(at < 0) break;
    let j = at + 1;
    while(j < text.length && /[a-zA-Z]/.test(text[j])) j++;
    const etype = text.slice(at+1, j).toLowerCase();
    while(j < text.length && /\s/.test(text[j])) j++;
    if(text[j] !== '{'){ i = at + 1; continue; }
    // find matching close brace
    let depth = 1, k = j + 1;
    while(k < text.length && depth > 0){
      if(text[k]==='{') depth++;
      else if(text[k]==='}') depth--;
      k++;
    }
    const body = text.slice(j+1, k-1);
    i = k;
    if(etype==='comment' || etype==='preamble' || etype==='string') continue;
    // citekey = up to first comma
    const ci = body.indexOf(',');
    const citekey = (ci<0 ? body : body.slice(0,ci)).trim();
    const fields = {};
    let p = ci < 0 ? body.length : ci + 1;
    while(p < body.length){
      // field name
      while(p < body.length && /[\s,]/.test(body[p])) p++;
      let q = p;
      while(q < body.length && /[^=\s]/.test(body[q])) q++;
      const name = body.slice(p,q).trim().toLowerCase();
      while(q < body.length && /\s/.test(body[q])) q++;
      if(body[q] !== '='){ break; }
      q++;
      while(q < body.length && /\s/.test(body[q])) q++;
      let val = '';
      if(body[q]==='{'){
        let d = 1, r = q + 1;
        while(r < body.length && d > 0){
          if(body[r]==='{') d++;
          else if(body[r]==='}') d--;
          if(d>0) val += body[r];
          r++;
        }
        p = r;
      }else if(body[q]==='"'){
        let r = q + 1;
        while(r < body.length && body[r] !== '"'){ val += body[r]; r++; }
        p = r + 1;
      }else{
        let r = q;
        while(r < body.length && body[r] !== ',' ) { val += body[r]; r++; }
        p = r;
      }
      if(name) fields[name] = cleanBibValue(val);
    }
    // map to item
    const authors = (fields.author||'').split(/\s+and\s+/i).filter(Boolean).map(a=>{
      if(a.includes(',')){ const parts = a.split(','); return { family:parts[0].trim(), given:parts.slice(1).join(',').trim() }; }
      const parts = a.trim().split(/\s+/); return { family: parts.pop()||'', given: parts.join(' ') };
    });
    let itype = BIB_TYPE_IN[etype] || 'misc';
    if((fields.archiveprefix||'').toLowerCase()==='arxiv' || fields.eprint) itype = itype==='misc' ? 'preprint' : itype;
    out.push(newItem({
      type: itype,
      title: fields.title || '',
      authors,
      journal: fields.journal || fields.booktitle || '',
      year: fields.year || '',
      volume: fields.volume || '', issue: fields.number || '',
      pages: normalizeRange(fields.pages || ''), publisher: fields.publisher || fields.school || fields.institution || '',
      doi: normDoi(fields.doi || ''), arxiv: fields.eprint || '',
      url: fields.url || '',
      abstract: fields.abstract || '',
      correspondingAuthors: fields.correspondingauthor || fields.corresponding || '',
      tags: opts.importKeywordsAsTags ? (fields.keywords||'').split(/[,;]/).map(s=>s.trim()).filter(Boolean) : [],
      citekey,
    }));
  }
  return out;
}

function splitListField(s){
  return String(s||'').split(/[;|]/).map(x=>x.trim()).filter(Boolean);
}
function parseCsvRows(text){
  const rows = [];
  let row = [], val = '', q = false;
  for(let i=0;i<text.length;i++){
    const c = text[i], n = text[i+1];
    if(q){
      if(c==='"' && n==='"'){ val += '"'; i++; }
      else if(c==='"') q = false;
      else val += c;
    }else if(c==='"') q = true;
    else if(c===','){ row.push(val); val = ''; }
    else if(c==='\n'){
      row.push(val); rows.push(row); row = []; val = '';
    }else if(c==='\r'){
      // ignore CR; LF handles row end
    }else val += c;
  }
  if(val || row.length){ row.push(val); rows.push(row); }
  return rows;
}
function paperpileType(t){
  t = String(t||'').toLowerCase();
  if(t.includes('journal')) return 'article';
  if(t.includes('book chapter')) return 'chapter';
  if(t.includes('book')) return 'book';
  if(t.includes('conference')) return 'inproceedings';
  if(t.includes('thesis')) return 'thesis';
  if(t.includes('web')) return 'web';
  return 'misc';
}
function paperpileAuthors(arrOrText){
  if(Array.isArray(arrOrText)){
    return arrOrText.map(a=>({family:a.last||'', given:a.first||''})).filter(a=>a.family||a.given);
  }
  return String(arrOrText||'').split(/\s*,\s*/).map(s=>s.trim()).filter(Boolean).map(name=>{
    const parts = name.split(/\s+/);
    return {family:parts.pop()||'', given:parts.join(' ')};
  });
}
function parsePaperpileCsv(text, opts){
  opts = Object.assign({importKeywordsAsTags:false}, opts || {});
  const rows = parseCsvRows(text).filter(r=>r.some(v=>String(v||'').trim()));
  if(rows.length<2) return [];
  const head = rows[0].map(h=>h.trim());
  const idx = (name)=>head.indexOf(name);
  const get = (r,name)=>{ const i=idx(name); return i>=0 ? (r[i]||'').trim() : ''; };
  return rows.slice(1).map(r=>newItem({
    type: paperpileType(get(r,'Item type')),
    title: get(r,'Title'),
    authors: paperpileAuthors(get(r,'Authors')),
    journal: get(r,'Journal') || get(r,'Journal (full title)') || get(r,'Book title') || get(r,'Website name'),
    journalAbbr: get(r,'Journal'),
    year: (get(r,'Publication year').match(/\d{4}/)||[''])[0],
    volume: get(r,'Volume'), issue: get(r,'Issue'), pages: normalizeRange(get(r,'Pages')),
    publisher: get(r,'Publisher'),
    doi: normDoi(get(r,'DOI')),
    url: splitListField(get(r,'URLs'))[0] || '',
    abstract: get(r,'Abstract'),
    notes: get(r,'Notes'),
    tags: opts.importKeywordsAsTags ? splitListField(get(r,'Keywords')) : [],
    collections: splitListField(get(r,'Folders filed in')),
    citekey: '',
  }));
}
function parsePaperpileJson(text, opts){
  opts = Object.assign({importKeywordsAsTags:false}, opts || {});
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);
  if(arr.some(x=>x && (x.type || Array.isArray(x.authors) || x.dateAdded))){
    return arr.map(x=>newItem(Object.assign({}, x, {
      id: uid(),
      doi: normDoi(x.doi || ''),
      pages: normalizeRange(x.pages || ''),
      tags: Array.isArray(x.tags) ? x.tags : splitListField(x.tags || ''),
      collections: Array.isArray(x.collections) ? x.collections.filter(Boolean) : splitListField(x.collections || ''),
      attachments: [],
      dateAdded: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    })));
  }
  return arr.map(x=>newItem({
    type: paperpileType(x.kind || x.pubtype),
    title: x.title || '',
    authors: paperpileAuthors(x.author || []),
    journal: x.journal || x.journalfull || '',
    journalAbbr: x.journal || '',
    year: x.published && x.published.year ? String(x.published.year) : '',
    volume: x.volume || '', issue: x.issue || x.number || '', pages: normalizeRange(x.pages || ''),
    publisher: x.publisher || '',
    doi: normDoi(x.doi || ''),
    url: Array.isArray(x.url) ? (x.url[0] || '') : (x.url || ''),
    abstract: x.abstract || '',
    notes: x.notes || '',
    tags: opts.importKeywordsAsTags ? splitListField(x.keywords || '') : [],
    collections: Array.isArray(x.foldersNamed) ? x.foldersNamed.filter(Boolean) : [],
    citekey: x.citekey || '',
  }));
}

/* ---------------------------------------------------------------
   Zotero RDF (.rdf) — bibliographic data PLUS collection hierarchy.
   Zotero represents each folder as a <z:Collection> whose <dcterms:hasPart>
   entries reference either items (by their rdf:about URI) or sub-collections
   (by #collection_N), so we can rebuild the full tree and membership.
   Note: linked files / web snapshots (the files/ subfolder) are not imported —
   only the reference metadata and folder structure.
---------------------------------------------------------------- */
// Zotero itemType → Paper Library type
const ZOTERO_TYPE_IN = {
  journalArticle:'article', magazineArticle:'article', newspaperArticle:'article',
  conferencePaper:'inproceedings', proceedings:'inproceedings',
  book:'book', bookSection:'chapter', encyclopediaArticle:'chapter', dictionaryEntry:'chapter',
  thesis:'thesis', report:'report', preprint:'preprint',
  webpage:'web', blogPost:'web', forumPost:'web', document:'misc',
};
// fallback from the bib:* element name when z:itemType is absent
const RDF_BIB_TYPE = { Article:'article', Book:'book', BookSection:'chapter',
  ConferenceProceedings:'inproceedings', Thesis:'thesis', Report:'report',
  Document:'web', Manuscript:'misc', Patent:'misc', Data:'misc' };
function parseZoteroRdf(text, opts){
  opts = Object.assign({importKeywordsAsTags:false}, opts||{});
  const RDF_NS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if(doc.getElementsByTagName('parsererror').length || !doc.documentElement) throw new Error('Invalid RDF/XML');
  const root = doc.documentElement;
  const aboutOf = el => el.getAttributeNS(RDF_NS,'about') || el.getAttribute('rdf:about') || '';
  const resOf = el => el.getAttributeNS(RDF_NS,'resource') || el.getAttribute('rdf:resource') || '';
  const kids = (el, local) => Array.from(el.children).filter(c => c.localName === local);
  const kid = (el, local) => kids(el, local)[0] || null;
  const txt = (el, local) => { const c = el && kid(el, local); return c ? c.textContent.trim() : ''; };

  // dc:identifier can carry "DOI 10.…" / "ISSN …" as plain text
  const doiFromIdentifiers = (el) => {
    for(const id of kids(el,'identifier')){
      const m = id.textContent.trim().match(/^DOI\s+(\S+)/i);
      if(m) return m[1];
    }
    return '';
  };
  const readJournal = (el) => ({ title: txt(el,'title'), volume: txt(el,'volume'),
    issue: txt(el,'number'), doi: doiFromIdentifiers(el) });

  // ---- pass 1: classify top-level nodes (items / journals / collections) ----
  const journals = {};
  const itemEls = [];
  const collNodes = [];
  for(const el of Array.from(root.children)){
    const local = el.localName;
    if(local === 'Collection'){
      collNodes.push({ about: aboutOf(el), title: txt(el,'title'),
        parts: kids(el,'hasPart').map(resOf).filter(Boolean) });
      continue;
    }
    if(local === 'Journal' || local === 'Series'){ const a = aboutOf(el); if(a) journals[a] = readJournal(el); continue; }
    const itype = txt(el,'itemType');
    if(itype === 'attachment' || itype === 'note') continue; // files/notes aren't imported
    if(itype || RDF_BIB_TYPE[local]) itemEls.push(el);
  }

  // ---- rebuild the collection tree (incl. empty/nested) and item membership ----
  const itemColls = buildRdfCollections(collNodes);

  // ---- pass 2: convert item elements ----
  const persons = (el, local) => {
    const wrap = kid(el, local);
    if(!wrap) return [];
    return Array.from(wrap.getElementsByTagNameNS('*','Person')).map(p=>({
      family: txt(p,'surname'), given: txt(p,'givenName'),
    })).filter(a => a.family || a.given);
  };
  const itemUrl = (el) => {
    for(const id of kids(el,'identifier')){
      const uri = kid(id,'URI');
      const v = uri ? txt(uri,'value') : '';
      if(v) return v;
    }
    const ab = aboutOf(el);
    return /^https?:/i.test(ab) ? ab : '';
  };
  const items = [];
  for(const el of itemEls){
    const about = aboutOf(el);
    const itype = txt(el,'itemType');
    // journal: referenced by ISSN urn, inline <bib:Journal>, or a bare title
    let journal = null;
    const partOf = kid(el,'isPartOf');
    if(partOf){
      const jref = resOf(partOf);
      if(jref && journals[jref]) journal = journals[jref];
      else{
        const inlineJ = kid(partOf,'Journal') || kid(partOf,'Series');
        if(inlineJ) journal = readJournal(inlineJ);
        else{ const jt = txt(partOf,'title'); if(jt) journal = { title:jt, volume:'', issue:'', doi:'' }; }
      }
    }
    const url = itemUrl(el);
    let doi = txt(el,'doi') || doiFromIdentifiers(el) || (journal && journal.doi) || '';
    if(!doi){ const m = decodeURIComponent(url||'').match(/10\.\d{4,9}\/[^\s"'<>?#]+/); if(m) doi = m[0]; }
    let arxiv = '';
    const am = (url||'').match(/arxiv\.org\/(?:abs|pdf)\/([a-z\-]+(?:\.[A-Z]{2})?\/\d{7}|\d{4}\.\d{4,5})/i);
    if(am) arxiv = am[1];
    else { const dm = (doi||'').match(/^10\.48550\/arxiv\.(.+)$/i); if(dm){ arxiv = dm[1]; doi = ''; } }
    let authors = persons(el, 'authors');
    if(!authors.length) authors = persons(el, 'editors'); // fall back to editors
    // tags: z:Tag are real tags (always); z:AutomaticTag come from keywords (gated)
    const tags = [];
    for(const s of kids(el,'subject')){
      const manual = kid(s,'Tag'), auto = kid(s,'AutomaticTag');
      if(manual){ const v = txt(manual,'value') || manual.textContent.trim(); if(v) tags.push(v); }
      else if(auto){ if(opts.importKeywordsAsTags){ const v = txt(auto,'value') || auto.textContent.trim(); if(v) tags.push(v); } }
      else { const v = s.textContent.trim(); if(v) tags.push(v); }
    }
    let publisher = '';
    const pub = kid(el,'publisher');
    if(pub){ const nm = pub.getElementsByTagNameNS('*','name')[0]; publisher = nm ? nm.textContent.trim() : pub.textContent.trim(); }
    items.push(newItem({
      type: ZOTERO_TYPE_IN[itype] || RDF_BIB_TYPE[el.localName] || 'misc',
      title: txt(el,'title'),
      authors,
      journal: journal ? journal.title : '',
      year: (txt(el,'date').match(/\d{4}/) || [''])[0],
      volume: (journal && journal.volume) || txt(el,'volume'),
      issue: (journal && journal.issue) || txt(el,'number'),
      pages: normalizeRange(txt(el,'pages')),
      publisher,
      doi: normDoi(doi||''),
      arxiv,
      url,
      abstract: txt(el,'abstract'),
      notes: txt(el,'description'),
      tags: Array.from(new Set(tags)),
      collections: itemColls.get(about) ? Array.from(itemColls.get(about)) : [],
    }));
  }
  return items;
}

/* ---------------------------------------------------------------
   RIS
---------------------------------------------------------------- */
const RIS_TYPE_OUT = { article:'JOUR', preprint:'JOUR', book:'BOOK', chapter:'CHAP',
  inproceedings:'CONF', thesis:'THES', report:'RPRT', web:'ELEC', misc:'GEN' };
const RIS_TYPE_IN = { JOUR:'article', BOOK:'book', CHAP:'chapter', CONF:'inproceedings',
  CPAPER:'inproceedings', THES:'thesis', RPRT:'report', ELEC:'web', GEN:'misc', EJOUR:'article' };

function itemToRIS(item){
  const L = [];
  const add = (k,v)=>{ if(v) L.push(`${k}  - ${v}`); };
  L.push(`TY  - ${RIS_TYPE_OUT[item.type]||'GEN'}`);
  (item.authors||[]).forEach(a=>add('AU', a.given ? `${a.family}, ${a.given}` : a.family));
  add('TI', item.title);
  add('T2', item.journal);
  add('PY', item.year);
  add('VL', item.volume);
  add('IS', item.issue);
  if(item.pages){
    const pp = String(item.pages).split(/[-–—]+/);
    add('SP', pp[0].trim());
    if(pp[1]) add('EP', pp[1].trim());
  }
  add('PB', item.publisher);
  add('DO', item.doi);
  add('UR', item.url);
  add('C1', item.correspondingAuthors);
  (item.tags||[]).forEach(tg=>add('KW', tg));
  add('AB', item.abstract);
  L.push('ER  - ');
  return L.join('\r\n') + '\r\n';
}
function parseRIS(text){
  const out = [];
  let cur = null, sp = '', ep = '';
  for(const rawLine of text.split(/\r?\n/)){
    const m = rawLine.match(/^([A-Z][A-Z0-9])\s{2}-\s?(.*)$/);
    if(!m) continue;
    const tag = m[1], val = m[2].trim();
    if(tag==='TY'){
      cur = newItem({ type: RIS_TYPE_IN[val] || 'misc' });
      sp = ''; ep = '';
      continue;
    }
    if(!cur) continue;
    switch(tag){
      case 'ER':
        cur.pages = sp ? (ep ? `${sp}–${ep}` : sp) : normalizeRange(cur.pages);
        out.push(cur); cur = null; break;
      case 'AU': case 'A1': case 'A2': {
        if(val.includes(',')){ const p = val.split(','); cur.authors.push({family:p[0].trim(), given:p.slice(1).join(',').trim()}); }
        else { const p = val.split(/\s+/); cur.authors.push({family:p.pop()||'', given:p.join(' ')}); }
        break;
      }
      case 'TI': case 'T1': cur.title = cur.title || val; break;
      case 'T2': case 'JO': case 'JF': case 'JA': cur.journal = cur.journal || val; break;
      case 'PY': case 'Y1': cur.year = cur.year || (val.match(/\d{4}/)||[''])[0]; break;
      case 'VL': cur.volume = val; break;
      case 'IS': cur.issue = val; break;
      case 'SP': sp = val; break;
      case 'EP': ep = val; break;
      case 'PB': cur.publisher = val; break;
      case 'DO': cur.doi = normDoi(val); break;
      case 'UR': cur.url = cur.url || val; break;
      case 'C1': if(/correspond/i.test(val) || !cur.correspondingAuthors) cur.correspondingAuthors = val; break;
      case 'KW': if(val) cur.tags.push(val); break;
      case 'AB': case 'N2': cur.abstract = cur.abstract || val; break;
    }
  }
  if(cur){ cur.pages = sp ? (ep ? `${sp}–${ep}` : sp) : normalizeRange(cur.pages); out.push(cur); }
  return out;
}

/* ---------------------------------------------------------------
   Citation text
---------------------------------------------------------------- */
function citationAuthors(item, opts){
  let list = item.authors || [];
  const style = citationStyleKey(opts.style);
  if(opts.authorScope==='corresponding' && item.correspondingAuthors){
    const corrAuthors = citationTextToAuthors(item.correspondingAuthors);
    const nCorr = corrAuthors.length;
    const corr = joinCitationAuthors(corrAuthors.map(a=>authorName(a, style)), style);
    // omitted co-authors → "et al." is required
    return corr + (list.length > nCorr ? ' et al.' : '');
  }
  if(opts.authorScope==='first'){
    const first = list[0] ? authorName(list[0], style) : '';
    return first && list.length > 1 ? first + ' et al.' : first;
  }
  return joinCitationAuthors(list.map(a=>authorName(a, style)), style);
}
function sentenceEnd(s){ return s ? s.replace(/\.+$/,'') + '. ' : ''; }
function sentenceEndHtml(s){
  if(!s) return '';
  // Punctuation may sit inside a trailing formatting tag ("<i>et al.</i>").
  // Treat it as the actual end mark instead of producing "et al..".
  return /[.!?](?:<\/[^>]+>)*$/.test(s) ? s + ' ' : s + '. ';
}
function citationAuthorsHtml(item, opts){
  return esc(citationAuthors(item, opts)).replace(/\bet al\./g, '<i>et al.</i>');
}
function itemToCitation(item, opts){
  opts = Object.assign({style:'acs', includeTitle:true, authorScope:'all', includeUrl:true}, opts || {});
  const style = citationStyleKey(opts.style);
  const auth = citationAuthors(item, opts);
  const journal = journalDisplay(item);
  const pages = normalizeRange(item.pages);
  const title = opts.includeTitle && item.title ? item.title.replace(/\.?$/,'.') : '';
  let s = '';
  if(style==='nature'){
    s = sentenceEnd(auth);
    if(title) s += title + ' ';
    if(journal) s += journal + ' ';
    if(item.volume) s += item.volume + ', ';
    if(pages) s += pages + ' ';
    if(item.year) s += `(${item.year}).`;
    return s.trim();
  }
  if(style==='science'){
    s = auth ? auth + ', ' : '';
    if(title) s += title + ' ';
    if(journal) s += journal + ' ';
    if(item.volume) s += item.volume + ', ';
    if(pages) s += pages + ' ';
    if(item.year) s += `(${item.year}).`;
  }else if(style==='rsc'){
    s = auth ? auth + ', ' : '';
    if(title) s += title + ' ';
    const parts = [journal, item.year, item.volume, pages].filter(Boolean);
    s += parts.join(', ');
    s = s.trim().replace(/,$/,'') + '.';
  }else if(style==='csj'){
    s = auth ? auth + ', ' : '';
    if(title) s += title + ' ';
    if(journal) s += journal + ' ';
    if(item.year) s += item.year;
    if(item.volume) s += ', ' + item.volume;
    if(pages) s += ', ' + pages;
    s = s.trim().replace(/,$/,'') + '.';
  }else if(style==='gdch'){
    s = auth ? auth + ', ' : '';
    if(title) s += '“' + title.replace(/\.$/,'') + '”, ';
    if(journal) s += journal + ' ';
    if(item.year) s += item.year;
    if(item.volume) s += ', ' + item.volume;
    if(pages) s += ', ' + pages;
    s = s.trim().replace(/,$/,'') + '.';
  }else{
    s = sentenceEnd(auth);
    if(title) s += title + ' ';
    if(journal) s += journal + ' ';
    if(item.year) s += item.year;
    if(item.volume) s += ', ' + item.volume;
    if(pages) s += ', ' + pages;
    s = s.trim().replace(/,$/,'') + '.';
  }
  if(opts.includeUrl !== false && item.doi) s += ' https://doi.org/' + item.doi;
  return s;
}
function itemToCitationHtml(item, opts){
  opts = Object.assign({style:'acs', includeTitle:true, authorScope:'all', includeUrl:true}, opts || {});
  const style = citationStyleKey(opts.style);
  const auth = citationAuthorsHtml(item, opts);
  const title = opts.includeTitle && item.title ? esc(item.title.replace(/\.?$/, '.')) : '';
  const journal = journalDisplay(item);
  const pages = normalizeRange(item.pages);
  const j = journal ? `<i>${esc(journal)}</i>` : '';
  const y = item.year ? `<b>${esc(item.year)}</b>` : '';
  const vol = item.volume ? ((style==='nature' || style==='science') ? `<b>${esc(item.volume)}</b>` : `<i>${esc(item.volume)}</i>`) : '';
  const p = pages ? esc(pages) : '';
  let html = '';
  if(style==='nature'){
    html = [auth ? sentenceEndHtml(auth).trim() : '', title, j, vol ? vol + ',' : '', p, item.year ? `(${esc(item.year)}).` : '']
      .filter(Boolean).join(' ').replace(/\s+,/g, ',').trim();
  }else if(style==='science'){
    html = [auth ? auth + ',' : '', title, j, vol ? vol + ',' : '', p, item.year ? `(${esc(item.year)}).` : '']
      .filter(Boolean).join(' ').replace(/\s+,/g, ',').trim();
  }else if(style==='rsc'){
    html = auth ? auth + ', ' : '';
    if(title) html += title + ' ';
    html += [j, y, vol, p].filter(Boolean).join(', ');
    html = html.trim().replace(/,$/, '') + '.';
  }else if(style==='csj'){
    html = auth ? auth + ', ' : '';
    if(title) html += title + ' ';
    html += [j, y].filter(Boolean).join(' ');
    if(vol) html += (html ? ', ' : '') + vol;
    if(p) html += (html ? ', ' : '') + p;
    html = html.trim().replace(/,$/, '') + '.';
  }else if(style==='gdch'){
    html = auth ? auth + ', ' : '';
    if(title) html += '&ldquo;' + title.replace(/\.$/,'') + '&rdquo;, ';
    html += [j, y].filter(Boolean).join(' ');
    if(vol) html += (html ? ', ' : '') + vol;
    if(p) html += (html ? ', ' : '') + p;
    html = html.trim().replace(/,$/, '') + '.';
  }else{
    html = [auth ? sentenceEndHtml(auth).trim() : '', title, j, y].filter(Boolean).join(' ');
    if(vol) html += (html ? ', ' : '') + vol;
    if(p) html += (html ? ', ' : '') + p;
    html = html.trim().replace(/,$/, '') + '.';
  }
  if(opts.includeUrl !== false && item.doi){
    const doi = esc(item.doi);
    html += ` <a href="https://doi.org/${doi}" target="_blank" rel="noopener noreferrer">https://doi.org/${doi}</a>`;
  }
  return html;
}
async function copyCitation(item, opts){
  const text = itemToCitation(item, opts);
  const html = itemToCitationHtml(item, opts);
  if(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write){
    try{
      await navigator.clipboard.write([new ClipboardItem({
        'text/plain': new Blob([text], {type:'text/plain'}),
        'text/html': new Blob([html], {type:'text/html'}),
      })]);
      return;
    }catch(e){ /* fall back to plain text */ }
  }
  await navigator.clipboard.writeText(text);
}

/* ---------------------------------------------------------------
   Filtering / sorting
---------------------------------------------------------------- */
function isItemTrashed(it){
  return !!(it && (it.trashed || it.trashedAt));
}
function makeTrashUndoRecord(it){
  if(!it) return null;
  return {
    id: it.id,
    trashed: !!it.trashed,
    trashedAt: it.trashedAt || '',
    dateModified: it.dateModified || '',
  };
}
function pushUndoEntry(entry){
  if(!entry || !entry.type) return;
  entry.at = new Date().toISOString();
  undoStack.push(entry);
  if(undoStack.length > 50) undoStack.shift();
}
function pushTrashUndo(records){
  records = (records || []).filter(Boolean);
  if(!records.length) return;
  pushUndoEntry({ type:'trash', records });
}
function makeItemCollectionUndoRecord(it){
  if(!it) return null;
  return {
    id: it.id,
    collections: Array.isArray(it.collections) ? it.collections.slice() : [],
    trashed: !!it.trashed,
    trashedAt: it.trashedAt || '',
    dateModified: it.dateModified || '',
  };
}
function pushItemCollectionUndo(records){
  records = (records || []).filter(Boolean);
  if(records.length) pushUndoEntry({type:'item-collection', records});
}
function makeCollectionMoveUndoRecord(c){
  if(!c) return null;
  return { id: c.id, parent: c.parent || '' };
}
function pushCollectionMoveUndo(records){
  records = (records || []).filter(Boolean);
  if(!records.length) return;
  pushUndoEntry({
    type:'collection-move',
    records,
    filterColl: filter.coll,
    selectedCollectionIds: Array.from(selectedCollectionIds || []),
    collectionSelectAnchorId: collectionSelectAnchorId || ''
  });
}
function validFilterCollectionId(id){
  if(['all','uncat','starred','myPublication','trash'].includes(id)) return true;
  return !!lib.collections.find(c=>c.id===id);
}
function undoTrashMove(entry){
  const restored = [];
  (entry.records || []).forEach(rec=>{
    const it = lib.items.find(x=>x.id===rec.id);
    if(!it) return;
    it.trashed = !!rec.trashed;
    it.trashedAt = rec.trashedAt || '';
    it.dateModified = rec.dateModified || new Date().toISOString();
    restored.push(it);
  });
  if(!restored.length) return false;
  selectedId = restored[0].id;
  touch();
  renderAll();
  showToast(lang==='ja' ? `ゴミ箱への移動を取り消しました（${restored.length}件）` : `Undid move to trash (${restored.length})`);
  return true;
}
function undoCollectionMove(entry){
  const restoredIds = [];
  (entry.records || []).forEach(rec=>{
    const c = lib.collections.find(x=>x.id===rec.id);
    if(!c) return;
    const oldParent = rec.parent || '';
    if(oldParent && (!lib.collections.find(x=>x.id===oldParent) || isCollectionDescendant(c.id, oldParent))) return;
    c.parent = oldParent;
    restoredIds.push(c.id);
  });
  if(!restoredIds.length) return false;
  restoredIds.forEach(openCollectionAncestors);
  selectedCollectionIds = new Set(restoredIds);
  collectionSelectAnchorId = restoredIds[0] || null;
  if(entry.filterColl && validFilterCollectionId(entry.filterColl)) filter.coll = entry.filterColl;
  touch();
  renderAll();
  showToast(lang==='ja' ? `フォルダ移動を取り消しました（${restoredIds.length}件）` : `Undid folder move (${restoredIds.length})`);
  return true;
}
function undoItemCollectionMove(entry){
  const restoredIds = [];
  let refreshAlerts = false;
  (entry.records || []).forEach(rec=>{
    const it = lib.items.find(x=>x.id===rec.id);
    if(!it) return;
    if(isItemTrashed(it)!==!!rec.trashed) refreshAlerts = true;
    it.collections = Array.isArray(rec.collections) ? rec.collections.slice() : [];
    it.trashed = !!rec.trashed;
    it.trashedAt = rec.trashedAt || '';
    it.dateModified = rec.dateModified || new Date().toISOString();
    restoredIds.push(it.id);
  });
  if(!restoredIds.length) return false;
  touch();
  renderAfterCollectionDrop(restoredIds, {refreshAlerts});
  showToast(lang==='ja' ? `コレクションへの移動を取り消しました（${restoredIds.length}件）` : `Undid collection move (${restoredIds.length})`);
  return true;
}
function undoLastAction(){
  while(undoStack.length){
    const entry = undoStack.pop();
    if(entry.type==='trash' && undoTrashMove(entry)) return true;
    if(entry.type==='collection-move' && undoCollectionMove(entry)) return true;
    if(entry.type==='item-collection' && undoItemCollectionMove(entry)) return true;
  }
  showToast(lang==='ja' ? '取り消せる操作はありません' : 'No action to undo');
  return false;
}
function undoLastTrashMove(){
  return undoLastAction();
}
function restoreDraggedItems(ids, opts){
  opts = opts || {};
  const idSet = new Set(ids || []);
  const targets = lib.items.filter(x=>idSet.has(x.id));
  let changed = 0;
  targets.forEach(it=>{
    let itemChanged = false;
    if(isItemTrashed(it)){ it.trashed = false; it.trashedAt = ''; itemChanged = true; }
    if(opts.uncategorize && it.collections && it.collections.length){ it.collections = []; itemChanged = true; }
    if(opts.collectionId && !(it.collections||[]).includes(opts.collectionId)){ it.collections.push(opts.collectionId); itemChanged = true; }
    if(itemChanged){ it.dateModified = new Date().toISOString(); changed++; }
  });
  return changed;
}
function visibleItems(){
  const q = filter.query.toLowerCase();
  const adv = filter.advanced || {};
  const advTerms = String(adv.terms||'').toLowerCase().split(/\s+/).filter(Boolean);
  const collIds = ['all','uncat','starred','myPublication','trash'].includes(filter.coll) ? [] : collectionWithDescendants(filter.coll);
  return lib.items.filter(it=>{
    const isTrashed = isItemTrashed(it);
    if(filter.coll==='trash'){
      if(!isTrashed) return false;
      // Trash is a system view: show every trashed item regardless of
      // search text, tag filters, advanced-search terms, year filters,
      // column filters, or collection membership.
      return true;
    }
    else if(isTrashed) return false;
    if(filter.coll==='uncat'){ if(it.collections.length) return false; }
    else if(filter.coll==='starred'){ if(!it.starred) return false; }
    else if(filter.coll==='myPublication'){ if(!it.myPublication) return false; }
    else if(filter.coll!=='all'){ if(!it.collections.some(id=>collIds.includes(id))) return false; }
    if(filter.coll!=='trash' && filter.tags.size){ for(const tg of filter.tags){ if(!it.tags.includes(tg)) return false; } }
    if(q){
      const hay = [it.title, (it.authors||[]).map(a=>a.family+' '+a.given).join(' '),
        it.journal, it.journalAbbr, it.correspondingAuthors, it.year, it.doi, it.arxiv, it.citekey, it.notes, (it.tags||[]).join(' ')].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    if(filter.coll!=='trash' && advTerms.length){
      const values = {
        title: it.title,
        authors: (it.authors||[]).map(a=>a.family+' '+a.given).join(' ') + ' ' + (it.correspondingAuthors||''),
        journal: [it.journal, it.journalAbbr].join(' '),
        notes: [it.notes, it.abstract, (it.tags||[]).join(' ')].join(' '),
      };
      const hay = String(adv.field==='all' ? Object.values(values).join(' ') + ' ' + [it.year,it.doi,it.arxiv,it.citekey].join(' ') : values[adv.field] || '').toLowerCase();
      const ok = adv.mode==='or' ? advTerms.some(term=>hay.includes(term)) : advTerms.every(term=>hay.includes(term));
      if(!ok) return false;
    }
    const yr = parseInt(it.year, 10);
    if(filter.coll!=='trash' && adv.yearFrom && (!yr || yr < parseInt(adv.yearFrom,10))) return false;
    if(filter.coll!=='trash' && adv.yearTo && (!yr || yr > parseInt(adv.yearTo,10))) return false;
    // In the Trash view, always show trashed records.
    // This prevents stale column filters or tag/search state from making
    // the sidebar count nonzero while the trash list appears empty.
    if(filter.coll!=='trash' && !passesColFilters(it)) return false;
    return true;
  }).sort((a,b)=>{
    let va, vb, numeric=false;
    switch(sortKey){
      case 'title': va = a.title.toLowerCase(); vb = b.title.toLowerCase(); break;
      case 'notes': va = (a.notes||'').toLowerCase(); vb = (b.notes||'').toLowerCase(); break;
      case 'starred': va = a.starred ? 1 : 0; vb = b.starred ? 1 : 0; numeric=true; break;
      case 'pdf': va = (a.attachments||[]).length ? 1 : 0; vb = (b.attachments||[]).length ? 1 : 0; numeric=true; break;
      case 'authors': va = ((a.authors[0]||{}).family||'').toLowerCase(); vb = ((b.authors[0]||{}).family||'').toLowerCase(); break;
      case 'year': va = parseInt(a.year,10)||0; vb = parseInt(b.year,10)||0; numeric=true; break;
      case 'journal': va = journalDisplay(a).toLowerCase(); vb = journalDisplay(b).toLowerCase(); break;
      case 'citedBy': va = a.citedByCount==null?-1:a.citedByCount; vb = b.citedByCount==null?-1:b.citedByCount; numeric=true; break;
      case 'corresponding': va = (a.correspondingAuthors||'').toLowerCase(); vb = (b.correspondingAuthors||'').toLowerCase(); break;
      case 'tags': va = (a.tags||[]).join(', ').toLowerCase(); vb = (b.tags||[]).join(', ').toLowerCase(); break;
      case 'collections': {
        const nm = (x)=>(x.collections||[]).map(id=>{const c=lib.collections.find(y=>y.id===id); return c?c.name:'';}).join(', ').toLowerCase();
        va = nm(a); vb = nm(b); break;
      }
      case 'type': va = (I18N[lang].typeNames[a.type]||a.type||'').toLowerCase(); vb = (I18N[lang].typeNames[b.type]||b.type||'').toLowerCase(); break;
      case 'category': va = (I18N[lang].categoryNames[a.category]||a.category||'').toLowerCase(); vb = (I18N[lang].categoryNames[b.category]||b.category||'').toLowerCase(); break;
      case 'doi': va = (a.doi||'').toLowerCase(); vb = (b.doi||'').toLowerCase(); break;
      case 'added': va = a.dateAdded||''; vb = b.dateAdded||''; break;
      default: va = a.dateAdded; vb = b.dateAdded;
    }
    const c = numeric ? (va - vb) : (va < vb ? -1 : va > vb ? 1 : 0);
    return sortAsc ? c : -c;
  });
}

/* ---------------------------------------------------------------
   Rendering
---------------------------------------------------------------- */
function renderAll(){ renderSidebar(); renderList(); renderDetail(); connectorNotify(); }

// Moving references between collections cannot change the fix/empty/duplicate
// alert counts. Refresh only the UI that depends on collection membership and
// avoid renderAll(), whose renderList() path performs the expensive alert scan.
function renderAfterCollectionDrop(changedItemIds, opts){
  renderSidebar();
  renderList({skipBadges:!(opts && opts.refreshAlerts)});
  if(selectedId && (changedItemIds||[]).includes(selectedId)) renderDetail();
}

function collectionWithDescendants(id){
  const ids = [id];
  for(let i=0;i<ids.length;i++){
    lib.collections.filter(c=>c.parent===ids[i]).forEach(c=>ids.push(c.id));
  }
  return ids;
}
function orderedCollections(parent, depth, out){
  depth = depth || 0;
  out = out || [];
  lib.collections
    .filter(c=>(c.parent||'')===(parent||''))
    .sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(c=>{
      out.push({c, depth});
      if(!collapsedCollectionIds.has(c.id)) orderedCollections(c.id, depth+1, out);
    });
  return out;
}
function collapsibleCollectionIds(){
  const parents = new Set(lib.collections.map(c=>c.parent||'').filter(Boolean));
  return lib.collections.filter(c=>parents.has(c.id)).map(c=>c.id);
}
// Text used to filter the collection tree in the sidebar (empty = no filter).
let collSearchQuery = '';
// Collections to show in the sidebar, honouring the search box. With no query
// this is just orderedCollections() (respecting collapse). With a query we show
// every collection whose name matches, plus its ancestors (for tree context)
// and its descendants (so the matched subtree is visible), ignoring collapse.
function collectionsForSidebar(){
  const q = collSearchQuery.trim().toLowerCase();
  if(!q) return orderedCollections();
  const keep = new Set();
  lib.collections.forEach(c=>{
    if((c.name||'').toLowerCase().includes(q)){
      collectionWithDescendants(c.id).forEach(id=>keep.add(id));
      let cur = c;
      while(cur && cur.parent){ keep.add(cur.parent); cur = lib.collections.find(x=>x.id===cur.parent); }
    }
  });
  const out = [];
  (function walk(parent, depth){
    lib.collections
      .filter(c=>(c.parent||'')===(parent||''))
      .sort((a,b)=>a.name.localeCompare(b.name))
      .forEach(c=>{ if(keep.has(c.id)){ out.push({c, depth}); walk(c.id, depth+1); } });
  })('', 0);
  return out;
}
function orderedAllCollections(parent, depth, out){
  depth = depth || 0;
  out = out || [];
  lib.collections
    .filter(c=>(c.parent||'')===(parent||''))
    .sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(c=>{
      out.push({c, depth});
      orderedAllCollections(c.id, depth+1, out);
    });
  return out;
}
function isCollectionDescendant(id, maybeChild){
  let cur = lib.collections.find(c=>c.id===maybeChild);
  while(cur && cur.parent){
    if(cur.parent===id) return true;
    cur = lib.collections.find(c=>c.id===cur.parent);
  }
  return false;
}
function collectionVisibleIds(){
  return orderedCollections().map(x=>x.c.id);
}
function hasChildCollections(id){
  return lib.collections.some(c=>(c.parent||'')===id);
}
function openCollectionAncestors(id){
  let cur = lib.collections.find(c=>c.id===id);
  while(cur && cur.parent){
    collapsedCollectionIds.delete(cur.parent);
    cur = lib.collections.find(c=>c.id===cur.parent);
  }
}
function handleCollectionSelection(id, e){
  if(!id) return;
  const additive = !!(e && (e.metaKey || e.ctrlKey));
  if(e && e.shiftKey && collectionSelectAnchorId){
    const ids = collectionVisibleIds();
    const a = ids.indexOf(collectionSelectAnchorId), b = ids.indexOf(id);
    if(a>=0 && b>=0){
      const [lo, hi] = a < b ? [a,b] : [b,a];
      if(!additive) selectedCollectionIds.clear();
      for(let i=lo; i<=hi; i++) selectedCollectionIds.add(ids[i]);
    }
  }else if(additive){
    if(selectedCollectionIds.has(id) && selectedCollectionIds.size > 1) selectedCollectionIds.delete(id);
    else selectedCollectionIds.add(id);
    collectionSelectAnchorId = id;
  }else{
    selectedCollectionIds = new Set([id]);
    collectionSelectAnchorId = id;
  }
  updateSidebarSelection();
}
function moveCollectionsToParent(ids, parentId){
  let changed = 0;
  const undoRecords = [];
  parentId = parentId || '';
  ids.forEach(id=>{
    const c = lib.collections.find(x=>x.id===id);
    if(!c || (c.parent||'')===parentId || c.id===parentId) return;
    if(parentId && isCollectionDescendant(c.id, parentId)) return;
    undoRecords.push(makeCollectionMoveUndoRecord(c));
    c.parent = parentId;
    changed++;
  });
  if(changed) pushCollectionMoveUndo(undoRecords);
  return changed;
}
function setSectionToggle(btn, closed){
  if(!btn) return;
  btn.classList.toggle('closed', closed);
  btn.title = t(closed ? 'expand' : 'collapse');
  const icEl = btn.querySelector('[data-ic]');
  if(icEl && btn.id==='btnToggleCollections'){
    icEl.dataset.ic = closed ? 'folder' : 'folderOpen';
    icEl.removeAttribute('data-ic-done');
    icEl.innerHTML = '';
    renderIcons(btn);
  }
}
function updateSidebarSectionVisibility(){
  $('#collList').style.display = collectionsSectionCollapsed ? 'none' : '';
  $('#tagList').style.display = tagsSectionCollapsed ? 'none' : '';
  setSectionToggle($('#btnToggleCollections'), collectionsSectionCollapsed);
  setSectionToggle($('#btnToggleTags'), tagsSectionCollapsed);
}
function updateCollapseAllCollectionsButton(){
  const btn = $('#btnCollapseAllCollections');
  if(!btn) return;
  const ids = collapsibleCollectionIds();
  const allClosed = ids.length > 0 && ids.every(id=>collapsedCollectionIds.has(id));
  const key = allClosed ? 'expandAllCollections' : 'collapseAllCollections';
  btn.disabled = ids.length === 0;
  btn.title = t(key);
  btn.setAttribute('aria-label', t(key));
  const icEl = btn.querySelector('[data-ic]');
  if(icEl){
    icEl.dataset.ic = allClosed ? 'folderOpen' : 'folders';
    icEl.removeAttribute('data-ic-done');
    icEl.innerHTML = '';
    renderIcons(btn);
  }
}
function collectionItemCounts(activeItems){
  const parentById = new Map(lib.collections.map(c=>[c.id, c.parent||'']));
  const counts = new Map(lib.collections.map(c=>[c.id, 0]));
  activeItems.forEach(it=>{
    // A reference can belong to both a parent and one of its descendants. Count
    // it only once in each collection while propagating membership upward.
    const counted = new Set();
    (it.collections||[]).forEach(id=>{
      let cur = id;
      const branchSeen = new Set();
      while(cur && counts.has(cur) && !branchSeen.has(cur)){
        branchSeen.add(cur);
        counted.add(cur);
        cur = parentById.get(cur) || '';
      }
    });
    counted.forEach(id=>counts.set(id, counts.get(id) + 1));
  });
  return counts;
}
function renderSidebar(){
  const activeItems = lib.items.filter(i=>!isItemTrashed(i));
  const collectionCounts = collectionItemCounts(activeItems);
  const collectionParents = new Set(lib.collections.map(c=>c.parent||'').filter(Boolean));
  const counts = {
    all: activeItems.length,
    starred: activeItems.filter(i=>i.starred).length,
    myPublication: activeItems.filter(i=>i.myPublication).length,
    trash: lib.items.filter(i=>isItemTrashed(i)).length,
    uncat: activeItems.filter(i=>!i.collections.length).length
  };
  $('#fixedFilters').innerHTML = `
    <div class="sideItem ${filter.coll==='all'?'active':''}" data-coll="all" data-drop-root="1">${ic('library')}${esc(t('allItems'))}<span class="cnt">${counts.all}</span></div>
    <div class="sideItem ${filter.coll==='starred'?'active':''}" data-coll="starred" data-drop-action="starred">${ic('star')}${esc(t('starred'))}<span class="cnt">${counts.starred}</span></div>
    <div class="sideItem ${filter.coll==='myPublication'?'active':''}" data-coll="myPublication" data-drop-action="myPublication">${ic('check')}${esc(t('myPublication'))}<span class="cnt">${counts.myPublication}</span></div>
    <div class="sideItem ${filter.coll==='trash'?'active':''}" data-coll="trash" data-drop-action="trash">${ic('trash')}${esc(t('trash'))}<span class="cnt">${counts.trash}</span></div>`;
  const searching = !!collSearchQuery.trim();
  const collRows = collectionsForSidebar();
  $('#collList').innerHTML = collRows.map(({c, depth})=>{
    const n = collectionCounts.get(c.id) || 0;
    const hasKids = collectionParents.has(c.id);
    // while searching we force the tree open, so never show a collapsed folder
    const closed = !searching && collapsedCollectionIds.has(c.id);
    // No chevron slot: a collection with sub-collections shows an open folder
    // when expanded and a closed folder when collapsed (same convention as the
    // "Collections" section header). Clicking the folder icon toggles it; leaf
    // folders keep the plain closed-folder icon. This keeps every folder icon
    // at the same left edge for a given depth.
    const folderName = hasKids ? (closed ? 'folders' : 'folderOpen') : 'folder';
    const folderIcInner = ic(folderName, c.color ? {style:`color:${esc(collectionDisplayColor(c.color))}`} : undefined);
    const folderIc = hasKids
      ? `<span class="collFolderToggle" data-act="toggleColl" data-id="${c.id}" title="${esc(closed ? t('expand') : t('collapse'))}">${folderIcInner}</span>`
      : folderIcInner;
    return `<div class="sideItem ${filter.coll===c.id?'active':''} ${selectedCollectionIds.has(c.id)?'collMultiSel':''}" data-coll="${c.id}" data-drop-coll="${c.id}" draggable="true">
      <span class="indent" style="width:${Math.min(depth*8, 24)}px"></span>${folderIc}<span style="overflow:hidden;text-overflow:ellipsis;flex:1">${esc(c.name)}</span>
      <span class="rowbtns">
        <button data-act="sub" data-id="${c.id}" title="${esc(t('newSubCollection'))}">${ic('folderPlus')}</button>
        <button data-act="color" data-id="${c.id}" title="${esc(t('collColor'))}">${ic('palette')}</button>
        <button data-act="ren" data-id="${c.id}">${ic('pencil')}</button>
        <button data-act="del" data-id="${c.id}">${ic('x')}</button>
      </span>
      <span class="cnt">${n}</span></div>`;
  }).join('') || (searching ? `<div class="collSearchEmpty">${esc(t('searchCollEmpty'))}</div>` : '');
  // tags
  const tagCount = new Map();
  lib.items.filter(i=>!isItemTrashed(i)).forEach(i=>(i.tags||[]).forEach(tg=>tagCount.set(tg,(tagCount.get(tg)||0)+1))); 
  const tags = Array.from(tagCount.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  $('#tagList').innerHTML = tags.map(([tg,n])=>
    `<span class="tagchip ${filter.tags.has(tg)?'on':''}" data-tag="${esc(tg)}" ${tagChipStyle(tg)}>${esc(tg)}<span class="cnt">${n}</span><button class="tagColorBtn" data-tagcolor="${esc(tg)}" title="${esc(t('collColor'))}">${ic('palette')}</button></span>`
  ).join('') || `<span style="color:var(--text3);font-size:12px;padding:0 8px">—</span>`;
  $('#uncatFilter').innerHTML = `<div class="sideItem ${filter.coll==='uncat'?'active':''}" data-coll="uncat">${ic('inbox')}${esc(t('uncategorized'))}<span class="cnt">${counts.uncat}</span></div>`;
  updateSidebarSectionVisibility();
  updateCollapseAllCollectionsButton();
}

// Fast path: selecting a collection/tag doesn't change any counts, so just
// re-flag the active/selected classes instead of rebuilding the whole sidebar
// (which recomputes every collection's item count = O(collections × items)).
function updateSidebarSelection(){
  document.querySelectorAll('#sidebar .sideItem[data-coll]').forEach(el=>{
    const cid = el.dataset.coll;
    el.classList.toggle('active', filter.coll === cid);
    if(el.dataset.dropColl) el.classList.toggle('collMultiSel', selectedCollectionIds.has(cid));
  });
  document.querySelectorAll('#tagList .tagchip[data-tag]').forEach(el=>{
    el.classList.toggle('on', filter.tags.has(el.dataset.tag));
  });
}
function clearCollectionSelection(){
  const wasCollectionFilter = !!lib.collections.find(c=>c.id===filter.coll);
  const hadSelection = selectedCollectionIds.size > 0 || collectionSelectAnchorId;
  if(!wasCollectionFilter && !hadSelection) return false;
  if(wasCollectionFilter) filter.coll = 'all';
  selectedCollectionIds.clear();
  collectionSelectAnchorId = null;
  updateSidebarSelection();
  if(wasCollectionFilter) renderList({skipBadges:true});
  return true;
}

function renderListHeader(){
  const keys = tableColumnKeys();
  // colgroup from the visible columns (pdf is now a normal, movable column)
  $('#itemCols').innerHTML = keys.map(k=>`<col style="width:${colWidth(k)}px">`).join('');
  // fix the table width to the sum of column widths so columns honour their
  // widths and horizontal scroll appears only when they overflow the pane
  const total = keys.reduce((s,k)=>s + colWidth(k), 0);
  $('#itemTable').style.width = total + 'px';
  // header cells
  const sortGlyph = (k)=> k===sortKey ? (sortAsc ? '▲' : '▼') : '▼';
  $('#itemHead').innerHTML =
    keys.map(k=>{
      const d = COLUMN_DEFS[k];
      // right-alignment is for the numeric cells only — the header title reads
      // better aligned like every other column
      const alignCls = d.align==='center' ? ' cell-center' : '';
      const pdfCls = d.special==='pdf' ? ' pdfCol' : '';
      const trashCls = (k==='trashDelete' || k==='trashRestore') ? ' trashDelCol' : '';
      const iconCls = d.headerIcon ? ' iconCol' : '';
      const fActive = !d.noFilter && colFilterActive(k);
      const funnel = d.noFilter ? '' : `<span class="thfilter${fActive?' on':''}" data-thfilter="${k}">${ic('funnel')}</span>`;
      const display = (k==='authors' || k==='corresponding') ? `<span class="thdisplay" data-author-display="${k}" title="${esc(t('authorDisplay'))}">${ic('sliders')}</span>` : '';
      const label = d.headerIcon ? ic(d.headerIcon) : esc(t(d.i18n));
      const sort = d.sortable === false ? '' : `<button type="button" class="thsort${k===sortKey?' active':''}" data-sort="${k}" title="${esc(t('sortColumn'))}" aria-label="${esc(t('sortColumn'))}: ${esc(t(d.i18n))}"><span aria-hidden="true">${sortGlyph(k)}</span></button>`;
      const dragAttr = d.sortable === false ? ' draggable="false"' : ' draggable="true"';
      const resize = d.sortable === false ? '' : `<span class="colresize" data-resize="${k}"></span>`;
      const title = d.sortable === false ? esc(t(d.i18n)) : `${esc(t(d.i18n))} — ${esc(t('colHint'))}`;
      const ariaSort = k===sortKey ? ` aria-sort="${sortAsc?'ascending':'descending'}"` : '';
      return `<th class="thmove${alignCls}${pdfCls}${trashCls}${iconCls}${k===sortKey?' sort-active':''}" data-col="${k}"${dragAttr} title="${title}"${ariaSort}>`+
        `<span class="thlabel">${label}</span>`+
        sort+display+funnel+resize+`</th>`;
    }).join('');
  renderIcons($('#itemHead'));
}
function reorderRenderedTableColumns(){
  const keys = tableColumnKeys();
  // Column reordering does not change filtering, sorting, cell contents, or
  // alert counts. Rebuild only the lightweight header/colgroup, then move the
  // existing cells in each rendered row instead of recreating the whole table.
  renderListHeader();
  $('#itemRows').querySelectorAll('tr.row').forEach(row=>{
    const cells = document.createDocumentFragment();
    keys.forEach(k=>{
      const cell = row.querySelector(`td.col-${k}`);
      if(cell) cells.appendChild(cell);
    });
    row.appendChild(cells);
  });
}
const LIST_RENDER_CHUNK = 250;
let listRenderLimit = LIST_RENDER_CHUNK;
let lastVisibleListItems = [];
function renderList(opts){
  const items = visibleItems();
  const keys = tableColumnKeys();
  if(!opts || !opts.keepLimit) listRenderLimit = LIST_RENDER_CHUNK;
  const shown = items.slice(0, listRenderLimit);
  lastVisibleListItems = items;
  const cardsActive = listView === 'cards';
  const shelvesActive = listView === 'shelves';
  const kanbanActive = listView === 'kanban';
  const tableActive = listView === 'table';
  if(tableActive) renderListHeader();
  const tbody = $('#itemRows');
  tbody.innerHTML = tableActive ? shown.map(it=>{
    const cells = keys.map(k=>{
      const d = COLUMN_DEFS[k];
      const tip = d.tip ? d.tip(it) : '';
      const alignCls = d.align==='right' ? ' cell-right' : d.align==='center' ? ' cell-center' : '';
      const keyCls = ` col-${k}${(k==='trashDelete' || k==='trashRestore') ? ' trashDelCol' : ''}`;
      return `<td class="${(alignCls + keyCls).trim()}"${tip?` title="${esc(tip)}"`:''}>${d.cell(it)}</td>`;
    }).join('');
    return `<tr class="row ${it.id===selectedId?'sel':''} ${multiSelectedIds.has(it.id)?'multiSel':''} ${updateClassForItem(it.id)} ${pickClassForItem(it.id)}" data-id="${it.id}" draggable="true">${cells}</tr>`;
  }).join('') : '';
  $('#itemCards').innerHTML = cardsActive ? shown.map(it=>cardRowHTML(it)).join('') : '';
  if(cardsActive) renderIcons($('#itemCards'));
  if(shelvesActive&&items.length) renderShelves(items); else $('#itemShelves').innerHTML='';
  if(kanbanActive&&items.length) renderKanban(items); else $('#itemKanban').innerHTML='';
  $('#emptyMsg').textContent = filter.coll==='trash' ? t('trashEmptyMsg') : t('emptyMsg');
  $('#emptyMsg').style.display = items.length ? 'none' : '';
  $('#listMore').style.display = (tableActive||cardsActive) && shown.length < items.length ? '' : 'none';
  $('#btnLoadMore').textContent = I18N[lang].showMoreItems(shown.length, items.length);
  $('#listCount').textContent = (items.length===lib.items.length)
    ? I18N[lang].itemsCount(lib.items.length)
    : I18N[lang].itemsShown(items.length, lib.items.length);
  updateEmptyTrashButton();
  updateListViewButton();
  // The duplicate/empty/fix badges are library-wide and don't change when only
  // the collection/tag/search filter changes, so allow skipping their (heavy)
  // recomputation on pure view changes. Data mutations call renderList() plainly.
  if(!opts || !opts.skipBadges){
    updateAlerts(); // one pass computes fix/empty/duplicate counts for the alerts button
  }
}
function renderMoreListItems(){
  if(listRenderLimit >= lastVisibleListItems.length) return;
  listRenderLimit = Math.min(lastVisibleListItems.length, listRenderLimit + LIST_RENDER_CHUNK);
  renderList({skipBadges:true, keepLimit:true});
}
$('#btnLoadMore').addEventListener('click', renderMoreListItems);
let listScrollRenderQueued = false;
$('#listScroller').addEventListener('scroll', ()=>{
  const scroller = $('#listScroller');
  if(listScrollRenderQueued || scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 160) return;
  listScrollRenderQueued = true;
  requestAnimationFrame(()=>{ listScrollRenderQueued = false; renderMoreListItems(); });
});
function dataIdSelector(id){
  const v = window.CSS && CSS.escape ? CSS.escape(id) : String(id).replace(/["\\]/g, '\\$&');
  return `[data-id="${v}"]`;
}
function updateSelectionMarks(prevId, nextId){
  if(prevId && prevId !== nextId){
    document.querySelectorAll(dataIdSelector(prevId)).forEach(el=>el.classList.remove('sel'));
  }
  if(nextId){
    document.querySelectorAll(dataIdSelector(nextId)).forEach(el=>el.classList.add('sel'));
  }
}
function updateMultiSelectionMarks(ids){
  const targets = ids ? Array.from(ids) : lib.items.map(it=>it.id);
  targets.forEach(id=>{
    document.querySelectorAll(dataIdSelector(id)).forEach(el=>el.classList.toggle('multiSel', multiSelectedIds.has(id)));
  });
}
function selectItem(id){
  if(!id) return;
  const prev = selectedId;
  selectedId = id;
  multiSelectedIds = new Set([id]);
  multiSelectAnchorId = id;
  updateSelectionMarks(prev, selectedId);
  updateMultiSelectionMarks(new Set([prev, id].filter(Boolean)));
  renderDetail();
}
function handleListSelection(id, e){
  if(!id) return;
  const prevMulti = new Set(multiSelectedIds);
  const prevSelected = selectedId;
  const visibleIds = visibleItems().map(it=>it.id);
  const additive = !!(e && (e.metaKey || e.ctrlKey));
  if(e && e.shiftKey && multiSelectAnchorId && visibleIds.includes(multiSelectAnchorId)){
    const a = visibleIds.indexOf(multiSelectAnchorId), b = visibleIds.indexOf(id);
    const [lo, hi] = a < b ? [a,b] : [b,a];
    if(!additive) multiSelectedIds.clear();
    for(let i=lo; i<=hi; i++) multiSelectedIds.add(visibleIds[i]);
  }else if(additive){
    if(multiSelectedIds.has(id) && multiSelectedIds.size > 1) multiSelectedIds.delete(id);
    else multiSelectedIds.add(id);
    multiSelectAnchorId = id;
  }else{
    multiSelectedIds = new Set([id]);
    multiSelectAnchorId = id;
  }
  selectedId = id;
  updateSelectionMarks(prevSelected, selectedId);
  const changed = new Set([...prevMulti, ...multiSelectedIds, prevSelected, selectedId].filter(Boolean));
  updateMultiSelectionMarks(changed);
  renderDetail();
}
function updateStarMarks(id){
  const it = lib.items.find(x=>x.id===id);
  if(!it) return;
  const on = !!it.starred;
  const tip = t(on ? 'unstarItem' : 'starItem');
  document.querySelectorAll('[data-star-id]').forEach(btn=>{
    if(btn.dataset.starId !== id) return;
    btn.classList.toggle('on', on);
    btn.title = tip;
    btn.setAttribute('aria-label', tip);
  });
}
function toggleStar(id){
  const it = lib.items.find(x=>x.id===id);
  if(!it) return;
  it.starred = !it.starred;
  touch(it);
  renderSidebar();
  if(filter.coll==='starred' || sortKey==='starred' || listView==='shelves' || listView==='kanban') renderList();
  else updateStarMarks(id);
  if(selectedId===id) renderDetail();
}
function toggleMyPublication(id){
  const it = lib.items.find(x=>x.id===id);
  if(!it) return;
  it.myPublication = !it.myPublication;
  touch(it);
  renderSidebar();
  if(filter.coll==='myPublication') renderList();
  if(selectedId===id) renderDetail();
}

/* ---------------------------------------------------------------
   Pick mode — choose specific items to refresh (cited-by / corresponding
   authors) instead of acting on every currently-visible item.
---------------------------------------------------------------- */
function enterPickMode(kind){
  pickMode = kind;
  pickedIds = new Set();
  pickAnchorId = null;
  document.querySelectorAll('#itemRows tr.row, .cardRow, .shelfPaper, .kanbanPaper').forEach(el=>el.classList.add('picking'));
  $('#pickBar').style.display = 'flex';
  $('#pickBarHint').textContent = t(kind==='cited' ? 'pickHintCited' : kind==='corresponding' ? 'pickHintCorresponding' : 'pickHintAll');
  updatePickBar();
}
function exitPickMode(){
  document.querySelectorAll('#itemRows tr.row.picked, .cardRow.picked, .shelfPaper.picked, .kanbanPaper.picked').forEach(el=>el.classList.remove('picked'));
  document.querySelectorAll('#itemRows tr.row.picking, .cardRow.picking, .shelfPaper.picking, .kanbanPaper.picking').forEach(el=>el.classList.remove('picking'));
  pickMode = null;
  pickedIds = new Set();
  pickAnchorId = null;
  $('#pickBar').style.display = 'none';
}
function updatePickBar(){
  const n = pickedIds.size;
  $('#pickBarCount').textContent = n;
  const confirmBtn = $('#btnPickConfirm');
  confirmBtn.textContent = n ? t('pickConfirm')(n) : t('pickNone');
  confirmBtn.disabled = n === 0;
}
function pickClassForItem(id){
  if(!pickMode) return '';
  return 'picking' + (pickedIds.has(id) ? ' picked' : '');
}
function setPicked(id, on){
  if(on) pickedIds.add(id); else pickedIds.delete(id);
  document.querySelectorAll(dataIdSelector(id)).forEach(el=>el.classList.toggle('picked', on));
}
// plain click: toggle one item, and move the shift-range anchor to it.
// shift+click: add the whole visible-order range between the anchor and this
// item (does not remove items already picked outside that range).
function handlePickClick(id, e){
  if(!pickMode) return false;
  const ids = visibleItems().map(it=>it.id);
  if(e && e.shiftKey && pickAnchorId && ids.includes(pickAnchorId)){
    const a = ids.indexOf(pickAnchorId), b = ids.indexOf(id);
    const [lo,hi] = a < b ? [a,b] : [b,a];
    for(let i=lo;i<=hi;i++) setPicked(ids[i], true);
  }else{
    setPicked(id, !pickedIds.has(id));
    pickAnchorId = id;
  }
  updatePickBar();
  return true;
}
function cardRowHTML(it){
  const hasPdf = !!(it.attachments && it.attachments.length);
  const pdfTip = esc(hasPdf ? t('attachments') : t('addPdf'));
  const title = esc(it.title || t('newItem'));
  const authors = esc(tableAuthorsText(it.authors, it.correspondingAuthors));
  const journal = esc(journalDisplay(it));
  const year = esc(it.year || '');
  const meta = [
    journal ? `<span class="journal">${journal}</span>` : '',
    year ? `<span>${year}</span>` : '',
  ].filter(Boolean).join(`<span class="dot">·</span>`);
  return `<div class="cardRow ${it.id===selectedId?'sel':''} ${multiSelectedIds.has(it.id)?'multiSel':''} ${updateClassForItem(it.id)} ${pickClassForItem(it.id)}" data-id="${it.id}" draggable="true">
    <div class="cardAccent"></div>
    <div class="cardBody">
      <div class="cardTitle">${starButtonHTML(it, 'cardStar')}<span class="cardTitleText">${title}</span></div>
      <div class="cardAuthors">${authors}</div>
      <div class="cardMeta">${meta}</div>
    </div>
    <div class="cardSide">
      ${filter.coll === 'trash' ? cardTrashDeleteHTML(it) : `<button class="cardPdfBtn ${hasPdf?'hasPdf':'noPdf'}" data-row-addpdf="${it.id}" title="${pdfTip}" aria-label="${pdfTip}">${hasPdf?ic('file') + '<span>PDF</span>':'<span>PDF</span><span>+</span>'}</button>`}
    </div>
  </div>`;
}

const READING_STATUSES = ['unread','reading','read'];
let shelfRecentDays=parseInt(localStorage.getItem('refshelf.shelfRecentDays')||'30',10);
if(!Number.isFinite(shelfRecentDays)||shelfRecentDays<1)shelfRecentDays=30;
shelfRecentDays=Math.min(3650,shelfRecentDays);
function normalizedReadingStatus(it){ return READING_STATUSES.includes(it.readingStatus) ? it.readingStatus : 'unread'; }
function readingStatusLabel(status){ return t({unread:'statusUnread',reading:'statusReading',read:'statusRead'}[status] || 'statusUnread'); }
function readingStatusIcon(status){ return {unread:'book',reading:'text',read:'check'}[status] || 'book'; }
function readingStatusOptions(){ return READING_STATUSES.map(v=>({v,label:readingStatusLabel(v)})); }
function compactPaperCardHTML(it, kind){
  return cardRowHTML(it).replace('class="cardRow ',`class="${kind}Paper cardRow `);
}
function shelfSectionHTML(title,items,opts){
  opts=opts||{}; const shown=items.slice(0,opts.limit||30);
  return `<section class="paperShelf"${opts.color?` style="--shelf-color:${esc(collectionDisplayColor(opts.color))}"`:''}>
    <div class="paperShelfHead"><span class="paperShelfIcon">${ic(opts.icon||'book')}</span><span class="paperShelfTitle">${esc(title)}</span><span class="paperShelfCount">${esc(I18N[lang].shelfItems(items.length))}</span>${opts.controls||''}</div>
    <div class="paperShelfRail">${shown.length?shown.map(it=>compactPaperCardHTML(it,'shelf')).join('')+(items.length>shown.length?`<div class="paperShelfMore">${esc(I18N[lang].shelfMore(items.length-shown.length))}</div>`:''):`<div class="paperShelfEmpty">${esc(t('shelfEmpty'))}</div>`}</div>
  </section>`;
}
function renderShelves(items){
  const cutoff=Date.now()-shelfRecentDays*86400000;
  const sortedRecent=items.filter(it=>{const ts=Date.parse(it.dateAdded||'');return Number.isFinite(ts)&&ts>=cutoff;}).sort((a,b)=>String(b.dateAdded||'').localeCompare(String(a.dateAdded||'')));
  const recentControl=`<label class="shelfPeriod"><input type="number" id="shelfRecentDays" min="1" max="3650" value="${shelfRecentDays}"><span>${esc(t('shelfRecentDays'))}</span></label>`;
  const sections=[
    shelfSectionHTML(t('shelfRecent'),sortedRecent,{icon:'clock',limit:18,controls:recentControl}),
    shelfSectionHTML(t('shelfStarred'),items.filter(x=>x.starred),{icon:'star',limit:30}),
    shelfSectionHTML(t('shelfReading'),items.filter(x=>normalizedReadingStatus(x)==='reading'),{icon:'text',limit:30}),
    shelfSectionHTML(t('shelfPdf'),items.filter(x=>x.attachments&&x.attachments.length),{icon:'file',limit:30})
  ];
  lib.collections.slice(0,12).forEach(c=>{
    const members=items.filter(it=>(it.collections||[]).includes(c.id));
    if(members.length) sections.push(shelfSectionHTML(c.name,members,{icon:'folder',color:c.color||'',limit:30}));
  });
  $('#itemShelves').innerHTML=sections.join('');
  renderIcons($('#itemShelves'));
}
function renderKanban(items){
  const perColumn=100;
  let renderedCount=0;
  const cols=READING_STATUSES.map(status=>{
    const all=items.filter(it=>normalizedReadingStatus(it)===status);
    const cards=all.slice(0,perColumn); renderedCount+=cards.length;
    return `<section class="kanbanCol status-${status}" data-kanban-status="${status}">
      <div class="kanbanHead"><span>${ic(readingStatusIcon(status))}</span><b>${esc(readingStatusLabel(status))}</b><span class="kanbanCount">${all.length}</span></div>
      <div class="kanbanCards">${cards.map(it=>compactPaperCardHTML(it,'kanban')).join('')}</div>
    </section>`;
  }).join('');
  $('#itemKanban').innerHTML=`<div class="kanbanHint">${ic('kanban')}<span>${esc(t('kanbanHint'))}</span>${items.length>renderedCount?`<span class="kanbanLimit">${renderedCount} / ${items.length}</span>`:''}</div><div class="kanbanBoard">${cols}</div>`;
  renderIcons($('#itemKanban'));
}

function fieldRow(label, id, value, type){
  if(type==='textarea') return `<div class="fRow"><label>${esc(label)}</label><textarea data-f="${id}">${esc(value)}</textarea></div>`;
  return `<div class="fRow"><label>${esc(label)}</label><input type="text" data-f="${id}" value="${esc(value)}"></div>`;
}
function selectRow(label, id, value, options){
  const opts = options.map(o=>`<option value="${esc(o.v)}"${o.v===(value||'')?' selected':''}>${esc(o.label)}</option>`).join('');
  return `<div class="fRow"><label>${esc(label)}</label><select data-f="${id}">${opts}</select></div>`;
}
function categoryOptions(){
  return [{v:'',label:t('categoryNone')}].concat(
    Object.keys(I18N[lang].categoryNames).map(v=>({v,label:I18N[lang].categoryNames[v]})));
}
function citationStyleOptions(){
  const curStyle = citationStyleKey(citationPrefs.style);
  return [
    ['acs','ACS'],
    ['rsc','RSC'],
    ['csj','CSJ'],
    ['gdch','Angewandte / GDCh'],
    ['nature','Nature'],
    ['science','Science'],
  ].map(([v,label])=>`<option value="${v}" ${curStyle===v?'selected':''}>${label}</option>`).join('');
}
function citationPrefsControls(){
  return `
    <div class="inlineOpts">
      <div class="fRow"><label>${esc(t('citationStyle'))}</label><select data-pref="style">${citationStyleOptions()}</select></div>
      <div class="fRow"><label>${esc(t('authorScope'))}</label><select data-pref="authorScope">
        <option value="all" ${citationPrefs.authorScope==='all'?'selected':''}>${esc(t('authorScopeAll'))}</option>
        <option value="first" ${citationPrefs.authorScope==='first'?'selected':''}>${esc(t('authorScopeFirst'))}</option>
        <option value="corresponding" ${citationPrefs.authorScope==='corresponding'?'selected':''}>${esc(t('authorScopeCorresponding'))}</option>
      </select></div>
      <label class="checkline"><input type="checkbox" data-pref="includeTitle" ${citationPrefs.includeTitle!==false?'checked':''}> ${esc(t('includeTitle'))}</label>
      <label class="checkline"><input type="checkbox" data-pref="includeUrl" ${citationPrefs.includeUrl!==false?'checked':''}> ${esc(t('includeUrl'))}</label>
    </div>`;
}
function openCitationPrefsDialog(){
  $('#citationPrefsBody').innerHTML = citationPrefsControls();
  renderIcons($('#citationPrefsBody'));
  $('#dlgCitationPrefs').showModal();
}
function collectionPathLabel(id){
  const names = [];
  let cur = lib.collections.find(c=>c.id===id);
  while(cur){
    names.unshift(cur.name);
    cur = cur.parent ? lib.collections.find(c=>c.id===cur.parent) : null;
  }
  return names.join(' / ');
}
function detailCollectionsDisplay(it){
  const rows = (it.collections||[]).map(id=>{
    const c = lib.collections.find(x=>x.id===id);
    if(!c) return '';
    const label = collectionPathLabel(id) || c.name;
    return `<span class="detailCollBtn" ${collectionChipStyle(c)} title="${esc(label)}">
      ${ic('folder')}<span class="collName">${esc(label)}</span>
    </span>`;
  }).filter(Boolean).join('');
  return rows || `<span style="color:var(--text3);font-size:12px">—</span>`;
}
function renderDetail(){
  const pane = $('#detail');
  const it = lib.items.find(x=>x.id===selectedId);
  if(!it){ pane.innerHTML = `<div class="noselect">${esc(t('noSelect'))}</div>`; return; }
  const collDisplay = detailCollectionsDisplay(it);
  const journalFix = fixSuggestionForItem(it);
  const atts = (it.attachments||[]).map((a,idx)=>
    `<div class="attRow">${ic('file')}<span class="aname" data-open-att="${idx}" title="${esc(a.name)}">${esc(a.name)}</span>
     <button class="attOpen" data-open-att="${idx}" title="${esc(t('openAttachment'))}">${ic('link')}${esc(t('openAttachment'))}</button>
     <button class="attDel" data-del-att="${idx}" title="✕">${ic('x')}</button></div>`).join('');
  pane.innerHTML = `
    <div class="dActions">
      ${it.url||it.doi ? `<button class="tbtn" data-act="openlink">${ic('link')}${esc(t('openLink'))}</button>` : ''}
      <button class="tbtn" data-act="citations">${ic('citations')}${esc(t('citations'))}</button>
      <button class="tbtn" data-act="graph">${ic('graph')}${esc(t('graphView'))}</button>
      <button class="tbtn" data-act="updateThis" title="${esc(t('updateThisItemHint'))}">${ic('retry')}${esc(t('updateThisItem'))}</button>
    </div>
    <div class="citePreview" id="citePreview" title="${esc(t('citePreviewHint'))}">
      <div class="cpHead">
        <span data-i18n="citePreview">引用プレビュー</span>
        <span class="cpActions">
          <span class="cpCopy" data-act="copycite">${ic('quote')}${esc(t('copy'))}</span>
          <button class="cpIconBtn" data-act="citeprefs" title="${esc(t('citationSettings'))}" aria-label="${esc(t('citationSettings'))}">${ic('gear')}</button>
        </span>
      </div>
      <div class="cpText" id="citePreviewText"></div>
    </div>
    <div class="dSection">${esc(t('info'))}</div>
    ${fieldRow(t('title'),'title',it.title,'textarea')}
    ${fieldRow(t('authorsField'),'authors',authorsToText(it.authors),'textarea')}
    ${fieldRow(t('journal'),'journal',it.journal)}
    ${fieldRow(t('journalAbbr'),'journalAbbr',it.journalAbbr || '')}
    ${journalFix ? `<div class="fixInline">
      <div class="fixInlineTop">
        <div class="fixInlineText">
          <b>${esc(t('fixSuggestions'))}</b><br>
          ${journalFix.changes && journalFix.changes.length
            ? journalFix.changes.map(ch=>fieldChangeLine(ch)).join('<br>')
            : `${esc(t('currentValue'))}: ${esc(journalFix.current)}<br>${esc(t('suggestedValue'))}: ${esc(journalFix.next)}`}${shouldShowFixReason(journalFix) ? `<br>
          ${esc(t(journalFix.reason))}` : ''}
        </div>
        <button class="tbtn primary" data-act="applyJournalFix">${esc(t('applyFix'))}</button>
      </div>
    </div>` : ''}
    <div class="fGrid">
      ${fieldRow(t('year'),'year',it.year)}
      ${fieldRow(t('volume'),'volume',it.volume)}
      ${fieldRow(t('issue'),'issue',it.issue)}
      ${fieldRow(t('pages'),'pages',it.pages)}
    </div>
    ${selectRow(t('colCategory'),'category',it.category,categoryOptions())}
    ${selectRow(t('readingStatus'),'readingStatus',normalizedReadingStatus(it),readingStatusOptions())}
    ${fieldRow(t('publisher'),'publisher',it.publisher)}
    ${fieldRow('DOI','doi',it.doi)}
    ${fieldRow(t('citekey'),'citekey',it.citekey)}
    ${fieldRow('URL','url',it.url)}
    ${fieldRow(t('correspondingAuthors'),'correspondingAuthors',it.correspondingAuthors)}
    ${fieldRow(t('abstract'),'abstract',it.abstract,'textarea')}
    <div class="dSection">${esc(t('attachments'))}</div>
    ${atts}
    <button class="tbtn" data-act="addpdf" style="font-size:12.5px">${ic('paperclip')}${esc(t('addPdf'))}</button>
    <div class="dSection">${esc(t('organize'))}</div>
    ${fieldRow(t('tagsField'),'tags',(it.tags||[]).join(', '))}
    <div class="fRow">
      <label style="margin:0 0 6px">${esc(t('collections'))}</label>
      <div class="detailCollections">${collDisplay}</div>
    </div>
    ${fieldRow(t('notes'),'notes',it.notes,'textarea')}
    <div style="margin-top:16px">${isItemTrashed(it) ? `<button class="tbtn" data-act="restoreItem">${ic('arrowUpRight')}${esc(t('restoreItem'))}</button> <button class="tbtn danger" data-act="deleteForever">${ic('trash')}${esc(t('deleteForever'))}</button>` : `<button class="tbtn danger" data-act="delitem">${ic('trash')}${esc(t('deleteItem'))}</button>`}</div>
  `;
  // long text fields: show full content (auto-grow instead of inner scrolling)
  pane.querySelectorAll('textarea[data-f="title"], textarea[data-f="authors"], textarea[data-f="abstract"], textarea[data-f="notes"]').forEach(el=>{
    el.classList.add('autogrow');
    autoGrow(el);
  });
  updateCitePreview();
}
function autoGrow(el){
  el.style.height = 'auto';
  el.style.height = (el.scrollHeight + 2) + 'px';
}
// live preview of exactly what "引用をコピー" will copy, given the current settings
function updateCitePreview(){
  const el = $('#citePreviewText');
  if(!el) return;
  const it = lib.items.find(x=>x.id===selectedId);
  el.innerHTML = it ? itemToCitationHtml(it, citationPrefs) : '';
}
let duplicateDialogCandidates = [];
function duplicateItemHTML(it, label){
  const meta = [
    authorsShort(it && it.authors),
    journalDisplay(it || {}),
    it && it.year,
    it && it.doi ? 'DOI: ' + it.doi : '',
  ].filter(Boolean).join(' · ');
  return `<div class="dupItem">
    <div class="dupLabel">${esc(label)}</div>
    <div class="dupTitle">${esc((it && it.title) || t('newItem'))}</div>
    <div class="dupMeta">${esc(meta)}</div>
  </div>`;
}
function renderDuplicateDialog(candidates){
  duplicateDialogCandidates = candidates || [];
  const body = $('#duplicateBody');
  if(!duplicateDialogCandidates.length){
    body.innerHTML = `<div class="dupSummary">${esc(t('duplicateNone'))}</div>`;
    return;
  }
  body.innerHTML = `<div class="dupSummary">${esc(I18N[lang].duplicateSummary(duplicateDialogCandidates.length))}</div>` +
    duplicateDialogCandidates.map((c,i)=>{
      const reason = c.skipped ? t('duplicateSkipped') : t(duplicateReasonKey(c.reason));
      const addedInLib = c.item && lib.items.some(x=>x.id===c.item.id);
      const existingInLib = c.match && c.match.id && lib.items.some(x=>x.id===c.match.id);
      return `<div class="dupPair" data-dup="${i}">
        <span class="dupBadge">${ic('alert')}${esc(reason)} · ${esc(String(c.score || 0))}%</span>
        <div class="dupCols">
          ${duplicateItemHTML(c.match, t('duplicateExisting'))}
          ${duplicateItemHTML(c.item, c.skipped ? t('duplicatePossible') : t('duplicateAdded'))}
        </div>
        <div class="dupActions">
          ${c.match && c.match.id ? `<button class="tbtn" data-dup-open="match">${esc(t('duplicateOpenExisting'))}</button>` : ''}
          ${addedInLib ? `<button class="tbtn" data-dup-open="item">${esc(t('duplicateOpenAdded'))}</button>` : ''}
          ${c.skipped && existingInLib ? `<button class="tbtn" data-dup-replace="${i}">${ic('retry')}${esc(t('duplicateReplaceExisting'))}</button>` : ''}
          ${existingInLib ? `<button class="tbtn danger" data-dup-delete="${esc(c.match.id)}">${ic('trash')}${esc(t('duplicateDeleteExisting'))}</button>` : ''}
          ${addedInLib ? `<button class="tbtn danger" data-dup-delete="${esc(c.item.id)}">${ic('trash')}${esc(t('duplicateDeleteAdded'))}</button>` : ''}
        </div>
      </div>`;
    }).join('');
  renderIcons(body);
}
function openDuplicateDialog(candidates){
  renderDuplicateDialog(candidates);
  $('#dlgDuplicates').showModal();
}
function updateDuplicateButton(){ updateAlerts(); }
function showDuplicateReviewAfterAdd(res){
  if(res && res.duplicateCandidates && res.duplicateCandidates.length){
    openDuplicateDialog(res.duplicateCandidates);
  }
}
function itemHasText(v){ return String(v||'').trim() !== ''; }
function isEmptyRecord(it){
  if(!it) return false;
  const hasAuthors = (it.authors||[]).some(a=>itemHasText(a.family) || itemHasText(a.given));
  const fields = ['title','journal','journalAbbr','year','volume','issue','pages','publisher','doi','arxiv','url','abstract','notes','correspondingAuthors'];
  const hasField = fields.some(k=>itemHasText(it[k]));
  const hasAttachment = (it.attachments||[]).length > 0;
  return !hasAuthors && !hasField && !hasAttachment;
}
function findEmptyRecords(){
  return lib.items.filter(isEmptyRecord).sort((a,b)=>(b.dateAdded||'').localeCompare(a.dateAdded||''));
}
function renderEmptyRecordsDialog(items){
  const body = $('#emptyRecordsBody');
  const list = items || findEmptyRecords();
  $('#btnDeleteAllEmpty').style.display = list.length ? '' : 'none';
  if(!list.length){
    body.innerHTML = `<div class="dupSummary">${esc(t('emptyRecordsNone'))}</div>`;
    return;
  }
  body.innerHTML = `<div class="dupSummary">${esc(I18N[lang].emptyRecordsSummary(list.length))}</div>` +
    list.map(it=>`<div class="emptyRec" data-empty-id="${esc(it.id)}">
      <div class="emptyRecMain">
        <div class="emptyRecTitle">${esc(t('emptyRecordLabel'))}</div>
        <div class="emptyRecMeta">${esc(I18N[lang].emptyRecordAdded((it.dateAdded||'').slice(0,10)))}</div>
      </div>
      <div class="emptyRecBtns">
        <button class="tbtn" data-empty-open="${esc(it.id)}">${esc(t('emptyOpen'))}</button>
        <button class="tbtn danger" data-empty-delete="${esc(it.id)}">${ic('trash')}${esc(t('emptyDelete'))}</button>
      </div>
    </div>`).join('');
  renderIcons(body);
}
function openEmptyRecordsDialog(){
  renderEmptyRecordsDialog();
  $('#dlgEmptyRecords').showModal();
}
function updateEmptyRecordsButton(){ updateAlerts(); }
function fixSuggestionForItem(it){
  const fields = [it.journal, it.journalAbbr].filter(Boolean);

  const angewCur = fields.filter(isAngewEnglVariant);
  if(angewCur.length){
    const typo = angewCur.some(isAngewEngleTypo);
    if(shouldUseCurrentAngew(it) || typo){
      return {
        id: it.id, kind:'angew',
        item: it,
        current: Array.from(new Set(angewCur)).join(' / '),
        next: shouldUseCurrentAngew(it) ? 'Angew. Chem. Int. Ed.' : 'Angew. Chem. Int. Ed. Engl.',
        reason: typo && !shouldUseCurrentAngew(it) ? 'fixAngewTypo' : 'fixAngewCurrent',
      };
    }
  }

  const formal = mappedJournalFull(it.journal) || mappedJournalFull(it.journalAbbr);
  if(formal && !isMdpiChemistry(it)){
    const abbr = mappedJournalAbbr(it.journalAbbr) || mappedJournalAbbr(it.journal) || mappedJournalAbbr(formal);
    const changes = [];
    if(normalizeJournalKey(it.journal) !== normalizeJournalKey(formal)){
      changes.push({field:'journal', label:'journal', current: it.journal || '', next: formal});
    }
    if(abbr && normalizeJournalKey(it.journalAbbr) !== normalizeJournalKey(abbr)){
      changes.push({field:'journalAbbr', label:'journalAbbr', current: it.journalAbbr || '', next: abbr});
    }
    if(changes.length){
      return {
        id: it.id, kind:'journalFullName',
        item: it,
        current: changes.map(ch=>ch.current || '—').join(' / '),
        next: changes.map(ch=>ch.next).join(' / '),
        changes,
      };
    }
  }

  const chemEurJCur = fields.filter(isChemEurJPaperpileVariant);
  if(chemEurJCur.length && !isMdpiChemistry(it)){
    return {
      id: it.id, kind:'chemEurJ',
      item: it,
      current: Array.from(new Set(chemEurJCur)).join(' / '),
      next: 'Chem. Eur. J.',
      reason: 'fixChemEurJPaperpile',
    };
  }

  const chemCommunCur = fields.filter(isChemCommunCambVariant);
  if(chemCommunCur.length){
    return {
      id: it.id, kind:'chemCommun',
      item: it,
      current: Array.from(new Set(chemCommunCur)).join(' / '),
      next: 'Chem. Commun.',
      reason: 'fixChemCommunCamb',
    };
  }

  return null;
}
function findFixSuggestions(){
  return lib.items.map(fixSuggestionForItem).filter(Boolean);
}
function shouldShowFixReason(s){
  return !!s && s.kind === 'angew';
}
function renderFixSuggestionsDialog(items){
  const body = $('#fixSuggestionsBody');
  const list = items || findFixSuggestions();
  $('#btnApplyAllFixes').style.display = list.length ? '' : 'none';
  if(!list.length){
    body.innerHTML = `<div class="dupSummary">${esc(t('fixSuggestionsNone'))}</div>`;
    return;
  }
  body.innerHTML = `<div class="dupSummary">${esc(I18N[lang].fixSuggestionsSummary(list.length))}</div>` +
    list.map((s,i)=>{
      const meta = [authorsShort(s.item.authors), s.item.year].filter(Boolean).join(' · ');
      return `<div class="emptyRec" data-fix="${i}">
        <div class="emptyRecMain">
          <div class="emptyRecTitle">${esc(s.item.title || t('newItem'))}</div>
          <div class="emptyRecMeta">${esc(meta)}</div>
          ${fixSuggestionChangeHtml(s)}
          ${shouldShowFixReason(s) ? `<div class="emptyRecMeta">${esc(t(s.reason))}</div>` : ''}
        </div>
        <div class="emptyRecBtns">
          <button class="tbtn" data-fix-open="${esc(s.id)}">${esc(t('emptyOpen'))}</button>
          <button class="tbtn primary" data-fix-apply="${i}">${esc(t('applyFix'))}</button>
        </div>
      </div>`;
    }).join('');
}
function openFixSuggestionsDialog(){
  renderFixSuggestionsDialog();
  $('#dlgFixSuggestions').showModal();
}
function updateFixSuggestionsButton(){ updateAlerts(); }

/* ---------------------------------------------------------------
   Item operations
---------------------------------------------------------------- */
function addItems(items, opts){
  opts = opts || {};
  let added = 0, skipped = 0;
  const addedItems = [], skippedItems = [], duplicateCandidates = [];
  const existingDois = new Map(lib.items.filter(i=>i.doi).map(i=>[i.doi, i]));
  for(const it of items){
    if(it.doi && existingDois.has(it.doi)){
      const ex = existingDois.get(it.doi);
      (it.collections||[]).forEach(id=>{ if(id && !ex.collections.includes(id)) ex.collections.push(id); });
      (it.tags||[]).forEach(tg=>{ if(tg && !ex.tags.includes(tg)) ex.tags.push(tg); });
      duplicateCandidates.push({item:it, match:ex, score:100, reason:'doi', skipped:true});
      skippedItems.push(it);
      skipped++; continue;
    }
    duplicateMatchesForItem(it, lib.items).slice(0, 2).forEach(m=>duplicateCandidates.push(m));
    if(!it.citekey) it.citekey = genCitekey(it);
    if(opts.coll && filter.coll!=='all' && filter.coll!=='uncat' && filter.coll!=='starred') it.collections = [filter.coll];
    lib.items.push(it);
    if(it.doi) existingDois.set(it.doi, it);
    addedItems.push(it);
    added++;
  }
  if(added || skipped) touch();
  return {added, skipped, addedItems, skippedItems, duplicateCandidates};
}
// Overwrite an existing record's bibliographic fields with a newer candidate's,
// keeping the user's local data (id, PDFs, notes, tags, collections, star, etc.).
// Used when a same-DOI import was skipped but the fetched candidate is fresher.
function replaceExistingWithCandidate(existing, cand){
  if(!existing || !cand) return;
  const strFields = ['type','title','journal','journalAbbr','year','volume','issue','pages',
    'publisher','doi','arxiv','url','abstract','correspondingAuthors','correspondingCheckedAt',
    'correspondingStatus','citedByAt','citedByStatus'];
  strFields.forEach(k=>{ if(String(cand[k]||'').trim() !== '') existing[k] = cand[k]; });
  if(Array.isArray(cand.authors) && cand.authors.length) existing.authors = cand.authors;
  if(cand.citedByCount != null) existing.citedByCount = cand.citedByCount;
  existing.dateModified = new Date().toISOString();
  touch();
}
function collectionIdByName(name){
  name = String(name||'').trim();
  if(!name) return '';
  let c = lib.collections.find(x=>x.name===name);
  if(!c){
    c = {id:uid(), name, parent:''};
    lib.collections.push(c);
  }
  return c.id;
}
function collectionIdByPath(path){
  const parts = String(path||'').split('/').map(s=>s.trim()).filter(Boolean);
  if(!parts.length) return '';
  if(parts.length===1) return collectionIdByName(parts[0]);
  let parent = '';
  let cur = null;
  parts.forEach(name=>{
    cur = lib.collections.find(x=>x.name===name && (x.parent||'')===parent);
    if(!cur){
      cur = {id:uid(), name, parent};
      lib.collections.push(cur);
    }
    parent = cur.id;
  });
  return cur ? cur.id : '';
}
function resolveImportedCollections(items){
  items.forEach(it=>{
    it.collections = Array.from(new Set((it.collections||[]).map(collectionIdByPath).filter(Boolean)));
  });
  return items;
}
// Zotero RDF collections: create every collection (including empty and nested
// ones, reusing existing ones by name+parent) and return a Map of
// item-rdf:about → Set(collectionId) for membership assignment.
function buildRdfCollections(collNodes){
  const byAbout = new Map(collNodes.map(c=>[c.about, c]));
  // a collection's parent is whoever lists it in hasPart (first wins)
  const parentOf = new Map();
  collNodes.forEach(c=>{ c.parts.forEach(r=>{ if(byAbout.has(r) && !parentOf.has(r)) parentOf.set(r, c.about); }); });
  const idCache = new Map();
  const resolving = new Set(); // guard against pathological cycles
  function resolve(about){
    if(idCache.has(about)) return idCache.get(about);
    const node = byAbout.get(about);
    if(!node) return '';
    let parentId = '';
    const pa = parentOf.get(about);
    if(pa && pa!==about && !resolving.has(pa)){ resolving.add(about); parentId = resolve(pa); resolving.delete(about); }
    const name = (node.title||'').trim() || 'Untitled';
    let c = lib.collections.find(x=>x.name===name && (x.parent||'')===(parentId||''));
    if(!c){ c = { id:uid(), name, parent: parentId||'' }; lib.collections.push(c); }
    idCache.set(about, c.id);
    return c.id;
  }
  collNodes.forEach(c=>resolve(c.about)); // materialize all collections
  const itemColls = new Map();
  collNodes.forEach(c=>{
    const cid = resolve(c.about);
    c.parts.forEach(r=>{
      if(byAbout.has(r)) return; // a sub-collection, not an item
      if(!itemColls.has(r)) itemColls.set(r, new Set());
      itemColls.get(r).add(cid);
    });
  });
  return itemColls;
}
async function deleteItem(id){
  const it = lib.items.find(x=>x.id===id);
  if(!it) return;
  if(!confirm(I18N[lang].confirmDelete(it.title || t('newItem')))) return;
  if(!isItemTrashed(it)) pushTrashUndo([makeTrashUndoRecord(it)]);
  it.trashed = true;
  it.trashedAt = new Date().toISOString();
  if(filter.coll!=='trash' && selectedId===id) selectedId = null;
  touch(it); renderAll();
}
async function restoreItem(id){
  return restoreItemsByIds([id]);
}
// Restore one or more items out of the trash. Pushes a trash-undo entry so
// Cmd+Z re-trashes them (undoTrashMove replays the captured trashed state).
function restoreItemsByIds(ids){
  const idSet = new Set(ids || []);
  const targets = lib.items.filter(it=>idSet.has(it.id) && isItemTrashed(it));
  if(!targets.length) return 0;
  pushTrashUndo(targets.map(makeTrashUndoRecord));
  targets.forEach(it=>{
    it.trashed = false;
    it.trashedAt = '';
    it.dateModified = new Date().toISOString();
  });
  touch(); renderAll();
  return targets.length;
}
async function restoreAllTrash(){
  const ids = lib.items.filter(isItemTrashed).map(it=>it.id);
  if(!ids.length){ showToast(t('trashEmptyMsg')); return 0; }
  if(!confirm(I18N[lang].confirmRestoreAll(ids.length))) return 0;
  const n = restoreItemsByIds(ids);
  if(n) showToast(I18N[lang].itemsRestored(n));
  return n;
}
// --- collection deletion (with keep / trash-items choices) ---
let pendingDeleteCollIds = [];
// Union of the given collections and all their descendants.
function collectionSetWithDescendants(ids){
  const out = new Set();
  (ids || []).forEach(id=>collectionWithDescendants(id).forEach(x=>out.add(x)));
  return out;
}
// Active (non-trashed) items that live in any of the given collections.
function itemsInCollectionSet(collIdSet){
  return lib.items.filter(it=>!isItemTrashed(it) && (it.collections||[]).some(cid=>collIdSet.has(cid)));
}
function openDeleteCollDialog(ids){
  ids = (ids || []).filter(id=>lib.collections.find(c=>c.id===id));
  if(!ids.length) return;
  pendingDeleteCollIds = ids;
  const allIds = collectionSetWithDescendants(ids);
  const itemCount = itemsInCollectionSet(allIds).length;
  const head = ids.length===1
    ? I18N[lang].deleteCollHeadOne((lib.collections.find(c=>c.id===ids[0])||{}).name || '')
    : I18N[lang].deleteCollHeadMany(ids.length);
  $('#deleteCollBody').innerHTML = `
    <div style="font-weight:700; margin-bottom:6px">${esc(head)}</div>
    <div style="color:var(--text2); margin-bottom:10px">${esc(I18N[lang].deleteCollItemCount(itemCount))}</div>
    <div style="margin-bottom:6px">${esc(t('deleteCollExplain'))}</div>
    <ul style="margin:0 0 10px 18px; padding:0; color:var(--text2); line-height:1.7">
      <li>${esc(t('deleteCollOptKeep'))}</li>
      <li>${esc(t('deleteCollOptTrash'))}</li>
      <li>${esc(t('deleteCollOptItemsOnly'))}</li>
    </ul>
    <div style="color:var(--danger); font-size:12.5px">${esc(t('deleteCollTrashWarn'))}</div>`;
  // Buttons that only make sense with items present are disabled when empty.
  $('#btnCollTrashItemsKeepColl').disabled = itemCount===0;
  $('#dlgDeleteColl').showModal();
}
// Remove the given collections (and descendants) from lib.collections and from
// every item's collections list, re-parenting orphaned sub-collections.
function removeCollections(collIdSet){
  lib.collections.forEach(x=>{
    if(collIdSet.has(x.parent)){
      // Walk up to the nearest surviving ancestor (or top level).
      let p = x.parent;
      while(p && collIdSet.has(p)){ const pc = lib.collections.find(c=>c.id===p); p = pc ? (pc.parent||'') : ''; }
      x.parent = p;
    }
  });
  lib.collections = lib.collections.filter(x=>!collIdSet.has(x.id));
  lib.items.forEach(i=>{ i.collections = (i.collections||[]).filter(x=>!collIdSet.has(x)); });
  collIdSet.forEach(id=>{
    selectedCollectionIds.delete(id);
    if(collectionSelectAnchorId===id) collectionSelectAnchorId = null;
    if(filter.coll===id) filter.coll = 'all';
  });
}
// mode: 'keep' (delete collections, keep items), 'trash' (delete collections
// + trash items), 'itemsOnly' (keep collections, trash items).
function performCollDelete(mode){
  const ids = pendingDeleteCollIds || [];
  if(!ids.length) return;
  const allIds = collectionSetWithDescendants(ids);
  let trashedCount = 0;
  if(mode==='trash' || mode==='itemsOnly'){
    const targets = itemsInCollectionSet(allIds).filter(it=>!isItemTrashed(it));
    if(targets.length){
      pushTrashUndo(targets.map(makeTrashUndoRecord));
      const now = new Date().toISOString();
      targets.forEach(it=>{
        it.trashed = true; it.trashedAt = now; it.dateModified = now;
        if(filter.coll!=='trash' && selectedId===it.id) selectedId = null;
      });
      trashedCount = targets.length;
    }
  }
  if(mode==='keep' || mode==='trash') removeCollections(allIds);
  touch(); renderAll();
  if(mode==='keep' || mode==='trash') showToast(I18N[lang].collDeleted(ids.length));
  if(trashedCount) showToast(I18N[lang].collItemsTrashed(trashedCount));
  pendingDeleteCollIds = [];
}
async function deleteForever(id){
  const idx = lib.items.findIndex(x=>x.id===id);
  if(idx<0) return;
  const it = lib.items[idx];
  if(!confirm(I18N[lang].confirmDeleteForever(it.title || t('newItem')))) return;
  for(const a of it.attachments||[]) pendingAttachmentDeletes.add(a.name);
  lib.items.splice(idx,1);
  if(selectedId===id) selectedId = null;
  multiSelectedIds.delete(id);
  if(multiSelectAnchorId===id) multiSelectAnchorId = null;
  touch(); renderAll();
}
async function deleteItemsByIds(ids){
  const idSet = new Set(ids || []);
  const targets = lib.items.filter(it=>idSet.has(it.id));
  for(const it of targets){
    for(const a of it.attachments||[]) pendingAttachmentDeletes.add(a.name);
  }
  lib.items = lib.items.filter(it=>!idSet.has(it.id));
  if(idSet.has(selectedId)) selectedId = null;
  idSet.forEach(id=>multiSelectedIds.delete(id));
  if(idSet.has(multiSelectAnchorId)) multiSelectAnchorId = null;
  if(targets.length){ touch(); renderAll(); }
  return targets.length;
}
async function emptyTrashForever(){
  const ids = lib.items.filter(isItemTrashed).map(it=>it.id);
  if(!ids.length){ showToast(t('trashEmptyMsg')); updateEmptyTrashButton(); return 0; }
  if(!confirm(I18N[lang].confirmEmptyTrash(ids.length))) return 0;
  const n = await deleteItemsByIds(ids);
  if(n) showToast(I18N[lang].trashEmptied(n));
  return n;
}
function updateEmptyTrashButton(){
  const bar = $('#trashInfoBar');
  const btn = $('#btnEmptyTrash');
  const count = $('#trashInfoCount');
  if(!bar || !btn) return;
  const n = lib.items.filter(isItemTrashed).length;
  const show = filter.coll === 'trash' && n > 0;
  bar.style.display = show ? 'flex' : 'none';
  $('#listPane')?.classList.toggle('trashView', show);
  btn.style.display = show ? 'inline-flex' : 'none';
  if(count) count.textContent = show ? I18N[lang].trashInfoCount(n) : '';
}
async function attachFiles(item, fileList){
  // Names waiting for post-save deletion are also reserved. Otherwise an
  // immediate replacement could be deleted by the earlier operation.
  const taken = new Set([...lib.items.flatMap(i=>(i.attachments||[]).map(a=>a.name)), ...pendingAttachmentDeletes]);
  for(const file of fileList){
    const base = (item.citekey || genCitekey(item)).replace(/[^\w.\-]/g,'_') || 'file';
    const ext = (file.name.match(/\.[a-zA-Z0-9]+$/)||['.pdf'])[0];
    let name = base + ext, n = 1;
    while(taken.has(name)){ name = `${base}-${++n}${ext}`; }
    taken.add(name);
    await backend.putAttachment(name, file);
    item.attachments.push({ name });
  }
  touch(item); renderList(); renderDetail();
  showToast(t('pdfAttached'));
}
async function openAttachment(name){
  try{
    const file = await backend.getAttachment(name);
    const url = URL.createObjectURL(file);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(()=>URL.revokeObjectURL(url), 60000);
  }catch(e){ showToast(t('fetchFail') + ': ' + name, true); }
}
async function openAccessPdfUrls(item){
  const urls = [];
  if(item.arxiv) urls.push('https://arxiv.org/pdf/' + encodeURIComponent(item.arxiv) + '.pdf');
  if(item.doi){
    try{
      const r = await fetch('https://api.openalex.org/works/https://doi.org/' + encodeURIComponent(item.doi));
      if(r.ok){
        const w = await r.json();
        const locs = [w.primary_location, ...(w.locations || [])].filter(Boolean);
        locs.forEach(loc=>{
          const pdf = loc.pdf_url || (loc.source && loc.source.pdf_url);
          if(pdf) urls.push(pdf);
        });
        if(w.open_access && w.open_access.oa_url && /\.pdf(\?|$)/i.test(w.open_access.oa_url)) urls.push(w.open_access.oa_url);
      }
    }catch(e){ /* OA lookup is best-effort */ }
  }
  return Array.from(new Set(urls));
}
async function tryAutoAttachPdf(item){
  if(!backend || (item.attachments||[]).length) return false;
  const urls = await openAccessPdfUrls(item);
  for(const url of urls){
    try{
      const r = await fetch(url);
      if(!r.ok) continue;
      const ct = (r.headers.get('content-type') || '').toLowerCase();
      const blob = await r.blob();
      if(!ct.includes('pdf') && blob.type !== 'application/pdf') continue;
      const file = new File([blob], ((item.citekey || genCitekey(item)) + '.pdf'), {type:'application/pdf'});
      await attachFiles(item, [file]);
      showToast(t('pdfAutoAttached'));
      return true;
    }catch(e){ /* try next URL */ }
  }
  return false;
}

/* ---------------------------------------------------------------
   Startup / library open
---------------------------------------------------------------- */
async function startWithBackend(be, opts){
  const fresh = !!(opts && opts.fresh);
  let data = null;
  if(!fresh){
    try{ data = await be.load(); }
    catch(e){ console.error(e); showToast(t('libLoadFail') + ': ' + e.message, true); return false; }
  }
  if(data!==null && (!data || typeof data!=='object' || !Array.isArray(data.items))){
    showToast(t('invalidLibrary'), true);
    return false;
  }
  const nextLib = data
    ? Object.assign({version:APP_VERSION, items:[], collections:[], tagColors:{}, journalDict:[]}, data)
    : { version:APP_VERSION, items:[], collections:[], tagColors:{}, journalDict:[] };
  if(!Array.isArray(nextLib.collections)) nextLib.collections = [];
  if(!Array.isArray(nextLib.journalDict)) nextLib.journalDict = [];
  nextLib.items.forEach(it=>{ // ensure fields exist on items from older versions / hand-edited files
    const fresh = newItem({id:it.id});
    for(const k in fresh) if(it[k]===undefined) it[k] = fresh[k];
  });
  nextLib.collections.forEach(c=>{ if(c.parent===undefined) c.parent = ''; });
  if(!nextLib.tagColors || typeof nextLib.tagColors!=='object') nextLib.tagColors = {};
  try{
    if(be.kind==='fs' && !data) await be.save(nextLib); // create only after validation succeeds
  }catch(e){
    console.error(e); showToast(t('saveFail') + ': ' + e.message, true); return false;
  }
  // Commit the new destination and data together only after load/validation/save succeeded.
  clearTimeout(saveTimer); saveTimer = null;
  backend = be;
  lib = nextLib;
  rebuildUserJournalDict();
  changeVersion++;
  savedVersion = changeVersion;
  pendingAttachmentDeletes.clear();
  if(pickMode) exitPickMode();
  selectedId = null;
  multiSelectedIds.clear();
  multiSelectAnchorId = null;
  selectedCollectionIds.clear();
  collectionSelectAnchorId = null;
  collapsedCollectionIds = new Set(collapsibleCollectionIds());
  filter = { query:'', coll:'all', tags:new Set(), cols:{}, advanced:{ terms:'', mode:'and', field:'all', yearFrom:'', yearTo:'' } };
  $('#searchBox').value = '';
  updateSearchAddUI(false);
  const libLabel = $('#libName');
  const libPath = be.path || be.fullPath || be.name || '';
  const shortLibPath = libPath ? String(libPath).split('/').filter(Boolean).pop() || libPath : '';
  libLabel.innerHTML = be.kind==='mem' ? '' : ic('folder') + '<span class="libNameText">' + esc(shortLibPath) + '</span>';
  libLabel.title = be.kind==='mem' ? t('demoLib') : libPath;
  $('#changeFolderWrap').style.display = HAS_FS ? '' : 'none';
  $('#startScreen').style.display = 'none';
  if(be.kind==='mem') showToast(t('demoWarn'));
  dirty = false; updateSaveDot();
  renderAll();
  return true;
}
async function pickFolder(){
  try{
    if(!await ensureSavedBeforeSwitch()) return;
    const dir = await window.showDirectoryPicker({ mode:'readwrite' });
    if(await startWithBackend(fsBackend(dir))) await idbSet('lastDir', dir);
  }catch(e){
    if(e && e.name==='AbortError') return;
    console.error(e); showToast(t('permDenied'), true);
  }
}
async function newLibrary(){
  try{
    if(!await ensureSavedBeforeSwitch()) return;
    const dir = await window.showDirectoryPicker({ mode:'readwrite' });
    if(await dirHasLibrary(dir)){
      // folder already holds a library — creating a fresh one would overwrite it
      if(!confirm(t('newLibOverwriteConfirm'))){
        if(await startWithBackend(fsBackend(dir))) await idbSet('lastDir', dir); // fall back to just opening it
        return;
      }
    }
    if(await startWithBackend(fsBackend(dir), { fresh:true })) await idbSet('lastDir', dir);
  }catch(e){
    if(e && e.name==='AbortError') return;
    console.error(e); showToast(t('permDenied'), true);
  }
}
async function openLast(){
  const dir = await idbGet('lastDir');
  if(!dir) return;
  try{
    const perm = await dir.requestPermission({ mode:'readwrite' });
    if(perm !== 'granted'){ showToast(t('permDenied'), true); return; }
    await startWithBackend(fsBackend(dir));
  }catch(e){ console.error(e); showToast(t('libLoadFail'), true); }
}
async function canAutoOpenDir(dir){
  if(!dir || !dir.queryPermission) return false;
  try{ return await dir.queryPermission({ mode:'readwrite' }) === 'granted'; }
  catch(e){ return false; }
}
async function dirHasLibrary(dir){
  try{ await dir.getFileHandle('library.json'); return true; }
  catch(e){ return false; }
}

/* ---------------------------------------------------------------
   Event wiring
---------------------------------------------------------------- */
function closeMenus(){
  document.querySelectorAll('.menu.open').forEach(m=>{
    m.classList.remove('open');
    m.style.position = '';
    m.style.top = '';
    m.style.bottom = '';
    m.style.left = '';
    m.style.right = '';
    m.style.zIndex = '';
  });
}
document.addEventListener('click', (e)=>{ if(!e.target.closest('.menuwrap')) closeMenus(); });
window.addEventListener('resize', closeMenus);

// Menus in the bottom status bar must not be clipped by the horizontal-scroll
// behavior used for narrow windows.  When one of those menus opens, place it
// as a viewport-fixed popover above the clicked button.  Toolbar/sidebar menus
// keep their normal absolute positioning.
function positionFloatingMenu(btn, menu){
  if(!btn || !menu) return;
  const inStatus = !!btn.closest('#listStatus');
  const inToolbar = !!btn.closest('#toolbar');
  if(!inStatus && !inToolbar) return;

  const r = btn.getBoundingClientRect();
  menu.style.position = 'fixed';
  menu.style.top = 'auto';
  menu.style.bottom = 'auto';
  menu.style.left = 'auto';
  menu.style.right = 'auto';
  menu.style.zIndex = '300';

  // The menu is display:block after .open is added, so dimensions are reliable.
  const mw = Math.max(menu.offsetWidth || 0, parseFloat(getComputedStyle(menu).minWidth) || 0, 190);
  const mh = menu.offsetHeight || 120;
  let left = r.right - mw;
  left = Math.max(8, Math.min(left, window.innerWidth - mw - 8));

  let top;
  if(inStatus){
    top = r.top - mh - 6;
    if(top < 8) top = Math.min(window.innerHeight - mh - 8, r.bottom + 6);
  }else{
    top = r.bottom + 6;
    if(top + mh > window.innerHeight - 8) top = Math.max(8, r.top - mh - 6);
  }
  top = Math.max(8, top);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}
function bindMenu(btnId, menuId){
  const btn = $(btnId);
  const menu = $(menuId);
  if(!btn || !menu) return;
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    const was = menu.classList.contains('open');
    closeMenus();
    if(!was){
      menu.classList.add('open');
      positionFloatingMenu(btn, menu);
    }
  });
}
bindMenu('#btnAddMenu','#menuAdd');
bindMenu('#btnExport','#menuExport');

$('#btnLang').addEventListener('click', toggleLang);
$('#startLang').addEventListener('click', toggleLang);
$('#btnTheme').addEventListener('click', toggleTheme);

// start screen
$('#btnOpenFolder').addEventListener('click', pickFolder);
$('#btnOpenLast').addEventListener('click', openLast);
bindMenu('#btnChangeFolder','#menuChangeFolder');
$('#miOpenFolder').addEventListener('click', ()=>{ closeMenus(); pickFolder(); });
$('#miNewLibrary').addEventListener('click', ()=>{ closeMenus(); newLibrary(); });

// manual
// miFig(): renders an ICONS path inside the schematic figures
const miFig = (name, x, y, s=16, color='var(--text2)') =>
  `<g transform="translate(${x} ${y}) scale(${(s/24).toFixed(3)})" stroke="${color}" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;
const MANUAL_FIGS = {
  storage(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 175" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <rect x="14" y="34" width="168" height="112" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      <text x="98" y="53" text-anchor="middle" font-weight="600" fill="var(--text)">Paper Library</text>
      <line x1="14" y1="62" x2="182" y2="62" stroke="var(--border2)"/>
      <rect x="28" y="76" width="126" height="8" rx="4" fill="var(--border2)"/>
      <rect x="28" y="94" width="104" height="8" rx="4" fill="var(--border2)"/>
      <rect x="28" y="112" width="118" height="8" rx="4" fill="var(--border2)"/>
      <text x="98" y="166" text-anchor="middle" font-size="10.5" fill="var(--text3)">${J?'アプリの画面':'The app'}</text>
      <text x="216" y="74" text-anchor="middle" fill="var(--accent)" font-weight="600">${J?'自動保存':'Auto-save'}</text>
      <path d="M192 90 H234 M226 83 L238 90 L226 97" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <path d="M250 52 h86 l12 12 h178 a8 8 0 0 1 8 8 v66 a8 8 0 0 1 -8 8 h-268 a8 8 0 0 1 -8 -8 v-78 a8 8 0 0 1 8 -8 z" fill="var(--panel)" stroke="var(--border)"/>
      <text x="266" y="86" font-weight="600" fill="var(--text)">${J?'選んだフォルダ（例：文献ライブラリ）':'The folder you chose (e.g. “Papers”)'}</text>
      ${miFig('file', 264, 96, 15)}
      <text x="288" y="108" fill="var(--text2)">library.json ${J?'— 文献の情報（自動で保存）':'— reference data (saved automatically)'}</text>
      ${miFig('folder', 264, 118, 15)}
      <text x="288" y="130" fill="var(--text2)">attachments/ ${J?'— 添付した PDF':'— attached PDFs'}</text>
    </svg>`;
  },
  add(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 150" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <text x="14" y="24" fill="var(--text2)">${J?'「追加」→「DOI / arXiv / URL から」に入力':'“Add” → “From DOI / arXiv / URL”'}</text>
      <rect x="14" y="36" width="210" height="30" rx="8" fill="var(--panel)" stroke="var(--border)"/>
      <text x="24" y="55" fill="var(--text3)" font-size="11.5">10.1038/nature12373</text>
      <rect x="232" y="36" width="106" height="30" rx="8" fill="var(--accent)"/>
      <text x="285" y="55" text-anchor="middle" fill="#fff" font-size="11.5">${J?'取得して追加':'Fetch &amp; add'}</text>
      <path d="M348 51 H382 M374 44 L386 51 L374 58" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <rect x="394" y="18" width="152" height="114" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      <rect x="406" y="32" width="128" height="9" rx="4" fill="var(--accent)" opacity=".85"/>
      <rect x="406" y="52" width="110" height="7" rx="3" fill="var(--border2)"/>
      <rect x="406" y="66" width="90" height="7" rx="3" fill="var(--border2)"/>
      <rect x="406" y="80" width="62" height="7" rx="3" fill="var(--border2)"/>
      <circle cx="414" cy="110" r="8" fill="var(--green-soft)" stroke="var(--green)"/>
      <path d="M410.5 110 l2.5 2.8 4.5 -5.6" stroke="var(--green)" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="428" y="114" fill="var(--green)" font-size="10.5">${J?'自動で入力されます':'Filled in automatically'}</text>
      <text x="470" y="146" text-anchor="middle" font-size="10.5" fill="var(--text3)">${J?'タイトル・著者・雑誌・年 など':'Title, authors, journal, year, …'}</text>
    </svg>`;
  },
  connector(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <rect x="16" y="18" width="150" height="66" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      ${miFig('download', 32, 31, 18, 'var(--accent)')}
      <text x="68" y="43" font-weight="700" fill="var(--text)">ZIP</text>
      <text x="32" y="64" fill="var(--text2)" font-size="10">${J?'解凍して読み込む':'Unzip and load'}</text>
      <path d="M176 51 H214 M206 44 L218 51 L206 58" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <rect x="230" y="18" width="182" height="66" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      <text x="246" y="39" font-weight="700" fill="var(--text)" font-size="12.5">chrome://extensions</text>
      <rect x="248" y="53" width="62" height="18" rx="9" fill="var(--accent-soft)" stroke="var(--accent-border)"/>
      <text x="279" y="66" text-anchor="middle" fill="var(--accent)" font-size="9.5">${J?'開発者ON':'Dev ON'}</text>
      <rect x="320" y="53" width="56" height="18" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      <text x="348" y="66" text-anchor="middle" fill="var(--text2)" font-size="9.5">${J?'読込':'Load'}</text>
      <path d="M422 51 H460 M452 44 L464 51 L452 58" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <rect x="476" y="18" width="148" height="66" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      ${miFig('gear', 492, 31, 16, 'var(--accent)')}
      <text x="518" y="43" font-weight="700" fill="var(--text)">${J?'詳細':'Details'}</text>
      <circle cx="496" cy="63" r="6" fill="var(--green-soft)" stroke="var(--green)"/>
      <path d="M493 63 l2 2.2 4 -5" stroke="var(--green)" fill="none" stroke-width="1.5" stroke-linecap="round"/>
      <text x="508" y="67" fill="var(--green)" font-size="9.5">${J?'file URL 許可':'Allow file URLs'}</text>
      <rect x="16" y="120" width="190" height="96" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      <text x="32" y="143" font-weight="700" fill="var(--text)">${J?'論文ページ':'Paper page'}</text>
      <rect x="32" y="157" width="138" height="8" rx="4" fill="var(--border2)"/>
      <rect x="32" y="174" width="112" height="8" rx="4" fill="var(--border2)"/>
      ${miFig('book', 170, 133, 18, 'var(--accent)')}
      <text x="111" y="203" text-anchor="middle" fill="var(--text3)" font-size="10">${J?'本のアイコンをクリック':'Click the book icon'}</text>
      <path d="M216 168 H250 M242 161 L254 168 L242 175" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <rect x="266" y="110" width="202" height="116" rx="12" fill="var(--panel)" stroke="var(--border)"/>
      <text x="282" y="132" font-weight="700" fill="var(--text)" font-size="12.5">Paper Library Connector</text>
      <rect x="282" y="145" width="146" height="20" rx="9" fill="var(--bg)" stroke="var(--border2)"/>
      <text x="300" y="159" fill="var(--text2)" font-size="10">${J?'保存先ライブラリ':'Destination library'}</text>
      <rect x="282" y="176" width="15" height="15" rx="3" fill="var(--accent-soft)" stroke="var(--accent)"/>
      <path d="M285 183 l3 3 6 -7" stroke="var(--accent)" fill="none" stroke-width="1.5" stroke-linecap="round"/>
      <text x="307" y="188" fill="var(--text2)" font-size="10.5">${J?'コレクションを選択':'Choose collections'}</text>
      <rect x="282" y="199" width="146" height="22" rx="8" fill="var(--accent)"/>
      <text x="355" y="214" text-anchor="middle" fill="#fff" font-size="10.5">${J?'保存':'Save'}</text>
      <path d="M478 168 H512 M504 161 L516 168 L504 175" stroke="var(--green)" fill="none" stroke-width="2"/>
      <rect x="528" y="120" width="96" height="96" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      <text x="576" y="143" text-anchor="middle" font-weight="700" fill="var(--text)" font-size="11.5">Paper Library</text>
      <circle cx="576" cy="166" r="11" fill="var(--green-soft)" stroke="var(--green)"/>
      <path d="M570.5 166 l4 4.2 7 -8.4" stroke="var(--green)" fill="none" stroke-width="1.8" stroke-linecap="round"/>
      <text x="576" y="191" text-anchor="middle" fill="var(--green)" font-weight="600" font-size="10">${J?'自動取り込み':'Auto-import'}</text>
      <text x="576" y="207" text-anchor="middle" fill="var(--text3)" font-size="9">${J?'次回も反映':'Next open too'}</text>
    </svg>`;
  },
  organize(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 170" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <rect x="14" y="22" width="168" height="128" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      <text x="26" y="44" font-weight="600" fill="var(--text)">${J?'コレクション':'Collections'}</text>
      ${miFig('folder', 26, 54, 15)}
      <text x="48" y="66" fill="var(--text2)">${J?'光化学':'Photochemistry'}</text>
      <rect x="22" y="80" width="152" height="26" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-dasharray="4 3"/>
      ${miFig('folder', 28, 85, 15, 'var(--accent)')}
      <text x="50" y="97" fill="var(--accent)" font-weight="600">${J?'有機合成':'Org. synthesis'}</text>
      ${miFig('folder', 26, 114, 15)}
      <text x="48" y="126" fill="var(--text2)">${J?'レビュー':'Reviews'}</text>
      <rect x="224" y="26" width="320" height="28" rx="8" fill="var(--panel)" stroke="var(--border)"/>
      <rect x="236" y="36" width="180" height="8" rx="4" fill="var(--border2)"/>
      <rect x="224" y="64" width="320" height="28" rx="8" fill="var(--sel)" stroke="var(--accent)"/>
      <rect x="236" y="74" width="200" height="8" rx="4" fill="var(--text3)"/>
      <rect x="224" y="102" width="320" height="28" rx="8" fill="var(--panel)" stroke="var(--border)"/>
      <rect x="236" y="112" width="160" height="8" rx="4" fill="var(--border2)"/>
      <path d="M224 82 C 200 92, 200 92, 186 92 M196 86 L184 93 L196 99" stroke="var(--accent)" fill="none" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="384" y="152" text-anchor="middle" fill="var(--accent)" font-weight="600">${J?'文献をコレクションへドラッグ＆ドロップ':'Drag &amp; drop references into a collection'}</text>
      <text x="384" y="166" text-anchor="middle" font-size="10.5" fill="var(--text3)">${J?'⌘/Ctrl・Shift クリックで複数選択してまとめて移動もできます':'Cmd/Ctrl- or Shift-click to select several and move them together'}</text>
    </svg>`;
  },
  search(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 150" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <rect x="14" y="16" width="260" height="30" rx="8" fill="var(--panel)" stroke="var(--border)"/>
      ${miFig('search', 24, 23, 15)}
      <text x="48" y="35" fill="var(--text3)" font-size="11.5">${J?'検索（タイトル・著者・DOI…）':'Search (title, author, DOI…)'}</text>
      <text x="290" y="35" fill="var(--text2)" font-size="10.5">${J?'← タイトル・著者・タグなどをまとめて検索':'← matches title, authors, tags, … at once'}</text>
      <rect x="14" y="70" width="530" height="30" rx="8" fill="var(--panel)" stroke="var(--border)"/>
      <text x="34" y="89" fill="var(--accent)" font-weight="700">${J?'年':'Year'} ▼</text>
      <line x1="96" y1="70" x2="96" y2="100" stroke="var(--border2)"/>
      <text x="112" y="89" fill="var(--text2)">${J?'タイトル':'Title'}</text>
      <line x1="300" y1="70" x2="300" y2="100" stroke="var(--border2)"/>
      <text x="316" y="89" fill="var(--text2)">${J?'著者':'Authors'}</text>
      <line x1="460" y1="70" x2="460" y2="100" stroke="var(--border2)"/>
      ${miFig('funnel', 508, 76, 15, 'var(--accent)')}
      <path d="M56 104 v10" stroke="var(--accent)" stroke-dasharray="3 3"/>
      <text x="24" y="128" fill="var(--accent)" font-weight="600">${J?'見出しをクリックで並べ替え':'Click a header to sort'}</text>
      <path d="M516 104 v10" stroke="var(--accent)" stroke-dasharray="3 3"/>
      <text x="544" y="128" text-anchor="end" fill="var(--accent)" font-weight="600">${J?'漏斗アイコンで絞り込み':'Funnel icon to filter'}</text>
      <text x="24" y="144" fill="var(--text3)" font-size="10.5">${J?'見出しのドラッグで並び順、右端ドラッグで幅を変更できます':'Drag headers to reorder; drag their right edge to resize'}</text>
    </svg>`;
  },
  pdf(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 160" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <path d="M44 18 h24 l10 10 v34 h-34 z" fill="var(--panel)" stroke="var(--border)"/>
      <path d="M68 18 v10 h10" fill="none" stroke="var(--border)"/>
      <text x="61" y="48" text-anchor="middle" font-weight="700" font-size="10" fill="var(--danger)">PDF</text>
      <path d="M61 68 V94 M54 86 L61 98 L68 86" stroke="var(--accent)" fill="none" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="80" y="88" fill="var(--accent)" font-weight="600">${J?'ドラッグ＆ドロップ':'Drag &amp; drop'}</text>
      <rect x="14" y="104" width="250" height="30" rx="8" fill="var(--panel)" stroke="var(--border)"/>
      <rect x="26" y="115" width="150" height="8" rx="4" fill="var(--border2)"/>
      ${miFig('paperclip', 238, 111, 15, 'var(--accent)')}
      <text x="139" y="152" text-anchor="middle" font-size="10.5" fill="var(--text3)">${J?'文献の行か詳細パネルに PDF を重ねると添付されます':'Drop a PDF onto a row or the detail pane to attach it'}</text>
      <rect x="300" y="16" width="244" height="128" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      <text x="312" y="38" font-weight="600" fill="var(--text)">${J?'詳細パネル':'Detail pane'}</text>
      <line x1="300" y1="48" x2="544" y2="48" stroke="var(--border2)"/>
      ${miFig('paperclip', 312, 56, 15, 'var(--accent)')}
      <text x="334" y="68" fill="var(--text2)">paper.pdf ${J?'（クリックで閲覧）':'(click to view)'}</text>
      <rect x="312" y="84" width="104" height="26" rx="8" fill="var(--accent-soft)" stroke="var(--accent-border)"/>
      <text x="364" y="101" text-anchor="middle" fill="var(--accent)" font-size="10.5">${J?'引用をコピー':'Copy citation'}</text>
      ${miFig('gear', 428, 89, 15)}
      <text x="450" y="101" fill="var(--text2)" font-size="10.5">${J?'引用設定':'Citation settings'}</text>
      <rect x="312" y="118" width="104" height="18" rx="6" fill="var(--border2)"/>
      <rect x="428" y="118" width="80" height="18" rx="6" fill="var(--border2)"/>
    </svg>`;
  },
  graph(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 175" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <defs><linearGradient id="mfigYear" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="hsl(205,70%,62%)"/><stop offset="1" stop-color="hsl(275,60%,62%)"/>
      </linearGradient></defs>
      <rect x="14" y="16" width="376" height="144" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      <path d="M200 88 L110 52 M200 88 L286 60 M200 88 L146 126 M200 88 L258 128 M200 88 L330 102 M110 52 L146 126 M286 60 L330 102" stroke="var(--border)" stroke-width="1.2"/>
      <circle cx="110" cy="52" r="8" fill="hsl(205,70%,62%)"/>
      <circle cx="286" cy="60" r="11" fill="hsl(245,60%,62%)"/>
      <circle cx="146" cy="126" r="7" fill="hsl(220,65%,62%)"/>
      <circle cx="258" cy="128" r="10" fill="hsl(262,58%,62%)"/>
      <circle cx="330" cy="102" r="6" fill="hsl(275,60%,62%)"/>
      <circle cx="200" cy="88" r="15" fill="hsl(240,62%,58%)" stroke="var(--accent)" stroke-width="2.5"/>
      <text x="200" y="118" text-anchor="middle" fill="var(--accent)" font-weight="600">${J?'選んだ論文':'Selected paper'}</text>
      <text x="202" y="152" text-anchor="middle" font-size="10.5" fill="var(--text3)">${J?'ドラッグで移動・ホイールで拡大縮小':'Drag to pan, scroll to zoom'}</text>
      <rect x="402" y="16" width="142" height="144" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      <circle cx="420" cy="40" r="4" fill="var(--text3)"/><circle cx="434" cy="40" r="7" fill="var(--text3)"/>
      <text x="448" y="44" fill="var(--text2)" font-size="10.5">${J?'大きさ＝被引用数':'Size = citations'}</text>
      <rect x="416" y="58" width="60" height="8" rx="4" fill="url(#mfigYear)"/>
      <text x="416" y="82" fill="var(--text2)" font-size="10.5">${J?'色＝出版年':'Color = year'}</text>
      <line x1="402" y1="94" x2="544" y2="94" stroke="var(--border2)"/>
      <text x="416" y="112" fill="var(--text2)" font-size="10.5">${J?'クリックで詳細を表示':'Click for details'}</text>
      <rect x="416" y="122" width="64" height="22" rx="7" fill="var(--accent-soft)" stroke="var(--accent-border)"/>
      <text x="448" y="137" text-anchor="middle" fill="var(--accent)" font-size="10.5">${J?'＋ 追加':'+ Add'}</text>
      <text x="490" y="137" fill="var(--text3)" font-size="10">${J?'未登録も':'even new'}</text>
    </svg>`;
  },
  maintain(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 130" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <text x="14" y="26" fill="var(--text2)" font-size="10.5">${J?'一覧の下部バー':'The bar below the list'}</text>
      <rect x="14" y="36" width="530" height="36" rx="8" fill="var(--panel)" stroke="var(--border)"/>
      <rect x="24" y="43" width="126" height="22" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('citations', 30, 46, 14, 'var(--accent)')}
      <text x="50" y="58" fill="var(--text2)" font-size="10.5">${J?'被引用数を更新':'Update cited-by'}</text>
      <rect x="158" y="43" width="126" height="22" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('users', 164, 46, 14, 'var(--accent)')}
      <text x="184" y="58" fill="var(--text2)" font-size="10.5">${J?'責任著者を更新':'Update corresp.'}</text>
      <rect x="330" y="43" width="98" height="22" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('alert', 336, 46, 14, 'var(--accent)')}
      <text x="356" y="58" fill="var(--text2)" font-size="10.5">${J?'重複候補':'Duplicates'}</text>
      <rect x="404" y="46" width="18" height="16" rx="8" fill="var(--chip)"/>
      <text x="413" y="58" text-anchor="middle" fill="var(--text2)" font-size="10">2</text>
      <rect x="436" y="43" width="98" height="22" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('alert', 442, 46, 14, 'var(--accent)')}
      <text x="462" y="58" fill="var(--text2)" font-size="10.5">${J?'修正候補':'Fixes'}</text>
      <rect x="498" y="46" width="18" height="16" rx="8" fill="var(--chip)"/>
      <text x="507" y="58" text-anchor="middle" fill="var(--text2)" font-size="10">3</text>
      <path d="M154 76 v10 M472 76 v10" stroke="var(--accent)" stroke-dasharray="3 3"/>
      <text x="24" y="102" fill="var(--accent)" font-weight="600">${J?'最新の情報をインターネットから取得':'Fetch the latest data from the internet'}</text>
      <text x="544" y="102" text-anchor="end" fill="var(--accent)" font-weight="600">${J?'見つかった問題はバッジで通知 → クリックで確認':'Problems appear as badges — click to review'}</text>
    </svg>`;
  },
  exportfig(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 170" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <rect x="14" y="16" width="216" height="132" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      ${miFig('upload', 26, 26, 15, 'var(--accent)')}
      <text x="48" y="38" font-weight="600" fill="var(--text)">${J?'エクスポート':'Export'}</text>
      <line x1="14" y1="48" x2="230" y2="48" stroke="var(--border2)"/>
      <text x="28" y="66" fill="var(--text2)">${J?'表示中の文献 → BibTeX':'Shown items → BibTeX'}</text>
      <text x="28" y="82" fill="var(--text2)">${J?'表示中の文献 → RIS / CSV / JSON':'Shown items → RIS / CSV / JSON'}</text>
      <line x1="14" y1="96" x2="230" y2="96" stroke="var(--border2)"/>
      <text x="28" y="116" fill="var(--accent)" font-weight="600">${J?'ライブラリ全体 → JSON':'Whole library → JSON'}</text>
      <text x="28" y="134" fill="var(--text3)" font-size="10">${J?'バックアップ・引っ越し用':'Backup / migration'}</text>
      <path d="M242 68 H274 M266 61 L278 68 L266 75" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <path d="M300 36 h24 l9 9 v34 h-33 z" fill="var(--panel)" stroke="var(--border)"/>
      <text x="316" y="61" text-anchor="middle" font-size="9.5" fill="var(--text2)">.bib</text>
      <path d="M348 36 h24 l9 9 v34 h-33 z" fill="var(--panel)" stroke="var(--border)"/>
      <text x="364" y="61" text-anchor="middle" font-size="9.5" fill="var(--text2)">.ris</text>
      <path d="M396 36 h24 l9 9 v34 h-33 z" fill="var(--panel)" stroke="var(--border)"/>
      <text x="412" y="61" text-anchor="middle" font-size="9.5" fill="var(--text2)">.csv</text>
      <text x="372" y="98" text-anchor="middle" font-size="10.5" fill="var(--text3)">${J?'LaTeX・他の文献管理ソフトで利用':'For LaTeX and other managers'}</text>
      <path d="M242 122 H274 M266 115 L278 122 L266 129" stroke="var(--green)" fill="none" stroke-width="2"/>
      <rect x="300" y="106" width="222" height="46" rx="10" fill="var(--green-soft)" stroke="var(--green)"/>
      <path d="M318 114 h24 l9 9 v22 h-33 z" fill="var(--panel)" stroke="var(--green)"/>
      <text x="335" y="137" text-anchor="middle" font-size="9.5" fill="var(--green)">.json</text>
      <text x="366" y="127" fill="var(--green)" font-size="10.5" font-weight="600">${J?'バックアップ・引っ越し':'Backup / migration'}</text>
      <text x="366" y="143" fill="var(--text2)" font-size="10">${J?'コレクション構成ごと保存':'Includes collection structure'}</text>
    </svg>`;
  },
  settings(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 560 115" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <rect x="14" y="26" width="530" height="40" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      ${miFig('book', 26, 38, 16, 'var(--accent)')}
      <text x="50" y="51" font-weight="700" fill="var(--text)">Paper Library</text>
      <rect x="300" y="36" width="88" height="22" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('book', 306, 39, 14)}
      <text x="326" y="51" fill="var(--text2)" font-size="10.5">${J?'マニュアル':'Manual'}</text>
      <rect x="396" y="36" width="62" height="22" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('moon', 402, 39, 14)}
      <text x="422" y="51" fill="var(--text2)" font-size="10.5">Dark</text>
      <rect x="466" y="36" width="36" height="22" rx="7" fill="var(--bg)" stroke="var(--border2)"/>
      <text x="484" y="51" text-anchor="middle" fill="var(--text2)" font-size="10.5">EN</text>
      <path d="M400 70 v10" stroke="var(--accent)" stroke-dasharray="3 3"/>
      <text x="544" y="96" text-anchor="end" fill="var(--accent)" font-weight="600">${J?'マニュアル・テーマ・言語の切替':'Manual, theme, and language'}</text>
    </svg>`;
  },
  wordaddin(lg){
    const J = lg==='ja';
    return `<svg viewBox="0 0 640 244" xmlns="http://www.w3.org/2000/svg" font-size="11">
      <!-- step 1: the app exports library.json -->
      <rect x="16" y="20" width="150" height="82" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      ${miFig('book', 30, 32, 16, 'var(--accent)')}
      <text x="54" y="44" font-weight="700" fill="var(--text)" font-size="11">Paper Library</text>
      ${miFig('upload', 30, 56, 14, 'var(--accent)')}
      <text x="50" y="68" fill="var(--text2)" font-size="10">${J?'エクスポート':'Export'}</text>
      <rect x="30" y="78" width="120" height="16" rx="5" fill="var(--green-soft)" stroke="var(--green)"/>
      <text x="90" y="90" text-anchor="middle" fill="var(--green)" font-size="9.5">library.json</text>
      <path d="M176 61 H214 M206 54 L218 61 L206 68" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <!-- step 2: the Word ribbon tab -->
      <rect x="230" y="20" width="196" height="82" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      <text x="244" y="38" font-weight="700" fill="var(--text)" font-size="11">${J?'Word のリボン':'Word ribbon'}</text>
      <rect x="244" y="46" width="86" height="18" rx="5" fill="var(--accent-soft)" stroke="var(--accent-border)"/>
      <text x="287" y="59" text-anchor="middle" fill="var(--accent)" font-size="9.5">Paper Library</text>
      <rect x="244" y="72" width="118" height="22" rx="7" fill="var(--accent)"/>
      ${miFig('book', 250, 75, 15, '#fff')}
      <text x="305" y="87" text-anchor="middle" fill="#fff" font-size="10">${J?'文献を挿入':'Insert reference'}</text>
      <path d="M436 61 H474 M466 54 L478 61 L466 68" stroke="var(--accent)" fill="none" stroke-width="2"/>
      <!-- step 3: the task pane -->
      <rect x="490" y="14" width="134" height="96" rx="11" fill="var(--panel)" stroke="var(--border)"/>
      <text x="502" y="32" font-weight="700" fill="var(--text)" font-size="10.5">${J?'パネル':'Panel'}</text>
      <rect x="502" y="40" width="110" height="16" rx="5" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('download', 505, 42, 12)}
      <text x="525" y="52" fill="var(--text2)" font-size="9">${J?'ライブラリ読込':'Load library'}</text>
      <rect x="502" y="61" width="110" height="16" rx="5" fill="var(--bg)" stroke="var(--border2)"/>
      ${miFig('search', 505, 63, 12)}
      <text x="525" y="73" fill="var(--text3)" font-size="9">${J?'検索':'Search'}</text>
      <rect x="502" y="83" width="110" height="19" rx="6" fill="var(--accent)"/>
      <text x="557" y="96" text-anchor="middle" fill="#fff" font-size="9.5">${J?'引用を挿入':'Insert citation'}</text>
      <path d="M557 110 V126" stroke="var(--accent)" stroke-dasharray="3 3"/>
      <!-- result: the document -->
      <rect x="150" y="128" width="340" height="106" rx="10" fill="var(--panel)" stroke="var(--border)"/>
      <text x="166" y="148" font-weight="600" fill="var(--text)" font-size="10.5">${J?'Word 文書':'Word document'}</text>
      <line x1="150" y1="156" x2="490" y2="156" stroke="var(--border2)"/>
      <rect x="166" y="166" width="146" height="7" rx="3" fill="var(--border2)"/>
      <text x="320" y="174" fill="var(--accent)" font-weight="700" font-size="10">[1]</text>
      <rect x="334" y="166" width="122" height="7" rx="3" fill="var(--border2)"/>
      <rect x="166" y="183" width="86" height="7" rx="3" fill="var(--border2)"/>
      <text x="260" y="191" fill="var(--accent)" font-weight="700" font-size="10">[2]</text>
      <rect x="274" y="183" width="182" height="7" rx="3" fill="var(--border2)"/>
      <text x="166" y="212" fill="var(--text2)" font-weight="600" font-size="9.5">${J?'文献リスト（自動連動）':'Bibliography (auto-linked)'}</text>
      <text x="170" y="226" fill="var(--text3)" font-size="9" font-style="italic">1. Author, A. J. Am. Chem. Soc. 2020, 142, 1.</text>
      <text x="506" y="150" fill="var(--accent)" font-weight="600" font-size="10">${J?'番号 [1] と':'Numbered [1]'}</text>
      <text x="506" y="164" fill="var(--accent)" font-weight="600" font-size="10">${J?'文献リストを':'and bibliography'}</text>
      <text x="506" y="178" fill="var(--accent)" font-weight="600" font-size="10">${J?'自動作成':'auto-built'}</text>
      <text x="506" y="200" fill="var(--text3)" font-size="9">${J?'斜体・太字も':'italics &amp; bold'}</text>
      <text x="506" y="212" fill="var(--text3)" font-size="9">${J?'保持されます':'preserved'}</text>
    </svg>`;
  },
};
const MANUAL = {
  ja: [
    { h:'ホーム画面と保存の仕組み', tab:'はじめに', blocks:[
      {p:'Paper Library v1.0 は、論文などの文献をブラウザ上で管理するローカル保存型のツールです。インストールは不要で、この HTML ファイルをブラウザ（Chrome / Edge）で開くだけで使えます。'},
      {fig:'storage'},
      {sub:'初めて使うとき'},
      {ul:[
        'ホーム画面の「ライブラリフォルダを開く / 作成」[[ic:folderOpen]] を押し、文献データの保存先にしたいフォルダを選びます（例：「ダウンロード」の中に「文献ライブラリ」フォルダを作って選ぶ）。',
        '注意：macOS の「デスクトップ」や「書類」など、OS が保護しているフォルダは選べない・保存できないことがあります。その場合は「ダウンロード」の中など、別の場所にフォルダを作ってください。',
        'ブラウザが「ファイルの変更を許可しますか？」と確認してきたら「許可」を選んでください。自動保存に必要です。',
        '空のフォルダを選ぶと、新しいライブラリが作られます。以前使ったフォルダを選ぶと、その中身がそのまま読み込まれます。',
        '2回目からはホーム画面に「前回のライブラリを開く」[[ic:clock]] ボタンが表示されるので、ワンクリックで再開できます。',
      ]},
      {sub:'データはどこに保存される？'},
      {ul:[
        '文献の情報（タイトル・著者・年など）は、選んだフォルダの中に「library.json」というファイルとして自動保存されます。保存ボタンを押す必要はありません（保存状態は画面右上に表示されます）。',
        '添付した PDF は、同じフォルダの中に自動で作られる「attachments」フォルダにコピーされます。',
        'つまり、選んだフォルダを丸ごとコピーすれば、それがライブラリ全体のバックアップになります。',
        'データはすべて自分のパソコンの中に保存されます。インターネット上にアップロードされることはありません。',
      ]},
    ]},
    { h:'文献を追加する', blocks:[
      {p:'文献の登録方法は「自動取得」「手動入力」「他のソフトからの取り込み」の3つです。'},
      {fig:'add'},
      {sub:'DOI などから自動取得（おすすめ）'},
      {ul:[
        '「追加」[[ic:plus]] →「DOI / arXiv / URL から」を開き、DOI（例：10.1038/nature12373）、arXiv ID、論文ページの URL、または論文タイトルを入力します。',
        '「取得して追加」を押すと、タイトル・著者・雑誌名・年などの情報が自動で入力されます。',
        'タイトルで検索した場合は候補が一覧で表示されるので、正しい論文をクリックして追加します。',
      ]},
      {sub:'手動で入力する'},
      {ul:[
        '「追加」→「手動追加」で空の文献が作られるので、右側の詳細パネルに直接入力します。',
      ]},
      {sub:'他のソフトから移行する（インポート）'},
      {ul:[
        'Zotero・Mendeley・Paperpile などから書き出したファイル（BibTeX .bib / RIS .ris / CSV / JSON / Zotero RDF .rdf）を「追加」メニューの「インポート」[[ic:download]] から読み込めます。',
        'Paperpile・Zotero からの具体的な移行手順は、マニュアルの「他のソフトから移行」タブ [[ic:download]] を参照してください。',
      ]},
    ]},
    { h:'他のソフトから移行', tab:'移行・インポート', icon:'download', blocks:[
      {p:'Zotero・Mendeley・Paperpile など、他の文献管理ソフトからのデータ移行に対応しています。移行元でファイルを「書き出し（エクスポート）」し、Paper Library の「追加」[[ic:plus]] →「インポート」[[ic:download]] から読み込みます。'},
      {p:'対応形式は BibTeX（.bib）／RIS（.ris）／CSV（.csv）／JSON（.json）／Zotero RDF（.rdf）です。コレクション（フォルダ階層）まで引き継ぎたい場合は、フォルダ情報を含む形式（Zotero RDF、Paper Library JSON、フォルダ列を含む CSV／JSON など）で書き出してください。BibTeX／RIS は書誌データのみで、フォルダ構成までは通常復元できません。'},
      {sub:'共通の設定'},
      {ul:[
        'インポートのメニュー内にある「keywords をタグとして読み込む」にチェックを入れると、移行元のキーワード（keywords）がそのまま Paper Library のタグになります。',
        '取り込み後は自動的に重複チェックが働き、DOI などが一致する文献は重複候補として通知されます（自動では消えません）。',
        'PDF などの添付ファイルは移行元のエクスポートには含まれないため取り込まれません。書誌データ（タイトル・著者・DOI など）とフォルダ構成のみが移行されます。PDF は移行後に各文献へ改めて添付してください。',
      ]},
      {sub:'Zotero から移行する'},
      {ul:[
        'Zotero を開き、移行したいコレクションを右クリック →「コレクションを書き出し…」を選びます（ライブラリ全体を移す場合は、左上の「マイ・ライブラリ」を右クリック →「ライブラリを書き出し…」）。',
        '形式（Format）で「Zotero RDF」を選択します。「ファイルを書き出す（Export Files）」のチェックは、PDF は取り込まれないため外して構いません（メモを移したい場合は「メモを書き出す（Export Notes）」を ON に）。',
        '書き出してできた .rdf ファイルを、Paper Library の「追加」→「インポート」→「Zotero RDF (.rdf)」から読み込みます。',
        'コレクション（入れ子構造・空のコレクションを含む）と、各文献の所属コレクションがそのまま復元されます。タグも引き継ぎたい場合は、読み込み前に「keywords をタグとして読み込む」にチェックを入れてください。',
        '注意：リンクされた PDF やウェブスナップショット（.rdf と一緒に作られる files/ フォルダ）は取り込まれません。取り込まれるのは書誌データとフォルダ構成のみです。',
      ]},
      {sub:'Paperpile から移行する'},
      {ul:[
        'Paperpile（ブラウザ版）を開き、移行したい論文を選択します（左側のフォルダを選んでから、リスト上部のチェックで全選択も可能）。',
        'メニューの「Export」から書き出し形式を選びます。書誌データだけを移すなら BibTeX（.bib）または RIS（.ris）が確実です。',
        '書き出したファイルを、Paper Library の「追加」→「インポート」から対応する形式（BibTeX または RIS）で読み込みます。',
        'Paperpile の「Labels（ラベル）」を Paper Library のタグとして引き継ぎたい場合は、読み込み前に「keywords をタグとして読み込む」にチェックを入れてください（ラベルが keywords として書き出されている場合に反映されます）。',
        'Paperpile の Folders（フォルダ）構成は BibTeX／RIS では引き継げません。フォルダごとに分けて移したい場合は、Paperpile 側でフォルダ単位に書き出し、Paper Library 側で先にコレクションを作ってから、そのコレクションを選んだ状態でインポートすると整理しやすいです。',
      ]},
      {sub:'その他のソフト（Mendeley など）'},
      {ul:[
        'Mendeley・EndNote など多くのソフトは BibTeX（.bib）または RIS（.ris）で書き出せます。書き出したファイルを「インポート」から読み込めば、書誌データを移行できます。',
        'フォルダ構成の移行が必要で、その形式でうまく引き継げない場合は、一度 Zotero に取り込んでから Zotero RDF で書き出す方法が確実です。',
      ]},
    ]},
    { h:'拡張機能で保存する', tab:'拡張機能', blocks:[
      {p:'Paper Library Connector は、論文ページを開いたまま Chrome のツールバーから文献を保存するための付属拡張機能です。保存した文献は、Paper Library を開いたときに自動でライブラリへ取り込まれます。'},
      {fig:'connector'},
      {sub:'インストール'},
      {dl:'拡張機能をダウンロード（ZIP）'},
      {ul:[
        '上のボタンで ZIP をダウンロードし、解凍します。解凍してできた「paper-library-connector」フォルダは、あとで消したり動かしたりしない場所に置いてください（おすすめ：Windows は「ドキュメント\\PaperLibrary\\」、Mac は「書類/PaperLibrary/」など、普段片づけない固定のフォルダ。ダウンロードフォルダやデスクトップに置いたままだと、掃除のときに誤って消しやすいので避けてください）。',
        'Chrome のアドレスバーに chrome://extensions と入力して開き、右上の「デベロッパーモード」を ON にします（chrome:// のページはリンクからは開けないため、アドレスバーに貼り付けて移動してください）。',
        '「パッケージ化されていない拡張機能を読み込む」を押し、先ほど置いた「paper-library-connector」フォルダを選びます。',
        '大切：読み込んだあとも Chrome はこのフォルダを直接参照し続けます。フォルダを削除・移動・名前変更すると拡張機能が動かなくなるので、そのままの場所に残しておいてください（消してしまった場合は、もう一度解凍して同じ場所に置き、この手順をやり直せば復活します）。',
        'GitHub Pages など https:// の Paper Library で使う場合は、このまま利用できます。ローカルの index.html を file:// で開いて使う場合だけ、拡張機能の「詳細」画面で「ファイルの URL へのアクセスを許可する」を ON にしてください。',
        '拡張機能を使う前に、一度 Paper Library をライブラリフォルダを開いた状態で表示しておいてください（保存先ライブラリとコレクション一覧を拡張機能に知らせるためです）。',
      ]},
      {sub:'論文ページから保存する'},
      {ul:[
        '出版社ページや arXiv などの論文ページを開き、Chrome ツールバーの本のアイコンをクリックします。',
        'ポップアップには論文タイトル、著者、雑誌名略語、年が表示されます。DOI は表示を邪魔しないよう、ここでは出しません。',
        '入れたいコレクションにチェックを入れて「保存」を押します。コレクションを選ばなければ「未分類」（どのコレクションにも入れない状態）で保存されます。',
      ]},
      {sub:'保存先ライブラリと取り込み'},
      {ul:[
        'ポップアップ上部に保存先ライブラリが表示されます。複数のライブラリを Paper Library で開いたことがある場合は、プルダウンで保存先を切り替えられます。',
        'Paper Library が開いている場合は、保存後すぐに取り込まれます。開いていない場合は「Paper Library を開いて取り込む」ボタンが表示され、次に開いたときにも自動で取り込まれます。',
        '選んだ保存先ライブラリとコレクションは、次にそのライブラリを開いたときに反映されます。',
      ]},
      {sub:'保存済み・取り込み待ちの見分け方'},
      {ul:[
        'すでにライブラリにある論文ページでは、拡張機能アイコンに緑の「✓」バッジが付き、ポップアップに登録先コレクションが表示されます。',
        '保存したがまだ Paper Library に取り込まれていない論文は、オレンジの「…」バッジで表示されます。',
        'ライブラリにまだ入っていない論文は、青い「＋」バッジで表示されます。',
        '保存済みの論文でも、別のコレクションを選んで保存すると、そのコレクションへの追加として扱われます。',
      ]},
    ]},
    { h:'整理する', blocks:[
      {p:'文献は「コレクション」（フォルダのようなもの）と「タグ」で分類できます。'},
      {fig:'organize'},
      {ul:[
        'コレクション：左パネルの「＋」[[ic:plus]] ボタンで作成し、文献をドラッグ＆ドロップで入れます。コレクションの中にコレクションを作って階層化もできます。',
        '1つの文献を複数のコレクションに入れることもできます（同じ文献が両方から見えるだけで、二重登録にはなりません）。',
        'タグ [[ic:tag]]：詳細パネルで文献にタグを付けられます。左パネルのタグ一覧から色も設定できます。',
        'スター [[ic:star]]：重要な文献に星を付けると、左パネルの「スター」からすぐに呼び出せます。',
        'まとめて操作：⌘（Windows では Ctrl）を押しながらクリックで複数選択、Shift＋クリックで範囲選択して、まとめてドラッグできます。',
      ]},
    ]},
    { h:'探す・並べ替える', blocks:[
      {fig:'search'},
      {ul:[
        '上部の検索欄 [[ic:search]]：タイトル・著者・雑誌名・DOI・タグなどをまとめて検索できます。',
        '「詳細検索」：「著者に◯◯を含み、2020年以降」のような、条件を組み合わせた検索ができます。',
        '並べ替え：表の見出し（「年」「タイトル」など）にマウスを重ね、表示される ▲／▼ ボタンを押します。もう一度押すと昇順・降順が切り替わります。',
        '列のカスタマイズ：見出しをドラッグすると列の順番を変更、見出しの右端をドラッグすると幅を変更できます。下部バーの「列」メニューで表示する項目を選べます。',
        '絞り込み [[ic:funnel]]：列の見出しにある漏斗アイコンから、その列の値で絞り込めます。',
        '表示の切替：下部バーの「表示」メニューで、表 [[ic:table]]、カード [[ic:rows]]、文献棚 [[ic:book]]、カンバンを切り替えられます。検索やコレクションの絞り込みは、どの表示にも反映されます。',
        '文献棚：最近追加、スター、読書中、PDFあり、各コレクションを横方向の棚として表示します。「最近追加」は日数を入力して対象期間を変更できます。文献をクリックすると通常どおり詳細パネルが開きます。',
        'カンバン：文献を「未読」「読書中」「読了」の3列で管理します。カードを別の列へドラッグすると状態が保存されます。読書状態は詳細パネルからも変更できます。',
      ]},
    ]},
    { h:'詳細パネルと PDF', blocks:[
      {p:'文献をクリックすると、右側に詳細パネルが開きます。'},
      {fig:'pdf'},
      {ul:[
        '書誌情報・アブストラクト・メモなどを確認・編集できます。編集した内容は自動で保存されます。',
        'PDF の添付 [[ic:paperclip]]：PDF ファイルを一覧の文献の行、または詳細パネルにドラッグ＆ドロップします。詳細パネルの「PDF を添付」ボタンからファイルを選ぶこともできます。',
        '添付した PDF は、クリックするとブラウザ内で開きます。',
        '引用をコピー [[ic:quote]]：論文リスト用の書式（著者・雑誌・年など）でコピーできます。歯車アイコン [[ic:gear]] の「引用設定」でスタイルや著者の書き方を変更できます。',
        '相関図 [[ic:graph]]：引用関係で繋がる関連論文をマップ表示します。詳しくは「相関図」タブをご覧ください。',
      ]},
    ]},
    { h:'相関図（関連論文マップ）', tab:'相関図', blocks:[
      {p:'相関図は、選んだ文献と引用関係で繋がる論文を地図のように表示する機能です。関連する論文や、読み落としている重要な論文を探すのに便利です。'},
      {fig:'graph'},
      {ul:[
        '開き方：文献を選んで、詳細パネルの「相関図」[[ic:graph]] ボタンを押します。',
        '丸1つが1本の論文です。丸の大きさは被引用数（よく引用される論文ほど大きい）、色は出版年を表します。',
        '関連の強い論文ほど近くに配置されます（同じ論文を参照している度合いなどから計算しています）。',
        '操作：背景をドラッグすると移動、マウスホイールで拡大・縮小、丸をドラッグすると配置を調整できます。',
        '丸をクリックすると右側に詳細が表示されます。ライブラリに未登録の論文はその場で「追加」でき、登録済みの論文には緑の印が付きます。',
        'データは公開データベース OpenAlex から取得します。一度表示した相関図は保存されるので、2回目からは通信なしですぐに開けます（ヘッダーの「再取得」で最新に更新）。',
        '短時間に多くの相関図を表示すると、OpenAlex の1日あたりの利用上限に達することがあります。その場合は時間をおいてから再試行してください。',
      ]},
    ]},
    { h:'情報の更新・メンテナンス', tab:'更新・メンテナンス', blocks:[
      {fig:'maintain'},
      {ul:[
        '被引用数を更新 [[ic:citations]]：下部バーのボタンで、各文献が何回引用されているかの最新値をインターネットから取得します。',
        '責任著者を更新 [[ic:users]]：論文の責任著者（corresponding author）の情報を取得します。',
        '責任著者の自動更新は、OpenAlex への負荷を抑えるため一度に最大25件ずつ処理します。さらに更新したい場合は、もう一度実行してください。',
        'どちらも「表示中の全件を自動で」または「文献を選んで」実行できます。',
        '重複候補・空データ・修正候補 [[ic:alert]]：同じ論文の二重登録や情報の欠けを自動で見つけて、下部バーにバッジで知らせます。クリックすると内容を確認して整理できます。',
        '修正候補では、Angew. Chem. Int. Ed. Engl. / Engle. / Eng. Ed. のような旧・誤略称を検出し、1998年以降の文献では Angew. Chem. Int. Ed. への修正を提案します。',
        '更新ログ：情報の自動取得に失敗した場合はここに記録され、あとから再試行 [[ic:retry]] できます。',
      ]},
      {sub:'雑誌名の辞書'},
      {p:'雑誌名の表記ゆれ（取得された略称・別名）を、正しい正式名・略称に対応づける辞書を自分で編集できます。ここに追加した対応は、修正候補と一覧の雑誌名表示に反映されます。'},
      {ul:[
        '「取得される表記・別名」に、実際に登録された雑誌名（例：[[code:Adv. Sci. (Weinh.)]]）を入れます。大文字・小文字や記号の違いは無視して照合されます。',
        '「正式名」は雑誌欄に入れたい正式名称、「略称」は一覧に表示したい略称です。どちらか一方だけでも登録できます。',
        '辞書は library.json に保存されるので、バックアップや別のパソコンへの移行でもそのまま引き継がれます。標準の辞書より優先されるため、既定の対応を上書きすることもできます。',
        '同じ雑誌名（別名）をもう一度追加すると、既存の登録が上書きされます。',
      ]},
      {dict:'雑誌名の辞書を開く'},
    ]},
    { h:'エクスポート・バックアップ', tab:'エクスポート', blocks:[
      {fig:'exportfig'},
      {ul:[
        '「エクスポート」[[ic:upload]] メニューから、いま一覧に表示されている文献を BibTeX / RIS / CSV / JSON 形式で書き出せます。LaTeX や他の文献管理ソフトで使えます。',
        '「ライブラリ全体 → JSON」はバックアップ用です。別のパソコンでこの JSON をインポートすると、コレクション構成ごと復元できます。',
        'フォルダ情報まで確実に残したい場合は JSON を使ってください。BibTeX / RIS は文献情報の受け渡し向けで、フォルダ構成は保持されないことがあります。',
        '普段のバックアップは、ライブラリフォルダ（library.json と attachments）を丸ごとコピーするだけでも大丈夫です。',
      ]},
    ]},
    { h:'Word アドインで引用する', tab:'Word アドイン', blocks:[
      {p:'Paper Library の Word アドインを入れると、Word のリボンに「Paper Library」タブが追加され、文献を検索してカーソル位置に引用文献を挿入できます。番号付き引用 [1] と末尾の文献リストが自動で連動し、雑誌名の斜体や年の太字もそのまま入ります。'},
      {fig:'wordaddin'},
      {sub:'1. manifest.xml をダウンロードする'},
      {dlword:'manifest.xml をダウンロード'},
      {ul:[
        '上のボタンで manifest.xml をダウンロードします。Word に登録するのはこの 1 ファイルだけです。',
      ]},
      {sub:'2. Word に登録する'},
      {ul:[
        'manifest.xml を、Word 専用の「wef」フォルダに入れると登録できます。',
        'Finder をアクティブにした状態で、[[code:Command ⌘ + Shift ⇧ + G]]で出てくる入力欄に[[code:~/Library/Containers/com.microsoft.Word/Data/Documents/wef/]]を入力して Enter を押します。',
        '開いたフォルダにダウンロードした manifest.xml をコピーアンドペーストして入れます。',
        'もし「フォルダが見つかりません」と出たら、末尾の [[code:wef/]] を消して [[code:~/Library/Containers/com.microsoft.Word/Data/Documents/]] へ移動し、その中で右クリック →「新規フォルダ」で名前を [[code:wef]] にして作成してから入れてください。',
        'Word を再起動し、ホームタブ →「アドイン」→「個人用アドイン」から Paper Library を選択します。',
        'リボンに「Paper Library」タブが追加されていたら完了です。',
      ]},
      {sub:'3. 使い方（パネルでの操作）'},
      {ul:[
        'Word のリボンの「Paper Library」タブ →「文献を挿入」[[ic:book]] を押すとパネルが開きます。',
        'パネルの「ライブラリ」ボタンで library.json を読み込みます。場所はライブラリの保存フォルダ内の library.json、または本体アプリの「エクスポート」[[ic:upload]] →「ライブラリ全体 → JSON」で書き出したファイルです。一度読み込むとキャッシュされ、次回から自動で復元します（文献を増やしたら再読み込み）。',
        '検索欄でタイトル・著者・雑誌・DOI などで絞り込み、スタイル（ACS / Nature / Science / RSC / CSJ / Angew.）を選びます。パネル右上の EN / 日本語 で表示言語を切り替えられます。',
        '各文献の「挿入」で、カーソル位置に番号 [1]（または上付き ¹）を挿入します。番号は出現順に自動で取得され、同じ文献を再引用すると同じ番号を使い回します。挿入するたびに末尾の文献リストが自動で更新されます（文献を消したり並べ替えたら「文献リストを更新」で再同期）。',
        '番号の見た目は「番号」で [1]（角括弧）／上付き ¹ を切り替えられます。挿入される文字は既定で Times New Roman 10.5pt です。',
      ]},
    ]},
    { h:'画面設定', blocks:[
      {fig:'settings'},
      {ul:[
        '右上のボタンで、ダーク / ライトテーマ [[ic:moon]] と日本語 / 英語表示を切り替えられます。',
        '更新内容は、マニュアル内の「更新履歴」から確認できます。',
        '文献情報の自動取得のときだけ、CrossRef・OpenAlex などの公開データベースに接続します。それ以外の操作はすべてパソコンの中で完結します。',
      ]},
    ]},
    { h:'更新履歴', blocks:[
      {changelog:true},
    ]},
    { h:'お問い合わせ', blocks:[
      {p:'不明点や、こうしてほしいという改善点があれば、下記までご連絡ください。'},
      {contact:true},
    ]},
  ],
  en: [
    { h:'Home screen & saving', blocks:[
      {p:'Paper Library v1.0 is a local-first tool for managing references (papers, books, etc.) in your browser. No installation is needed — just open this HTML file in Chrome or Edge.'},
      {fig:'storage'},
      {sub:'First time'},
      {ul:[
        'On the home screen, press “Open / create a library folder” [[ic:folderOpen]] and choose the folder where you want your reference data to live (for example, a “Papers” folder created inside Downloads).',
        'Note: folders protected by the OS — such as Desktop and Documents on macOS — may be refused for saving. If that happens, create your library folder somewhere else, e.g. inside Downloads.',
        'If the browser asks for permission to edit files, choose “Allow” — this is needed for automatic saving.',
        'Choosing an empty folder creates a new library. Choosing a folder you used before loads its contents as-is.',
        'From the second time on, the home screen shows an “Open the last library” [[ic:clock]] button so you can resume with one click.',
      ]},
      {sub:'Where is my data stored?'},
      {ul:[
        'Reference details (title, authors, year, …) are saved automatically into a file called “library.json” inside the folder you chose. There is no save button to press — the save state is shown at the top right.',
        'Attached PDFs are copied into an “attachments” folder that is created automatically inside the same folder.',
        'This means copying that one folder gives you a complete backup of your library.',
        'Everything stays on your own computer; nothing is uploaded to the internet.',
      ]},
    ]},
    { h:'Adding references', blocks:[
      {p:'There are three ways to register a reference: automatic fetching, manual entry, and importing from other software.'},
      {fig:'add'},
      {sub:'Fetch automatically from a DOI (recommended)'},
      {ul:[
        'Open “Add” [[ic:plus]] → “From DOI / arXiv / URL” and enter a DOI (e.g. 10.1038/nature12373), an arXiv ID, the URL of a paper page, or a paper title.',
        'Press “Fetch & add” and the title, authors, journal, year, and more are filled in automatically.',
        'If you searched by title, a list of candidates appears — click the right paper to add it.',
      ]},
      {sub:'Enter manually'},
      {ul:[
        '“Add” → “Add manually” creates an empty record that you fill in from the detail pane on the right.',
      ]},
      {sub:'Migrate from other software (import)'},
      {ul:[
        'Files exported from Zotero, Mendeley, Paperpile, etc. (BibTeX .bib / RIS .ris / CSV / JSON / Zotero RDF .rdf) can be loaded from “Import” [[ic:download]] in the “Add” menu.',
        'For step-by-step instructions for Paperpile and Zotero, see the “Migrate” tab [[ic:download]] of this manual.',
      ]},
    ]},
    { h:'Migrate from other software', tab:'Migrate / import', icon:'download', blocks:[
      {p:'You can migrate data from other reference managers such as Zotero, Mendeley and Paperpile. Export a file from the other app, then load it via “Add” [[ic:plus]] → “Import” [[ic:download]] in Paper Library.'},
      {p:'Supported formats are BibTeX (.bib), RIS (.ris), CSV (.csv), JSON (.json) and Zotero RDF (.rdf). To carry over collections (folder hierarchy), export a format that actually contains folder information (Zotero RDF, Paper Library JSON, or a CSV/JSON with a folder column). BibTeX / RIS hold reference metadata only and usually cannot restore folder structure.'},
      {sub:'Common options'},
      {ul:[
        'Tick “Import keywords as tags” in the Import menu to turn the source’s keywords into Paper Library tags.',
        'After importing, a duplicate check runs automatically and flags references that match by DOI etc. as possible duplicates (nothing is deleted automatically).',
        'Attachments such as PDFs are not part of these exports and are not imported — only reference metadata and folder structure migrate. Re-attach PDFs to each reference after migrating.',
      ]},
      {sub:'Migrate from Zotero'},
      {ul:[
        'In Zotero, right-click the collection you want to migrate → “Export Collection…” (or right-click “My Library” at the top left → “Export Library…” to move everything).',
        'For Format, choose “Zotero RDF”. You can leave “Export Files” unchecked since PDFs are not imported (turn on “Export Notes” if you want to carry notes over).',
        'Load the resulting .rdf file via “Add” → “Import” → “Zotero RDF (.rdf)” in Paper Library.',
        'Your collections (including nested and empty ones) and each reference’s membership are restored as-is. To also carry over tags, tick “Import keywords as tags” before importing.',
        'Note: linked PDFs and web snapshots (the files/ folder created next to the .rdf) are not imported — only reference metadata and folder structure.',
      ]},
      {sub:'Migrate from Paperpile'},
      {ul:[
        'Open Paperpile (web app) and select the papers to migrate (choose a folder on the left, then use the checkbox at the top of the list to select all).',
        'Choose an export format from the “Export” menu. For reference metadata, BibTeX (.bib) or RIS (.ris) are the reliable choices.',
        'Load the exported file via “Add” → “Import” in Paper Library, choosing the matching format (BibTeX or RIS).',
        'To carry Paperpile “Labels” over as Paper Library tags, tick “Import keywords as tags” before importing (this applies when labels are exported as keywords).',
        'Paperpile Folders cannot be preserved through BibTeX / RIS. To keep things organised by folder, export one Paperpile folder at a time, create the matching collection in Paper Library first, then import with that collection selected.',
      ]},
      {sub:'Other software (Mendeley, etc.)'},
      {ul:[
        'Most apps (Mendeley, EndNote, …) can export BibTeX (.bib) or RIS (.ris). Load the exported file from “Import” to migrate the reference metadata.',
        'If you need to preserve folder structure and it doesn’t come through in that format, importing into Zotero first and then exporting as Zotero RDF is the most reliable route.',
      ]},
    ]},
    { h:'Save with the extension', tab:'Extension', blocks:[
      {p:'Paper Library Connector is the bundled Chrome extension for saving references from paper pages directly from the Chrome toolbar. Saved papers are imported automatically when Paper Library is open.'},
      {fig:'connector'},
      {sub:'Install'},
      {dl:'Download the extension (ZIP)'},
      {ul:[
        'Download the ZIP with the button above and unzip it. Put the resulting “paper-library-connector” folder somewhere permanent that you will not delete or move later (recommended: a fixed folder such as Documents\\PaperLibrary\\ on Windows or Documents/PaperLibrary/ on Mac — avoid leaving it in Downloads or on the Desktop, where it is easy to clean up by mistake).',
        'Type chrome://extensions into the Chrome address bar to open it, then turn on “Developer mode” at the top right (chrome:// pages cannot be opened from a link, so paste it into the address bar).',
        'Click “Load unpacked” and select the “paper-library-connector” folder you placed above.',
        'Important: after loading, Chrome keeps referencing this folder directly. Deleting, moving, or renaming it disables the extension, so leave it where it is (if you do remove it, just unzip again into the same place and repeat these steps to restore it).',
        'If you use Paper Library from GitHub Pages or another https:// page, no extra switch is needed. If you open a local index.html via file://, open the extension’s “Details” page and enable “Allow access to file URLs”.',
        'Before first use, open Paper Library once with your library folder open, so the extension learns your library name and collection list.',
      ]},
      {sub:'Save from a paper page'},
      {ul:[
        'Open a publisher page, arXiv page, or another paper page, then click the book icon in the Chrome toolbar.',
        'The popup shows the paper title, authors, abbreviated journal name, and year. DOI is hidden here to keep the popup readable.',
        'Tick the collections you want and press “Save”. With nothing selected, the paper is saved as “uncategorized” (in no collection).',
      ]},
      {sub:'Destination library and import'},
      {ul:[
        'The popup shows the destination library at the top. If you have opened more than one Paper Library library, use the dropdown to switch where the paper will be saved.',
        'If Paper Library is already open, the paper is imported right after saving. If it is closed, the popup shows an “Open Paper Library to import” button, and it also imports automatically the next time you open the library.',
        'The chosen destination library and collections are applied when that library is next opened.',
      ]},
      {sub:'Saved and pending states'},
      {ul:[
        'Pages already in your library show a green “✓” badge on the extension icon, and the popup lists the collections the paper is filed in.',
        'Papers saved but not yet imported into Paper Library show an orange “…” badge.',
        'Detected papers that are not in your library yet show a blue “+” badge.',
        'If a paper is already saved, choosing more collections and saving again adds it to those collections.',
      ]},
    ]},
    { h:'Organizing', blocks:[
      {p:'References can be organized with collections (like folders) and tags.'},
      {fig:'organize'},
      {ul:[
        'Collections: create one with the “+” [[ic:plus]] button in the left pane and drag & drop references into it. Collections can be nested inside each other.',
        'A reference can belong to several collections at once (it simply appears in both — it is not duplicated).',
        'Tags [[ic:tag]]: assign tags from the detail pane. You can set tag colors from the tag list in the left pane.',
        'Stars [[ic:star]]: mark important references with a star and find them instantly under “Starred” in the left pane.',
        'Bulk actions: Cmd-click (Ctrl on Windows) for multi-select, Shift-click for range select, then drag them together.',
      ]},
    ]},
    { h:'Searching & sorting', blocks:[
      {fig:'search'},
      {ul:[
        'The search box [[ic:search]] at the top matches titles, authors, journals, DOIs, tags, and more, all at once.',
        '“Advanced search” combines conditions, e.g. “author contains X, published after 2020”.',
        'Sorting: hover a table header (“Year”, “Title”, …) and click the ▲/▼ control that appears; click it again to reverse the order.',
        'Customizing columns: drag headers to reorder, drag a header’s right edge to resize, and choose visible columns from the “Columns” menu in the bottom bar.',
        'Filtering [[ic:funnel]]: the funnel icon in each column header filters by that column’s values.',
        'View switching: use the “View” menu in the bottom bar to choose table [[ic:table]], cards [[ic:rows]], literature shelves [[ic:book]], or Kanban. Search and collection filters apply to every view.',
        'Literature shelves: shows recently added, starred, currently reading, PDF-attached, and collection-specific shelves in horizontal rows. Enter a number of days to control the “Recently added” period. Click a paper to open its usual detail pane.',
        'Kanban: manages papers in three columns — Unread, Reading, and Read. Drag a card to another column to save its status; the same status can be changed in the detail pane.',
      ]},
    ]},
    { h:'Detail pane & PDFs', blocks:[
      {p:'Clicking a reference opens the detail pane on the right.'},
      {fig:'pdf'},
      {ul:[
        'You can view and edit bibliographic info, the abstract, notes, and more. Edits are saved automatically.',
        'Attaching PDFs [[ic:paperclip]]: drag & drop a PDF onto a reference row in the list, or onto the detail pane. You can also pick a file with the “Attach PDF” button in the detail pane.',
        'Attached PDFs open right in the browser when clicked.',
        'Copy citation [[ic:quote]]: copies a formatted citation (authors, journal, year, …). The gear icon [[ic:gear]] opens Citation settings for style and author formatting.',
        'Graph [[ic:graph]]: maps related papers connected through citations — see the “Graph” tab for details.',
      ]},
    ]},
    { h:'Graph (related-papers map)', blocks:[
      {p:'The Graph view lays out papers connected to the selected reference through citations, like a map. It is handy for discovering related work and important papers you may have missed.'},
      {fig:'graph'},
      {ul:[
        'How to open: select a reference and press the “Graph” [[ic:graph]] button in the detail pane.',
        'Each circle is one paper. Its size reflects the citation count (heavily cited papers are bigger) and its color reflects the publication year.',
        'Strongly related papers are placed close together (computed from how many references they share, among other signals).',
        'Controls: drag the background to pan, use the mouse wheel to zoom, and drag circles to adjust the layout.',
        'Click a circle to see its details on the right. Papers not yet in your library can be added on the spot; papers already registered get a green mark.',
        'Data comes from the public OpenAlex database. Once shown, a graph is cached, so reopening it needs no network access (use “Refetch” in the header to refresh).',
        'Opening many graphs in a short time can hit OpenAlex’s daily usage limit. If that happens, wait a while and retry.',
      ]},
    ]},
    { h:'Updating & maintenance', blocks:[
      {fig:'maintain'},
      {ul:[
        'Update cited-by counts [[ic:citations]]: a bottom-bar button fetches the latest citation counts from the internet.',
        'Update corresponding authors [[ic:users]]: fetches corresponding-author information for your papers.',
        'Corresponding-author refresh processes at most 25 items at a time to reduce OpenAlex load. Run it again if you need to continue.',
        'Both can run on “all shown items” automatically or only on items you pick.',
        'Duplicates / empty records / fix suggestions [[ic:alert]]: double registrations and missing fields are detected automatically and flagged with badges in the bottom bar. Click a badge to review and clean up.',
        'Fix suggestions also detect old or mistyped Angewandte abbreviations such as Angew. Chem. Int. Ed. Engl. / Engle. / Eng. Ed., and suggest Angew. Chem. Int. Ed. for papers from 1998 onward.',
        'Update log: failed fetches are recorded here and can be retried [[ic:retry]] later.',
      ]},
      {sub:'Journal name dictionary'},
      {p:'You can edit your own dictionary that maps journal-name variants (fetched abbreviations or aliases) to the correct full name and abbreviation. Entries you add feed the fix suggestions and the journal name shown in the list.'},
      {ul:[
        'In “Fetched form / alias”, enter the journal name as it was actually saved (e.g. [[code:Adv. Sci. (Weinh.)]]). Matching ignores differences in case and punctuation.',
        '“Full name” is what you want in the journal field; “Abbreviation” is what you want shown in the list. Either one alone is enough.',
        'The dictionary is stored in library.json, so it carries over through backups and to other computers. It takes precedence over the built-in dictionary, so you can override the defaults too.',
        'Adding the same journal name (alias) again overwrites the existing entry.',
      ]},
      {dict:'Open the journal name dictionary'},
    ]},
    { h:'Export & backup', blocks:[
      {fig:'exportfig'},
      {ul:[
        'The “Export” [[ic:upload]] menu writes the currently shown references to BibTeX / RIS / CSV / JSON — usable in LaTeX and other reference managers.',
        '“Whole library → JSON” is for backup. Importing that JSON on another computer restores everything, including your collection structure.',
        'Use JSON when folder information must be preserved. BibTeX / RIS are mainly for bibliographic exchange and may not carry folder structure.',
        'For everyday backups, simply copying the whole library folder (library.json and attachments) also works.',
      ]},
    ]},
    { h:'Cite in Word (Word add-in)', tab:'Word add-in', blocks:[
      {p:'The Paper Library Word add-in adds a “Paper Library” tab to the Word ribbon. From that tab, you can search your references and insert citations at the cursor. Numbered citations [1] and the bibliography at the end stay in sync automatically, and italic journal names and bold years are preserved.'},
      {fig:'wordaddin'},
      {sub:'1. Download manifest.xml'},
      {dlword:'Download manifest.xml'},
      {ul:[
        'Download manifest.xml with the button above. This is the only file you need to register with Word.',
      ]},
      {sub:'2. Register it with Word'},
      {ul:[
        'Register the add-in by putting manifest.xml into Word’s dedicated “wef” folder.',
        'With Finder active, press [[code:Command ⌘ + Shift ⇧ + G]], enter [[code:~/Library/Containers/com.microsoft.Word/Data/Documents/wef/]] in the input field, and press Enter.',
        'Copy and paste the downloaded manifest.xml into the folder that opens.',
        'If Finder says the folder cannot be found, remove the trailing [[code:wef/]], go to [[code:~/Library/Containers/com.microsoft.Word/Data/Documents/]], right-click in that folder, choose “New Folder”, name it [[code:wef]], and then put manifest.xml inside it.',
        'Restart Word. A “Paper Library” tab will be added to the ribbon. You can also open it from Insert → Add-ins → My Add-ins.',
      ]},
      {sub:'3. How to use the panel'},
      {ul:[
        'On the Word ribbon, press the “Paper Library” tab → “Insert reference” [[ic:book]] to open the panel.',
        'Press the “Library” button in the panel to load library.json. Use the library.json file in your library folder, or a file exported from the main app via “Export” [[ic:upload]] → “Whole library → JSON”. Once loaded, it is cached and restored automatically next time. Reload it after adding new references.',
        'Filter by title, author, journal, DOI, etc. in the search box and choose a style (ACS / Nature / Science / RSC / CSJ / Angew.). Use EN / 日本語 at the top right to switch the panel language.',
        'Press “Insert” on a reference to insert a number [1] (or superscript ¹) at the cursor. Numbers are assigned in order of appearance, and re-citing the same reference reuses the same number. Each insertion updates the bibliography at the end automatically. If you delete or reorder references, press “Update bibliography” to resync it.',
        'Use “Number” to switch the appearance between [1] (brackets) and superscript ¹. Inserted text defaults to Times New Roman 10.5pt.',
      ]},
    ]},
    { h:'Display settings', blocks:[
      {fig:'settings'},
      {ul:[
        'The buttons at the top right switch between dark / light themes [[ic:moon]] and Japanese / English.',
        'You can review updates from the “Changelog” tab inside this manual.',
        'The app only connects to public databases such as CrossRef and OpenAlex when fetching reference data; everything else happens entirely on your computer.',
      ]},
    ]},
    { h:'Changelog', blocks:[
      {changelog:true},
    ]},
    { h:'Contact', blocks:[
      {p:'For questions or suggestions, please contact us at the address below.'},
      {contact:true},
    ]},
  ],
};
function renderChangelogHtml(){
  return CHANGELOG.map(c=>
    `<div class="changelog-item"><span class="cd">${c.date}</span>
     <ul>${c[lang].map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
}

function openManual(initial){
  const secs = MANUAL[lang];
  const rich = x => esc(x)
    // Chrome refuses to navigate to chrome:// URLs from a web-page link, so this
    // is shown as non-clickable code (the text says to paste it into the bar)
    .replace(/\bchrome:\/\/extensions\b/g, '<code class="manual-code">chrome://extensions</code>')
    // inline monospaced snippets: [[code:...]] (content is already HTML-escaped by esc)
    .replace(/\[\[code:([^\]]+)\]\]/g, (_, s) => `<code class="manual-code">${s}</code>`)
    .replace(/\[\[ic:(\w+)\]\]/g, (_, n) => ic(n));
  const tabIcon = s => s.icon || (((s.blocks || []).some(b => b.contact)) ? 'message' : ({
    storage:'folderOpen',
    add:'plus',
    connector:'book',
    organize:'folder',
    search:'search',
    pdf:'paperclip',
    graph:'graph',
    maintain:'retry',
    exportfig:'upload',
    settings:'gear',
    wordaddin:'book',
  }[((s.blocks || []).find(b => b.fig) || {}).fig] || 'book'));
  const tabs = $('#manualTabs');
  tabs.innerHTML = secs.map((s,i)=>`<button data-mtab="${i}">${ic(tabIcon(s))}<span>${esc(s.tab || s.h)}</span></button>`).join('');
  const show = (i)=>{
    tabs.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active', j===i));
    $('#manualContent').innerHTML = `<h3>${esc(secs[i].h)}</h3>` + secs[i].blocks.map(b=>
      b.fig ? `<div class="manual-fig">${MANUAL_FIGS[b.fig](lang)}</div>` :
      b.sub ? `<h4>${esc(b.sub)}</h4>` :
      b.contact ? `<p><a href="mailto:aaths.takumi@gmail.com">aaths.takumi@gmail.com</a></p>` :
      b.changelog ? renderChangelogHtml() :
      b.dl  ? `<p><button class="tbtn primary" data-connector-dl>${ic('download')}${esc(b.dl)}</button></p>` :
      b.dlword ? `<p><button class="tbtn primary" data-wordaddin-dl>${ic('download')}${esc(b.dlword)}</button></p>` :
      b.dict ? `<p><button class="tbtn primary" data-journaldict-open>${ic('book')}${esc(b.dict)}</button></p>` :
      b.p   ? `<p>${rich(b.p)}</p>` :
              `<ul>${b.ul.map(x=>`<li>${rich(x)}</li>`).join('')}</ul>`).join('');
    $('#manualContent').scrollTop = 0;
  };
  tabs.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click', ()=>show(i)));
  show(typeof initial === 'number' && initial >= 0 ? initial : 0);
  $('#dlgManual').showModal();
}
$('#btnManual').addEventListener('click', ()=>openManual());
$('#startManual').addEventListener('click', ()=>openManual());
// The dictionary is opened from the manual, so remember which manual tab we came
// from and reopen it when the dictionary closes (× or Esc).
let journalDictReturnTab = -1;
$('#manualContent').addEventListener('click', (e)=>{
  if(e.target.closest('[data-connector-dl]')) downloadConnectorZip();
  if(e.target.closest('[data-wordaddin-dl]')) downloadWordManifest();
  if(e.target.closest('[data-journaldict-open]')){
    journalDictReturnTab = [...$('#manualTabs').children].findIndex(b=>b.classList.contains('active'));
    $('#dlgManual').close();
    openJournalDictDialog();
  }
});

// ---- Journal dictionary editor (user entries in lib.journalDict + built-in) ----
// The two built-in maps (JOURNAL_ABBR / JOURNAL_FULL_NAMES) key the same journal
// under different forms (full name, abbreviation, spelling variants). We resolve
// each key to a (full, abbr) pair, de-duplicate to one row per journal, and keep
// the remaining keys as "variants" (表記揺れ). Built once, lazily.
let builtinJournalRowsCache = null;
function builtinJournalRows(){
  if(builtinJournalRowsCache) return builtinJournalRowsCache;
  const bAbbr = k => JOURNAL_ABBR_NORMALIZED.get(normalizeJournalKey(k)) || '';
  const bFull = k => JOURNAL_FULL_NORMALIZED.get(normalizeJournalKey(k)) || '';
  const byId = new Map();
  const add = (origKey)=>{
    let abbr = bAbbr(origKey), full = bFull(origKey);
    if(!full && abbr) full = bFull(abbr);
    if(!abbr && full) abbr = bAbbr(full);
    const id = (full + '|' + abbr).toLowerCase();
    if(!byId.has(id)) byId.set(id, {full, abbr, aliases:new Set()});
    byId.get(id).aliases.add(String(origKey).trim());
  };
  JOURNAL_ABBR.forEach((v,k)=>add(k));
  JOURNAL_FULL_NAMES.forEach((v,k)=>add(k));
  const rows = [...byId.values()].map(r=>{
    // keep only genuine variants: drop aliases identical to the canonical full / abbr
    const fn = normalizeJournalKey(r.full), an = normalizeJournalKey(r.abbr);
    const variants = [...r.aliases]
      .filter(a=>{ const n = normalizeJournalKey(a); return n && n!==fn && n!==an; })
      .sort((a,b)=>a.localeCompare(b));
    return { full:r.full, abbr:r.abbr, variants };
  });
  rows.sort((a,b)=>(a.abbr||a.full).toLowerCase().localeCompare((b.abbr||b.full).toLowerCase()));
  return (builtinJournalRowsCache = rows);
}
// One merged table: the user's own entries (tinted, deletable) first, then the
// built-in journals. Clicking a built-in row with variants expands them.
function renderJournalDictTable(){
  const list = $('#dictList');
  if(!list) return;
  const q = ($('#dictSearch') && $('#dictSearch').value.trim().toLowerCase()) || '';
  const userEntries = Array.isArray(lib.journalDict) ? lib.journalDict : [];
  const builtins = builtinJournalRows();
  const cnt = $('#dictCount');
  if(cnt) cnt.textContent = t('journalDictCount')(userEntries.length, builtins.length);
  const hit = s => !q || String(s).toLowerCase().includes(q);
  const dash = '—';
  const userRows = userEntries
    .map((e,i)=>({e,i}))
    .filter(({e})=> hit((e.match||'') + ' ' + (e.full||'') + ' ' + (e.abbr||'')))
    .map(({e,i})=>`<div class="dictRow dictUser" data-dict-row="${i}">
      <div class="dictCell dictAlias">${e.match ? esc(e.match) : dash}</div>
      <div class="dictCell">${e.full ? esc(e.full) : dash}</div>
      <div class="dictCell dictAbbr">${e.abbr ? esc(e.abbr) : dash}</div>
      <button class="dictDel" data-dict-del="${i}" title="${esc(t('journalDictRemove'))}" aria-label="${esc(t('journalDictRemove'))}">${ic('trash')}</button>
    </div>`).join('');
  const builtinRows = builtins
    .filter(r=> hit(r.variants.join(' ') + ' ' + r.full + ' ' + r.abbr))
    .map(r=>{
      const hasV = r.variants.length > 0;
      return `<div class="dictRow dictBuiltin${hasV ? ' dictExpandable' : ''}">
      <div class="dictCell dictAlias">${hasV ? esc(r.variants.join(' / ')) : dash}</div>
      <div class="dictCell">${r.full ? esc(r.full) : dash}</div>
      <div class="dictCell dictAbbr">${r.abbr ? esc(r.abbr) : dash}</div>
      <span class="dictAct"></span>
    </div>`;
    }).join('');
  const header = `<div class="dictRow dictHead">
      <div class="dictCell">${esc(t('journalDictColAlias'))}</div>
      <div class="dictCell">${esc(t('journalDictColFull'))}</div>
      <div class="dictCell">${esc(t('journalDictColAbbr'))}</div>
      <span class="dictAct"></span>
    </div>`;
  list.innerHTML = header + ((userRows + builtinRows) || `<div class="dictEmpty">${esc(t('journalDictBuiltinEmpty'))}</div>`);
}
function openJournalDictDialog(){
  $('#dictMatch').value=''; $('#dictFull').value=''; $('#dictAbbr').value='';
  if($('#dictSearch')) $('#dictSearch').value='';
  renderJournalDictTable();
  $('#dlgJournalDict').showModal();
  $('#dictMatch').focus();
}
function addJournalDictEntry(){
  const match = $('#dictMatch').value.trim();
  const full = $('#dictFull').value.trim();
  const abbr = $('#dictAbbr').value.trim();
  if(!match){ showToast(t('journalDictMatchReq'), true); $('#dictMatch').focus(); return; }
  if(!full && !abbr){ showToast(t('journalDictNeedValue'), true); $('#dictFull').focus(); return; }
  if(!Array.isArray(lib.journalDict)) lib.journalDict = [];
  // Overwrite an entry whose match normalizes to the same key instead of duplicating.
  const key = normalizeJournalKey(match);
  const existing = lib.journalDict.find(e=>normalizeJournalKey(e.match)===key);
  if(existing){ existing.match = match; existing.full = full; existing.abbr = abbr; }
  else lib.journalDict.push({match, full, abbr});
  rebuildUserJournalDict();
  touch();
  renderJournalDictTable();
  renderList(); renderDetail(); updateAlerts();
  $('#dictMatch').value=''; $('#dictFull').value=''; $('#dictAbbr').value='';
  $('#dictMatch').focus();
  showToast(existing ? t('journalDictUpdated') : t('journalDictAdded'));
}
$('#dictAdd').addEventListener('click', addJournalDictEntry);
$('#dictSearch').addEventListener('input', renderJournalDictTable);
$('#dlgJournalDict').addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && ['dictMatch','dictFull','dictAbbr'].includes(e.target.id)){
    e.preventDefault(); addJournalDictEntry();
  }
  // intercept Esc so the return-to-manual runs (native close skips our handler)
  if(e.key==='Escape'){ e.preventDefault(); closeJournalDict(); }
});
$('#dictList').addEventListener('click', (e)=>{
  const del = e.target.closest('[data-dict-del]');
  if(del){
    const i = +del.dataset.dictDel;
    if(!Array.isArray(lib.journalDict) || !lib.journalDict[i]) return;
    lib.journalDict.splice(i,1);
    rebuildUserJournalDict();
    touch();
    renderJournalDictTable();
    renderList(); renderDetail(); updateAlerts();
    showToast(t('journalDictRemoved'));
    return;
  }
  // Selecting a built-in row that has spelling variants expands them.
  const row = e.target.closest('.dictExpandable');
  if(row) row.classList.toggle('expanded');
});
// Closing the dictionary (× or Esc) returns to the manual it was opened from.
// (The dialog's native 'close' event is unreliable across engines, so close
// explicitly here instead of listening for it.)
function closeJournalDict(){
  const dlg = $('#dlgJournalDict');
  if(dlg.open) dlg.close();
  if(journalDictReturnTab >= 0){
    const i = journalDictReturnTab;
    journalDictReturnTab = -1;
    openManual(i);
  }
}
$('#dictClose').addEventListener('click', closeJournalDict);

document.querySelectorAll('dialog [data-close]').forEach(b=>b.addEventListener('click', ()=>b.closest('dialog').close()));
function openDuplicatesFromAlert(){
  const cands = findLibraryDuplicateCandidates(80);
  if(!cands.length){ showToast(t('duplicateNone')); updateAlerts(); return; }
  openDuplicateDialog(cands);
}
$('#duplicateBody').addEventListener('click', async (e)=>{
  const row = e.target.closest('[data-dup]');
  if(!row) return;
  const cand = duplicateDialogCandidates[+row.dataset.dup];
  if(!cand) return;
  const open = e.target.closest('[data-dup-open]');
  if(open){
    const it = cand[open.dataset.dupOpen];
    if(it && lib.items.some(x=>x.id===it.id)){
      selectItem(it.id);
      $('#dlgDuplicates').close();
    }
    return;
  }
  const rep = e.target.closest('[data-dup-replace]');
  if(rep){
    if(cand.match && cand.item){
      replaceExistingWithCandidate(cand.match, cand.item);
      renderList(); renderDetail();
      showToast(t('duplicateReplacedExisting'));
    }
    renderDuplicateDialog(findLibraryDuplicateCandidates(80));
    return;
  }
  const del = e.target.closest('[data-dup-delete]');
  if(del){
    await deleteItem(del.dataset.dupDelete);
    renderDuplicateDialog(findLibraryDuplicateCandidates(80));
  }
});
$('#btnEmptyTrash').addEventListener('click', async ()=>{
  await emptyTrashForever();
});
$('#btnRestoreAllTrash').addEventListener('click', async ()=>{
  await restoreAllTrash();
});
$('#btnCollDelKeep').addEventListener('click', ()=>{ $('#dlgDeleteColl').close(); performCollDelete('keep'); });
$('#btnCollDelTrash').addEventListener('click', ()=>{ $('#dlgDeleteColl').close(); performCollDelete('trash'); });
$('#btnCollTrashItemsKeepColl').addEventListener('click', ()=>{ $('#dlgDeleteColl').close(); performCollDelete('itemsOnly'); });
function openEmptyRecordsFromAlert(){
  const empties = findEmptyRecords();
  if(!empties.length){ showToast(t('emptyRecordsNone')); updateAlerts(); return; }
  openEmptyRecordsDialog();
}
$('#emptyRecordsBody').addEventListener('click', async (e)=>{
  const open = e.target.closest('[data-empty-open]');
  if(open){
    selectItem(open.dataset.emptyOpen);
    $('#dlgEmptyRecords').close();
    return;
  }
  const del = e.target.closest('[data-empty-delete]');
  if(del){
    if(!confirm(I18N[lang].confirmDeleteEmpty(1))) return;
    await deleteItemsByIds([del.dataset.emptyDelete]);
    renderEmptyRecordsDialog();
  }
});
$('#btnDeleteAllEmpty').addEventListener('click', async ()=>{
  const ids = findEmptyRecords().map(it=>it.id);
  if(!ids.length){ renderEmptyRecordsDialog([]); return; }
  if(!confirm(I18N[lang].confirmDeleteEmpty(ids.length))) return;
  await deleteItemsByIds(ids);
  renderEmptyRecordsDialog([]);
});
function openFixSuggestionsFromAlert(){
  const fixes = findFixSuggestions();
  if(!fixes.length){ showToast(t('fixSuggestionsNone')); updateAlerts(); return; }
  openFixSuggestionsDialog();
}
$('#fixSuggestionsBody').addEventListener('click', (e)=>{
  const open = e.target.closest('[data-fix-open]');
  if(open){
    selectItem(open.dataset.fixOpen);
    $('#dlgFixSuggestions').close();
    return;
  }
  const apply = e.target.closest('[data-fix-apply]');
  if(apply){
    const sug = findFixSuggestions()[+apply.dataset.fixApply];
    if(sug && applyJournalFixSuggestion(sug)){
      renderList(); renderDetail(); renderFixSuggestionsDialog();
    }
  }
});
$('#btnApplyAllFixes').addEventListener('click', ()=>{
  const fixes = findFixSuggestions();
  if(!fixes.length){ renderFixSuggestionsDialog([]); return; }
  if(!confirm(I18N[lang].confirmApplyAllFixes(fixes.length))) return;
  let n = 0;
  fixes.forEach(s=>{ if(applyJournalFixSuggestion(s)) n++; });
  if(n){ renderList(); renderDetail(); }
  renderFixSuggestionsDialog([]);
});

// search
// The search box doubles as a quick-add field: when its content is a DOI /
// arXiv id / URL, it stops filtering and offers to fetch & add it (Enter or the
// inline button) instead — most references are added by pasting a URL.
// A pasted bibliographic citation such as
//   "Angew. Chem. Int. Ed. 2017, 56, 3270–3274."   (ACS / Angew. style)
//   "Nature 2019, 566, 100."
//   "J. Am. Chem. Soc. 2020, 142, 1234-1240."
//   "Science 359, 1234 (2018)."                     (year-in-parens style)
// These are neither a DOI/URL nor a plain title, but CrossRef's
// query.bibliographic resolves them well, so treat them as addable and let
// fetchAndAddQuick hand them to the CrossRef search (candidate picker).
function looksLikeCitation(v){
  v = String(v||'').trim();
  if(v.length < 10) return false;
  if(parseIdInput(v)) return false;                    // a DOI/arXiv id takes priority
  // "<journal> <year>, <volume>, <page>"  (year, volume, page comma-separated)
  if(/\b(?:19|20)\d{2}\s*,\s*\d+\s*,\s*[A-Za-z]?\d+/.test(v)) return true;
  // "<journal> <volume>, <page> (<year>)"  (Nature / Science, year in parens)
  if(/\b\d+\s*,\s*[A-Za-z]?\d+.*\(\s*(?:19|20)\d{2}\s*\)/.test(v)) return true;
  return false;
}
function isAddable(v){
  v = String(v||'').trim();
  if(!v) return false;
  if(/^https?:\/\//i.test(v)) return true;   // any URL
  if(parseIdInput(v)) return true;             // DOI / arXiv (incl. bare ids)
  return looksLikeCitation(v);                 // pasted bibliographic citation
}
function updateSearchAddUI(addable){
  const btn = $('#btnSearchAdd');
  if(btn) btn.style.display = addable ? 'inline-flex' : 'none';
  const wrap = document.querySelector('.searchWrap');
  if(wrap) wrap.classList.toggle('addMode', addable);
}
// Shared fetch-&-add used by both the toolbar add bar and the search bar.
// - a DOI/arXiv (incl. inside a URL) is fetched and added directly
// - anything else (an id-less URL or a plain title) is handed to the Add dialog,
//   which runs a CrossRef title search and shows candidates to pick from
async function fetchAndAddQuick(raw, opts){
  opts = opts || {};
  raw = String(raw||'').trim();
  if(!raw) return;
  // Route every input (DOI/arXiv/URL/title) through the Add dialog so the user
  // always confirms the fetched paper in the candidate list before it is added
  // — even when it resolves to a single unambiguous match.
  openAddIdDialog(raw);
  $('#btnFetchId').click();
  if(opts.onDone) opts.onDone();
}
// ---- toolbar add bar ----
async function addFromAddBar(){
  const raw = $('#addBox').value.trim();
  if(!raw) return;
  await fetchAndAddQuick(raw, { btn: $('#btnAddGo'), onDone: ()=>{ $('#addBox').value = ''; updateAddBarUI(); } });
}
function updateAddBarUI(){ const b = $('#btnAddGo'); if(b) b.disabled = !$('#addBox').value.trim(); }
$('#addBox').addEventListener('input', updateAddBarUI);
$('#addBox').addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); addFromAddBar(); } });
$('#btnAddGo').addEventListener('click', addFromAddBar);
updateAddBarUI();
// ---- search bar quick-add (kept in addition to the add bar) ----
async function quickAddFromSearch(){
  const raw = $('#searchBox').value.trim();
  if(!raw || !isAddable(raw)) return;
  await fetchAndAddQuick(raw, {
    btn: $('#btnSearchAdd'),
    onDone: ()=>{ $('#searchBox').value = ''; filter.query = ''; updateSearchAddUI(false); renderList({skipBadges:true}); },
  });
}
$('#searchBox').addEventListener('input', ()=>{
  const v = $('#searchBox').value.trim();
  const addable = isAddable(v);
  updateSearchAddUI(addable);
  filter.query = addable ? '' : v; // don't filter the list by a URL/DOI being added
  renderList({skipBadges:true});
});
$('#searchBox').addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && isAddable($('#searchBox').value.trim())){ e.preventDefault(); quickAddFromSearch(); }
});
$('#btnSearchAdd').addEventListener('click', quickAddFromSearch);
$('#btnAdvancedSearch').addEventListener('click', ()=>{
  const adv = filter.advanced || {};
  $('#advTerms').value = adv.terms || '';
  $('#advMode').value = adv.mode || 'and';
  $('#advField').value = adv.field || 'all';
  $('#advYearFrom').value = adv.yearFrom || '';
  $('#advYearTo').value = adv.yearTo || '';
  $('#dlgAdvancedSearch').showModal();
  $('#advTerms').focus();
});
$('#btnAdvApply').addEventListener('click', ()=>{
  filter.advanced = {
    terms: $('#advTerms').value.trim(),
    mode: $('#advMode').value,
    field: $('#advField').value,
    yearFrom: $('#advYearFrom').value.trim(),
    yearTo: $('#advYearTo').value.trim(),
  };
  $('#dlgAdvancedSearch').close();
  renderList();
});
$('#btnAdvClear').addEventListener('click', ()=>{
  filter.advanced = { terms:'', mode:'and', field:'all', yearFrom:'', yearTo:'' };
  $('#advTerms').value = '';
  $('#advYearFrom').value = '';
  $('#advYearTo').value = '';
  $('#dlgAdvancedSearch').close();
  renderList();
});
document.addEventListener('keydown', (e)=>{
  if((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase()==='z' && !e.target.matches('input,textarea,select') && !document.querySelector('dialog[open]')){
    e.preventDefault();
    undoLastAction();
    return;
  }
  if(e.key==='/' && !e.target.matches('input,textarea,select') && !document.querySelector('dialog[open]')){
    e.preventDefault(); $('#searchBox').focus();
  }
  if(e.key==='Escape' && pickMode && !document.querySelector('dialog[open]')) exitPickMode();
  if(e.key==='Escape' && !document.querySelector('dialog[open]')) clearCollectionSelection();
});

// sidebar
function toggleSidebarSection(section){
  if(section==='collections') collectionsSectionCollapsed = !collectionsSectionCollapsed;
  else if(section==='tags') tagsSectionCollapsed = !tagsSectionCollapsed;
  updateSidebarSectionVisibility();
}
$('#collectionsHead').addEventListener('click', (e)=>{
  if(e.target.closest('.headBtns')) return;
  toggleSidebarSection('collections');
});
$('#tagsHead').addEventListener('click', ()=>{
  toggleSidebarSection('tags');
});
$('#collectionsHead').addEventListener('keydown', (e)=>{
  if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggleSidebarSection('collections'); }
});
$('#tagsHead').addEventListener('keydown', (e)=>{
  if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggleSidebarSection('tags'); }
});
$('#btnToggleCollections').addEventListener('click', (e)=>{
  e.stopPropagation();
  toggleSidebarSection('collections');
});
$('#btnCollapseAllCollections').addEventListener('click', (e)=>{
  e.stopPropagation();
  const ids = collapsibleCollectionIds();
  const allClosed = ids.length > 0 && ids.every(id=>collapsedCollectionIds.has(id));
  ids.forEach(id=>{
    if(allClosed) collapsedCollectionIds.delete(id);
    else collapsedCollectionIds.add(id);
  });
  renderSidebar();
});
$('#btnToggleTags').addEventListener('click', (e)=>{
  e.stopPropagation();
  toggleSidebarSection('tags');
});
$('#sidebar').addEventListener('click', async (e)=>{
  const actBtn = e.target.closest('[data-act]');
  if(actBtn){
    e.stopPropagation();
    const c = lib.collections.find(x=>x.id===actBtn.dataset.id);
    if(!c) return;
    if(actBtn.dataset.act==='toggleColl'){
      if(collapsedCollectionIds.has(c.id)) collapsedCollectionIds.delete(c.id);
      else collapsedCollectionIds.add(c.id);
      renderSidebar();
    }else if(actBtn.dataset.act==='sub'){
      const name = prompt(t('promptCollName'));
      if(name && name.trim()){
        collapsedCollectionIds.delete(c.id);
        lib.collections.push({ id: uid(), name: name.trim(), parent: c.id });
        touch(); renderSidebar(); renderDetail();
      }
    }else if(actBtn.dataset.act==='color'){
      openCollColorPop(c, actBtn);
    }else if(actBtn.dataset.act==='ren'){
      const name = prompt(t('promptRename'), c.name);
      if(name && name.trim()){ c.name = name.trim(); touch(); renderAll(); }
    }else{
      // Delete: if this collection is part of a multi-selection, act on all of
      // them; otherwise just this one. Offers keep-items / trash-items choices.
      const ids = (selectedCollectionIds.size > 1 && selectedCollectionIds.has(c.id))
        ? Array.from(selectedCollectionIds)
        : [c.id];
      openDeleteCollDialog(ids);
    }
    return;
  }
  const collEl = e.target.closest('[data-coll]');
  if(collEl){
    const cid = collEl.dataset.coll;
    if(collEl.dataset.dropColl && (e.metaKey || e.ctrlKey || e.shiftKey)){
      handleCollectionSelection(cid, e);
      return;
    }
    if(collEl.dataset.dropColl){
      selectedCollectionIds = new Set([cid]);
      collectionSelectAnchorId = cid;
    }
    filter.coll = cid; updateSidebarSelection(); renderList({skipBadges:true}); return;
  }
  const tagEl = e.target.closest('[data-tag]');
  if(tagEl){
    const colorBtn = e.target.closest('[data-tagcolor]');
    if(colorBtn){ openTagColorPop(colorBtn.dataset.tagcolor, colorBtn); return; }
    const tg = tagEl.dataset.tag;
    if(filter.tags.has(tg)) filter.tags.delete(tg); else filter.tags.add(tg);
    updateSidebarSelection(); renderList({skipBadges:true});
    return;
  }
  clearCollectionSelection();
});
function sidebarDropTarget(e){
  return e.target.closest('[data-drop-coll],[data-drop-root],[data-drop-action]');
}
function dataTransferHasItems(e){
  const types = Array.from(e.dataTransfer.types || []);
  return types.includes('text/plain') || types.includes('application/x-paper-library-items');
}
function dataTransferHasCollections(e){
  const types = Array.from(e.dataTransfer.types || []);
  return types.includes('application/x-paper-library-collections') || types.includes('application/x-refshelf-collection');
}
function draggedItemIds(e){
  let ids = [];
  try{ ids = JSON.parse(e.dataTransfer.getData('application/x-paper-library-items') || '[]'); }catch(_e){ ids = []; }
  const id = e.dataTransfer.getData('text/plain');
  if(!ids.length && id) ids = [id];
  return ids.filter(Boolean);
}
function applyFixedFilterDrop(ids, action){
  const idSet = new Set(ids || []);
  const targets = lib.items.filter(x=>idSet.has(x.id));
  const undoRecords = [];
  let changed = 0;
  targets.forEach(it=>{
    let itemChanged = false;
    if(action==='starred'){
      if(!it.starred){ it.starred = true; itemChanged = true; }
      if(isItemTrashed(it)){ it.trashed = false; it.trashedAt = ''; itemChanged = true; }
    }else if(action==='myPublication'){
      if(!it.myPublication){ it.myPublication = true; itemChanged = true; }
      if(isItemTrashed(it)){ it.trashed = false; it.trashedAt = ''; itemChanged = true; }
    }else if(action==='trash'){
      if(!isItemTrashed(it)){
        undoRecords.push(makeTrashUndoRecord(it));
        it.trashed = true;
        it.trashedAt = new Date().toISOString();
        itemChanged = true;
      }
      if(selectedId===it.id && filter.coll!=='trash') selectedId = null;
    }
    if(itemChanged){
      it.dateModified = new Date().toISOString();
      changed++;
    }
  });
  if(action==='trash' && changed) pushTrashUndo(undoRecords);
  return changed;
}
$('#sidebar').addEventListener('dragover', (e)=>{
  const collEl = sidebarDropTarget(e);
  if(!collEl) return;
  const isFixedAction = !!collEl.dataset.dropAction;
  const draggingColl = dataTransferHasCollections(e);
  // the trash target also accepts whole collections (drop = delete that collection)
  const fixedAccepts = dataTransferHasItems(e) || (collEl.dataset.dropAction==='trash' && draggingColl);
  const acceptable = isFixedAction ? fixedAccepts : (dataTransferHasItems(e) || draggingColl);
  if(!acceptable) return;
  e.preventDefault();
  // A collection drag starts with effectAllowed='move' (see dragstart). Chrome
  // rejects the drop if dropEffect isn't compatible with effectAllowed, so a
  // collection MUST report 'move' here — otherwise re-parenting silently fails.
  // Items start with effectAllowed='copyMove', so 'copy' (add to collection) or
  // 'move' (into trash) are both fine for them.
  e.dataTransfer.dropEffect = draggingColl ? 'move'
    : (isFixedAction && collEl.dataset.dropAction==='trash' ? 'move' : 'copy');
  collEl.classList.add('dropTarget');
});
$('#sidebar').addEventListener('dragleave', (e)=>{
  const collEl = sidebarDropTarget(e);
  if(collEl) collEl.classList.remove('dropTarget');
});
$('#sidebar').addEventListener('drop', (e)=>{
  const collEl = sidebarDropTarget(e);
  if(!collEl) return;
  e.preventDefault();
  collEl.classList.remove('dropTarget');
  const action = collEl.dataset.dropAction || '';
  if(action){
    // a collection dropped on the trash means "delete this collection"
    if(action==='trash' && dataTransferHasCollections(e)){
      let collIds = [];
      try{ collIds = JSON.parse(e.dataTransfer.getData('application/x-paper-library-collections') || '[]'); }catch(_e){ collIds = []; }
      const one = e.dataTransfer.getData('application/x-refshelf-collection');
      if(!collIds.length && one) collIds = [one];
      if(collIds.length) openDeleteCollDialog(collIds);
      return;
    }
    const ids = draggedItemIds(e);
    const changed = applyFixedFilterDrop(ids, action);
    if(changed){
      touch();
      renderAll();
    }
    return;
  }
  const draggedCollId = e.dataTransfer.getData('application/x-refshelf-collection');
  let draggedCollIds = [];
  try{ draggedCollIds = JSON.parse(e.dataTransfer.getData('application/x-paper-library-collections') || '[]'); }catch(_e){ draggedCollIds = []; }
  const ids = draggedItemIds(e);
  const cid = collEl.dataset.dropRoot ? '' : collEl.dataset.dropColl;
  if(draggedCollId || draggedCollIds.length){
    if(!draggedCollIds.length) draggedCollIds = [draggedCollId];
    const changed = moveCollectionsToParent(draggedCollIds, cid);
    if(changed){
      if(draggedCollIds.includes(filter.coll)) filter.coll = cid || 'all';
      selectedCollectionIds = new Set(draggedCollIds);
      if(cid) collapsedCollectionIds.delete(cid);
      touch();
      renderAfterCollectionDrop([]);
    }
    return;
  }
  const idSet = new Set(ids);
  const targets = lib.items.filter(x=>idSet.has(x.id));
  let changed = 0;
  let restoredFromTrash = false;
  const undoRecords = [];
  targets.forEach(it=>{
    const undoRecord = makeItemCollectionUndoRecord(it);
    let itemChanged = false;
    const wasTrashed = isItemTrashed(it);
    if(wasTrashed){
      it.trashed = false;
      it.trashedAt = '';
      itemChanged = true;
      restoredFromTrash = true;
    }
    if(cid){
      if(!it.collections.includes(cid)){ it.collections.push(cid); itemChanged = true; }
    }else if(!wasTrashed && it.collections.length){
      // Dropping an active item on the root still means "remove from collections".
      // Dropping a trashed item on All items means "restore" and preserves its old collections.
      it.collections = [];
      itemChanged = true;
    }
    if(itemChanged){
      undoRecords.push(undoRecord);
      it.dateModified = new Date().toISOString();
      changed++;
    }
  });
  if(changed){
    pushItemCollectionUndo(undoRecords);
    touch();
    renderAfterCollectionDrop(ids, {refreshAlerts:restoredFromTrash});
  }
});
$('#sidebar').addEventListener('dragstart', (e)=>{
  const collEl = e.target.closest('[data-drop-coll]');
  // don't start a drag from an in-row control (buttons, or the folder-icon
  // collapse toggle) — those are clicks, not drag handles
  if(!collEl || e.target.closest('button,input,.collFolderToggle')) return;
  const ids = selectedCollectionIds.has(collEl.dataset.dropColl) ? Array.from(selectedCollectionIds) : [collEl.dataset.dropColl];
  e.dataTransfer.setData('application/x-refshelf-collection', collEl.dataset.dropColl);
  e.dataTransfer.setData('application/x-paper-library-collections', JSON.stringify(ids));
  e.dataTransfer.effectAllowed = 'move';
});
// Collection search: the magnifier toggles a filter box; typing narrows the tree.
function setCollSearchOpen(open){
  const bar = $('#collSearchBar');
  const btn = $('#btnSearchColl');
  bar.hidden = !open;
  btn.classList.toggle('on', open);
  if(open){
    collectionsSectionCollapsed = false;
    updateSidebarSectionVisibility();
    $('#collSearchInput').focus();
    $('#collSearchInput').select();
  }else{
    if(collSearchQuery){ collSearchQuery = ''; $('#collSearchInput').value = ''; renderSidebar(); }
  }
}
$('#btnSearchColl').addEventListener('click', (e)=>{
  e.stopPropagation();
  setCollSearchOpen($('#collSearchBar').hidden);
});
$('#collSearchInput').addEventListener('input', (e)=>{
  collSearchQuery = e.target.value;
  renderSidebar();
});
$('#collSearchInput').addEventListener('keydown', (e)=>{
  if(e.key==='Escape'){ e.preventDefault(); setCollSearchOpen(false); }
});
$('#collSearchClear').addEventListener('click', (e)=>{
  e.stopPropagation();
  collSearchQuery = '';
  $('#collSearchInput').value = '';
  renderSidebar();
  $('#collSearchInput').focus();
});
$('#btnAddColl').addEventListener('click', ()=>{
  const name = prompt(t('promptCollName'));
  if(name && name.trim()){
    const parent = (filter.coll!=='all' && filter.coll!=='uncat' && !['all','uncat','starred','myPublication','trash'].includes(filter.coll)) ? filter.coll : '';
    collectionsSectionCollapsed = false;
    if(parent) collapsedCollectionIds.delete(parent);
    lib.collections.push({ id: uid(), name: name.trim(), parent });
    touch(); renderSidebar(); renderDetail();
  }
});

/* ---- collection folder color ---- */
const COLL_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#6b7280'];
function openCollColorPop(coll, anchorEl){
  const pop = $('#collColorPop');
  const swatches = [''].concat(COLL_COLORS); // '' = default first
  pop.innerHTML = `<div class="swatches">` +
    swatches.map(col=>{
      const cur = (coll.color||'')===col ? ' cur' : '';
      const bg = col || 'var(--chip)';
      const label = col ? '' : `<span style="font-size:10px;color:var(--text2)">×</span>`;
      return `<span class="swatch${cur}" data-col="${col}" title="${col||esc(t('collColorDefault'))}" style="background:${bg}">${label}</span>`;
    }).join('') + `</div>
    <div class="customColorRow">${esc(t('collColorCustom'))}<input type="color" id="collCustomColor" value="${coll.color||'#3b82f6'}"></div>`;
  const r = anchorEl.getBoundingClientRect();
  pop.style.left = Math.min(r.left, window.innerWidth - 190) + 'px';
  pop.style.top = (r.bottom + 6) + 'px';
  pop.classList.add('open');
  pop.onclick = (e)=>{
    e.stopPropagation();
    const sw = e.target.closest('.swatch');
    if(sw){
      coll.color = sw.dataset.col || '';
      touch(); renderSidebar(); renderList();
      pop.classList.remove('open');
    }
  };
  $('#collCustomColor').oninput = (e)=>{
    coll.color = e.target.value;
    touch(); renderSidebar(); renderList();
  };
}
function openTagColorPop(tag, anchorEl){
  if(!lib.tagColors || typeof lib.tagColors!=='object') lib.tagColors = {};
  const pop = $('#tagColorPop');
  const swatches = [''].concat(COLL_COLORS);
  const current = lib.tagColors[tag] || '';
  pop.innerHTML = `<div class="swatches">` +
    swatches.map(col=>{
      const cur = current===col ? ' cur' : '';
      const bg = col || 'var(--chip)';
      const label = col ? '' : `<span style="font-size:10px;color:var(--text2)">×</span>`;
      return `<span class="swatch${cur}" data-col="${col}" title="${col||esc(t('collColorDefault'))}" style="background:${bg}">${label}</span>`;
    }).join('') + `</div>
    <div class="customColorRow">${esc(t('collColorCustom'))}<input type="color" id="tagCustomColor" value="${current||'#3b82f6'}"></div>`;
  const r = anchorEl.getBoundingClientRect();
  pop.style.left = Math.min(r.left, window.innerWidth - 190) + 'px';
  pop.style.top = (r.bottom + 6) + 'px';
  pop.classList.add('open');
  pop.onclick = (e)=>{
    e.stopPropagation();
    const sw = e.target.closest('.swatch');
    if(sw){
      const col = sw.dataset.col || '';
      if(col) lib.tagColors[tag] = col; else delete lib.tagColors[tag];
      touch(); renderSidebar(); renderList();
      pop.classList.remove('open');
    }
  };
  $('#tagCustomColor').oninput = (e)=>{
    lib.tagColors[tag] = e.target.value;
    touch(); renderSidebar(); renderList();
  };
}
document.addEventListener('click', (e)=>{
  if(!e.target.closest('#collColorPop') && !e.target.closest('[data-act="color"]')) $('#collColorPop').classList.remove('open');
  if(!e.target.closest('#tagColorPop') && !e.target.closest('[data-tagcolor]')) $('#tagColorPop').classList.remove('open');
  if(!e.target.closest('#colFilterPop') && !e.target.closest('.thfilter')) $('#colFilterPop').classList.remove('open');
  if(!e.target.closest('#authorDisplayPop') && !e.target.closest('[data-author-display]')) $('#authorDisplayPop').classList.remove('open');
});

/* ---- list wrap toggle ---- */
let listWrap = localStorage.getItem('refshelf.listWrap') === '1'; // default: wrap off
let listView = localStorage.getItem('refshelf.listView') || 'table';
let cardCols = localStorage.getItem('refshelf.cardCols') || '1';
if(!['table','cards','shelves','kanban'].includes(listView)) listView = 'table';
if(cardCols!=='2') cardCols = '1';
function applyWrapMode(){
  $('#itemTable').classList.toggle('nowrap', !listWrap);
  $('#itemCards').classList.toggle('nowrap', !listWrap);
  $('#btnWrap').style.color = listWrap ? 'var(--accent)' : '';
}
function updateListViewButton(){
  const btn = $('#btnViewStyle');
  if(!btn) return;
  const isCards = listView === 'cards';
  const isShelves = listView === 'shelves';
  const isKanban = listView === 'kanban';
  const nextCards = listView !== 'cards';
  btn.innerHTML = `${ic(nextCards ? 'rows' : 'table')}<span id="viewStyleLabel">${esc(t(nextCards ? 'viewCards' : 'viewTable'))}</span>`;
  btn.style.color = isCards ? 'var(--accent)' : '';
  btn.style.display = 'none';
  $('#listStatus').classList.toggle('cardMode', isCards);
  $('#listStatus').classList.toggle('shelfMode', isShelves);
  $('#listStatus').classList.toggle('kanbanMode', isKanban);
  const wrapBtn = $('#btnWrap');
  if(wrapBtn) wrapBtn.style.display = 'none';
  const filterBtn = $('#btnCardFilters');
  if(filterBtn){
    const filterWrap = filterBtn.closest('.menuwrap');
    if(filterWrap) filterWrap.style.display = 'none';
    filterBtn.style.display = '';
    filterBtn.style.color = anyColFilterActive() ? 'var(--accent)' : '';
  }
  const colsBtn = $('#btnCardCols');
  if(colsBtn){
    const next = cardCols === '2' ? 1 : 2;
    colsBtn.style.display = 'none';
    colsBtn.innerHTML = `${ic(next===2 ? 'table' : 'rows')}<span id="cardColsLabel">${esc(I18N[lang].cardCols(next))}</span>`;
    colsBtn.style.color = cardCols === '2' ? 'var(--accent)' : '';
  }
  const viewMenu = $('#btnCardViewMenu');
  if(viewMenu){
    viewMenu.closest('.menuwrap').style.display = '';
    const viewIcon=isShelves?'book':isKanban?'kanban':isCards?'rows':'table';
    viewMenu.innerHTML=`${ic(viewIcon)}<span data-i18n="viewMenu">${esc(t('viewMenu'))}</span>${ic('chevron')}`;
    viewMenu.style.color=(isShelves||isKanban)?'var(--accent)':'';
  }
  const colsMenu = $('#btnColMenu');
  if(colsMenu) colsMenu.closest('.menuwrap').style.display = listView==='table' ? '' : 'none';
  document.querySelectorAll('#cardViewMenu [data-list-view]').forEach(el=>{
    el.classList.toggle('viewActive',el.dataset.listView===listView);
    el.setAttribute('aria-current',el.dataset.listView===listView?'true':'false');
  });
  const colsItem = $('#cardViewColsMenuItem');
  if(colsItem) colsItem.style.display = isCards ? '' : 'none';
  const filtersItem = $('#cardViewFiltersMenuItem');
  if(filtersItem) filtersItem.style.display = listView==='table' ? 'none' : '';
  const wrapItem=$('#cardViewMenu [data-card-view-act="wrap"]');
  if(wrapItem) wrapItem.style.display=(isShelves||isKanban)?'none':'';
  const lbl = $('#cardViewColsMenuLabel');
  if(lbl){
    const next = cardCols === '2' ? 1 : 2;
    lbl.textContent = I18N[lang].cardCols(next);
  }
  const corrStar = $('#cardViewCorrStar');
  if(corrStar){
    corrStar.checked = !!authorDisplayPrefs.markCorresponding;
    corrStar.closest('.menuCheck').style.display=isCards?'':'none';
  }
}
function applyListView(){
  $('#listScroller').classList.toggle('cardView', listView === 'cards');
  $('#listScroller').classList.toggle('shelfView', listView === 'shelves');
  $('#listScroller').classList.toggle('kanbanView', listView === 'kanban');
  $('#itemCards').classList.toggle('cardCols2', cardCols === '2');
  $('#itemCards').classList.toggle('cardCols1', cardCols !== '2');
  updateListViewButton();
}
$('#btnWrap').addEventListener('click', ()=>{
  listWrap = !listWrap;
  localStorage.setItem('refshelf.listWrap', listWrap ? '1' : '0');
  applyWrapMode();
});
$('#btnViewStyle').addEventListener('click', ()=>{
  listView = listView === 'cards' ? 'table' : 'cards';
  localStorage.setItem('refshelf.listView', listView);
  applyListView();
  renderList({skipBadges:true});
});
$('#btnCardCols').addEventListener('click', ()=>{
  cardCols = cardCols === '2' ? '1' : '2';
  localStorage.setItem('refshelf.cardCols', cardCols);
  applyListView();
  if(listView==='cards') renderList({skipBadges:true});
});
$('#btnCardViewMenu').addEventListener('click', (e)=>{
  e.stopPropagation();
  const btn = $('#btnCardViewMenu');
  const m = $('#cardViewMenu'), was = m.classList.contains('open');
  closeMenus();
  if(!was){
    m.classList.add('open');
    positionFloatingMenu(btn, m);
  }
});
$('#cardViewMenu').addEventListener('click', (e)=>{
  e.stopPropagation();
  const viewBtn=e.target.closest('[data-list-view]');
  if(viewBtn){
    listView=viewBtn.dataset.listView;
    localStorage.setItem('refshelf.listView',listView);
    applyListView(); closeMenus(); renderList({skipBadges:true}); return;
  }
  const btn = e.target.closest('[data-card-view-act]');
  if(!btn) return;
  const act = btn.dataset.cardViewAct;
  if(act==='wrap') $('#btnWrap').click();
  else if(act==='cols') $('#btnCardCols').click();
  else if(act==='filters'){
    closeMenus();
    setTimeout(()=>{
      openCardFilterMenu($('#btnCardViewMenu'));
    }, 0);
    return;
  }
  closeMenus();
  updateListViewButton();
});
$('#cardViewMenu').addEventListener('change', (e)=>{
  if(e.target && e.target.id === 'cardViewCorrStar'){
    authorDisplayPrefs.markCorresponding = !!e.target.checked;
    localStorage.setItem('refshelf.authorDisplay', JSON.stringify(authorDisplayPrefs));
    renderList();
    updateListViewButton();
  }
});
applyWrapMode();
applyListView();

function cardFilterKeys(){
  return ['title','authors','year','journal','tags','collections','citedBy','doi','corresponding','added']
    .filter(k=>COLUMN_DEFS[k] && !COLUMN_DEFS[k].noFilter);
}
function renderCardFilterMenu(){
  $('#cardFilterMenu').innerHTML = cardFilterKeys().map(k=>{
    const on = colFilterActive(k);
    return `<button data-card-filter="${k}">${ic(on ? 'check' : 'funnel')}<span>${esc(t(COLUMN_DEFS[k].i18n))}</span></button>`;
  }).join('') + (anyColFilterActive() ? `<hr><button data-card-filter-clear>${esc(t('filterClear'))}</button>` : '');
  renderIcons($('#cardFilterMenu'));
}
function openCardFilterMenu(anchor){
  renderCardFilterMenu();
  const m = $('#cardFilterMenu');
  if(anchor){
    const r = anchor.getBoundingClientRect();
    m.style.top = 'auto';
    m.style.bottom = Math.max(8, window.innerHeight - r.top + 4) + 'px';
    m.style.left = 'auto';
    m.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
  }
  m.classList.add('open');
}
$('#btnCardFilters').addEventListener('click', (e)=>{
  e.stopPropagation();
  const m = $('#cardFilterMenu'), was = m.classList.contains('open');
  closeMenus();
  if(!was) openCardFilterMenu($('#btnCardFilters'));
});
$('#cardFilterMenu').addEventListener('click', (e)=>{
  e.stopPropagation();
  const clear = e.target.closest('[data-card-filter-clear]');
  if(clear){
    filter.cols = {};
    closeMenus(); $('#colFilterPop').classList.remove('open');
    renderList();
    return;
  }
  const btn = e.target.closest('[data-card-filter]');
  if(!btn) return;
  const key = btn.dataset.cardFilter;
  closeMenus();
  setTimeout(()=>openColFilterPop(key, listView === 'table' ? $('#btnCardFilters') : $('#btnCardViewMenu')), 0);
});

// list
$('#itemRows').addEventListener('click', (e)=>{
  const tr = e.target.closest('tr.row');
  if(pickMode){ if(tr) handlePickClick(tr.dataset.id, e); return; }
  const restoreBtn = e.target.closest('[data-restore-id]');
  if(restoreBtn){
    e.stopPropagation();
    const n = restoreItemsByIds([restoreBtn.dataset.restoreId]);
    if(n) showToast(I18N[lang].itemsRestored(n));
    return;
  }
  const delForeverBtn = e.target.closest('[data-delete-forever-id]');
  if(delForeverBtn){
    e.stopPropagation();
    deleteForever(delForeverBtn.dataset.deleteForeverId);
    return;
  }
  const starBtn = e.target.closest('[data-star-id]');
  if(starBtn){
    e.stopPropagation();
    toggleStar(starBtn.dataset.starId);
    return;
  }
  const pdfBtn = e.target.closest('[data-row-addpdf]');
  if(pdfBtn){
    e.stopPropagation();
    selectItem(pdfBtn.dataset.rowAddpdf);
    $('#filePdf').click();
    return;
  }
  if(!tr) return;
  handleListSelection(tr.dataset.id, e);
});
$('#itemCards').addEventListener('click', (e)=>{
  const row = e.target.closest('.cardRow');
  if(pickMode){ if(row) handlePickClick(row.dataset.id, e); return; }
  const restoreBtn = e.target.closest('[data-restore-id]');
  if(restoreBtn){
    e.stopPropagation();
    const n = restoreItemsByIds([restoreBtn.dataset.restoreId]);
    if(n) showToast(I18N[lang].itemsRestored(n));
    return;
  }
  const delForeverBtn = e.target.closest('[data-delete-forever-id]');
  if(delForeverBtn){
    e.stopPropagation();
    deleteForever(delForeverBtn.dataset.deleteForeverId);
    return;
  }
  const starBtn = e.target.closest('[data-star-id]');
  if(starBtn){
    e.stopPropagation();
    toggleStar(starBtn.dataset.starId);
    return;
  }
  const pdfBtn = e.target.closest('[data-row-addpdf]');
  if(pdfBtn){
    e.stopPropagation();
    selectItem(pdfBtn.dataset.rowAddpdf);
    $('#filePdf').click();
    return;
  }
  if(!row) return;
  handleListSelection(row.dataset.id, e);
});
$('#itemRows').addEventListener('dragstart', (e)=>{
  const tr = e.target.closest('tr.row');
  if(!tr) return;
  const ids = multiSelectedIds.has(tr.dataset.id) ? Array.from(multiSelectedIds) : [tr.dataset.id];
  e.dataTransfer.setData('text/plain', tr.dataset.id);
  e.dataTransfer.setData('application/x-paper-library-items', JSON.stringify(ids));
  e.dataTransfer.effectAllowed = 'copyMove';
});
$('#itemCards').addEventListener('dragstart', (e)=>{
  const row = e.target.closest('.cardRow');
  if(!row) return;
  const ids = multiSelectedIds.has(row.dataset.id) ? Array.from(multiSelectedIds) : [row.dataset.id];
  e.dataTransfer.setData('text/plain', row.dataset.id);
  e.dataTransfer.setData('application/x-paper-library-items', JSON.stringify(ids));
  e.dataTransfer.effectAllowed = 'copyMove';
});
function handleCompactViewClick(e){
  const paper=e.target.closest('.shelfPaper,.kanbanPaper');
  if(!paper)return;
  if(pickMode){handlePickClick(paper.dataset.id,e);return;}
  const restoreBtn=e.target.closest('[data-restore-id]');
  if(restoreBtn){e.stopPropagation();const n=restoreItemsByIds([restoreBtn.dataset.restoreId]);if(n)showToast(I18N[lang].itemsRestored(n));return;}
  const delForeverBtn=e.target.closest('[data-delete-forever-id]');
  if(delForeverBtn){e.stopPropagation();deleteForever(delForeverBtn.dataset.deleteForeverId);return;}
  const starBtn=e.target.closest('[data-star-id]');
  if(starBtn){e.stopPropagation();toggleStar(starBtn.dataset.starId);return;}
  const pdfBtn=e.target.closest('[data-row-addpdf]');
  if(pdfBtn){e.stopPropagation();selectItem(pdfBtn.dataset.rowAddpdf);$('#filePdf').click();return;}
  handleListSelection(paper.dataset.id,e);
}
function startCompactPaperDrag(e){
  const paper=e.target.closest('.shelfPaper,.kanbanPaper');
  if(!paper)return;
  const ids=multiSelectedIds.has(paper.dataset.id)?Array.from(multiSelectedIds):[paper.dataset.id];
  e.dataTransfer.setData('text/plain',paper.dataset.id);
  e.dataTransfer.setData('application/x-paper-library-items',JSON.stringify(ids));
  e.dataTransfer.effectAllowed='copyMove';
  paper.classList.add('dragging');
}
$('#itemShelves').addEventListener('click',handleCompactViewClick);
$('#itemKanban').addEventListener('click',handleCompactViewClick);
$('#itemShelves').addEventListener('change',e=>{
  if(e.target.id!=='shelfRecentDays')return;
  const days=Math.max(1,Math.min(3650,parseInt(e.target.value,10)||30));
  shelfRecentDays=days;localStorage.setItem('refshelf.shelfRecentDays',String(days));
  renderList({skipBadges:true});
});
$('#itemShelves').addEventListener('dragstart',startCompactPaperDrag);
$('#itemKanban').addEventListener('dragstart',startCompactPaperDrag);
$('#itemShelves').addEventListener('dragend',()=>$('#itemShelves').querySelectorAll('.dragging').forEach(x=>x.classList.remove('dragging')));
$('#itemKanban').addEventListener('dragover',e=>{
  const col=e.target.closest('[data-kanban-status]');
  if(!col||!dataTransferHasItems(e))return;
  e.preventDefault();e.dataTransfer.dropEffect='move';
  $('#itemKanban').querySelectorAll('.kanbanCol').forEach(x=>x.classList.toggle('dragOver',x===col));
});
$('#itemKanban').addEventListener('dragleave',e=>{
  if(!e.relatedTarget||!$('#itemKanban').contains(e.relatedTarget)) $('#itemKanban').querySelectorAll('.kanbanCol').forEach(x=>x.classList.remove('dragOver'));
});
$('#itemKanban').addEventListener('drop',e=>{
  const col=e.target.closest('[data-kanban-status]');
  if(!col||!dataTransferHasItems(e))return;
  e.preventDefault();
  const ids=draggedItemIds(e),status=col.dataset.kanbanStatus,now=new Date().toISOString();
  let changed=0;
  ids.forEach(id=>{const it=lib.items.find(x=>x.id===id);if(it&&normalizedReadingStatus(it)!==status){it.readingStatus=status;it.dateModified=now;changed++;}});
  $('#itemKanban').querySelectorAll('.kanbanCol').forEach(x=>x.classList.remove('dragOver'));
  if(changed){touch();renderList();if(selectedId&&ids.includes(selectedId))renderDetail();}
});
$('#itemKanban').addEventListener('dragend',()=>{
  $('#itemKanban').querySelectorAll('.dragging,.dragOver').forEach(x=>x.classList.remove('dragging','dragOver'));
});
// header: sort only from the dedicated control (headers are re-rendered)
$('#itemHead').addEventListener('click', (e)=>{
  if(colResizing || e.target.closest('.colresize')) return;
  const displayEl = e.target.closest('[data-author-display]');
  if(displayEl){ e.stopPropagation(); openAuthorDisplayPop(displayEl); return; }
  const fEl = e.target.closest('.thfilter');
  if(fEl){ e.stopPropagation(); openColFilterPop(fEl.dataset.thfilter, fEl); return; }
  const sortButton = e.target.closest('[data-sort]');
  if(!sortButton || sortButton.dataset.suppressClick) return;
  const key = sortButton.dataset.sort;
  if(sortKey===key) sortAsc = !sortAsc;
  else { sortKey = key; sortAsc = (key==='citedBy' || key==='pdf' || key==='starred') ? false : true; }
  renderList();
});

function authorDisplayOptions(items, cur){
  return items.map(([v,label])=>`<option value="${v}" ${cur===v?'selected':''}>${esc(label)}</option>`).join('');
}
function openAuthorDisplayPop(anchorEl){
  const pop = $('#authorDisplayPop');
  pop.innerHTML = `
    <div class="fRow"><label>${esc(t('authorNameStyle'))}</label>
      <select id="adStyle">${authorDisplayOptions([
        ['family', t('authorFamily')],
        ['initial', t('authorInitial')],
        ['full', t('authorFull')],
      ], authorDisplayPrefs.style)}</select></div>
    <div class="fRow"><label>${esc(t('authorLimit'))}</label>
      <select id="adLimit">${authorDisplayOptions([
        ['all', t('authorAll')],
        ['first3', t('authorFirst3')],
        ['first1', t('authorFirst1')],
      ], authorDisplayPrefs.limit)}</select></div>
    <div class="fRow"><label>${esc(t('authorSeparator'))}</label>
      <select id="adSep">${authorDisplayOptions([
        ['; ', ';'],
        [', ', ','],
        [' / ', '/'],
      ], authorDisplayPrefs.sep)}</select></div>
    <label class="checkline"><input type="checkbox" id="adMarkCorresponding" ${authorDisplayPrefs.markCorresponding?'checked':''}> ${esc(t('authorMarkCorresponding'))}</label>`;
  const r = anchorEl.getBoundingClientRect();
  pop.style.left = Math.max(8, Math.min(r.left - 90, window.innerWidth - 230)) + 'px';
  pop.style.top = (r.bottom + 6) + 'px';
  pop.classList.add('open');
  const pr = pop.getBoundingClientRect();
  if(pr.bottom > window.innerHeight - 8){
    pop.style.top = Math.max(8, r.top - pr.height - 6) + 'px';
  }
  const apply = ()=>{
    authorDisplayPrefs = {
      style: $('#adStyle').value,
      limit: $('#adLimit').value,
      sep: $('#adSep').value,
      markCorresponding: !!($('#adMarkCorresponding') && $('#adMarkCorresponding').checked),
    };
    localStorage.setItem('refshelf.authorDisplay', JSON.stringify(authorDisplayPrefs));
    renderList();
  };
  pop.querySelectorAll('select,input[type=checkbox]').forEach(sel=>sel.addEventListener('change', apply));
}

// per-column filter popup
function openColFilterPop(key, anchorEl){
  const pop = $('#colFilterPop');
  const label = t(COLUMN_DEFS[key].i18n);
  const cur = (filter.cols||{})[key];
  if(NUMERIC_FILTER_COLS.includes(key)){
    const from = cur && cur.from!=null ? cur.from : '';
    const to = cur && cur.to!=null ? cur.to : '';
    pop.innerHTML = `<div class="fRow"><label>${esc(I18N[lang].filterTitle(label))}</label>
      <div class="rangeRow"><input type="number" id="cfFrom" value="${esc(from)}" placeholder="${esc(t('filterFrom'))}"> – <input type="number" id="cfTo" value="${esc(to)}" placeholder="${esc(t('filterTo'))}"></div></div>
      <div class="popActions"><button id="cfClear">${esc(t('filterClear'))}</button></div>`;
  }else if(PICK_FILTER_COLS.includes(key)){
    const txt = colFilterSearch(cur);
    const selected = new Set(colFilterSelected(cur));
    const opts = colFilterOptions(key);
    pop.innerHTML = `<div class="fRow"><label>${esc(I18N[lang].filterTitle(label))}</label>
      <input type="text" id="cfText" value="${esc(txt)}" placeholder="${esc(t('filterContains'))}">
      <div class="hint">${esc(t('filterOptions'))}</div>
      <div class="pickList">` + (opts.length ? opts.map(o=>
        `<label class="pickItem"><input type="checkbox" data-cfopt="${esc(o)}" ${selected.has(o)?'checked':''}> <span class="pickLabel" ${filterOptionStyle(key,o)}>${filterOptionIcon(key)}${esc(o)}</span></label>`
      ).join('') : `<div class="hint">${esc(t('filterNoOptions'))}</div>`) + `</div></div>
      <div class="popActions"><button id="cfClear">${esc(t('filterClear'))}</button></div>`;
  }else{
    pop.innerHTML = `<div class="fRow"><label>${esc(I18N[lang].filterTitle(label))}</label>
      <input type="text" id="cfText" value="${esc(cur||'')}" placeholder="${esc(t('filterContains'))}"></div>
      <div class="popActions"><button id="cfClear">${esc(t('filterClear'))}</button></div>`;
  }
  let r = anchorEl.getBoundingClientRect();
  if(!r.width){ const th = anchorEl.closest('th'); if(th) r = th.getBoundingClientRect(); }
  pop.style.left = Math.max(8, Math.min(r.left - 60, window.innerWidth - 210)) + 'px';
  pop.style.top = (r.bottom + 6) + 'px';
  pop.classList.add('open');
  const pr = pop.getBoundingClientRect();
  if(pr.bottom > window.innerHeight - 8){
    pop.style.top = Math.max(8, r.top - pr.height - 6) + 'px';
  }
  const apply = ()=>{
    if(NUMERIC_FILTER_COLS.includes(key)){
      filter.cols[key] = { from: $('#cfFrom').value.trim(), to: $('#cfTo').value.trim() };
    }else if(PICK_FILTER_COLS.includes(key)){
      filter.cols[key] = {
        text: $('#cfText').value.trim(),
        selected: Array.from(pop.querySelectorAll('[data-cfopt]:checked')).map(x=>x.dataset.cfopt),
      };
    }else{
      filter.cols[key] = $('#cfText').value;
    }
    renderList();
  };
  pop.querySelectorAll('input').forEach(inp=>{
    inp.addEventListener('input', apply);
    inp.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key==='Escape') pop.classList.remove('open'); });
  });
  $('#cfClear').addEventListener('click', ()=>{
    delete filter.cols[key];
    pop.classList.remove('open');
    renderList();
  });
  const first = pop.querySelector('input');
  if(first) first.focus();
}

// header: drag to reorder columns (distinct dataTransfer type, no conflict with row DnD)
let colDragKey = null;
let colDropTarget = null;
let colDropAfter = false;
function clearColumnDropMarker(){
  if(colDropTarget) colDropTarget.classList.remove('col-drop-before','col-drop-after');
  colDropTarget = null;
  colDropAfter = false;
}
$('#itemHead').addEventListener('dragstart', (e)=>{
  if(colResizing || e.target.closest('.colresize')){ e.preventDefault(); return; }
  const th = e.target.closest('th.thmove');
  if(!th){ e.preventDefault(); return; }
  clearColumnDropMarker();
  colDragKey = th.dataset.col;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('application/x-refshelf-col', colDragKey);
  th.classList.add('col-drag');
});
$('#itemHead').addEventListener('dragover', (e)=>{
  if(!colDragKey) return;
  const th = e.target.closest('th.thmove');
  if(!th || th.dataset.col===colDragKey) return;
  e.preventDefault();
  const r = th.getBoundingClientRect();
  const after = (e.clientX - r.left) > r.width/2;
  if(colDropTarget===th && colDropAfter===after) return;
  clearColumnDropMarker();
  colDropTarget = th;
  colDropAfter = after;
  th.classList.add(after ? 'col-drop-after' : 'col-drop-before');
});
$('#itemHead').addEventListener('drop', (e)=>{
  if(!colDragKey) return;
  const th = e.target.closest('th.thmove');
  if(th && th.dataset.col!==colDragKey){
    e.preventDefault();
    const r = th.getBoundingClientRect();
    const after = (e.clientX - r.left) > r.width/2;
    const order = columnConfig.order.filter(k=>k!==colDragKey);
    let idx = order.indexOf(th.dataset.col);
    if(after) idx++;
    order.splice(idx, 0, colDragKey);
    columnConfig.order = order;
    saveColumns();
    clearColumnDropMarker();
    reorderRenderedTableColumns();
    colDragKey = null;
  }
});
$('#itemHead').addEventListener('dragend', ()=>{
  colDragKey = null;
  clearColumnDropMarker();
  const dragged = $('#itemHead').querySelector('th.col-drag');
  if(dragged) dragged.classList.remove('col-drag');
});

// header: drag right edge to resize
let colResizing = null;
$('#itemHead').addEventListener('dblclick', (e)=>{
  const handle = e.target.closest('.colresize');
  if(!handle) return;
  e.preventDefault(); e.stopPropagation();
  autoFitColumn(handle.dataset.resize);
});
$('#itemHead').addEventListener('pointerdown', (e)=>{
  const handle = e.target.closest('.colresize');
  if(!handle) return;
  e.preventDefault(); e.stopPropagation();
  const key = handle.dataset.resize;
  const th = handle.closest('th');
  colResizing = { key, startX:e.clientX, startW:th.getBoundingClientRect().width };
  document.body.classList.add('col-resizing');
  handle.setPointerCapture(e.pointerId);
});
$('#itemHead').addEventListener('pointermove', (e)=>{
  if(!colResizing) return;
  const w = Math.max(COLUMN_DEFS[colResizing.key].min, Math.round(colResizing.startW + (e.clientX - colResizing.startX)));
  columnConfig.widths[colResizing.key] = w;
  // live update the matching <col> and the total table width
  const keys = visibleColumnKeys();
  const colEl = $('#itemCols').children[keys.indexOf(colResizing.key)];
  if(colEl) colEl.style.width = w + 'px';
  $('#itemTable').style.width = keys.reduce((s,k)=>s + colWidth(k), 0) + 'px';
});
$('#itemHead').addEventListener('pointerup', (e)=>{
  if(!colResizing) return;
  const th = e.target.closest('th');
  if(th){ th.dataset.suppressClick = '1'; setTimeout(()=>{ delete th.dataset.suppressClick; }, 0); }
  colResizing = null;
  document.body.classList.remove('col-resizing');
  saveColumns();
});

// column menu (show/hide + reset)
function renderColumnMenu(){
  const rows = Object.keys(COLUMN_DEFS).filter(k=>!COLUMN_DEFS[k].trashOnly).map(k=>{
    const on = !columnConfig.hidden.includes(k) && columnConfig.order.includes(k);
    return `<label class="cmItem"><input type="checkbox" data-coltoggle="${k}" ${on?'checked':''}> ${esc(t(COLUMN_DEFS[k].i18n))}</label>`;
  }).join('');
  $('#colMenu').innerHTML = rows + `<hr><button data-colreset>${esc(t('colReset'))}</button>`;
}
$('#btnColMenu').addEventListener('click', (e)=>{
  e.stopPropagation();
  const m = $('#colMenu'), was = m.classList.contains('open');
  closeMenus();
  if(!was){ renderColumnMenu(); m.classList.add('open'); positionFloatingMenu($('#btnColMenu'), m); }
});
$('#colMenu').addEventListener('click', (e)=>{
  const cb = e.target.closest('[data-coltoggle]');
  if(cb){
    const k = cb.dataset.coltoggle;
    if(!columnConfig.order.includes(k)) columnConfig.order.push(k);
    const i = columnConfig.hidden.indexOf(k);
    if(cb.checked){ if(i>=0) columnConfig.hidden.splice(i,1); }
    else{ if(i<0) columnConfig.hidden.push(k); }
    // keep at least one non-pin column visible
    if(!visibleColumnKeys().length){ columnConfig.hidden = columnConfig.hidden.filter(x=>x!==k); cb.checked = true; }
    saveColumns(); renderList();
    return;
  }
  if(e.target.closest('[data-colreset]')){
    columnConfig = JSON.parse(JSON.stringify(DEFAULT_COLUMNS));
    saveColumns(); renderColumnMenu(); renderList();
  }
});

// Refresh cited-by counts. Prefer Semantic Scholar for counts; use OpenAlex
// only for unresolved items. Corresponding authors are refreshed separately.
// Main button = automatic (as before). The caret opens a menu offering the
// same automatic action, or "select items" (pick mode) to target specific papers.
// The main button updates everything (cited-by + corresponding + category) for
// the visible items; the caret menu offers the same over a hand-picked set, or a
// single field only.
$('#btnRefreshAll').addEventListener('click', ()=>refreshAll());
bindMenu('#btnRefreshAllCaret','#menuRefreshAll');
function refreshFnForKind(kind){
  return kind==='cited' ? refreshCitedByCounts
    : kind==='corresponding' ? refreshCorrespondingAuthors
    : kind==='category' ? refreshCategories
    : refreshAll;
}
// Update cited-by, corresponding authors and category in one pass. Category is
// filled opportunistically inside the two OpenAlex passes above (no extra calls).
async function refreshAll(explicitItems, opts){
  await refreshCitedByCounts(explicitItems, opts);
  await refreshCorrespondingAuthors(explicitItems, opts);
}
// Category-only bulk fill for items that don't have one yet.
async function refreshCategories(explicitItems){
  const items = (explicitItems || visibleItems()).filter(it=>(it.doi || it.arxiv) && !it.category);
  if(!items.length){ showToast(t('citeNotFound'), false); return; }
  const btn = $('#btnRefreshAll'); btn.disabled = true;
  clearUpdateStates();
  let updated = 0;
  for(const it of items){
    setItemUpdateState(it, 'running');
    try{ if(await enrichCategory(it)) updated++; }catch(e){ /* skip */ }
    setItemUpdateState(it, it.category ? 'ok' : 'none');
    refreshRowCells(it);
  }
  if(updated) touch();
  clearUpdateStates();
  renderList(); renderDetail();
  btn.disabled = false;
  showToast(I18N[lang].refreshedCategory(updated));
}
$('#menuRefreshAll').addEventListener('click', (e)=>{
  const b = e.target.closest('[data-refresh-mode]');
  if(!b) return;
  closeMenus();
  const kind = b.dataset.refreshKind || 'all';
  if(b.dataset.refreshMode==='pick') enterPickMode(kind);
  else refreshFnForKind(kind)();
});
$('#btnPickCancel').addEventListener('click', exitPickMode);
$('#btnPickClear').addEventListener('click', ()=>{
  Array.from(pickedIds).forEach(id=>setPicked(id, false));
  updatePickBar();
});
$('#btnPickConfirm').addEventListener('click', async ()=>{
  if(!pickedIds.size || !pickMode) return;
  const kind = pickMode;
  const items = lib.items.filter(it=>pickedIds.has(it.id));
  const n = items.length;
  exitPickMode();
  await refreshFnForKind(kind)(items, {force:true});
  showToast(I18N[lang].pickDone(n));
});
function applyOaCitedBy(it, w){
  if(typeof w.cited_by_count!=='number') return false;
  it.citedByCount = w.cited_by_count;
  it.citedByAt = new Date().toISOString();
  it.citedByStatus = '';
  return true;
}
// Fetch one item's OpenAlex record via the single-entity endpoint, which keeps
// working even when list/filter queries are rate-limited (daily budget).
async function fetchOneOaByItem(it, sel){
  sel = sel || 'doi,cited_by_count';
  if(it.doi) return oaFetch('works/doi:' + encodeURIComponent(normDoi(it.doi)) + '?select=' + sel);
  if(it.arxiv) return oaFetch('works/doi:' + encodeURIComponent('10.48550/arXiv.' + it.arxiv) + '?select=' + sel);
  // no DOI/arXiv → title search (a list query; may be rate-limited)
  const q = it.title.replace(/[:–—-]/g,' ').replace(/\s+/g,' ').trim();
  const d = await oaFetch('works?per-page=1&select=' + sel + '&filter=title.search:' + encodeURIComponent(q));
  if(d.results && d.results[0]) return d.results[0];
  throw new Error(t('citeNotFound'));
}
async function refreshCitedByCounts(explicitItems, opts){
  opts = opts || {};
  const all = (explicitItems || visibleItems()).filter(it=>it.doi || it.arxiv || it.title);
  // cache: skip items whose data is still fresh, unless a forced/single retry
  const items = (opts.force || explicitItems) ? all : all.filter(it=>!isFresh(it.citedByAt));
  const skipped = all.length - items.length;
  if(!items.length){ showToast(skipped ? I18N[lang].allFresh(skipped) : t('citeNotFound'), false); return; }
  const btn = $('#btnRefreshAll');
  btn.disabled = true;
  clearUpdateStates();
  renderAlerts();
  if($('#dlgFetchLog').open) renderFetchLog();
  const label = btn.querySelector('span[data-i18n]'); const orig = label ? label.textContent : '';
  if(label) label.textContent = t('refreshingCited');
  let s2Updated = 0, oaUpdated = 0, rateLimited = false, oaTitleBudget = 5;
  const updatedIds = new Set();
  const stillFailed = [];
  // One batched Semantic Scholar lookup up front; its answers are then applied
  // per-item below so the table fills in one row at a time (same feel as the
  // corresponding-author refresh) rather than all at once.
  let counts = new Map();
  try{ counts = await s2BatchCitedBy(items); }
  catch(e){ console.warn('Semantic Scholar cited-by refresh failed', e); }
  for(const it of items){
    setItemUpdateState(it, 'running');
    logUpdateProgress(it, 'cited', 'running', `${t('logRunning')} · Semantic Scholar`);
    await nextFrame(); // let the highlight paint before this row resolves
    if(counts.has(it.id)){
      it.citedByCount = counts.get(it.id);
      it.citedByAt = new Date().toISOString();
      it.citedByStatus = '';
      s2Updated++; updatedIds.add(it.id);
      setItemUpdateState(it, 'ok');
      logUpdateProgress(it, 'cited', 'ok', `${t('logUpdated')} · Semantic Scholar`, String(it.citedByCount));
      refreshRowCells(it);
      continue;
    }
    // Semantic Scholar had no answer: fall back to OpenAlex (secondary).
    // Skip OpenAlex once rate-limited, and cap title-only lookups.
    const canOa = !rateLimited && (it.doi || it.arxiv || oaTitleBudget > 0);
    if(!canOa){
      it.citedByStatus = 'fail';
      setItemUpdateState(it, 'fail');
      stillFailed.push(it);
      refreshRowCells(it);
      continue;
    }
    if(!it.doi && !it.arxiv) oaTitleBudget--;
    try{
      logUpdateProgress(it, 'cited', 'running', `${t('logRunning')} · OpenAlex`);
      const w = await fetchOneOaByItem(it, 'doi,cited_by_count,type');
      if(!it.category){ const c = detectCategoryFromLabel(w.type); if(c) it.category = c; }
      if(applyOaCitedBy(it, w)){
        updatedIds.add(it.id); oaUpdated++;
        setItemUpdateState(it, 'ok');
        logUpdateProgress(it, 'cited', 'ok', `${t('logUpdated')} · OpenAlex`, String(it.citedByCount));
      }else{
        it.citedByCount = null;
        it.citedByAt = new Date().toISOString();
        it.citedByStatus = 'none';
        setItemUpdateState(it, 'none');
        logUpdateProgress(it, 'cited', 'none');
      }
    }catch(e){
      if(e && e.rateLimited) rateLimited = true;
      it.citedByStatus = 'fail';
      setItemUpdateState(it, 'fail');
      stillFailed.push(it);
    }
    refreshRowCells(it);
  }
  const updated = updatedIds.size;

  stillFailed.forEach(it=>{
    it.citedByStatus = 'fail';
    logFetchFailure({
      label: it.title || it.doi || it.arxiv, detail: it.doi || it.arxiv || '',
      reason: rateLimited ? t('oaBudgetErr') : t('citeNotFound'), itemId: it.id, kind:'cited'
    });
  });
  if(updated || stillFailed.length) touch();
  clearUpdateStates();
  renderList(); renderDetail();
  if(label) label.textContent = orig; btn.disabled = false;
  const failed = stillFailed.length;
  if(failed){
    showToast(I18N[lang].refreshedCitedPartial(updated, failed), !updated);
  }else{
    showToast(s2Updated ? I18N[lang].refreshedCitedS2(updated, s2Updated) : I18N[lang].refreshedCited(updated));
  }
}
async function refreshCorrespondingAuthors(explicitItems, opts){
  opts = opts || {};
  // force (explicit per-item / picked-selection updates) also re-checks items that
  // already have a corresponding author, since the user asked for this one on purpose
  const all = (explicitItems || visibleItems()).filter(it=>(it.doi || it.arxiv) && (opts.force || !it.correspondingAuthors));
  const fresh = opts.force ? all : all.filter(it=>!isFresh(it.correspondingCheckedAt));
  // the automatic "whatever is visible" run now processes every eligible item,
  // just like an explicit selection
  const items = fresh;
  if(!items.length){ showToast(all.length ? t('recentlyCheckedNoCorresponding') : t('noCorrespondingTargets')); return; }
  const btn = $('#btnRefreshAll');
  btn.disabled = true;
  clearUpdateStates();
  renderAlerts();
  if($('#dlgFetchLog').open) renderFetchLog();
  const label = btn.querySelector('span[data-i18n]'); const orig = label ? label.textContent : '';
  if(label) label.textContent = t('refreshingCorresponding');
  let updated = 0, failed = 0, checked = 0, rateLimited = false;
  for(const it of items){
    try{
      setItemUpdateState(it, 'running');
      logUpdateProgress(it, 'corresponding', 'running');
      const w = await fetchOneOaByItem(it, 'doi,authorships,type');
      if(!it.category){ const c = detectCategoryFromLabel(w.type); if(c) it.category = c; }
      const corr = oaCorrespondingAuthors(w.authorships);
      if(corr){
        it.correspondingAuthors = corr;
        it.correspondingCheckedAt = new Date().toISOString();
        it.correspondingStatus = '';
        checked++;
        updated++;
        setItemUpdateState(it, 'ok');
        logUpdateProgress(it, 'corresponding', 'ok', t('logUpdated'), corr);
      }else{
        it.correspondingAuthors = '';
        it.correspondingCheckedAt = new Date().toISOString();
        it.correspondingStatus = 'none';
        checked++;
        failed++;
        setItemUpdateState(it, 'none');
        logUpdateProgress(it, 'corresponding', 'none', t('noCorrespondingFound'));
        logFetchFailure({
          label: it.title || it.doi || it.arxiv, detail: it.doi || it.arxiv || '',
          reason: t('noCorrespondingFound'), itemId: it.id, kind:'corresponding', status:'none'
        });
      }
    }catch(e){
      if(e && e.rateLimited) rateLimited = true;
      it.correspondingStatus = 'fail';
      failed++;
      setItemUpdateState(it, 'fail');
      logFetchFailure({
        label: it.title || it.doi || it.arxiv, detail: it.doi || it.arxiv || '',
        reason: rateLimited ? t('oaBudgetErr') : reasonText(e), itemId: it.id, kind:'corresponding'
      });
      if(rateLimited){ refreshRowCells(it); break; }
    }
    refreshRowCells(it); // show this row's result live before moving on
  }
  if(updated || checked || failed) touch();
  clearUpdateStates();
  renderList(); renderDetail();
  if(label) label.textContent = orig; btn.disabled = false;
  if(failed) showToast(I18N[lang].refreshedCorrespondingPartial(updated, failed), !updated);
  else showToast(I18N[lang].refreshedCorresponding(updated));
}

// detail pane: field editing (event delegation)
$('#detail').addEventListener('input', (e)=>{
  if(e.target.classList && e.target.classList.contains('autogrow')) autoGrow(e.target);
  const f = e.target.dataset.f;
  const it = lib.items.find(x=>x.id===selectedId);
  if(!f || !it) return;
  const v = e.target.value;
  switch(f){
    case 'authors': it.authors = textToAuthors(v); break;
    case 'tags': it.tags = v.split(',').map(s=>s.trim()).filter(Boolean); break;
    case 'pages': it.pages = normalizeRange(v); break;
    case 'doi': {
      const nd = normDoi(v);
      const am = nd.match(/^10\.48550\/arxiv\.(.+)$/i);
      if(am){ it.doi = ''; it.arxiv = normalizeArxivInput(am[1]); if(!it.url) it.url = 'https://arxiv.org/abs/' + it.arxiv; }
      else { it.doi = nd; normalizeRepositoryPreprintItem(it); }
      break;
    }
    case 'arxiv': {
      it.arxiv = normalizeArxivInput(v);
      if(it.arxiv && !it.url) it.url = 'https://arxiv.org/abs/' + it.arxiv;
      break;
    }
    case 'correspondingAuthors': it.correspondingAuthors = v; it.correspondingStatus = v.trim() ? '' : it.correspondingStatus; break;
    default: it[f] = v;
  }
  touch(it);
  updateCitePreview();
  clearTimeout(renderListDebounce._t);
  renderListDebounce._t = setTimeout(()=>{ renderList(); renderSidebar(); }, 400);
});
function renderListDebounce(){}
function updateCitationPrefFromEvent(e){
  if(e.target.dataset.pref){
    const key = e.target.dataset.pref;
    citationPrefs[key] = (key==='includeTitle' || key==='includeUrl') ? e.target.checked : e.target.value;
    localStorage.setItem('refshelf.citationPrefs', JSON.stringify(citationPrefs));
    updateCitePreview();
    return true;
  }
  return false;
}
$('#dlgCitationPrefs').addEventListener('change', updateCitationPrefFromEvent);
$('#detail').addEventListener('change', (e)=>{
  if(updateCitationPrefFromEvent(e)) return;
});
$('#detail').addEventListener('click', async (e)=>{
  const btn = e.target.closest('[data-act],[data-open-att],[data-del-att]');
  if(!btn) return;
  const it = lib.items.find(x=>x.id===selectedId);
  if(!it) return;
  if(btn.dataset.openAtt !== undefined){ openAttachment(it.attachments[+btn.dataset.openAtt].name); return; }
  if(btn.dataset.delAtt !== undefined){
    const a = it.attachments[+btn.dataset.delAtt];
    if(!confirm(I18N[lang].confirmDeleteAtt(a.name))) return;
    pendingAttachmentDeletes.add(a.name);
    it.attachments.splice(+btn.dataset.delAtt,1);
    touch(it); renderList(); renderDetail();
    showToast(t('attDeleted'));
    return;
  }
  switch(btn.dataset.act){
    case 'openlink': openExternalLink(it.url || ('https://doi.org/' + it.doi)); break;
    case 'copycite': await copyCitation(it, citationPrefs); showToast(t('copied')); break;
    case 'copybib': await navigator.clipboard.writeText(itemToBibTeX(it)); showToast(t('copied')); break;
    case 'citeprefs': openCitationPrefsDialog(); break;
    case 'toggleStar': toggleStar(it.id); break;
    case 'toggleMyPublication': toggleMyPublication(it.id); break;
    case 'addpdf': $('#filePdf').click(); break;
    case 'delitem': await deleteItem(it.id); break;
    case 'restoreItem': await restoreItem(it.id); break;
    case 'deleteForever': await deleteForever(it.id); break;
    case 'citations': openCitationsDialog(it); break;
    case 'graph': openGraphDialog(it); break;
    case 'updateThis': await updateSingleItem(it); break;
    case 'applyJournalFix': {
      const sug = fixSuggestionForItem(it);
      if(sug && applyJournalFixSuggestion(sug)){
        renderList(); renderDetail();
      }
      break;
    }
  }
});
// Per-item update: refresh cited-by + corresponding authors for exactly one item,
// bypassing the freshness cache (the user explicitly asked for this one).
async function updateSingleItem(it){
  await refreshCitedByCounts([it], {force:true});
  await refreshCorrespondingAuthors([it], {force:true});
  if(await enrichCategory(it)){ touch(); refreshRowCells(it); renderDetail(); }
}
$('#filePdf').addEventListener('change', async ()=>{
  const it = lib.items.find(x=>x.id===selectedId);
  if(it && $('#filePdf').files.length) await attachFiles(it, Array.from($('#filePdf').files));
  $('#filePdf').value = '';
});

/* ---------------------------------------------------------------
   Citations dialog (OpenAlex references + cited-by)
---------------------------------------------------------------- */
let citState = { ref:[], cited:[] };   // mapped RefShelf items backing each list
function isInLibrary(it){
  if(it.doi) return lib.items.some(x=>x.doi && x.doi===it.doi);
  if(it.arxiv) return lib.items.some(x=>x.arxiv===it.arxiv);
  const key = (it.title||'').toLowerCase().trim();
  return key && lib.items.some(x=>(x.title||'').toLowerCase().trim()===key);
}
function citRowHTML(it, listName, idx){
  // Render the same formatted citation as the citation preview (current style /
  // author scope / title setting), so entries read like "K. Kawabata et al.,
  // J. Am. Chem. Soc. 2016, 138, …". The row already has a link button, so the
  // inline DOI URL is dropped to keep it compact.
  const cite = itemToCitationHtml(it, Object.assign({}, citationPrefs, {includeUrl:false}))
    || esc(it.title || t('newItem'));
  const inLib = isInLibrary(it);
  const linkBtn = (it.doi || it.url)
    ? `<button data-cit-open="${listName}:${idx}" title="${esc(t('openLink'))}">${ic('link')}</button>` : '';
  const addBtn = inLib
    ? `<button class="cIn" disabled>${ic('check')}${esc(t('citeInLib'))}</button>`
    : `<button class="cAdd" data-cit-add="${listName}:${idx}">${ic('plus')}${esc(t('citeAdd'))}</button>`;
  return `<div class="citRow">
    <div class="cbody"><div class="cCite">${cite}</div></div>
    <div class="cbtns">${linkBtn}${addBtn}</div>
  </div>`;
}
function renderCitList(listName){
  const box = listName==='ref' ? $('#citRefList') : $('#citCitedList');
  const items = citState[listName];
  box.innerHTML = items.length
    ? items.map((it,i)=>citRowHTML(it, listName, i)).join('')
    : `<div class="citEmpty">${esc(listName==='ref' ? t('citeRefNone') : t('citeCitedNone'))}</div>`;
}
async function openCitationsDialog(item){
  citState = { ref:[], cited:[] };
  $('#citHeadTitle').textContent = I18N[lang].citationsFor(item.title || t('newItem'));
  $('#citRefCnt').textContent = ''; $('#citCitedCnt').textContent = '';
  $('#citRefList').innerHTML = `<div class="citLoad">${esc(t('citeLoading'))}</div>`;
  $('#citCitedList').innerHTML = `<div class="citLoad">${esc(t('citeLoading'))}</div>`;
  $('#dlgCitations').showModal();
  let work;
  try{ work = await resolveOpenAlexWork(item); }
  catch(e){
    const msg = `<div class="citEmpty">${esc(t('citeNotFound'))}</div>`;
    $('#citRefList').innerHTML = msg; $('#citCitedList').innerHTML = msg;
    return;
  }
  // references
  fetchOpenAlexReferences(work).then(works=>{
    citState.ref = works.map(openAlexToItem);
    $('#citRefCnt').textContent = I18N[lang].citeCountRef(citState.ref.length);
    renderCitList('ref');
  }).catch(e=>{ $('#citRefList').innerHTML = `<div class="citEmpty">${esc(e.message)}</div>`; });
  // cited-by
  fetchOpenAlexCitedBy(work).then(res=>{
    citState.cited = res.works.map(openAlexToItem);
    $('#citCitedCnt').textContent = I18N[lang].citeCountCited(citState.cited.length, res.total);
    renderCitList('cited');
  }).catch(e=>{ $('#citCitedList').innerHTML = `<div class="citEmpty">${esc(e.message)}</div>`; });
}
$('#citBody').addEventListener('click', (e)=>{
  const openBtn = e.target.closest('[data-cit-open]');
  if(openBtn){
    const [ln,i] = openBtn.dataset.citOpen.split(':');
    const it = citState[ln][+i];
    openExternalLink(it.doi ? 'https://doi.org/' + it.doi : it.url);
    return;
  }
  const addBtn = e.target.closest('[data-cit-add]');
  if(addBtn){
    const [ln,i] = addBtn.dataset.citAdd.split(':');
    const src = citState[ln][+i];
    const clone = JSON.parse(JSON.stringify(src));
    clone.id = uid(); clone.citekey = '';
    clone.dateAdded = new Date().toISOString();
    const res = addItems([clone]);
    if(res.added){ showToast(t('addedFromCite') + ': ' + (clone.title||'')); renderAll(); showDuplicateReviewAfterAdd(res); }
    renderCitList('ref'); renderCitList('cited'); // refresh "in library" markers
  }
});
/* ---------------------------------------------------------------
   Related-papers graph (Connected Papers style).
   Pool = seed refs + citing works (with their reference lists), scored by
   cosine-normalised bibliographic coupling + co-citation with the seed;
   top-N by relevance become nodes. Edges use normalised coupling so long
   reference lists (reviews) do not dominate the layout.
---------------------------------------------------------------- */
const GRAPH_MAX_NODES = 42;      // seed + neighbours
const GRAPH_MIN_SHARED = 1;      // min shared refs for an edge; later thinned visually
const GRAPH_POOL_CITING = 100;   // citing works pulled into the candidate pool
const GRAPH_POOL_REFS = 100;     // seed references considered (ranked by co-citation)
const GRAPH_CACHE_V = 2;         // bump to invalidate graphs cached by older logic
let graphState = null;           // { nodes, edges, view, selId, anim }
let graphShowLabels = true;

// Fetch works by OpenAlex id: batched list queries first (1 request / 50 ids),
// falling back to the un-metered single-entity endpoint for chunks the list
// tier could not serve (rate limit etc.). Calls cb(work) for each record.
async function fetchWorksByIds(ids, select, cb){
  const missing = [];
  for(let i=0; i<ids.length; i+=50){
    const chunk = ids.slice(i, i+50);
    try{
      const d = await oaFetch('works?per-page=50&select=' + select + '&filter=openalex:' + chunk.join('|'));
      (d.results||[]).forEach(cb);
    }catch(e){ missing.push(...chunk); }
  }
  const CONC = 6;
  let idx = 0;
  async function worker(){
    while(idx < missing.length){
      const id = missing[idx++];
      try{ cb(await oaFetch('works/' + id + '?select=' + select)); }
      catch(e){ /* skip this candidate */ }
    }
  }
  await Promise.all(Array.from({length:Math.min(CONC, missing.length)}, worker));
}

function sharedCount(a, b){
  let n = 0;
  const small = a.size < b.size ? a : b;
  const large = small===a ? b : a;
  small.forEach(r=>{ if(large.has(r)) n++; });
  return n;
}
// cosine-normalised bibliographic coupling: shared / sqrt(|A|·|B|)
function couplingSim(shared, sizeA, sizeB){
  return (shared && sizeA && sizeB) ? shared / Math.sqrt(sizeA * sizeB) : 0;
}

async function buildGraphData(seedItem, onProgress){
  onProgress(t('graphLoading1'));
  const seedWork = await resolveOpenAlexWork(seedItem); // single-entity, throws if not found
  const seedId = oaId(seedWork.id);
  const refIds = (seedWork.referenced_works||[]).map(oaId).filter(id=>id!==seedId);
  const seedRefs = new Set(refIds);

  // ---- candidate pool (light select: reference lists drive the scoring) ----
  const POOL_SELECT = 'id,referenced_works,cited_by_count';
  const pool = new Map();   // id -> { refs:Set, cited }
  const addPool = (w)=>{
    const id = oaId(w.id);
    if(!id || id===seedId || pool.has(id)) return;
    pool.set(id, { refs:new Set((w.referenced_works||[]).map(oaId)), cited:w.cited_by_count||0 });
  };
  // citing works — one list query; optional (skipped if rate-limited)
  let citingList = [];
  try{
    const d = await oaFetch('works?per-page=' + GRAPH_POOL_CITING + '&sort=cited_by_count:desc&select=' + POOL_SELECT + '&filter=cites:' + seedId);
    citingList = d.results||[];
  }catch(e){ /* citing list optional under budget limits */ }
  citingList.forEach(addPool);
  // co-citation with the seed: how often each work appears in a citing work's
  // reference list alongside the seed
  const cocit = new Map();  // id -> count
  citingList.forEach(w=>{
    (w.referenced_works||[]).forEach(r=>{
      const id = oaId(r);
      if(id && id!==seedId) cocit.set(id, (cocit.get(id)||0)+1);
    });
  });
  // seed references: rank by co-citation before capping, so the refs most
  // entangled with the seed's citation neighbourhood survive the cut
  const refPick = refIds.slice()
    .sort((a,b)=>(cocit.get(b)||0)-(cocit.get(a)||0))
    .slice(0, GRAPH_POOL_REFS)
    .filter(id=>!pool.has(id));
  onProgress(t('graphLoading2'));
  await fetchWorksByIds(refPick, POOL_SELECT, addPool);

  // ---- score pool: coupling + co-citation (+ tiny prominence tie-breaker) ----
  const maxCocit = Math.max(1, ...Array.from(pool.keys(), id=>cocit.get(id)||0));
  const maxCited = Math.max(10, ...Array.from(pool.values(), p=>p.cited));
  const scored = [];
  pool.forEach((p, id)=>{
    const coupling = couplingSim(sharedCount(p.refs, seedRefs), p.refs.size, seedRefs.size);
    const co = (cocit.get(id)||0) / maxCocit;
    const prominence = Math.log10(1+p.cited) / Math.log10(1+maxCited);
    scored.push({ id, score: coupling + 0.8*co + 0.08*prominence });
  });
  scored.sort((a,b)=>b.score-a.score);
  const chosenIds = scored.slice(0, GRAPH_MAX_NODES-1).map(s=>s.id);

  // ---- full metadata for the chosen candidates only ----
  const works = new Map();  // id -> work (with referenced_works)
  await fetchWorksByIds(chosenIds, OA_SELECT, w=>{ const id = oaId(w.id); if(id && id!==seedId) works.set(id, w); });
  const fetchFailed = chosenIds.length - works.size;

  // nodes: seed + every candidate we managed to fetch
  const nodes = [{ id:seedId, w:seedWork, wRefs:seedRefs, seed:true }];
  works.forEach((w, id)=>{
    nodes.push({ id, w, wRefs:new Set((w.referenced_works||[]).map(oaId)), seed:false });
  });
  nodes.forEach(n=>{
    n.item = openAlexToItem(n.w);
    n.year = parseInt(n.item.year,10) || null;
    n.cited = n.w.cited_by_count || 0;
    n.label = ((n.item.authors[0]||{}).family || '') + (n.year ? ' ' + n.year : '');
    n.seedRel = n.seed ? null : {
      shared: sharedCount(n.wRefs, seedRefs),
      citesSeed: n.wRefs.has(seedId),
      citedBySeed: seedRefs.has(n.id)
    };
  });
  // edges: normalised bibliographic coupling between node pairs + direct citations
  const edges = [];
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const A = nodes[i], B = nodes[j];
      const shared = sharedCount(A.wRefs, B.wRefs);
      const direct = A.wRefs.has(B.id) || B.wRefs.has(A.id);
      if(shared >= GRAPH_MIN_SHARED || direct){
        edges.push({ a:i, b:j, w: couplingSim(shared, A.wRefs.size, B.wRefs.size) + (direct ? 0.25 : 0), shared, direct });
      }
    }
  }
  return { nodes, edges, fetchFailed };
}

// Reduce the hairball: keep a maximum spanning tree (connectivity via the
// strongest links) plus each node's top-2 strongest edges.
function thinEdges(nodes, edges){
  if(edges.length <= nodes.length) return edges;
  const sorted = edges.slice().sort((a,b)=>b.w - a.w);
  const keep = new Set();
  // max spanning tree (Kruskal + union-find)
  const parent = nodes.map((_,i)=>i);
  const find = (x)=>{ while(parent[x]!==x){ parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  sorted.forEach(e=>{
    const ra = find(e.a), rb = find(e.b);
    if(ra!==rb){ parent[ra] = rb; keep.add(e); }
  });
  // + top-3 strongest per node so local clusters remain readable
  const byNode = new Map();
  sorted.forEach(e=>{
    for(const v of [e.a, e.b]){
      if(!byNode.has(v)) byNode.set(v, []);
      byNode.get(v).push(e);
    }
  });
  byNode.forEach(list=>{ list.slice(0,3).forEach(e=>keep.add(e)); });
  return edges.filter(e=>keep.has(e));
}

function graphLayout(nodes, edges, W, H, iterations){
  // simple force-directed layout (repulsion + edge springs + centering)
  const N = nodes.length;
  nodes.forEach((n,i)=>{
    if(n.seed){ n.x = 0; n.y = 0; }
    else{
      // jittered start so "re-layout" explores a genuinely different arrangement
      const a = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.9;
      const r = 100 + (i % 5) * 30 + Math.random() * 50;
      n.x = Math.cos(a) * r; n.y = Math.sin(a) * r;
    }
    n.vx = 0; n.vy = 0;
  });
  const maxW = Math.max(1, ...edges.map(e=>e.w));
  for(let it=0; it<(iterations||260); it++){
    const temp = 1 - it/(iterations||260);
    // repulsion
    for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
      const A = nodes[i], B = nodes[j];
      let dx = A.x-B.x, dy = A.y-B.y;
      let d2 = dx*dx + dy*dy || 0.01;
      if(d2 < 90000){
        const f = 2600 / d2;
        const d = Math.sqrt(d2);
        dx/=d; dy/=d;
        A.vx += dx*f; A.vy += dy*f;
        B.vx -= dx*f; B.vy -= dy*f;
      }
    }
    // springs
    edges.forEach(e=>{
      const A = nodes[e.a], B = nodes[e.b];
      const dx = B.x-A.x, dy = B.y-A.y;
      const d = Math.sqrt(dx*dx+dy*dy) || 0.01;
      const target = 150 - 70 * (e.w / maxW);   // stronger edge → shorter
      const f = (d - target) * 0.02 * (0.5 + e.w / maxW);
      A.vx += dx/d*f; A.vy += dy/d*f;
      B.vx -= dx/d*f; B.vy -= dy/d*f;
    });
    // centering + integrate
    nodes.forEach(n=>{
      n.vx -= n.x * 0.012; n.vy -= n.y * 0.012;
      if(n.seed){ n.vx *= 0.2; n.vy *= 0.2; } // keep seed near center
      n.x += Math.max(-14, Math.min(14, n.vx * temp));
      n.y += Math.max(-14, Math.min(14, n.vy * temp));
      n.vx *= 0.6; n.vy *= 0.6;
    });
  }
  // fit into viewport
  const xs = nodes.map(n=>n.x), ys = nodes.map(n=>n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 56;
  const sc = Math.min((W-2*pad)/Math.max(1,maxX-minX), (H-2*pad)/Math.max(1,maxY-minY), 2.2);
  nodes.forEach(n=>{
    n.x = (n.x - (minX+maxX)/2) * sc + W/2;
    n.y = (n.y - (minY+maxY)/2) * sc + H/2;
  });
}

function graphYearColor(year, minY, maxY){
  if(!year) return '#9ca3af';
  const f = maxY>minY ? (year-minY)/(maxY-minY) : 0.5;
  // higher-contrast ramp on light bg: sky blue → indigo → deep violet
  const h = 205 + f*72, s = 80 - f*10, l = 68 - f*28;
  return `hsl(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%)`;
}
function graphNodeR(cited, maxCited){
  return 6 + 16 * Math.sqrt(Math.log10(1+cited) / Math.log10(1+Math.max(10,maxCited)));
}
function graphEdgeShared(e){ return e.shared!=null ? e.shared : Math.max(0, (e.w||0) - (e.direct ? 2 : 0)); }
function graphSeedRelation(g, idx){
  const n = g.nodes[idx];
  if(!n || n.seed) return null;
  if(n.seedRel) return n.seedRel;
  const seedIdx = g.nodes.findIndex(x=>x.seed);
  const e = g.edges.find(x=>(x.a===seedIdx && x.b===idx) || (x.b===seedIdx && x.a===idx));
  return e ? { shared:graphEdgeShared(e), citesSeed:false, citedBySeed:false } : { shared:0, citesSeed:false, citedBySeed:false };
}
function graphRelationText(rel){
  const parts = [];
  if(rel.citesSeed) parts.push(t('graphDirectCites'));
  if(rel.citedBySeed) parts.push(t('graphDirectCitedBy'));
  if(rel.shared) parts.push(I18N[lang].graphSharedRefs(rel.shared));
  return parts.length ? parts.join(' / ') : I18N[lang].graphSharedRefs(0);
}
function graphNearestLinks(g, idx){
  return g.edges
    .filter(e=>e.a===idx || e.b===idx)
    .sort((a,b)=>b.w-a.w)
    .slice(0,4)
    .map(e=>{
      const otherIdx = e.a===idx ? e.b : e.a;
      return { node:g.nodes[otherIdx], edge:e };
    });
}
function fitGraphView(pad){
  const g = graphState;
  if(!g || !g.nodes.length) return;
  const rs = g.nodes.map(n=>graphNodeR(n.cited, Math.max(...g.nodes.map(x=>x.cited))));
  const minX = Math.min(...g.nodes.map((n,i)=>n.x-rs[i])), maxX = Math.max(...g.nodes.map((n,i)=>n.x+rs[i]));
  const minY = Math.min(...g.nodes.map((n,i)=>n.y-rs[i])), maxY = Math.max(...g.nodes.map((n,i)=>n.y+rs[i]));
  const boxW = Math.max(1, maxX-minX), boxH = Math.max(1, maxY-minY);
  const p = pad == null ? 46 : pad;
  const k = Math.max(0.3, Math.min(5, Math.min((g.W - p*2)/boxW, (g.H - p*2)/boxH)));
  // centre the bounding box on both axes — the non-constraining axis has slack,
  // and clamping k can leave asymmetric padding otherwise
  g.view = { x: minX - (g.W/k - boxW)/2, y: minY - (g.H/k - boxH)/2, k };
}
function updateGraphStats(){
  const el = $('#graphStats');
  if(!el || !graphState){ if(el) el.textContent = ''; return; }
  el.textContent = I18N[lang].graphStats(graphState.nodes.length, graphState.edges.length);
}

// pan / zoom / resize only move the camera — updating the viewBox is enough,
// no need to rebuild the SVG DOM
function updateGraphViewBox(){
  const g = graphState;
  if(!g) return;
  $('#graphSvg').setAttribute('viewBox', `${g.view.x} ${g.view.y} ${g.W/g.view.k} ${g.H/g.view.k}`);
}
function renderGraph(){
  const g = graphState;
  if(!g) return;
  const svg = $('#graphSvg');
  updateGraphViewBox();
  svg.classList.toggle('hideLabels', !graphShowLabels);
  const years = g.nodes.map(n=>n.year).filter(Boolean);
  const minY = Math.min(...years), maxY = Math.max(...years);
  $('#glYears').textContent = years.length ? `${minY}–${maxY}` : '';
  const maxCited = Math.max(...g.nodes.map(n=>n.cited));
  const maxW = Math.max(1, ...g.edges.map(e=>e.w));
  const edgeHtml = g.edges.map((e,ei)=>{
    const A = g.nodes[e.a], B = g.nodes[e.b];
    const title = graphEdgeShared(e) ? I18N[lang].graphSharedRefs(graphEdgeShared(e)) : '';
    return `<line class="gEdge${e.direct ? ' direct' : ''}" data-e="${ei}" x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}" x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}" stroke-width="${(0.7 + 2.8*e.w/maxW).toFixed(2)}" opacity="${(0.18 + 0.4*e.w/maxW).toFixed(2)}">${title ? `<title>${esc(title)}</title>` : ''}</line>`;
  }).join('');
  const nodeHtml = g.nodes.map((n,i)=>{
    // the seed gets a size floor — a modestly-cited seed must not vanish among
    // the classics it pulled in
    const r = Math.max(graphNodeR(n.cited, maxCited), n.seed ? 13 : 0);
    const fill = graphYearColor(n.year, minY, maxY);
    const inLib = isInLibrary(n.item);
    const cls = ['gNode', n.seed?'seed':'', (!n.seed && inLib)?'inlib':''].filter(Boolean).join(' ');
    return `<g class="${cls}" data-node="${i}" transform="translate(${n.x.toFixed(1)},${n.y.toFixed(1)})">`+
      (n.seed ? `<circle class="gSeedHalo" r="${(r+5).toFixed(1)}"></circle>` : '')+
      `<circle r="${r.toFixed(1)}" fill="${fill}"><title>${esc(n.item.title)}</title></circle></g>`+
      `<text class="gLabel${n.seed?' seed':''}" data-lbl="${i}" x="${n.x.toFixed(1)}" y="${(n.y + r + (n.seed?16:10)).toFixed(1)}" text-anchor="middle">${esc(n.label)}</text>`;
  }).join('');
  svg.innerHTML = `<g>${edgeHtml}${nodeHtml}</g>`;
  // the seed must never hide behind a bigger neighbour
  const seedIdx = g.nodes.findIndex(n=>n.seed);
  if(seedIdx >= 0){
    const sl = svg.querySelector(`[data-lbl="${seedIdx}"]`);
    if(sl) sl.parentNode.appendChild(sl);
    const sn = svg.querySelector(`[data-node="${seedIdx}"]`);
    if(sn) sn.parentNode.appendChild(sn);
  }
  updateGraphStats();
  applyHighlight();
}
// Dim everything except the selected node and its neighbours.
// Class toggling only — no re-render, so it is cheap.
function applyHighlight(){
  const g = graphState;
  if(!g) return;
  const svg = $('#graphSvg');
  svg.querySelectorAll('.gNode.sel').forEach(el=>el.classList.remove('sel'));
  if(g.selIdx!=null){
    const el = svg.querySelector(`[data-node="${g.selIdx}"]`);
    if(el){
      el.classList.add('sel');
      // raise above neighbouring nodes so the selection ring is never hidden
      const lbl = svg.querySelector(`[data-lbl="${g.selIdx}"]`);
      if(lbl) lbl.parentNode.appendChild(lbl);
      el.parentNode.appendChild(el);
    }
  }
  const focus = g.selIdx;
  if(focus==null){
    svg.querySelectorAll('.dim').forEach(el=>el.classList.remove('dim'));
    return;
  }
  const nbr = new Set([focus]);
  g.edges.forEach(e=>{ if(e.a===focus) nbr.add(e.b); if(e.b===focus) nbr.add(e.a); });
  svg.querySelectorAll('[data-node]').forEach(el=>el.classList.toggle('dim', !nbr.has(+el.dataset.node)));
  svg.querySelectorAll('[data-lbl]').forEach(el=>el.classList.toggle('dim', !nbr.has(+el.dataset.lbl)));
  svg.querySelectorAll('[data-e]').forEach(el=>{
    const e = g.edges[+el.dataset.e];
    el.classList.toggle('dim', !(e.a===focus || e.b===focus));
  });
}

function renderGraphSide(){
  const g = graphState;
  const side = $('#graphSide');
  if(!g || g.selIdx==null){
    side.innerHTML = `<div class="noselect">${esc(t('graphHint'))}</div>`;
    return;
  }
  const n = g.nodes[g.selIdx];
  const it = n.item;
  const inLib = isInLibrary(it);
  const meta1 = [authorsShort(it.authors)].filter(Boolean).join('');
  const meta2 = [it.journal, it.year].filter(Boolean).join(' · ');
  const rel = graphSeedRelation(g, g.selIdx);
  const nearest = graphNearestLinks(g, g.selIdx);
  side.innerHTML = `
    ${n.seed ? `<span class="gsSeedBadge">${esc(t('graphSeed'))}</span>` : ''}
    <div class="gsTitle">${esc(it.title)}</div>
    <div class="gsMeta">${esc(meta1)}</div>
    <div class="gsMeta">${esc(meta2)}</div>
    <div class="gsMeta">${esc(t('colCitedBy'))}: ${n.cited.toLocaleString()}</div>
    ${rel ? `<div class="gsRel"><b>${esc(t('graphRelToSeed'))}</b><br>${esc(graphRelationText(rel))}</div>` : ''}
    ${nearest.length ? `<div class="gsLinks"><b>${esc(t('graphNearest'))}</b>${nearest.map(x=>`<div class="gsLink">${esc(x.node.label || x.node.item.title || '')} · ${esc(I18N[lang].graphSharedRefs(graphEdgeShared(x.edge)))}</div>`).join('')}</div>` : ''}
    <div class="gsBtns">
      ${(it.doi||it.url) ? `<button class="tbtn" data-gs="open">${ic('link')}${esc(t('graphOpenPage'))}</button>` : ''}
      ${n.seed ? '' : `<button class="tbtn" data-gs="graph">${ic('graph')}${esc(t('graphView'))}</button>`}
      ${n.seed ? '' : inLib
        ? `<span class="gsInLib">${ic('check')}${esc(t('citeInLib'))}</span>`
        : `<button class="tbtn" data-gs="add">${ic('plus')}${esc(t('citeAdd'))}</button>`}
    </div>
    ${it.abstract ? `<div class="gsAbsHead">${esc(t('abstract'))}</div><div class="gsAbs">${esc(it.abstract)}</div>` : ''}
  `;
}

function graphCacheKey(item){ return item.doi ? 'doi:'+normDoi(item.doi) : item.arxiv ? 'arxiv:'+item.arxiv : 'id:'+item.id; }
// lean, JSON-serialisable snapshot of a built graph (no Sets / full works)
function leanGraph(data){
  return { nodes: data.nodes.map(n=>({ id:n.id, item:n.item, year:n.year, cited:n.cited, seed:!!n.seed, label:n.label, seedRel:n.seedRel||null })), edges: data.edges };
}
// Generation guard: each open (or refetch) bumps the generation, and a build
// still in flight for an older generation must not touch state/UI afterwards —
// otherwise a slow build A can clobber a dialog that meanwhile shows graph B.
let graphGen = 0;
async function openGraphDialog(item, opts){
  opts = opts || {};
  const gen = ++graphGen;
  $('#graphHeadTitle').textContent = I18N[lang].graphTitle(item.title || t('newItem'));
  const svg = $('#graphSvg');
  svg.innerHTML = '';
  $('#graphStats').textContent = '';
  $('#graphCacheNote').textContent = '';
  graphState = null; graphSeedItem = item;
  renderGraphSide();
  $('#dlgGraph').showModal();

  lib.graphCache = lib.graphCache || {};
  const key = graphCacheKey(item);
  const cached = lib.graphCache[key];
  const cacheUsable = !!(cached && cached.v === GRAPH_CACHE_V && cached.nodes && cached.nodes.length >= 3);
  const useCached = ()=>({ nodes: cached.nodes.map(n=>Object.assign({}, n)), edges: cached.edges });
  let data, fromCache = false;
  if(cacheUsable && !opts.force && isFresh(cached.ts)){
    data = useCached();
    fromCache = true;
  }else{
    $('#graphLoading').textContent = t('graphLoading1');
    let err = null;
    try{
      data = await buildGraphData(item, msg=>{ if(gen===graphGen) $('#graphLoading').textContent = msg; });
    }catch(e){ console.error(e); err = e; }
    if(!err && data.nodes.length < 3) err = { tooFew:true };
    if(!err){
      data.edges = thinEdges(data.nodes, data.edges);
      // persist a lean snapshot so re-opening this graph costs no API calls —
      // even for a superseded build (the data is valid; only the UI is stale).
      // Skipped when too much is missing, so a later retry can heal the gap.
      const wanted = data.nodes.length - 1 + (data.fetchFailed||0);
      if(!data.fetchFailed || data.fetchFailed <= wanted * 0.25){
        lib.graphCache[key] = Object.assign({ ts: new Date().toISOString(), v: GRAPH_CACHE_V }, leanGraph(data));
        // cap the cache: keep the 40 most recent seeds
        const keys = Object.keys(lib.graphCache);
        if(keys.length > 40){
          keys.sort((a,b)=>(lib.graphCache[a].ts||'').localeCompare(lib.graphCache[b].ts||''));
          keys.slice(0, keys.length-40).forEach(k=>delete lib.graphCache[k]);
        }
        touch();
      }
    }
    if(gen !== graphGen) return; // superseded by a newer open / dialog close
    if(err){
      const msg = err.tooFew ? t('graphTooFew') : (err.rateLimited ? t('oaBudgetErr') : t('graphNotFound'));
      if(!cacheUsable){ $('#graphLoading').textContent = msg; return; }
      // keep showing the last good graph (even a stale one) instead of wiping it
      data = useCached();
      fromCache = true;
      showToast(msg);
    }else if(data.fetchFailed){
      showToast(I18N[lang].graphPartial(data.fetchFailed));
    }
  }
  $('#graphLoading').textContent = t('graphLoading3');
  await new Promise(r=>setTimeout(r, 20)); // let the message paint
  if(gen !== graphGen) return;
  // measure the canvas only now (after the build) — right after showModal()
  // the dialog may not have its final size yet. A tiny/hidden viewport gets
  // sane fallbacks; the ResizeObserver below re-layouts once real dims arrive.
  const wrap = $('#graphCanvasWrap');
  let W = wrap.clientWidth, H = wrap.clientHeight;
  if(W < 200 || H < 200){ W = 900; H = 600; }
  graphLayout(data.nodes, data.edges, W, H);
  graphState = { nodes:data.nodes, edges:data.edges, W, H, view:{x:0,y:0,k:1}, selIdx:null };
  fitGraphView();
  $('#graphLoading').textContent = '';
  $('#graphCacheNote').textContent = fromCache ? I18N[lang].graphCached(cached.ts.slice(0,10)) : '';
  renderGraph();
}
let graphSeedItem = null;
// closing the dialog abandons any in-flight build (state stays untouched)
$('#dlgGraph').addEventListener('close', ()=>{ graphGen++; });

// interactions: select, pan, zoom, node drag
(function(){
  const svg = $('#graphSvg');
  let pan = null, dragNode = null, moved = false;
  svg.addEventListener('pointerdown', (e)=>{
    if(!graphState) return;
    const nodeEl = e.target.closest('[data-node]');
    moved = false;
    if(nodeEl){
      dragNode = { i:+nodeEl.dataset.node, px:e.clientX, py:e.clientY };
    }else{
      pan = { x:e.clientX, y:e.clientY, vx:graphState.view.x, vy:graphState.view.y };
      svg.classList.add('panning');
    }
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', (e)=>{
    if(!graphState) return;
    if(dragNode){
      const k = graphState.view.k;
      const n = graphState.nodes[dragNode.i];
      n.x += (e.clientX - dragNode.px)/k;
      n.y += (e.clientY - dragNode.py)/k;
      dragNode.px = e.clientX; dragNode.py = e.clientY;
      moved = true;
      graphState.userView = true;
      renderGraph();
    }else if(pan){
      const k = graphState.view.k;
      graphState.view.x = pan.vx - (e.clientX - pan.x)/k;
      graphState.view.y = pan.vy - (e.clientY - pan.y)/k;
      moved = true;
      graphState.userView = true;
      updateGraphViewBox();
    }
  });
  // double-click detection lives here rather than on the dblclick event —
  // synthetic/touch input often produces two clicks without one
  let lastClick = { i:-1, t:0 };
  svg.addEventListener('pointerup', (e)=>{
    if(dragNode && !moved){
      const i = dragNode.i;
      const now = Date.now();
      if(lastClick.i === i && now - lastClick.t < 400){
        // double-click: rebuild the map around that paper (Connected Papers-style hop)
        lastClick = { i:-1, t:0 };
        const n = graphState.nodes[i];
        dragNode = null; pan = null;
        svg.classList.remove('panning');
        if(n && !n.seed) openGraphDialog(n.item);
        return;
      }
      lastClick = { i, t:now };
      // click: select node (or toggle off)
      graphState.selIdx = graphState.selIdx===dragNode.i ? null : dragNode.i;
      applyHighlight(); renderGraphSide();
    }else if(pan && !moved){
      graphState.selIdx = null;
      applyHighlight(); renderGraphSide();
    }
    dragNode = null; pan = null;
    svg.classList.remove('panning');
  });
  svg.addEventListener('wheel', (e)=>{
    if(!graphState) return;
    e.preventDefault();
    const v = graphState.view;
    const rect = svg.getBoundingClientRect();
    const mx = v.x + (e.clientX - rect.left)/v.k;
    const my = v.y + (e.clientY - rect.top)/v.k;
    const k2 = Math.max(0.3, Math.min(5, v.k * (e.deltaY < 0 ? 1.15 : 1/1.15)));
    v.x = mx - (e.clientX - rect.left)/k2;
    v.y = my - (e.clientY - rect.top)/k2;
    v.k = k2;
    graphState.userView = true;
    updateGraphViewBox();
  }, {passive:false});
  // Canvas resizes (window resized, or the dialog opened before the window had
  // its final size): update the px ↔ graph-unit mapping immediately, and — as
  // long as the user hasn't started arranging the view by hand — re-run the
  // layout against the new dimensions after the resize settles.
  let roTimer = null;
  new ResizeObserver(()=>{
    const g = graphState;
    if(!g) return;
    const wrap = $('#graphCanvasWrap');
    const W = wrap.clientWidth, H = wrap.clientHeight;
    if(W < 200 || H < 200 || (W===g.W && H===g.H)) return;
    g.W = W; g.H = H;
    updateGraphViewBox();
    if(g.userView) return; // keep a hand-arranged view intact
    clearTimeout(roTimer);
    roTimer = setTimeout(()=>{
      if(graphState !== g) return;
      graphLayout(g.nodes, g.edges, g.W, g.H);
      fitGraphView();
      renderGraph();
    }, 120);
  }).observe($('#graphCanvasWrap'));
})();
$('#btnGraphRelayout').addEventListener('click', ()=>{
  const g = graphState;
  if(!g) return;
  g.userView = false; // back to an automatic arrangement
  graphLayout(g.nodes, g.edges, g.W, g.H);
  fitGraphView();
  renderGraph();
});
$('#btnGraphFit').addEventListener('click', ()=>{
  if(!graphState) return;
  graphState.userView = false;
  fitGraphView();
  updateGraphViewBox();
});
$('#btnGraphLabels').addEventListener('click', ()=>{
  graphShowLabels = !graphShowLabels;
  renderGraph();
});
$('#btnGraphRefetch').addEventListener('click', ()=>{
  if(graphSeedItem) openGraphDialog(graphSeedItem, {force:true}); // bypass cache, hit OpenAlex
});
$('#graphSide').addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-gs]');
  const g = graphState;
  if(!btn || !g || g.selIdx==null) return;
  const it = g.nodes[g.selIdx].item;
  if(btn.dataset.gs==='open'){
    openExternalLink(it.doi ? 'https://doi.org/' + it.doi : it.url);
  }else if(btn.dataset.gs==='graph'){
    openGraphDialog(it); // hop the map to this paper (Connected Papers-style browsing)
  }else if(btn.dataset.gs==='add'){
    const clone = JSON.parse(JSON.stringify(it));
    clone.id = uid(); clone.citekey = '';
    clone.dateAdded = new Date().toISOString();
    const res = addItems([clone]);
    if(res.added){ showToast(t('addedFromCite') + ': ' + (clone.title||'')); renderAll(); showDuplicateReviewAfterAdd(res); }
    renderGraph(); renderGraphSide();
  }
});

// drag & drop PDF onto detail pane
const detailEl = $('#detail');
detailEl.addEventListener('dragover', (e)=>{
  if(selectedId && e.dataTransfer.types.includes('Files')){ e.preventDefault(); detailEl.classList.add('dragover'); }
});
detailEl.addEventListener('dragleave', ()=>detailEl.classList.remove('dragover'));
detailEl.addEventListener('drop', async (e)=>{
  detailEl.classList.remove('dragover');
  const it = lib.items.find(x=>x.id===selectedId);
  if(!it || !e.dataTransfer.files.length) return;
  e.preventDefault();
  await attachFiles(it, Array.from(e.dataTransfer.files));
});

// drag & drop PDF onto a list row / card
{
  let fileDropRow = null;
  const setFileDropRow = (el)=>{
    if(fileDropRow === el) return;
    if(fileDropRow) fileDropRow.classList.remove('fileDrop');
    fileDropRow = el;
    if(el) el.classList.add('fileDrop');
  };
  [['#itemRows','tr.row'], ['#itemCards','.cardRow']].forEach(([rootSel, rowSel])=>{
    const root = $(rootSel);
    root.addEventListener('dragover', (e)=>{
      if(!e.dataTransfer.types.includes('Files')){ setFileDropRow(null); return; }
      const row = e.target.closest(rowSel);
      if(row){ e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }
      setFileDropRow(row);
    });
    root.addEventListener('dragleave', (e)=>{ if(!(e.relatedTarget && root.contains(e.relatedTarget))) setFileDropRow(null); });
    root.addEventListener('drop', async (e)=>{
      const row = e.target.closest(rowSel);
      setFileDropRow(null);
      if(!row || !e.dataTransfer.files.length) return;
      e.preventDefault();
      const it = lib.items.find(x=>x.id===row.dataset.id);
      if(it) await attachFiles(it, Array.from(e.dataTransfer.files));
    });
  });
}

// add manually
$('#miAddManual').addEventListener('click', ()=>{
  closeMenus();
  const it = newItem();
  const res = addItems([it], {coll:true});
  if(res.added){ selectedId = it.id; renderAll(); showDuplicateReviewAfterAdd(res); }
});

// add by DOI/arXiv/title
function openAddIdDialog(prefill){
  closeMenus();
  $('#idError').className = 'errbox';
  $('#idInput').value = prefill || '';
  $('#idResults').innerHTML = '';
  $('#dlgAddId').showModal();
  $('#idInput').focus();
}
$('#miAddId').addEventListener('click', ()=> openAddIdDialog(''));
$('#idInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); $('#btnFetchId').click(); } });

async function addFetchedItem(it, errbox){
  const res = addItems([it], {coll:true});
  if(!res.added){
    if(errbox){ errbox.textContent = t('dupDoi'); errbox.className = 'errbox show'; }
    else showToast(t('dupDoi'), true); // search-bar add has no error box
    showDuplicateReviewAfterAdd(res);
    return false;
  }
  selectedId = it.id;
  $('#dlgAddId').close();
  renderAll();
  showDuplicateReviewAfterAdd(res);
  showToast(t('added') + ': ' + (it.title || it.doi || it.arxiv));
  // fill corresponding authors & cited-by from OpenAlex in the background so the
  // add feels instant; the list/detail refresh themselves when it resolves
  autoEnrichOnAdd(it).catch(e=>console.warn('auto-enrich failed', e));
  try{ await tryAutoAttachPdf(it); }
  catch(e){ console.warn(e); }
  return true;
}
function renderCandidates(items, errbox){
  const box = $('#idResults');
  if(!items.length){ errbox.textContent = t('searchNoHit'); errbox.className = 'errbox show'; return; }
  window.__cands = items;
  box.innerHTML = `<div class="hint">${esc(I18N[lang].searchResults(items.length))}</div>` +
    items.map((it,i)=>{
      const meta = [authorsShort(it.authors), it.journal, it.year].filter(Boolean).join(' · ');
      return `<div class="candItem" data-cand="${i}">
        <div style="flex:1;min-width:0">
          <div class="ct">${esc(it.title)}</div>
          <div class="cm">${esc(meta)}${it.doi?` · ${esc(it.doi)}`:''}</div>
        </div>
        <span class="cadd">${ic('plus')}${esc(t('addThis'))}</span>
      </div>`;
    }).join('');
}
$('#idResults').addEventListener('click', async (e)=>{
  const el = e.target.closest('[data-cand]');
  if(!el) return;
  const it = (window.__cands||[])[+el.dataset.cand];
  if(it){ await addFetchedItem(it, $('#idError')); } // corresponding authors are filled on manual OpenAlex refresh
});
$('#btnFetchId').addEventListener('click', async ()=>{
  const errbox = $('#idError');
  errbox.className = 'errbox';
  $('#idResults').innerHTML = '';
  const raw = $('#idInput').value.trim();
  if(!raw) return;
  const parsed = parseIdInput(raw);
  const btn = $('#btnFetchId');
  btn.disabled = true;
  try{
    if(parseScienceDirectUrl(raw)){
      btn.textContent = t('fetching');
      const it = await fetchScienceDirectPii(raw);
      renderCandidates([it], errbox);
    }else if(parsed){
      btn.textContent = t('fetching');
      const it = parsed.kind==='doi' ? await fetchCrossref(parsed.id) : await fetchArxiv(parsed.id);
      // Even when the input resolves to a single unambiguous paper (DOI/arXiv),
      // show it as a one-item candidate list so the user confirms before adding
      // — consistent with the multi-candidate title-search flow.
      renderCandidates([it], errbox);
    }else if(parseMdpiUrl(raw)){
      // MDPI article URL: derive the DOI (10.3390/…) from the path + ISSN, then fetch
      btn.textContent = t('fetching');
      $('#idResults').innerHTML = `<div class="candLoading">${esc(t('fetching'))}</div>`;
      const it = await fetchCrossref(await mdpiUrlToDoi(raw));
      renderCandidates([it], errbox);
    }else{
      // no DOI/arXiv → title search via CrossRef
      btn.textContent = t('searching');
      $('#idResults').innerHTML = `<div class="candLoading">${esc(t('searching'))}</div>`;
      const query = inputToSearchQuery(raw);
      const items = await searchCrossref(query);
      renderCandidates(items, errbox);
    }
  }catch(e){
    console.error(e);
    $('#idResults').innerHTML = '';
    errbox.textContent = t('fetchFail') + '\n' + e.message;
    errbox.className = 'errbox show';
  }
  btn.disabled = false; btn.textContent = t('fetchAdd');
});

// import
let importKind = 'bib';
const importKeywordsAsTags = localStorage.getItem('refshelf.importKeywordsAsTags') === '1';
$('#importKeywordsAsTags').checked = importKeywordsAsTags;
$('#importKeywordsAsTags').addEventListener('change', (e)=>{
  localStorage.setItem('refshelf.importKeywordsAsTags', e.target.checked ? '1' : '0');
});
$('#miImportBib').addEventListener('click', ()=>{ importKind='bib'; $('#fileImport').accept='.bib,.bibtex,text/plain'; $('#fileImport').click(); closeMenus(); });
$('#miImportRis').addEventListener('click', ()=>{ importKind='ris'; $('#fileImport').accept='.ris,text/plain'; $('#fileImport').click(); closeMenus(); });
$('#miImportCsv').addEventListener('click', ()=>{ importKind='csv'; $('#fileImport').accept='.csv,text/csv,text/plain'; $('#fileImport').click(); closeMenus(); });
$('#miImportJson').addEventListener('click', ()=>{ importKind='json'; $('#fileImport').accept='.json,application/json,text/plain'; $('#fileImport').click(); closeMenus(); });
$('#miImportRdf').addEventListener('click', ()=>{ importKind='rdf'; $('#fileImport').accept='.rdf,application/rdf+xml,text/xml,application/xml'; $('#fileImport').click(); closeMenus(); });
$('#fileImport').addEventListener('change', async ()=>{
  const file = $('#fileImport').files[0];
  $('#fileImport').value = '';
  if(!file) return;
  const text = await file.text();
  let items;
  const opts = {importKeywordsAsTags:$('#importKeywordsAsTags').checked};
  try{
    if(importKind==='bib') items = parseBibTeX(text, opts);
    else if(importKind==='ris') items = parseRIS(text);
    else if(importKind==='csv') items = resolveImportedCollections(parsePaperpileCsv(text, opts));
    else if(importKind==='json') items = resolveImportedCollections(parsePaperpileJson(text, opts));
    else if(importKind==='rdf') items = parseZoteroRdf(text, opts); // collections already resolved to ids
  }
  catch(e){ console.error(e); showToast(t('fetchFail') + ': ' + e.message, true); return; }
  const res = addItems(items);
  renderAll();
  showDuplicateReviewAfterAdd(res);
  if(!(res.duplicateCandidates && res.duplicateCandidates.length) && findFixSuggestions().length){
    openFixSuggestionsDialog();
  }
  showToast(I18N[lang].imported(res.added, res.skipped));
});

/* ---------------------------------------------------------------
   Browser-extension connector (Paper Library Connector)
   The extension's content script relays window.postMessage between
   this page and chrome.storage: we publish a library snapshot
   (DOI/arXiv keys + collection tree) and accept queued saves.
   The extension itself ships inside this file (CONNECTOR_FILES)
   and is downloaded as a ZIP from the manual.
---------------------------------------------------------------- */
// Minimal ZIP writer (store method, no compression) for the extension download.
function crc32Bytes(buf){
  let table = crc32Bytes.table;
  if(!table){
    table = crc32Bytes.table = new Int32Array(256);
    for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c = (c&1) ? (0xEDB88320 ^ (c>>>1)) : (c>>>1); table[n]=c; }
  }
  let c = ~0;
  for(let i=0;i<buf.length;i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return ~c >>> 0;
}
function buildZip(files){ // files: [{name, data:Uint8Array}]
  const enc = new TextEncoder();
  const num = (n, bytes)=>{ const a = new Uint8Array(bytes); for(let i=0;i<bytes;i++) a[i] = (n >>> (8*i)) & 0xFF; return a; };
  const parts = [], central = [];
  let offset = 0;
  for(const f of files){
    const name = enc.encode(f.name);
    const crc = crc32Bytes(f.data);
    const local = [num(0x04034b50,4), num(20,2), num(0,2), num(0,2), num(0,2), num(0,2),
      num(crc,4), num(f.data.length,4), num(f.data.length,4), num(name.length,2), num(0,2), name, f.data];
    central.push([num(0x02014b50,4), num(20,2), num(20,2), num(0,2), num(0,2), num(0,2), num(0,2),
      num(crc,4), num(f.data.length,4), num(f.data.length,4), num(name.length,2), num(0,2), num(0,2),
      num(0,2), num(0,2), num(0,4), num(offset,4), name]);
    for(const a of local){ parts.push(a); offset += a.length; }
  }
  const centralStart = offset;
  let centralSize = 0;
  for(const c of central) for(const a of c){ parts.push(a); centralSize += a.length; }
  parts.push(num(0x06054b50,4), num(0,2), num(0,2), num(files.length,2), num(files.length,2),
    num(centralSize,4), num(centralStart,4), num(0,2));
  return new Blob(parts, {type:'application/zip'});
}
function downloadConnectorZip(){
  const enc = new TextEncoder();
  const files = Object.entries(CONNECTOR_FILES).map(([name, f])=>({
    name: 'paper-library-connector/' + name,
    data: f.b64 ? Uint8Array.from(atob(f.b64), ch=>ch.charCodeAt(0)) : enc.encode(f.text),
  }));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(buildZip(files));
  a.download = 'paper-library-connector.zip';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
}
/* === CONNECTOR_FILES (auto-generated by sync-connector.py — do not edit by hand) === */
const CONNECTOR_FILES = {
  "README.md": {text: "# Paper Library Connector\n\nPaper Library 用の Chrome 拡張機能です。論文ページを開いたまま、ツールバーのボタン一つでライブラリに保存できます。\n\nA Chrome extension for Paper Library: save the paper you are viewing to your library with one toolbar click.\n\nこの ZIP は Paper Library 本体（index.html）のマニュアル「文献を追加する」からダウンロードできます。\n\n## インストール / Install\n\n1. ダウンロードした `paper-library-connector.zip` を解凍する\n2. Chrome で `chrome://extensions` を開く\n3. 右上の「デベロッパーモード」を ON にする\n4. 「パッケージ化されていない拡張機能を読み込む」で、解凍してできた `paper-library-connector` フォルダを選ぶ\n5. 拡張機能の「詳細」を開き、**「ファイルの URL へのアクセスを許可する」を ON にする**（`index.html` をファイルとして開いているライブラリと連携するために必須）\n\nEnglish: unzip `paper-library-connector.zip`, open `chrome://extensions`, enable *Developer mode*, click *Load unpacked* and select the unzipped `paper-library-connector` folder, then open the extension's *Details* page and enable **Allow access to file URLs**.\n\n## 使い方 / Usage\n\n- 論文ページ（出版社ページ・arXiv など）でツールバーの本のアイコンをクリック → 入れるコレクションにチェック →「保存」。何も選ばなければ「未分類」（どのコレクションにも入れない状態）で保存されます\n- 保存先ライブラリはポップアップ上部に表示されます。複数のライブラリを Paper Library で開いたことがある場合は、プルダウンで保存先を切り替えられます\n- 雑誌名はポップアップで略語表示されます（例：J. Am. Chem. Soc.）\n- すでにライブラリにある論文のページでは、アイコンに緑の「✓」バッジが付き、ポップアップに所属コレクションが表示されます\n- 送信待ちの論文はオレンジの「…」バッジで表示されます\n- 保存した文献は、Paper Library（`index.html`）をライブラリフォルダを開いた状態で表示した瞬間に自動で取り込まれます。メタデータは CrossRef / arXiv API から自動補完されます\n\n## 仕組み / How it works\n\n- `sniffer.js` — 各ページで DOI / arXiv ID を検出し、ライブラリのミラーと照合してバッジを表示\n- `popup.js` — ページから書誌メタデータ（`citation_*` メタタグ等）を抽出し、保存キューに追加\n- `bridge.js` — Paper Library のページと `chrome.storage` の橋渡し（ライブラリのスナップショット保存・キューの受け渡し）\n- ライブラリ本体（library.json・PDF）には一切触れません。取り込みはすべて Paper Library 本体が行います\n\n## 注意 / Notes\n\n- お試しモード（フォルダ未選択）のライブラリとは同期しません。フォルダを開いた状態の Paper Library とだけ連携します\n- Paper Library のタブを複数同時に開くと二重取り込みの原因になるため、1 つだけ開いてください\n"},
  "background.js": {text: "// Badge keeper: content scripts report whether the current page's paper is in\n// the library; we paint the toolbar badge for that tab.\n// '✓' = already in the library, '…' = queued, waiting for Paper Library to open.\nchrome.runtime.onMessage.addListener((msg, sender) => {\n  if (msg && msg.type === 'badge' && sender.tab && sender.tab.id != null) {\n    const text = msg.text || '';\n    chrome.action.setBadgeText({ tabId: sender.tab.id, text });\n    if (text) {\n      chrome.action.setBadgeBackgroundColor({\n        tabId: sender.tab.id,\n        color: text === '✓' ? '#16a34a' : '#d97706',\n      });\n      if (chrome.action.setBadgeTextColor) {\n        chrome.action.setBadgeTextColor({ tabId: sender.tab.id, color: '#ffffff' });\n      }\n    }\n  }\n});\n"},
  "bridge.js": {text: "// Runs on the Paper Library page (file:// or localhost): relays messages\n// between the page and chrome.storage — stores each library's snapshot under\n// its id, and feeds queued saves addressed to THIS library into the page.\n(function () {\n  if (!document.querySelector('meta[name=\"refshelf-app\"]')) return;\n\n  let myLibId = '';        // id of the library currently open in this page\n  let delivering = false;\n\n  function post(msg) {\n    window.postMessage(Object.assign({ source: 'refshelf-connector' }, msg), '*');\n  }\n\n  async function deliver() {\n    if (!myLibId || delivering) return;\n    const { pending = [] } = await chrome.storage.local.get('pending');\n    // items addressed to this library, plus legacy items with no target\n    const mine = pending.filter(p => !p.targetLib || p.targetLib === myLibId);\n    if (!mine.length) return;\n    delivering = true;\n    post({ action: 'import', items: mine });\n  }\n\n  window.addEventListener('message', async (e) => {\n    const d = e.data;\n    if (e.source !== window || !d || d.source !== 'refshelf-app') return;\n    if (d.action === 'snapshot' && d.snapshot) {\n      // Trial (in-memory) libraries are not mirrored and get no queued saves:\n      // anything imported there would evaporate with the session.\n      if (!d.snapshot.persistent) return;\n      const snap = d.snapshot;\n      myLibId = snap.libraryId || snap.libraryName || 'default';\n      const store = await chrome.storage.local.get(['libraries', 'activeLib']);\n      const libraries = store.libraries || {};\n      libraries[myLibId] = {\n        id: myLibId,\n        name: snap.libraryName || '',\n        collections: snap.collections || [],\n        saved: snap.saved || {},\n        url: location.href, // so the popup can offer to open this library\n        snapshotAt: Date.now(),\n      };\n      const patch = { libraries, appUrl: location.href };\n      // Default the active (destination) library to whatever is open, until the\n      // user picks a specific one in the popup.\n      if (!store.activeLib || !libraries[store.activeLib]) patch.activeLib = myLibId;\n      await chrome.storage.local.set(patch);\n      deliver();\n    } else if (d.action === 'import-result') {\n      const done = new Set((d.results || []).map(r => r.id));\n      const { pending = [] } = await chrome.storage.local.get('pending');\n      await chrome.storage.local.set({ pending: pending.filter(p => !done.has(p.id)) });\n      delivering = false;\n      deliver(); // pick up anything that arrived while we were importing\n    }\n  });\n\n  chrome.storage.onChanged.addListener((ch, area) => {\n    if (area === 'local' && ch.pending && (ch.pending.newValue || []).length) deliver();\n  });\n\n  post({ action: 'hello' });\n})();\n"},
  "icons/icon128.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADKElEQVR42u3dP2sTYRzA8b6DvAMzOfcFOKSbY1a3Gx2zuxQEcRDNIAhFJG9AqNAOHYSITuJwDgVxym6HFNQqIjzeEx61JE2T6vV6l3y+8KMlpH+S3yd3bZbb2JAkSZIkSZIkSZIkSZIkSZIkSSq5a1u77WI6xWwX0y9mWMw4fezU7fe9cfekU8ywmHH62C9mO93ettH5i94sppsWvZsWHJaYeL92DRa/mRYelph4v90Eoxu/dp0WHV/NWVp0XN5oyUUvmsFVQIiv6mIGSy5+0YwSjggji0eNph+2e1OH7VDBVAKh5MUvmtOnk16tTydp8aEGEyG0Gr74RdMB4PwZp1NNq4TFt9KheVyT5QNQBYSaLh6AMiGEENpxGrR4AP5z4n8eWVr+MPxtmJaf1XzxAJQx93cOx2GqJy9/NGHxAJQxjwYfpvcfnr36EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYA0B5Oky9P10+ddBjQEM0mVn++my7zkAy13O9fSCu+l7tc75WZvpa+oCIC57c97vm65H3CmmOwVktA4Afi94kBacpfu2S/qZwysEMCxjGcX3aCcgWQIyWACklgDaZS/4siCUAGBY5RLOANLe0FwIo0sEkNfy1acZCNl5EP4BQDwUZ57ZFYFwAQAWv0IQxhcAYPHL9Hj/uFdMXkyo+zx4fhRu3cnD9Zt7cwFs3fsabj/9HB6+qP/jSROf+95VLL7VlMWfBWHvzdEMgIP335u0+LMgtKoEkDf0iZrM24/fZgDE25r8mOJOqjzsN/rJen14MgMg3tb0x1XJ6aDpr/44OwfH4dPxzz/Lj5/H21YAQF4FgFV4oiYL33/3ZTIrsvzJALDm4xSw3pP7I3C9p+ffQK9+bwSt4/IrfSOoiW8Fr/Diq38rWJIkSZIkSZIkSZIkSVJN+wWzouI99lKbwgAAAABJRU5ErkJggg=="},
  "icons/icon16.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAe0lEQVR42mNgGD5AzmF9PBCvB+LzQPweiOuBmN+66RsI1wPxeyA+D8TrgTgemwH7gfg/Mg7LP/w/Z+GP/0AN6Hj/qAGD1YB+aNyDsD8Q30cyABT//tD0AML9KJonb/ngD8T70fGElY//z9j19T82OZAeggYQwP6DIw8BAHNcStl941x5AAAAAElFTkSuQmCC"},
  "icons/icon32.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4klEQVR42mNgGAWjYBRgAXIO6+WB2B6I64G4H4j3A/F7KG2PS5910zd7IN4PxO+hdD8Q10PF5Ym1HGTxfwIY5BB5JIv1oRb+J4DtqeUAMN534sX947f/3CfCYto44Nj51//P3f/zf9QBow4YdcCoA0YdMOoAWjsA1g5YD8T3iXAAqHZcj9QuINkBsMaIPg75eJhD0BwAsjgeR0NFn6hGyeQtH+SBuJ4YnNB05f65a+//X37053/uvE/3idUHsgOfA0AG/ScWn7z5HYxJ0QOyg2oOIBPfp0oUUIDlR5v9owAZAADCXwIiw7wc3wAAAABJRU5ErkJggg=="},
  "icons/icon48.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQElEQVR42u2ZMUoDQRiFc4O5gZ11DpBi0wTLtHbT2c4BLBYDViIBbT1BEFYw/TTp5wamsLQYBZV0f/4Jf5YUYiYzu6uQ9+ArFpbZ98Fu87bXQxAEQZBjycmwKhjNlEzFOMbLtYo9ZzD5VkzJeMYxlVxrpmiy8JSxzJKhPQQRE1HeSHHaw5KxzDRHgBIIsvqH4lpK0aF0LVCLEJELpBb/awHaJqc8BCAAAQhAAAIQgAAEIAABCEAAAhBIF/CyDVUyYBkZuPo792m5L1YgrBR6Z3Lph0FLNqNShi673Y+6Wu2UCPpfBLwUVK0Xup+/FylcPryORxcLe3r2XAsMr7/o/O7TXs0+xqnnHlJcMY6hHG4e32qB26e8s4TQScUImAYetsG9rDY0dV7o1qlAC5jOXqEWiHuFcj/itsDfGQRB/mfWC5TjUOc+S18AAAAASUVORK5CYII="},
  "manifest.json": {text: "{\n  \"manifest_version\": 3,\n  \"name\": \"Paper Library Connector\",\n  \"version\": \"1.0\",\n  \"description\": \"Save the paper you are viewing to Paper Library and see at a glance whether it is already in your library.\",\n  \"icons\": {\n    \"16\": \"icons/icon16.png\",\n    \"32\": \"icons/icon32.png\",\n    \"48\": \"icons/icon48.png\",\n    \"128\": \"icons/icon128.png\"\n  },\n  \"action\": {\n    \"default_popup\": \"popup.html\",\n    \"default_icon\": {\n      \"16\": \"icons/icon16.png\",\n      \"32\": \"icons/icon32.png\"\n    }\n  },\n  \"background\": {\n    \"service_worker\": \"background.js\"\n  },\n  \"permissions\": [\"storage\", \"scripting\", \"activeTab\", \"tabs\"],\n  \"content_scripts\": [\n    {\n      \"matches\": [\"http://*/*\", \"https://*/*\"],\n      \"js\": [\"sniffer.js\"],\n      \"run_at\": \"document_idle\"\n    },\n    {\n      \"matches\": [\"file:///*\", \"http://localhost/*\", \"http://127.0.0.1/*\"],\n      \"js\": [\"bridge.js\"],\n      \"run_at\": \"document_idle\"\n    }\n  ]\n}\n"},
  "popup.html": {text: "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n<style>\n  :root{\n    --bg:#ffffff; --bg2:#f5f6f8; --border:#dcdfe4; --text:#1f2328; --text2:#59636e;\n    --accent:#2563eb; --accent-soft:#eaf1fe; --green:#16a34a; --green-soft:#e7f6ec; --amber:#d97706; --amber-soft:#fdf1e0;\n  }\n  @media (prefers-color-scheme: dark){\n    :root{\n      --bg:#1c2128; --bg2:#22272e; --border:#3a4048; --text:#e6e8eb; --text2:#9aa4af;\n      --accent:#6ba1f7; --accent-soft:#263a5c; --green:#3fbf6f; --green-soft:#1f3a2a; --amber:#e8a44a; --amber-soft:#3d3020;\n    }\n  }\n  html,body{margin:0; padding:0}\n  body{\n    width:340px; background:var(--bg); color:var(--text);\n    font:13px/1.5 -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Hiragino Sans\", \"Noto Sans JP\", sans-serif;\n  }\n  header{display:flex; align-items:center; gap:8px; padding:10px 14px; border-bottom:1px solid var(--border)}\n  header img{width:18px; height:18px}\n  header .name{font-weight:600; font-size:13px}\n  header .libname{margin-left:auto; font-size:11px; color:var(--text2); max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}\n  #body{padding:12px 14px}\n  #paperTitle{font-weight:600; font-size:13.5px; line-height:1.45; margin:0 0 3px}\n  #paperMeta{font-size:11.5px; color:var(--text2); margin:0 0 10px; overflow-wrap:break-word}\n  .chip{\n    display:inline-flex; align-items:center; gap:5px; padding:2px 9px; border-radius:999px;\n    font-size:11.5px; font-weight:600; margin:0 0 10px;\n  }\n  .chip.saved{background:var(--green-soft); color:var(--green)}\n  .chip.queued{background:var(--amber-soft); color:var(--amber)}\n  .chip.new{background:var(--accent-soft); color:var(--accent)}\n  #savedFolders{font-size:11.5px; color:var(--text2); margin:-6px 0 10px}\n  #destLib{\n    font-size:11.5px; color:var(--text2); background:var(--bg2);\n    border:1px solid var(--border); border-radius:8px; padding:6px 9px; margin:0 0 10px;\n  }\n  #destLib b{color:var(--text); font-weight:600}\n  #destLib .libRow{display:flex; align-items:center; gap:6px}\n  #destLib select{\n    flex:1; min-width:0; font:inherit; font-size:12px; color:var(--text);\n    background:var(--bg); border:1px solid var(--border); border-radius:6px; padding:3px 6px;\n  }\n  .sectionLabel{font-size:11px; font-weight:600; color:var(--text2); margin:0 0 5px; text-transform:none}\n  #folders{\n    max-height:180px; overflow-y:auto; border:1px solid var(--border); border-radius:8px;\n    padding:5px 4px; margin-bottom:10px; background:var(--bg2);\n  }\n  #folders label{display:flex; align-items:center; gap:7px; padding:3px 8px; border-radius:6px; cursor:pointer}\n  #folders label:hover{background:var(--accent-soft)}\n  #folders input{margin:0; accent-color:var(--accent)}\n  #folders .none{color:var(--text2); font-size:11.5px; padding:4px 8px}\n  button#save{\n    width:100%; padding:8px 0; border:none; border-radius:8px; background:var(--accent); color:#fff;\n    font-size:13px; font-weight:600; cursor:pointer;\n  }\n  button#save:hover{filter:brightness(1.07)}\n  button#save:disabled{opacity:.5; cursor:default}\n  #note{font-size:11.5px; color:var(--text2); margin:8px 0 0; line-height:1.5}\n  #note.ok{color:var(--green)}\n  #note button{\n    margin-top:6px; padding:5px 10px; border:1px solid var(--accent); border-radius:7px;\n    background:var(--accent-soft); color:var(--accent); font-size:12px; font-weight:600; cursor:pointer;\n  }\n  #note button:hover{filter:brightness(1.03)}\n  #warn{font-size:11.5px; color:var(--amber); margin:0 0 10px; line-height:1.5}\n<\/style>\n<\/head>\n<body>\n<header>\n  <img src=\"icons/icon32.png\" alt=\"\">\n  <span class=\"name\">Paper Library Connector<\/span>\n<\/header>\n<div id=\"body\">\n  <div id=\"status\"><\/div>\n  <p id=\"paperTitle\"><\/p>\n  <p id=\"paperMeta\"><\/p>\n  <div id=\"savedFolders\"><\/div>\n  <div id=\"warn\" style=\"display:none\"><\/div>\n  <div id=\"destLib\" style=\"display:none\"><\/div>\n  <div class=\"sectionLabel\" id=\"foldersLabel\"><\/div>\n  <div id=\"folders\"><\/div>\n  <button id=\"save\"><\/button>\n  <p id=\"note\"><\/p>\n<\/div>\n<script src=\"popup.js\"><\/script>\n<\/body>\n<\/html>\n"},
  "popup.js": {text: "// Popup: extracts the paper on the active tab, shows saved/queued status and\n// the collection tree for the chosen destination library, and queues the save.\n\nconst JA = (navigator.language || '').toLowerCase().startsWith('ja');\nconst T = JA ? {\n  saved: '✓ ライブラリに保存済み',\n  queued: '… 取り込み待ち',\n  notSaved: '未登録',\n  noPaper: 'このページから論文情報を見つけられませんでした。DOI 付きの論文ページで試してください。',\n  savedIn: (names) => `所属コレクション: ${names}`,\n  savedNoFolder: '所属コレクション: なし（未分類）',\n  destLib: '保存先ライブラリ',\n  folders: '入れるコレクション（複数選択可）',\n  noFolders: 'コレクションはまだありません（未分類として保存されます）',\n  saveRoot: 'コレクションに入れずに保存（未分類）',\n  saveTo: (names) => `「${names}」に保存`,\n  addTo: (names) => `「${names}」に追加`,\n  uncat: '未分類',\n  openApp: 'Paper Library を開いて取り込む',\n  // after a save\n  doneOpen: (dest) => `保存しました → ${dest}。開いている Paper Library に取り込まれます。`,\n  doneClosed: (dest) => `保存しました → ${dest}。下のボタンを押すか、次に Paper Library を開くと取り込まれます。`,\n  doneNoUrl: (dest) => `保存しました → ${dest}。次に Paper Library を開くと取り込まれます。`,\n  // when the paper is already queued (popup reopened)\n  pendingOpen: 'この論文は取り込み待ちです。開いている Paper Library に取り込まれます。',\n  pendingClosed: 'この論文は取り込み待ちです。下のボタンを押すか、次に Paper Library を開くと取り込まれます。',\n  pendingNoUrl: 'この論文は取り込み待ちです。次に Paper Library を開くと取り込まれます。',\n  needSync: 'まだライブラリと同期していません。Paper Library をライブラリフォルダを開いた状態で一度表示すると、保存先ライブラリ・コレクション一覧・保存済み判定が使えるようになります（保存自体は今でも可能です）。',\n  restricted: 'このページでは拡張機能が動作できません。',\n} : {\n  saved: '✓ In your library',\n  queued: '… Pending import',\n  notSaved: 'Not in library',\n  noPaper: 'Could not find paper metadata on this page. Try a paper page with a DOI.',\n  savedIn: (names) => `In collections: ${names}`,\n  savedNoFolder: 'In collections: none (uncategorized)',\n  destLib: 'Destination library',\n  folders: 'Put in collections (multi-select)',\n  noFolders: 'No collections yet (saved as uncategorized)',\n  saveRoot: 'Save without a collection (uncategorized)',\n  saveTo: (names) => `Save to “${names}”`,\n  addTo: (names) => `Add to “${names}”`,\n  uncat: 'uncategorized',\n  openApp: 'Open Paper Library to import',\n  doneOpen: (dest) => `Saved → ${dest}. Importing into the open Paper Library.`,\n  doneClosed: (dest) => `Saved → ${dest}. Press the button below, or it imports next time you open Paper Library.`,\n  doneNoUrl: (dest) => `Saved → ${dest}. It imports next time you open Paper Library.`,\n  pendingOpen: 'This paper is pending import. It will be imported into the open Paper Library.',\n  pendingClosed: 'This paper is pending import. Press the button below, or it imports next time you open Paper Library.',\n  pendingNoUrl: 'This paper is pending import. It imports next time you open Paper Library.',\n  needSync: 'Not synced with your library yet. Open Paper Library once (with your library folder open) to enable the destination-library picker, collection list, and saved-state checks. Saving still works now.',\n  restricted: 'The extension cannot run on this page.',\n};\n\nconst DOI_RE = /10\\.\\d{4,9}\\/[^\\s\"'<>&]+/;\n\n// A few common journals for an instant, offline abbreviation; anything else is\n// refined from CrossRef's short-container-title once it responds.\nconst ABBREV = {\n  'journal of the american chemical society': 'J. Am. Chem. Soc.',\n  'angewandte chemie international edition': 'Angew. Chem. Int. Ed.',\n  'angewandte chemie': 'Angew. Chem.',\n  'chemical science': 'Chem. Sci.',\n  'chemical communications': 'Chem. Commun.',\n  'chemical reviews': 'Chem. Rev.',\n  'chemistry - a european journal': 'Chem. Eur. J.',\n  'chemistry a european journal': 'Chem. Eur. J.',\n  'nature': 'Nature',\n  'nature chemistry': 'Nat. Chem.',\n  'nature communications': 'Nat. Commun.',\n  'nature materials': 'Nat. Mater.',\n  'science': 'Science',\n  'journal of organic chemistry': 'J. Org. Chem.',\n  'organic letters': 'Org. Lett.',\n  'organometallics': 'Organometallics',\n  'inorganic chemistry': 'Inorg. Chem.',\n  'dalton transactions': 'Dalton Trans.',\n  'journal of physical chemistry a': 'J. Phys. Chem. A',\n  'journal of physical chemistry b': 'J. Phys. Chem. B',\n  'journal of physical chemistry c': 'J. Phys. Chem. C',\n  'journal of physical chemistry letters': 'J. Phys. Chem. Lett.',\n  'journal of chemical physics': 'J. Chem. Phys.',\n  'physical review letters': 'Phys. Rev. Lett.',\n  'physical review b': 'Phys. Rev. B',\n  'proceedings of the national academy of sciences': 'Proc. Natl. Acad. Sci. U. S. A.',\n  'advanced materials': 'Adv. Mater.',\n  'acs nano': 'ACS Nano',\n  'journal of the chemical society': 'J. Chem. Soc.',\n};\nfunction abbreviate(journal, journalAbbr) {\n  if (journalAbbr) return journalAbbr;\n  const key = String(journal || '').toLowerCase().replace(/^the\\s+/, '').replace(/[.:]/g, '').replace(/\\s+/g, ' ').trim();\n  return ABBREV[key] || '';\n}\nasync function fetchCrossrefAbbrev(doi) {\n  try {\n    const r = await fetch('https://api.crossref.org/works/' + encodeURIComponent(doi) + '?select=short-container-title');\n    if (!r.ok) return '';\n    const m = (await r.json()).message || {};\n    return (m['short-container-title'] && m['short-container-title'][0]) || '';\n  } catch (e) { return ''; }\n}\n\n// ACS-style author list: \"Family, F. M.\" joined by \"; \" (matches the app).\nfunction acsAuthors(authors) {\n  return (authors || []).map(a => {\n    const s = String(a).trim();\n    if (!s) return '';\n    let family, given;\n    if (s.includes(',')) { const p = s.split(','); family = p[0].trim(); given = p.slice(1).join(',').trim(); }\n    else { const p = s.split(/\\s+/); family = p.pop() || ''; given = p.join(' '); }\n    const ini = given.split(/[\\s.\\-]+/).filter(Boolean).map(w => w[0].toUpperCase() + '.').join(' ');\n    return ini ? `${family}, ${ini}` : family;\n  }).filter(Boolean);\n}\n// ACS-style meta line: \"Doe, J.; Smith, A. B. Chem. Sci. 2026\" (no DOI).\nfunction acsMetaLine(authors, venue, year, cap) {\n  const names = acsAuthors(authors);\n  let auth = '';\n  if (names.length) {\n    const many = cap && names.length > cap;\n    auth = (many ? names.slice(0, cap) : names).join('; ');\n    if (many) auth += ' et al.';\n    if (!/\\.$/.test(auth)) auth += '.'; // period before the venue\n  }\n  return [auth, venue, year].filter(Boolean).join(' ');\n}\n\n// Injected into the page — must be self-contained.\nfunction extractPageMetadata() {\n  const doiRe = /10\\.\\d{4,9}\\/[^\\s\"'<>&]+/;\n  const one = (n) => {\n    const el = document.querySelector(`meta[name=\"${n}\" i], meta[property=\"${n}\" i]`);\n    return el && el.content ? el.content.trim() : '';\n  };\n  const all = (n) => Array.from(document.querySelectorAll(`meta[name=\"${n}\" i]`))\n    .map(e => (e.content || '').trim()).filter(Boolean);\n  let doi = '';\n  for (const n of ['citation_doi', 'dc.identifier', 'dc.identifier.doi', 'prism.doi', 'doi']) {\n    const m = one(n).match(doiRe);\n    if (m) { doi = m[0]; break; }\n  }\n  if (!doi) {\n    try {\n      const m = decodeURIComponent(location.href).match(doiRe);\n      if (m) doi = m[0].replace(/[.,;)\\]]+$/, '');\n    } catch (e) { /* malformed escape */ }\n  }\n  if (!doi) {\n    const a = document.querySelector('a[href*=\"doi.org/10.\"]');\n    if (a) {\n      const m = decodeURIComponent(a.href).match(doiRe);\n      if (m) doi = m[0];\n    }\n  }\n  let arxiv = one('citation_arxiv_id');\n  if (!arxiv) {\n    const m = location.href.match(/arxiv\\.org\\/(?:abs|pdf)\\/([a-z\\-]+(?:\\.[A-Z]{2})?\\/\\d{7}|\\d{4}\\.\\d{4,5})/i);\n    if (m) arxiv = m[1];\n  }\n  if (!arxiv && doi) {\n    const m = doi.match(/^10\\.48550\\/arxiv\\.(.+)$/i);\n    if (m) { arxiv = m[1]; doi = ''; }\n  }\n  const yr = (one('citation_publication_date') || one('citation_date') ||\n    one('citation_online_date') || one('prism.publicationdate')).match(/\\d{4}/);\n  return {\n    url: location.href.replace(/#.*$/, ''),\n    doi, arxiv,\n    title: one('citation_title') || one('og:title') || document.title || '',\n    authors: all('citation_author'),\n    journal: one('citation_journal_title') || one('og:site_name') || '',\n    journalAbbr: one('citation_journal_abbrev') || '',\n    year: yr ? yr[0] : '',\n    abstract: one('citation_abstract') || one('dcterms.abstract') || one('dc.description') || '',\n  };\n}\n\n// Fallback when scripting is blocked (PDF viewer, chrome:// pages…).\nfunction metaFromUrl(url, title) {\n  const out = { url: String(url || ''), doi: '', arxiv: '', title: String(title || ''), authors: [], journal: '', journalAbbr: '', year: '', abstract: '' };\n  try {\n    const dec = decodeURIComponent(out.url);\n    const a = dec.match(/arxiv\\.org\\/(?:abs|pdf)\\/([a-z\\-]+(?:\\.[A-Z]{2})?\\/\\d{7}|\\d{4}\\.\\d{4,5})/i);\n    if (a) out.arxiv = a[1];\n    else {\n      const m = dec.match(DOI_RE);\n      if (m) out.doi = m[0].replace(/[.,;)\\]]+$/, '');\n    }\n  } catch (e) { /* ignore */ }\n  return out;\n}\n\nfunction normKeys(meta) {\n  return {\n    doiKey: meta.doi ? 'doi:' + meta.doi.toLowerCase() : '',\n    arxivKey: meta.arxiv ? 'arxiv:' + String(meta.arxiv).toLowerCase().replace(/v\\d+$/, '') : '',\n  };\n}\n\nfunction folderTree(collections) {\n  const byParent = new Map();\n  (collections || []).forEach(c => {\n    const k = c.parent || '';\n    if (!byParent.has(k)) byParent.set(k, []);\n    byParent.get(k).push(c);\n  });\n  for (const arr of byParent.values()) arr.sort((a, b) => a.name.localeCompare(b.name, JA ? 'ja' : 'en'));\n  const out = [];\n  (function walk(parent, depth) {\n    (byParent.get(parent) || []).forEach(c => {\n      out.push({ id: c.id, name: c.name, depth });\n      walk(c.id, depth + 1);\n    });\n  })('', 0);\n  return out;\n}\n\nconst $ = (s) => document.querySelector(s);\nfunction esc(s) {\n  return String(s).replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' }[c]));\n}\n\nasync function init() {\n  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });\n  let meta = null;\n  if (tab && /^(https?|file):/.test(tab.url || '')) {\n    try {\n      const res = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractPageMetadata });\n      meta = res && res[0] && res[0].result;\n    } catch (e) { /* injection blocked (PDF viewer etc.) */ }\n  }\n  if (!meta) meta = metaFromUrl(tab && tab.url, tab && tab.title);\n\n  const { doiKey, arxivKey } = normKeys(meta);\n  const identifiable = !!(meta.doi || meta.arxiv || meta.title);\n\n  // ---- title + ACS-style meta line (authors, journal abbrev, year; no DOI) ----\n  const venueOf = (journal) => journal || (meta.arxiv ? 'arXiv:' + meta.arxiv : '');\n  const renderMeta = (journal) => {\n    $('#paperMeta').textContent = acsMetaLine(meta.authors, venueOf(journal), meta.year, 10);\n  };\n  $('#paperTitle').textContent = meta.title || meta.doi || meta.arxiv || '';\n  const abbr = abbreviate(meta.journal, meta.journalAbbr);\n  renderMeta(abbr || meta.journal);\n  if (!abbr && meta.doi && meta.journal) {\n    fetchCrossrefAbbrev(meta.doi).then(a => { if (a) renderMeta(a); });\n  }\n\n  // ---- load libraries (with fallback from the old single-snapshot shape) ----\n  let { libraries = {}, activeLib, pending = [], appUrl = '' } =\n    await chrome.storage.local.get(['libraries', 'activeLib', 'pending', 'appUrl']);\n  if (!Object.keys(libraries).length) {\n    const { snapshot } = await chrome.storage.local.get('snapshot');\n    if (snapshot && snapshot.persistent) {\n      const id = snapshot.libraryId || snapshot.libraryName || 'default';\n      libraries = { [id]: { id, name: snapshot.libraryName || '', collections: snapshot.collections || [], saved: snapshot.saved || {} } };\n      if (!activeLib) activeLib = id;\n    }\n  }\n  const libIds = Object.keys(libraries);\n  if (!activeLib || !libraries[activeLib]) activeLib = libIds[0];\n  const currentLib = () => libraries[activeLib] || null;\n\n  // ---- \"open Paper Library to import\" helpers ----\n  // The library folder can only be written by the Paper Library page (browser\n  // security — an extension can't write to your chosen folder). So a save is\n  // captured here and flushed when the page is open; offer to open it.\n  async function appTabState() {\n    const url = (currentLib() && currentLib().url) || appUrl || '';\n    if (!url) return { url: '', open: false };\n    try {\n      const base = url.split('#')[0];\n      const tabs = await chrome.tabs.query({});\n      return { url, open: tabs.some(t => t.url && t.url.split('#')[0] === base) };\n    } catch (e) { return { url, open: false }; }\n  }\n  function setNote(text, url) {\n    $('#note').className = 'ok';\n    $('#note').textContent = text;\n    if (url) {\n      const b = document.createElement('button');\n      b.textContent = T.openApp;\n      b.addEventListener('click', () => { chrome.tabs.create({ url }); window.close(); });\n      $('#note').appendChild(document.createElement('br'));\n      $('#note').appendChild(b);\n    }\n  }\n  async function showImportHint(msgOpen, msgClosed, msgNoUrl) {\n    const { url, open } = await appTabState();\n    if (open) setNote(msgOpen, '');\n    else if (url) setNote(msgClosed, url);\n    else setNote(msgNoUrl, '');\n  }\n\n  if (!libIds.length) { $('#warn').style.display = 'block'; $('#warn').textContent = T.needSync; }\n\n  // ---- destination-library picker ----\n  const renderDestLib = () => {\n    if (!libIds.length) { $('#destLib').style.display = 'none'; return; }\n    $('#destLib').style.display = 'block';\n    if (libIds.length === 1) {\n      $('#destLib').innerHTML = esc(T.destLib) + ': <b>' + esc(currentLib().name || activeLib) + '<\/b>';\n      return;\n    }\n    const opts = libIds.map(id =>\n      `<option value=\"${esc(id)}\"${id === activeLib ? ' selected' : ''}>${esc(libraries[id].name || id)}<\/option>`).join('');\n    $('#destLib').innerHTML = `<div class=\"libRow\"><span>${esc(T.destLib)}:<\/span><select id=\"libSel\">${opts}<\/select><\/div>`;\n    $('#libSel').addEventListener('change', async (e) => {\n      activeLib = e.target.value;\n      await chrome.storage.local.set({ activeLib });\n      renderForLibrary(); // collections/saved-state differ per library\n    });\n  };\n\n  // ---- per-library section (status, collections, save button) ----\n  const collName = (id) => {\n    const lib = currentLib();\n    const c = lib && (lib.collections || []).find(x => x.id === id);\n    return c ? c.name : '';\n  };\n  const btn = $('#save');\n  const checkedNames = () => Array.from(document.querySelectorAll('#folders input:checked'))\n    .map(el => collName(el.value)).filter(Boolean);\n\n  function renderForLibrary() {\n    const lib = currentLib();\n    const saved = (lib && lib.saved) || {};\n    const savedColls = (doiKey && saved[doiKey]) || (arxivKey && saved[arxivKey]) || null;\n    const isQueued = pending.some(p => {\n      const k = normKeys(p);\n      return (doiKey && k.doiKey === doiKey) || (arxivKey && k.arxivKey === arxivKey);\n    });\n\n    // status chip\n    $('#savedFolders').textContent = '';\n    if (savedColls) {\n      $('#status').innerHTML = `<span class=\"chip saved\">${esc(T.saved)}<\/span>`;\n      const names = (savedColls || []).map(collName).filter(Boolean);\n      $('#savedFolders').textContent = names.length ? T.savedIn(names.join(', ')) : T.savedNoFolder;\n    } else if (isQueued) {\n      $('#status').innerHTML = `<span class=\"chip queued\">${esc(T.queued)}<\/span>`;\n    } else if (identifiable) {\n      $('#status').innerHTML = `<span class=\"chip new\">${esc(T.notSaved)}<\/span>`;\n    } else {\n      $('#status').innerHTML = '';\n    }\n\n    // collection list\n    $('#foldersLabel').textContent = T.folders;\n    const tree = folderTree(lib && lib.collections);\n    $('#folders').innerHTML = tree.length\n      ? tree.map(c => `<label style=\"padding-left:${8 + c.depth * 16}px\"><input type=\"checkbox\" value=\"${esc(c.id)}\">${esc(c.name)}<\/label>`).join('')\n      : `<div class=\"none\">${esc(T.noFolders)}<\/div>`;\n\n    // button label\n    btn.dataset.saved = savedColls ? '1' : '';\n    updateBtn();\n  }\n\n  const updateBtn = () => {\n    const names = checkedNames();\n    if (!names.length) btn.textContent = T.saveRoot;\n    else btn.textContent = (btn.dataset.saved ? T.addTo : T.saveTo)(names.join('・'));\n  };\n\n  renderDestLib();\n  renderForLibrary();\n\n  $('#folders').addEventListener('change', updateBtn);\n\n  if (!identifiable) {\n    btn.disabled = true;\n    $('#note').textContent = T.noPaper;\n    return;\n  }\n\n  btn.addEventListener('click', async () => {\n    btn.disabled = true;\n    const collIds = Array.from(document.querySelectorAll('#folders input:checked')).map(el => el.value);\n    const item = {\n      id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random().toString(36).slice(2),\n      doi: meta.doi || '', arxiv: meta.arxiv || '', url: meta.url || '',\n      title: meta.title || '', authors: meta.authors || [], journal: meta.journal || '',\n      year: meta.year || '', abstract: meta.abstract || '',\n      collections: collIds, targetLib: activeLib || '', savedAt: Date.now(),\n    };\n    const { pending: cur = [] } = await chrome.storage.local.get('pending');\n    cur.push(item);\n    await chrome.storage.local.set({ pending: cur });\n    const destColl = checkedNames().join('・') || T.uncat;\n    const libLabel = (currentLib() && currentLib().name) || '';\n    const dest = libLabel ? `${libLabel} / ${destColl}` : destColl;\n    $('#status').innerHTML = `<span class=\"chip queued\">${esc(T.queued)}<\/span>`;\n    await showImportHint(T.doneOpen(dest), T.doneClosed(dest), T.doneNoUrl(dest));\n  });\n\n  // if this paper is already queued (popup reopened before importing), explain\n  // how it gets into the library rather than looking stuck\n  const alreadyQueued = pending.some(p => {\n    const k = normKeys(p);\n    return (doiKey && k.doiKey === doiKey) || (arxivKey && k.arxivKey === arxivKey);\n  });\n  const savedNow = (() => {\n    const saved = (currentLib() && currentLib().saved) || {};\n    return (doiKey && saved[doiKey]) || (arxivKey && saved[arxivKey]) || null;\n  })();\n  if (alreadyQueued && !savedNow) {\n    showImportHint(T.pendingOpen, T.pendingClosed, T.pendingNoUrl);\n  }\n}\n\ninit().catch(e => {\n  console.error(e);\n  $('#note').textContent = T.restricted;\n});\n"},
  "sniffer.js": {text: "// Runs on every http(s) page: detects the paper's DOI / arXiv id and asks the\n// background worker to show an \"already in library\" badge for this tab.\n(function () {\n  if (document.querySelector('meta[name=\"refshelf-app\"]')) return; // the app itself\n\n  const DOI_RE = /10\\.\\d{4,9}\\/[^\\s\"'<>&]+/;\n\n  function meta(name) {\n    const el = document.querySelector(`meta[name=\"${name}\" i], meta[property=\"${name}\" i]`);\n    return el && el.content ? el.content.trim() : '';\n  }\n\n  function findIds() {\n    let doi = '';\n    for (const n of ['citation_doi', 'dc.identifier', 'dc.identifier.doi', 'prism.doi', 'doi']) {\n      const m = meta(n).match(DOI_RE);\n      if (m) { doi = m[0]; break; }\n    }\n    if (!doi) {\n      try {\n        const m = decodeURIComponent(location.href).match(DOI_RE);\n        if (m) doi = m[0].replace(/[.,;)\\]]+$/, '');\n      } catch (e) { /* malformed escape in URL */ }\n    }\n    if (!doi) {\n      const a = document.querySelector('a[href*=\"doi.org/10.\"]');\n      if (a) {\n        const m = decodeURIComponent(a.href).match(DOI_RE);\n        if (m) doi = m[0];\n      }\n    }\n    let arxiv = meta('citation_arxiv_id');\n    if (!arxiv) {\n      const m = location.href.match(/arxiv\\.org\\/(?:abs|pdf)\\/([a-z\\-]+(?:\\.[A-Z]{2})?\\/\\d{7}|\\d{4}\\.\\d{4,5})/i);\n      if (m) arxiv = m[1];\n    }\n    if (!arxiv && doi) {\n      const m = doi.match(/^10\\.48550\\/arxiv\\.(.+)$/i);\n      if (m) { arxiv = m[1]; doi = ''; }\n    }\n    return {\n      doi: doi.toLowerCase(),\n      arxiv: String(arxiv || '').toLowerCase().replace(/v\\d+$/, ''),\n    };\n  }\n\n  async function update() {\n    const { doi, arxiv } = findIds();\n    let text = '';\n    if (doi || arxiv) {\n      const { libraries = {}, activeLib, pending = [] } =\n        await chrome.storage.local.get(['libraries', 'activeLib', 'pending']);\n      // badge reflects the active (destination) library, matching the popup\n      const lib = libraries[activeLib] || Object.values(libraries)[0] || null;\n      const saved = (lib && lib.saved) || {};\n      const queued = pending.some(p =>\n        (doi && String(p.doi || '').toLowerCase() === doi) ||\n        (arxiv && String(p.arxiv || '').toLowerCase().replace(/v\\d+$/, '') === arxiv));\n      if ((doi && saved['doi:' + doi]) || (arxiv && saved['arxiv:' + arxiv])) text = '✓';\n      else if (queued) text = '…';\n    }\n    try { await chrome.runtime.sendMessage({ type: 'badge', text }); }\n    catch (e) { /* extension reloaded / worker unavailable */ }\n  }\n\n  chrome.storage.onChanged.addListener((ch, area) => {\n    if (area === 'local' && (ch.libraries || ch.activeLib || ch.pending)) update();\n  });\n  update();\n})();\n"},
};
/* === END CONNECTOR_FILES === */

/* ----------------------------------------------------------------
   Word add-in (Paper Library) — the Office add-in that adds a
   "Paper Library" ribbon tab to Word and inserts formatted citations.
   The add-in files ship inside this page (WORDADDIN_FILES) and are
   downloaded as a ZIP from the manual's "Word" tab.
   See paper-library-word-addin/README.md for installation details.
---------------------------------------------------------------- */
function downloadWordAddinZip(){
  const enc = new TextEncoder();
  const files = Object.entries(WORDADDIN_FILES).map(([name, f])=>({
    name: 'paper-library-word-addin/' + name,
    data: f.b64 ? Uint8Array.from(atob(f.b64), ch=>ch.charCodeAt(0)) : enc.encode(f.text),
  }));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(buildZip(files));
  a.download = 'paper-library-word-addin.zip';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
}
// End users only need the manifest — taskpane.html etc. are served from GitHub Pages.
function downloadWordManifest(){
  const f = WORDADDIN_FILES['manifest.xml'];
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([f.text], {type:'application/xml'}));
  a.download = 'manifest.xml';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
}
/* === WORDADDIN_FILES (auto-generated by sync-wordaddin.py — do not edit by hand) === */
const WORDADDIN_FILES = {
  "assets/icon-128.png": {b64: "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"},
  "assets/icon-16.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAAXnVPIAAAB1klEQVQ4EaWSwWsTQRTGf7Mzu5ukSVsxSC+1oPSq0KOeevDuQT34f/g/eVD/AkHwUMSDCrlYwaqlaBXERJPNbnaz4zcJCYo5mbfM8maY973v++YZr2CNiNaonZWuDeAWDB4/+8nDpwP6o5p223H9asr9W1s4F/HoqKD3seJX5mmncOdmg9s3lCiWAC/f5rx5XxCnlng05eRrRr8wbF1o8rw3wRhDXnhOi5rXJ9W/ANYaOh3H3cNNKm84/lxhIoPVOtiP2etafO15IjZxvOD9BwMbR7jU8eJ4QqsV8WMMOxej2eX+2DA5nzIcezbauufMEmEpweqw0bTs7yaUYpDmHhsbkiTi0nZNJzWEsmziBboKwOpBtF59mhJuxonl8o6l1TT0v8F5v9a5JMnUeCWDIEHdQqHXF3LrLIm6NdQd1CCMnOZuJYNIJoaiOUgYD+1VHEtkmkiSVngFOfsXA7MY5aN3JXnp6TQjRiX0zqbkUrPXdYgcV7ryw8JI3iQCvbarjWJm4vcRDCrLUACnGQzVKcMymMCXD1OKrGScVeRD5WPlw4oH97Y5PNiYA0gqLVEM5unZVSr6RlojTy4ZuQ4LGVy4mkI0ysSz2ZozWEqY8fmPX3BrrfgNKhuinbSAzWcAAAAASUVORK5CYII="},
  "assets/icon-32.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACPTkDJAAAFJUlEQVRYCe1Wy24cRRQ9XV09M7YzmSR27DixLIiDQkQiJAt5wWPDAimLrEBiifgExJYVX8ECCQnBMhskFoAUKQpCDq9EQOIIZBLijC1iOTgPz6tfnFM1PWZmDDKbZOOyyl3VXXXPuefeujVBzoYn2MwTxHbQewT2FLCDSZikOb5fauK7600sr8ZY30zR4buxEYPZIyWcfrqMV+dHMVEL+7ZuPMxw6VqM6ysp7qyneNTMEXHJ+H6D40cM5ucizJ+IYPu3IRg8hou/NPDmeyswoUFoAxgT+GwNOVbnPOTz3Iv78M4bBzg3+OCLJr78sQPyRJoAcZIhSQHtlEMap+wfv7sfCyejPuJDCmhXVA6h6iAwgQpQxSIkKU8C+PzbBs6cqKA8EuHCzzFsxI1JjjzMYWFgbe5AHQvutrQReF/+mwCX9YC1UoCBSJBMQAt0GMaSiJtzTKOVUuC81HqtsSSRpkIjITK3ZYOE5HZFQIydlwQ9OVvGwqkKjk1YjNDIVjvHzbUYXy+1OeY6okudkHGtjQV4gXGePmgwQkKtTo7VjQyXf43xx13qT8O7IhA4owYBPT1+tIRyyeDqcpuJGKA6GuCZmRJWaHipHstdp4ClIpO1AIdrBrfWMzzYypiAAWbGDc48ZVHneqkhdQbbUA5oiSWo2oWrDarhk1FSKikvXuu4b8oHkVRXZt/eyNk7lJoJRzxdMZd/Y1pQest96jvgM18Gm0IgfHnH5+RBi5lJixINNOMcdzZStBMlpfdIhBUChaLMNYerfDLR2xRojWvXH9AUT4Ic2BUBl2iUVAbffq2Kl5+rYPUvghK8ylowfSjEh181cOVW7AwqDyrMj2ePhnh9IcLd+5nLFYVgimH55kaM84s8ojqWwxEYVsB7RLlo+NOLW/iEXWddUkv2Er3LipPCNVJJZG+spnj/fCJdCJazFtBrhiI0PgQ+BwblZvgGXwnIn3VSIWUZVytqQNZ1wx9DEfDxFYDWqPCoiQj/Oc9d9ePY7CDBEAGB2oge81l4raf2ipgISR1ny3P0XjIM8porHQHlhZSQHeXL/yhEXQUExL+iJgjYmSe4U0UERYpdGa4mr/XO0i0Xc/eSyqhQMRz6Nth2UGBbboELVXF2XnO3ux8otXvHzzKqJNRxc02BV+M0d6fDOCV0UeyKgGLqc0DAQhChQgky6RJyOeHUUB2gOjpnbLabBw6Me7ebV2d77kfDCvD9P2Md8kjKuCPWTVCFJqB3Lk+IpHhLfiWbipBvSkpKL2VciHw+FF+L5xABMa+OhZibCnFsPHRnX4Qe8n6vb2a4fS9HcRJ46fVyQCSkzsQY+z6DUcY9y3I8auWsDaqS6Y4hGPo9ELNgSHkquWPThbR4M8VnP2U4ezrEIV5CV+oZFmYNTk0ZVPqv+54NciEhhaj3yg36CNxrAL+zprdY9ZospR2SUfaKlH5UxCowfDb4PebltElV5GVE1zNq326mSGP+GOGmVJ3r9Ez4rtNKEbEovXX2AF55frTHoo/ApWVKRg+VeFu8cwTWYQzbAuclo59mItXgt7Z++XCsGMcESDlpNVLEXFCQSHglx3yvub6t/dlmSAP88NFcj0BfDkSadQIaJqgAZZwgBZguIZEQARFx37lGQB32VpPe8lsihThPuMiPqQ4JKFEnan2Q/b8JBVS/7w3La2V0Sondk8IoDIplm6DFOxWcjKQUCnnvxpyrCvpx5p5SqcT4n3upiunxbRJ9Iejp8hgH/5Lrj4/BHoG/AazeWyomMWZgAAAAAElFTkSuQmCC"},
  "assets/icon-64.png": {b64: "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"},
  "assets/icon-80.png": {b64: "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"},
  "assets/logo-128.png": {b64: "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"},
  "assets/logo-16.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAAXnVPIAAAB1klEQVQ4EaWSwWsTQRTGf7Mzu5ukSVsxSC+1oPSq0KOeevDuQT34f/g/eVD/AkHwUMSDCrlYwaqlaBXERJPNbnaz4zcJCYo5mbfM8maY973v++YZr2CNiNaonZWuDeAWDB4/+8nDpwP6o5p223H9asr9W1s4F/HoqKD3seJX5mmncOdmg9s3lCiWAC/f5rx5XxCnlng05eRrRr8wbF1o8rw3wRhDXnhOi5rXJ9W/ANYaOh3H3cNNKm84/lxhIoPVOtiP2etafO15IjZxvOD9BwMbR7jU8eJ4QqsV8WMMOxej2eX+2DA5nzIcezbauufMEmEpweqw0bTs7yaUYpDmHhsbkiTi0nZNJzWEsmziBboKwOpBtF59mhJuxonl8o6l1TT0v8F5v9a5JMnUeCWDIEHdQqHXF3LrLIm6NdQd1CCMnOZuJYNIJoaiOUgYD+1VHEtkmkiSVngFOfsXA7MY5aN3JXnp6TQjRiX0zqbkUrPXdYgcV7ryw8JI3iQCvbarjWJm4vcRDCrLUACnGQzVKcMymMCXD1OKrGScVeRD5WPlw4oH97Y5PNiYA0gqLVEM5unZVSr6RlojTy4ZuQ4LGVy4mkI0ysSz2ZozWEqY8fmPX3BrrfgNKhuinbSAzWcAAAAASUVORK5CYII="},
  "assets/logo-32.png": {b64: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACPTkDJAAAFJUlEQVRYCe1Wy24cRRQ9XV09M7YzmSR27DixLIiDQkQiJAt5wWPDAimLrEBiifgExJYVX8ECCQnBMhskFoAUKQpCDq9EQOIIZBLijC1iOTgPz6tfnFM1PWZmDDKbZOOyyl3VXXXPuefeujVBzoYn2MwTxHbQewT2FLCDSZikOb5fauK7600sr8ZY30zR4buxEYPZIyWcfrqMV+dHMVEL+7ZuPMxw6VqM6ysp7qyneNTMEXHJ+H6D40cM5ucizJ+IYPu3IRg8hou/NPDmeyswoUFoAxgT+GwNOVbnPOTz3Iv78M4bBzg3+OCLJr78sQPyRJoAcZIhSQHtlEMap+wfv7sfCyejPuJDCmhXVA6h6iAwgQpQxSIkKU8C+PzbBs6cqKA8EuHCzzFsxI1JjjzMYWFgbe5AHQvutrQReF/+mwCX9YC1UoCBSJBMQAt0GMaSiJtzTKOVUuC81HqtsSSRpkIjITK3ZYOE5HZFQIydlwQ9OVvGwqkKjk1YjNDIVjvHzbUYXy+1OeY6okudkHGtjQV4gXGePmgwQkKtTo7VjQyXf43xx13qT8O7IhA4owYBPT1+tIRyyeDqcpuJGKA6GuCZmRJWaHipHstdp4ClIpO1AIdrBrfWMzzYypiAAWbGDc48ZVHneqkhdQbbUA5oiSWo2oWrDarhk1FSKikvXuu4b8oHkVRXZt/eyNk7lJoJRzxdMZd/Y1pQest96jvgM18Gm0IgfHnH5+RBi5lJixINNOMcdzZStBMlpfdIhBUChaLMNYerfDLR2xRojWvXH9AUT4Ic2BUBl2iUVAbffq2Kl5+rYPUvghK8ylowfSjEh181cOVW7AwqDyrMj2ePhnh9IcLd+5nLFYVgimH55kaM84s8ojqWwxEYVsB7RLlo+NOLW/iEXWddUkv2Er3LipPCNVJJZG+spnj/fCJdCJazFtBrhiI0PgQ+BwblZvgGXwnIn3VSIWUZVytqQNZ1wx9DEfDxFYDWqPCoiQj/Oc9d9ePY7CDBEAGB2oge81l4raf2ipgISR1ny3P0XjIM8porHQHlhZSQHeXL/yhEXQUExL+iJgjYmSe4U0UERYpdGa4mr/XO0i0Xc/eSyqhQMRz6Nth2UGBbboELVXF2XnO3ux8otXvHzzKqJNRxc02BV+M0d6fDOCV0UeyKgGLqc0DAQhChQgky6RJyOeHUUB2gOjpnbLabBw6Me7ebV2d77kfDCvD9P2Md8kjKuCPWTVCFJqB3Lk+IpHhLfiWbipBvSkpKL2VciHw+FF+L5xABMa+OhZibCnFsPHRnX4Qe8n6vb2a4fS9HcRJ46fVyQCSkzsQY+z6DUcY9y3I8auWsDaqS6Y4hGPo9ELNgSHkquWPThbR4M8VnP2U4ezrEIV5CV+oZFmYNTk0ZVPqv+54NciEhhaj3yg36CNxrAL+zprdY9ZospR2SUfaKlH5UxCowfDb4PebltElV5GVE1zNq326mSGP+GOGmVJ3r9Ez4rtNKEbEovXX2AF55frTHoo/ApWVKRg+VeFu8cwTWYQzbAuclo59mItXgt7Z++XCsGMcESDlpNVLEXFCQSHglx3yvub6t/dlmSAP88NFcj0BfDkSadQIaJqgAZZwgBZguIZEQARFx37lGQB32VpPe8lsihThPuMiPqQ4JKFEnan2Q/b8JBVS/7w3La2V0Sondk8IoDIplm6DFOxWcjKQUCnnvxpyrCvpx5p5SqcT4n3upiunxbRJ9Iejp8hgH/5Lrj4/BHoG/AazeWyomMWZgAAAAAElFTkSuQmCC"},
  "assets/logo-64.png": {b64: "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"},
  "assets/logo-80.png": {b64: "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"},
  "functions.html": {text: "<!DOCTYPE html>\n<html>\n<head><meta charset=\"UTF-8\"><script src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><\/script><\/head>\n<body>\n<!-- Required FunctionFile for the add-in commands. No custom ribbon functions are\n     used (the button opens the task pane directly), so this just initializes Office. -->\n<script>Office.onReady(function(){});<\/script>\n<\/body>\n<\/html>\n"},
  "manifest.xml": {text: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!--\n  Paper Library — Word add-in manifest (GitHub Pages / online version).\n\n  This is the file you sideload into Word. The add-in (taskpane.html, assets/…)\n  is served from GitHub Pages:\n    https://t-shiokawa1.github.io/Paper-Library/word-addin/\n  i.e. taskpane.html, functions.html and assets/ live in a \"word-addin\" folder\n  at the repository root.\n\n  To publish elsewhere, replace every\n    https://t-shiokawa1.github.io/Paper-Library/word-addin\n  below with your own HTTPS host (<AppDomain> is the origin only).\n-->\n<OfficeApp xmlns=\"http://schemas.microsoft.com/office/appforoffice/1.1\"\n           xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n           xmlns:bt=\"http://schemas.microsoft.com/office/officeappbasictypes/1.0\"\n           xmlns:ov=\"http://schemas.microsoft.com/office/taskpaneappversionoverrides\"\n           xsi:type=\"TaskPaneApp\">\n  <Id>e4bd1298-a84d-4249-b366-c20d396bc42e<\/Id>\n  <Version>1.0.1.0<\/Version>\n  <ProviderName>Paper Library<\/ProviderName>\n  <DefaultLocale>ja-JP<\/DefaultLocale>\n  <DisplayName DefaultValue=\"Paper Library\"/>\n  <Description DefaultValue=\"Paper Library の文献を検索して、引用文献を Word に挿入します。\"/>\n  <IconUrl DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/assets/logo-32.png\"/>\n  <HighResolutionIconUrl DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/assets/logo-80.png\"/>\n  <SupportUrl DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/\"/>\n  <AppDomains>\n    <AppDomain>https://t-shiokawa1.github.io<\/AppDomain>\n  <\/AppDomains>\n  <Hosts>\n    <Host Name=\"Document\"/>\n  <\/Hosts>\n  <DefaultSettings>\n    <SourceLocation DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/taskpane.html\"/>\n  <\/DefaultSettings>\n  <Permissions>ReadWriteDocument<\/Permissions>\n\n  <VersionOverrides xmlns=\"http://schemas.microsoft.com/office/taskpaneappversionoverrides\" xsi:type=\"VersionOverridesV1_0\">\n    <Hosts>\n      <Host xsi:type=\"Document\">\n        <DesktopFormFactor>\n          <GetStarted>\n            <Title resid=\"GetStarted.Title\"/>\n            <Description resid=\"GetStarted.Description\"/>\n            <LearnMoreUrl resid=\"Urls.Support\"/>\n          <\/GetStarted>\n          <FunctionFile resid=\"Urls.Functions\"/>\n          <ExtensionPoint xsi:type=\"PrimaryCommandSurface\">\n            <CustomTab id=\"PaperLibrary.Tab\">\n              <Label resid=\"Tab.Label\"/>\n              <Group id=\"PaperLibrary.Group\">\n                <Label resid=\"Group.Label\"/>\n                <Icon>\n                  <bt:Image size=\"16\" resid=\"Icon.16\"/>\n                  <bt:Image size=\"32\" resid=\"Icon.32\"/>\n                  <bt:Image size=\"80\" resid=\"Icon.80\"/>\n                <\/Icon>\n                <Control xsi:type=\"Button\" id=\"PaperLibrary.OpenBtn\">\n                  <Label resid=\"OpenBtn.Label\"/>\n                  <Supertip>\n                    <Title resid=\"OpenBtn.Label\"/>\n                    <Description resid=\"OpenBtn.Tip\"/>\n                  <\/Supertip>\n                  <Icon>\n                    <bt:Image size=\"16\" resid=\"Icon.16\"/>\n                    <bt:Image size=\"32\" resid=\"Icon.32\"/>\n                    <bt:Image size=\"80\" resid=\"Icon.80\"/>\n                  <\/Icon>\n                  <Action xsi:type=\"ShowTaskpane\">\n                    <TaskpaneId>PaperLibrary.Taskpane<\/TaskpaneId>\n                    <SourceLocation resid=\"Urls.Taskpane\"/>\n                  <\/Action>\n                <\/Control>\n              <\/Group>\n            <\/CustomTab>\n          <\/ExtensionPoint>\n        <\/DesktopFormFactor>\n      <\/Host>\n    <\/Hosts>\n\n    <Resources>\n      <bt:Images>\n        <bt:Image id=\"Icon.16\" DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/assets/logo-16.png\"/>\n        <bt:Image id=\"Icon.32\" DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/assets/logo-32.png\"/>\n        <bt:Image id=\"Icon.80\" DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/assets/logo-80.png\"/>\n      <\/bt:Images>\n      <bt:Urls>\n        <bt:Url id=\"Urls.Taskpane\" DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/taskpane.html\"/>\n        <bt:Url id=\"Urls.Functions\" DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/word-addin/functions.html\"/>\n        <bt:Url id=\"Urls.Support\" DefaultValue=\"https://t-shiokawa1.github.io/Paper-Library/\"/>\n      <\/bt:Urls>\n      <bt:ShortStrings>\n        <bt:String id=\"Tab.Label\" DefaultValue=\"Paper Library\"/>\n        <bt:String id=\"Group.Label\" DefaultValue=\"Paper Library\"/>\n        <bt:String id=\"OpenBtn.Label\" DefaultValue=\"文献を挿入\"/>\n        <bt:String id=\"GetStarted.Title\" DefaultValue=\"Paper Library へようこそ\"/>\n      <\/bt:ShortStrings>\n      <bt:LongStrings>\n        <bt:String id=\"OpenBtn.Tip\" DefaultValue=\"Paper Library の文献を検索し、引用文献をカーソル位置に挿入します。\"/>\n        <bt:String id=\"GetStarted.Description\" DefaultValue=\"リボンの「文献を挿入」を押すとパネルが開きます。library.json を読み込んで検索してください。\"/>\n      <\/bt:LongStrings>\n    <\/Resources>\n  <\/VersionOverrides>\n<\/OfficeApp>\n"},
  "taskpane.html": {text: "<!DOCTYPE html>\n<html lang=\"ja\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Paper Library<\/title>\n<script src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><\/script>\n<style>\n  :root{ --accent:#2563eb; --accent-soft:#eaf1ff; --border:#e2e6ee; --text:#1c2430; --text2:#5a6675; --text3:#8a94a3; --bg:#f6f8fb; }\n  *{box-sizing:border-box}\n  html,body{margin:0; height:100%; font-family:-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",sans-serif; color:var(--text); font-size:13px; background:#fff}\n  body{display:flex; flex-direction:column}\n  header{padding:10px 12px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:8px}\n  header .logo{width:24px;height:24px;flex:0 0 auto;display:block}\n  header .t{font-weight:700}\n  header .lib{margin-left:auto; font-size:11.5px; color:var(--text3); text-align:right; line-height:1.3}\n  header .langBtn{flex:0 0 auto; border:1px solid var(--border); background:#fff; color:var(--text2); border-radius:6px; padding:3px 9px; font-size:11.5px; cursor:pointer}\n  header .langBtn:hover{border-color:var(--accent); color:var(--accent)}\n  .controls{padding:8px 12px; border-bottom:1px solid var(--border); display:flex; flex-direction:column; gap:7px}\n  .subbar{padding:8px 12px; border-bottom:1px solid var(--border); display:flex; flex-direction:column; gap:7px; background:#fbfcff}\n  .groupHead{font-size:10px; font-weight:700; letter-spacing:.05em; color:var(--text3); text-transform:uppercase; margin-top:1px}\n  .row{display:flex; gap:6px; align-items:center; flex-wrap:wrap}\n  .row > label{font-size:11.5px; color:var(--text2)}\n  select, input[type=search], input[type=text]{ font:inherit; padding:5px 8px; border:1px solid var(--border); border-radius:6px; background:#fff; color:var(--text); outline:none; min-width:0 }\n  select:focus, input:focus{border-color:var(--accent)}\n  #q{flex:1}\n  .fields{display:flex; gap:8px; align-items:flex-end}\n  .field{flex:1 1 0; min-width:0; display:flex; flex-direction:column; gap:2px}\n  .field > label{font-size:11.5px; color:var(--text2)}\n  .field select{width:100%}\n  .btn{font:inherit; border:1px solid var(--accent); background:var(--accent); color:#fff; border-radius:6px; padding:5px 10px; cursor:pointer; font-weight:600; white-space:nowrap}\n  .btn:hover{filter:brightness(1.07)}\n  .btn.ghost{background:#fff; color:var(--accent)}\n  .btn.ghost:hover{background:var(--accent-soft)}\n  .btn:disabled{opacity:.5; cursor:default}\n  .libraryPicker{display:flex; align-items:center; width:100%; min-width:0; border:1px solid var(--accent); border-radius:6px; overflow:hidden; background:#fff; color:var(--accent);}\n  .libraryPicker .libNameBtn{font:inherit; border:0; background:#fff; color:var(--accent); padding:5px 9px; flex:1 1 auto; min-width:0; overflow:hidden; white-space:nowrap; font-weight:600; cursor:pointer; max-width:none; display:inline-flex; align-items:center; justify-content:flex-start; gap:5px;}\n  .libraryPicker .libNameBtn:hover{background:var(--accent-soft)}\n  .libraryPicker .libNameBtn .libNameIcon{width:14px; height:14px; flex:0 0 auto;}\n  .libraryPicker .libNameBtn #libButtonLabel{min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}\n  .libraryPicker .libIconBtn{width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border:0; border-left:1px solid var(--border); background:#fff; color:var(--accent); cursor:pointer; padding:0;}\n  .libraryPicker .libIconBtn:hover{background:var(--accent-soft)}\n  .libraryPicker .libIconBtn:disabled{opacity:.45; cursor:default;}\n  .libraryPicker .libIconBtn:disabled:hover{background:#fff;}\n  .libraryPicker .libIconBtn svg{width:14px; height:14px; flex:0 0 auto;}\n  .seg{display:inline-flex; border:1px solid var(--border); border-radius:8px; overflow:hidden; background:#fff}\n  .seg .segBtn{font:inherit; border:0; border-left:1px solid var(--border); background:#fff; color:var(--text2); padding:5px 12px; cursor:pointer; min-width:36px; line-height:1.15; text-align:center}\n  .seg .segBtn:first-child{border-left:0}\n  .seg .segBtn:hover{background:var(--accent-soft); color:var(--accent)}\n  .seg .segBtn.active{background:var(--accent); color:#fff}\n  .seg .segBtn sup{font-size:.72em; line-height:0}\n  .check{display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:var(--text2)}\n  #results{flex:1; overflow-y:auto; padding:6px 8px}\n  .card{border:1px solid var(--border); border-radius:8px; padding:8px 10px; margin-bottom:7px; background:#fff}\n  .card:hover{border-color:var(--accent)}\n  .card .ct{font-weight:600; line-height:1.3; margin-bottom:3px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden}\n  .card .cau{color:var(--text2); font-size:12px; line-height:1.25; margin-bottom:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden}\n  .card .cmeta{display:flex; flex-wrap:wrap; gap:6px 8px; align-items:center; color:var(--text3); font-size:11.5px; font-weight:600}\n  .card .cmeta .journal{color:var(--accent)}\n  .card .acts{display:flex; gap:6px; margin-left:auto}\n  .card .acts .btn{display:inline-flex; align-items:center; gap:4px; padding:3px 9px}\n  .card .acts .btn svg{width:13px; height:13px; flex:0 0 auto}\n\n  #btnRefresh{display:inline-flex; align-items:center; gap:4px;}\n  #btnRefresh .refreshSvg{width:14px; height:14px; flex:0 0 auto;}\n  .empty{color:var(--text3); text-align:center; padding:26px 16px; line-height:1.6}\n  .toast{position:fixed; left:50%; bottom:12px; transform:translateX(-50%); background:#1c2430; color:#fff; padding:7px 13px; border-radius:8px; font-size:12px; opacity:0; transition:opacity .2s; pointer-events:none; max-width:88%}\n  .toast.show{opacity:.96}\n  .toast.err{background:#b42318}\n  .hidden{display:none !important}\n  a{color:var(--accent)}\n\n\n/* === Final CSS: reference card hover + refined control focus === */\n/* 02: richer reference cards */\n#results{\n  padding:8px;\n  background:linear-gradient(180deg,#f8fafc 0%,#ffffff 100%);\n}\n.card{\n  border-radius:11px;\n  padding:9px 10px;\n  box-shadow:0 1px 3px rgba(15,23,42,.035);\n  transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease;\n}\n.card:hover{\n  border-color:rgba(37,99,235,.48);\n  box-shadow:0 5px 14px rgba(15,23,42,.075);\n  transform:translateY(-1px);\n}\n.card .ct{font-weight:700;}\n.card .cmeta .journal{\n  background:#eef5ff;\n  color:#1d4ed8;\n  border-radius:999px;\n  padding:1px 6px;\n}\n\n/* 03: refined controls and focus states */\n.controls{\n  background:#fbfcff;\n  gap:8px;\n}\nselect,\ninput[type=search],\ninput[type=text]{\n  padding:6px 9px;\n  border-radius:8px;\n  transition:border-color .15s ease,box-shadow .15s ease,background .15s ease;\n}\nselect:hover,\ninput[type=search]:hover,\ninput[type=text]:hover{border-color:#cbd5e1;}\nselect:focus,\ninput:focus{\n  border-color:var(--accent);\n  box-shadow:0 0 0 3px rgba(37,99,235,.12);\n}\n.check{\n  padding:2px 4px;\n  border-radius:6px;\n}\n.check:hover{background:#f1f5f9;}\n.btn{border-radius:8px;}\n\n<\/style>\n<\/head>\n<body>\n  <header>\n    <svg class=\"logo\" viewBox=\"0 0 32 32\" fill=\"none\" aria-hidden=\"true\">\n      <defs>\n        <linearGradient id=\"plg1\" x1=\"5\" y1=\"7\" x2=\"16\" y2=\"25\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#1d4ed8\"/><stop offset=\"1\" stop-color=\"#60a5fa\"/><\/linearGradient>\n        <linearGradient id=\"plg2\" x1=\"27\" y1=\"7\" x2=\"16\" y2=\"25\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#2563eb\"/><stop offset=\"1\" stop-color=\"#93c5fd\"/><\/linearGradient>\n        <linearGradient id=\"plg3\" x1=\"3\" y1=\"25\" x2=\"29\" y2=\"25\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#bfdbfe\"/><stop offset=\".5\" stop-color=\"#60a5fa\"/><stop offset=\"1\" stop-color=\"#1d4ed8\"/><\/linearGradient>\n      <\/defs>\n      <path d=\"M16 8.35C13.2 5.95 8.7 5.7 4.75 6.95v16.2c3.95-1.15 8.45-.8 11.25 1.85z\" fill=\"url(#plg1)\"/>\n      <path d=\"M16 8.35C18.8 5.95 23.3 5.7 27.25 6.95v16.2c-3.95-1.15-8.45-.8-11.25 1.85z\" fill=\"url(#plg2)\"/>\n      <path d=\"M7.8 11.15c1.85-.5 3.7-.48 5.15.06M7.8 14.55c1.85-.5 3.7-.48 5.15.06M19.05 11.15c1.85-.5 3.7-.48 5.15.06M19.05 14.55c1.85-.5 3.7-.48 5.15.06\" stroke=\"#fff\" stroke-width=\"1.05\" stroke-linecap=\"round\" opacity=\".82\"/>\n      <path d=\"M16 8.5v16.25\" stroke=\"#eff6ff\" stroke-width=\"1.25\" stroke-linecap=\"round\"/>\n      <rect x=\"3\" y=\"24.25\" width=\"26\" height=\"3.25\" rx=\"1.6\" fill=\"url(#plg3)\"/>\n      <path d=\"M5.1 25.9h21.8\" stroke=\"#eff6ff\" stroke-width=\".7\" stroke-linecap=\"round\" opacity=\".55\"/>\n    <\/svg>\n    <span class=\"t\">Paper Library<\/span>\n    <span class=\"lib\" id=\"libInfo\"><\/span>\n    <button class=\"langBtn\" id=\"btnLang\">EN<\/button>\n  <\/header>\n\n  <div class=\"controls\">\n    <div class=\"row\">\n      <div class=\"libraryPicker\" id=\"libraryPicker\">\n        <button type=\"button\" class=\"libNameBtn\" id=\"btnLoad\" data-i18n-title=\"loadTitle\">\n          <svg class=\"libNameIcon\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M2.4 5.1h4.5l1.2 1.5h5.5v6.2H2.4z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.35\" stroke-linejoin=\"round\"/><path d=\"M2.4 5.1V3.6h4.1l1.1 1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.35\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><\/svg>\n          <span id=\"libButtonLabel\" data-i18n=\"loadBtn\">ライブラリを選択<\/span>\n        <\/button>\n        <button type=\"button\" class=\"libIconBtn\" id=\"btnReloadLib\" data-i18n-title=\"reloadLibTitle\" aria-label=\"ライブラリを再読み込み\">\n          <svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M13.1 6.2A5.2 5.2 0 1 0 12 11.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><path d=\"M13.1 2.9v3.3H9.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><\/svg>\n        <\/button>\n      <\/div>\n      <input type=\"file\" id=\"file\" accept=\".json,application/json\" class=\"hidden\">\n      <input type=\"file\" id=\"folder\" webkitdirectory directory multiple class=\"hidden\">\n    <\/div>\n    <div class=\"groupHead\" data-i18n=\"styleGroup\">引用スタイル<\/div>\n    <div class=\"fields\">\n      <div class=\"field\">\n        <label data-i18n=\"styleLabel\">スタイル<\/label>\n        <select id=\"style\">\n          <option value=\"acs\">ACS<\/option>\n          <option value=\"nature\">Nature<\/option>\n          <option value=\"science\">Science<\/option>\n          <option value=\"rsc\">RSC<\/option>\n          <option value=\"csj\">CSJ<\/option>\n          <option value=\"gdch\">Wiley<\/option>\n        <\/select>\n      <\/div>\n      <div class=\"field\">\n        <label data-i18n=\"numberLabel\">番号<\/label>\n        <div class=\"seg\" id=\"markerStyle\" role=\"group\" aria-label=\"番号スタイル\">\n          <button type=\"button\" class=\"segBtn\" data-val=\"bracket\" data-i18n-title=\"bracketOpt\">[1]<\/button>\n          <button type=\"button\" class=\"segBtn\" data-val=\"super\" data-i18n-title=\"superOpt\"><sup>1<\/sup><\/button>\n          <button type=\"button\" class=\"segBtn\" data-val=\"superBracket\" data-i18n-title=\"superBracketOpt\"><sup>[1]<\/sup><\/button>\n        <\/div>\n      <\/div>\n    <\/div>\n    <div class=\"row\">\n      <label class=\"check\"><input type=\"checkbox\" id=\"incTitle\"> <span data-i18n=\"incTitle\">タイトル<\/span><\/label>\n      <label class=\"check\"><input type=\"checkbox\" id=\"incUrl\"> <span data-i18n=\"incUrl\">DOI/URL<\/span><\/label>\n      <span style=\"flex:1\"><\/span>\n      <button class=\"btn ghost\" id=\"btnRefresh\" data-i18n-title=\"refreshTitle\"><svg class=\"refreshSvg\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M13.1 6.2A5.2 5.2 0 1 0 12 11.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><path d=\"M13.1 2.9v3.3H9.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><\/svg><span id=\"refreshLabel\">文献リストを更新<\/span><\/button>\n    <\/div>\n  <\/div>\n\n  <div class=\"subbar\">\n    <div class=\"groupHead\" data-i18n=\"searchGroup\">検索・絞り込み<\/div>\n    <div class=\"fields\">\n      <div class=\"field\">\n        <label data-i18n=\"collLabel\">コレクション<\/label>\n        <select id=\"coll\"><\/select>\n      <\/div>\n      <div class=\"field\">\n        <label data-i18n=\"tagLabel\">タグ<\/label>\n        <select id=\"tag\"><\/select>\n      <\/div>\n    <\/div>\n    <div class=\"row\">\n      <label class=\"check\"><input type=\"checkbox\" id=\"fStar\"> <span data-i18n=\"starredOpt\">★ スター<\/span><\/label>\n      <label class=\"check\"><input type=\"checkbox\" id=\"fMine\"> <span data-i18n=\"myPubOpt\">自分の論文<\/span><\/label>\n      <span style=\"flex:1\"><\/span>\n      <span id=\"count\" style=\"font-size:11.5px;color:var(--text3)\"><\/span>\n    <\/div>\n    <div class=\"row\">\n      <input type=\"search\" id=\"q\" data-i18n-ph=\"searchPh\">\n    <\/div>\n  <\/div>\n\n  <div id=\"results\"><\/div>\n  <div class=\"toast\" id=\"toast\"><\/div>\n\n<script>\n/* ================================================================\n   Citation engine — ported from Paper Library (index.html) so the\n   inserted citations match the app exactly. Keep in sync if the app's\n   citation logic changes.\n================================================================ */\nfunction esc(s){ return String(s==null?'':s).replace(/[&<>\"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c])); }\nfunction normalizeRange(s){ return String(s||'').replace(/\\s*[-–—]+\\s*/g, '–'); }\nfunction normalizeJournalKey(s){\n  return String(s||'').toLowerCase().replace(/[–—-]/g,' ').replace(/&/g,'and').replace(/\\bthe\\b/g,' ')\n    .replace(/[^a-z0-9]+/g,' ').replace(/\\s+/g,' ').trim();\n}\nconst JOURNAL_ABBR = new Map([\n  ['journal of the american chemical society','J. Am. Chem. Soc.'],['nature materials','Nat. Mater.'],\n  ['nature chemistry','Nat. Chem.'],['nature catalysis','Nat. Catal.'],\n  ['angewandte chemie international edition','Angew. Chem. Int. Ed.'],['chemistry - a european journal','Chem. Eur. J.'],\n  ['chemistry a european journal','Chem. Eur. J.'],['chemical science','Chem. Sci.'],['chemical communications','Chem. Commun.'],\n  ['chemistry letters','Chem. Lett.'],['journal of materials chemistry a','J. Mater. Chem. A'],\n  ['journal of materials chemistry b','J. Mater. Chem. B'],['journal of materials chemistry c','J. Mater. Chem. C'],\n  ['energy & environmental science','Energy Environ. Sci.'],['acs catalysis','ACS Catal.'],['acs energy letters','ACS Energy Lett.'],\n  ['acs materials letters','ACS Mater. Lett.'],['acs nano','ACS Nano'],['nano letters','Nano Lett.'],\n  ['chemistry of materials','Chem. Mater.'],['inorganic chemistry','Inorg. Chem.'],['organic letters','Org. Lett.'],\n  ['the journal of organic chemistry','J. Org. Chem.'],['journal of organic chemistry','J. Org. Chem.'],\n  ['organometallics','Organometallics'],['dalton transactions','Dalton Trans.'],\n  ['physical chemistry chemical physics','Phys. Chem. Chem. Phys.'],['journal of physical chemistry letters','J. Phys. Chem. Lett.'],\n  ['the journal of physical chemistry letters','J. Phys. Chem. Lett.'],['journal of physical chemistry c','J. Phys. Chem. C'],\n  ['the journal of physical chemistry c','J. Phys. Chem. C'],['journal of physical chemistry b','J. Phys. Chem. B'],\n  ['the journal of physical chemistry b','J. Phys. Chem. B'],['journal of chemical physics','J. Chem. Phys.'],\n  ['the journal of chemical physics','J. Chem. Phys.'],['advanced materials','Adv. Mater.'],\n  ['advanced energy materials','Adv. Energy Mater.'],['advanced functional materials','Adv. Funct. Mater.'],\n  ['advanced science','Adv. Sci.'],['materials horizons','Mater. Horiz.'],['small','Small'],\n]);\nconst JOURNAL_ABBR_NORMALIZED = new Map(Array.from(JOURNAL_ABBR, ([k,v])=>[normalizeJournalKey(k), v]));\nfunction mappedJournalAbbr(s){ return JOURNAL_ABBR_NORMALIZED.get(normalizeJournalKey(s)) || ''; }\nfunction journalDisplay(item){\n  const j = item.journal || '';\n  return mappedJournalAbbr(j) || mappedJournalAbbr(item.journalAbbr) || item.journalAbbr || j;\n}\nfunction citationStyleKey(style){\n  if(style==='wiley' || style==='angew') return 'gdch';\n  if(style==='jcs') return 'csj';\n  return style || 'acs';\n}\nfunction authorName(a, style){\n  style = citationStyleKey(style);\n  const ini = (a.given||'').split(/[\\s.]+/).filter(Boolean).map(x=>x[0].toUpperCase()+'.').join(' ');\n  if(style==='nature' || style==='rsc' || style==='gdch' || style==='csj' || style==='science'){\n    return [ini, a.family].filter(Boolean).join(' ');\n  }\n  return ini ? `${a.family}, ${ini}` : a.family;\n}\nfunction joinCitationAuthors(names, style){\n  style = citationStyleKey(style); names = names.filter(Boolean);\n  if(!names.length) return '';\n  if(style==='acs') return names.join('; ');\n  if(style==='rsc'){\n    if(names.length===1) return names[0];\n    if(names.length===2) return names[0] + ' and ' + names[1];\n    return names.slice(0,-1).join(', ') + ', and ' + names[names.length-1];\n  }\n  if(style==='nature'){\n    if(names.length===1) return names[0];\n    if(names.length===2) return names[0] + ' & ' + names[1];\n    return names.slice(0,-1).join(', ') + ' & ' + names[names.length-1];\n  }\n  return names.join(', ');\n}\nfunction citationTextToAuthors(text){\n  return String(text||'').split(';').map(s=>s.trim()).filter(Boolean).map(name=>{\n    if(name.includes(',')){ const p = name.split(','); return {family:(p[0]||'').trim(), given:p.slice(1).join(',').trim()}; }\n    const p = name.split(/\\s+/).filter(Boolean); return {family:p.pop()||'', given:p.join(' ')};\n  });\n}\nfunction citationAuthors(item, opts){\n  let list = item.authors || []; const style = citationStyleKey(opts.style);\n  if(opts.authorScope==='corresponding' && item.correspondingAuthors){\n    const corrAuthors = citationTextToAuthors(item.correspondingAuthors); const nCorr = corrAuthors.length;\n    const corr = joinCitationAuthors(corrAuthors.map(a=>authorName(a, style)), style);\n    return corr + (list.length > nCorr ? ' et al.' : '');\n  }\n  if(opts.authorScope==='first'){\n    const first = list[0] ? authorName(list[0], style) : '';\n    return first && list.length > 1 ? first + ' et al.' : first;\n  }\n  return joinCitationAuthors(list.map(a=>authorName(a, style)), style);\n}\nfunction sentenceEnd(s){ return s ? s.replace(/\\.+$/,'') + '. ' : ''; }\nfunction sentenceEndHtml(s){\n  if(!s) return '';\n  return /[.!?](?:<\\/[^>]+>)*$/.test(s) ? s + ' ' : s + '. ';\n}\nfunction citationAuthorsHtml(item, opts){ return esc(citationAuthors(item, opts)).replace(/\\bet al\\./g, '<i>et al.<\/i>'); }\nfunction itemToCitationHtml(item, opts){\n  opts = Object.assign({style:'acs', includeTitle:true, authorScope:'all', includeUrl:true}, opts || {});\n  const style = citationStyleKey(opts.style);\n  const auth = citationAuthorsHtml(item, opts);\n  const title = opts.includeTitle && item.title ? esc(item.title.replace(/\\.?$/, '.')) : '';\n  const journal = journalDisplay(item);\n  const pages = normalizeRange(item.pages);\n  const j = journal ? `<i>${esc(journal)}<\/i>` : '';\n  const y = item.year ? `<b>${esc(item.year)}<\/b>` : '';\n  const vol = item.volume ? ((style==='nature' || style==='science') ? `<b>${esc(item.volume)}<\/b>` : `<i>${esc(item.volume)}<\/i>`) : '';\n  const p = pages ? esc(pages) : '';\n  let html = '';\n  if(style==='nature'){\n    html = [auth ? sentenceEndHtml(auth).trim() : '', title, j, vol ? vol + ',' : '', p, item.year ? `(${esc(item.year)}).` : '']\n      .filter(Boolean).join(' ').replace(/\\s+,/g, ',').trim();\n  }else if(style==='science'){\n    html = [auth ? auth + ',' : '', title, j, vol ? vol + ',' : '', p, item.year ? `(${esc(item.year)}).` : '']\n      .filter(Boolean).join(' ').replace(/\\s+,/g, ',').trim();\n  }else if(style==='rsc'){\n    html = auth ? auth + ', ' : ''; if(title) html += title + ' ';\n    html += [j, y, vol, p].filter(Boolean).join(', '); html = html.trim().replace(/,$/, '') + '.';\n  }else if(style==='csj'){\n    html = auth ? auth + ', ' : ''; if(title) html += title + ' ';\n    html += [j, y].filter(Boolean).join(' ');\n    if(vol) html += (html ? ', ' : '') + vol; if(p) html += (html ? ', ' : '') + p;\n    html = html.trim().replace(/,$/, '') + '.';\n  }else if(style==='gdch'){\n    html = auth ? auth + ', ' : ''; if(title) html += '&ldquo;' + title.replace(/\\.$/,'') + '&rdquo;, ';\n    html += [j, y].filter(Boolean).join(' ');\n    if(vol) html += (html ? ', ' : '') + vol; if(p) html += (html ? ', ' : '') + p;\n    html = html.trim().replace(/,$/, '') + '.';\n  }else{\n    html = [auth ? sentenceEndHtml(auth).trim() : '', title, j, y].filter(Boolean).join(' ');\n    if(vol) html += (html ? ', ' : '') + vol; if(p) html += (html ? ', ' : '') + p;\n    html = html.trim().replace(/,$/, '') + '.';\n  }\n  if(opts.includeUrl !== false && item.doi){\n    const doi = esc(item.doi);\n    html += ` <a href=\"https://doi.org/${doi}\">https://doi.org/${doi}<\/a>`;\n  }\n  return html;\n}\n\n/* ================================================================\n   i18n (JA / EN)\n================================================================ */\nvar I18N = {\n  ja: {\n    notLoaded:'未読み込み', nRefs:function(n){return n+' 件の文献';},\n    searchPh:'タイトル・著者・雑誌・DOI で検索…', loadBtn:'ライブラリを選択', libLoaded:'ライブラリ', loadTitle:'ライブラリフォルダを選択', reloadLibTitle:'library.json を再読み込み', changeLibTitle:'ライブラリフォルダを変更',\n    styleLabel:'スタイル', collLabel:'コレクション', allColl:'すべてのコレクション',\n    styleGroup:'引用スタイル', searchGroup:'検索・絞り込み', tagLabel:'タグ', allTags:'すべてのタグ', starredOpt:'★ スター', myPubOpt:'自分の論文',\n    incTitle:'タイトル', incUrl:'DOI/URL', numberLabel:'番号', bracketOpt:'括弧 [1]', superOpt:'上付き ¹', superBracketOpt:'上付き [1]',\n    refreshBtn:'文献リストを更新', refreshTitle:'本文の番号と末尾の文献リストを再同期します',\n    insertBtn:'挿入', copyBtn:'コピー',\n    insertTitle:'番号を本文に挿入し、末尾リストと連動',\n    count:function(n,m){return n+' / '+m+' 件';},\n    emptyLoad:'まず「ライブラリ」ボタンから library.json を読み込んでください。（Paper Library の保存フォルダ内、または「エクスポート → ライブラリ全体 → JSON」）',\n    moreItems:function(n){return '上位 '+n+' 件を表示（絞り込んでください）';}, noTitle:'(無題)',\n    loaded:'ライブラリを読み込みました', reloaded:'ライブラリを再読み込みしました', loadedNoCache:'ライブラリを読み込みましたが、大きすぎるため次回は再読み込みが必要です', loadFail:function(e){return '読み込み失敗: '+e;}, folderNoJson:'選択したフォルダに library.json が見つかりません', reloadNeedsSelect:'この環境では自動再読み込みできません。もう一度ライブラリフォルダを選択してください',\n    inserted:'引用を挿入しました', insertFail:function(e){return '挿入に失敗: '+e;},\n    updated:'文献リストを更新しました', updateFail:function(e){return '更新に失敗: '+e;},\n    copied:'引用をコピーしました', copyFail:'コピーできませんでした',\n    wordOnly:'Word 上でのみ挿入できます（プレビュー環境では不可）', wordOnlyUpdate:'Word 上でのみ動作します',\n    badFormat:'library.json の形式を認識できません', noCites:'（引用がありません）', notFound:'(ライブラリに見つかりません)',\n  },\n  en: {\n    notLoaded:'Not loaded', nRefs:function(n){return n+' references';},\n    searchPh:'Search title, author, journal, DOI…', loadBtn:'Select library', libLoaded:'Library', loadTitle:'Select library folder', reloadLibTitle:'Reload library.json', changeLibTitle:'Change library folder',\n    styleLabel:'Style', collLabel:'Collection', allColl:'All collections',\n    styleGroup:'Citation style', searchGroup:'Search & filter', tagLabel:'Tag', allTags:'All tags', starredOpt:'★ Starred', myPubOpt:'My publications',\n    incTitle:'Title', incUrl:'DOI/URL', numberLabel:'Number', bracketOpt:'Brackets [1]', superOpt:'Superscript ¹', superBracketOpt:'Superscript [1]',\n    refreshBtn:'Update bibliography', refreshTitle:'Re-sync the in-text numbers and the reference list',\n    insertBtn:'Insert', copyBtn:'Copy',\n    insertTitle:'Insert a number in the text, linked to the reference list',\n    count:function(n,m){return n+' / '+m;},\n    emptyLoad:'Load library.json with the “Library” button. (It is in your Paper Library folder, or export via Export → Whole library → JSON.)',\n    moreItems:function(n){return 'Showing top '+n+' (refine your search)';}, noTitle:'(untitled)',\n    loaded:'Library loaded', reloaded:'Library reloaded', loadedNoCache:'Library loaded, but it is too large to cache. Reload it next time.', loadFail:function(e){return 'Load failed: '+e;}, folderNoJson:'library.json was not found in the selected folder', reloadNeedsSelect:'Automatic reload is not available in this environment. Select the library folder again',\n    inserted:'Citation inserted', insertFail:function(e){return 'Insert failed: '+e;},\n    updated:'Bibliography updated', updateFail:function(e){return 'Update failed: '+e;},\n    copied:'Citation copied', copyFail:'Could not copy',\n    wordOnly:'Only available inside Word', wordOnlyUpdate:'Only works inside Word',\n    badFormat:'Unrecognized library.json format', noCites:'(no citations)', notFound:'(not found in library)',\n  }\n};\nvar LANG = 'ja';\nfunction tr(k){ var a=[].slice.call(arguments,1); var v=I18N[LANG][k]; return typeof v==='function' ? v.apply(null,a) : v; }\n\n/* ================================================================\n   Add-in state + UI\n================================================================ */\nvar $ = (s)=>document.querySelector(s);\nvar STATE = { items: [], collections: [], cached:false, libraryLabel:'', dirHandle:null, libraryFileHandle:null, lastFolderFiles:null };\nvar PREFS = { style:'acs', includeTitle:false, includeUrl:false, marker:'bracket' };\nvar officeReady = false;\nvar LS_LIB = 'plWordAddin.library';\nvar LS_PREFS = 'plWordAddin.prefs';\nvar LS_LANG = 'plWordAddin.lang';\n// inserted content defaults to Times New Roman 10.5pt\nvar INS_FONT = \"Times New Roman\", INS_SIZE = 10.5;\n// inline button icons\nvar IC_INSERT = '<svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M8 3.3v9.4M3.3 8h9.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\"/><\/svg>';\nvar IC_COPY = '<svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><rect x=\"5.6\" y=\"5.6\" width=\"7.8\" height=\"7.8\" rx=\"1.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\"/><path d=\"M10.2 5.6V4.1A1.5 1.5 0 0 0 8.7 2.6H4A1.5 1.5 0 0 0 2.5 4.1v4.7A1.5 1.5 0 0 0 4 10.3h1.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\"/><\/svg>';\n\nfunction toast(msg, isErr){\n  var el = $('#toast'); el.textContent = msg;\n  el.className = 'toast show' + (isErr ? ' err' : '');\n  clearTimeout(toast._t); toast._t = setTimeout(function(){ el.className = 'toast'; }, 2600);\n}\nfunction collById(id){ return STATE.collections.find(function(c){ return c.id===id; }); }\nfunction activeItems(){ return STATE.items.filter(function(it){ return !it.trashed; }); }\n// a collection and all of its descendant collection ids (so a parent includes its children)\nfunction collectionDescendants(id){\n  var out = [id], byParent = {};\n  STATE.collections.forEach(function(c){ (byParent[c.parent||''] = byParent[c.parent||''] || []).push(c.id); });\n  (function walk(pid){ (byParent[pid]||[]).forEach(function(cid){ out.push(cid); walk(cid); }); })(id);\n  return out;\n}\nfunction allTagsSorted(){\n  var set = {};\n  activeItems().forEach(function(it){ (it.tags||[]).forEach(function(tg){ if(tg) set[tg] = 1; }); });\n  return Object.keys(set).sort(function(a,b){ return a.localeCompare(b,'ja'); });\n}\n// collection filter (hierarchical); an \"all collections\" option means no restriction\nfunction buildCollOptions(){\n  var sel = $('#coll'); if(!sel) return;\n  var prev = sel.value;\n  var byParent = {};\n  STATE.collections.forEach(function(c){ (byParent[c.parent||''] = byParent[c.parent||''] || []).push(c); });\n  var opts = ['<option value=\"\">'+esc(tr('allColl'))+'<\/option>'];\n  (function walk(parent, depth){\n    (byParent[parent]||[]).sort(function(a,b){ return a.name.localeCompare(b.name,'ja'); }).forEach(function(c){\n      opts.push('<option value=\"'+esc(c.id)+'\">'+ '　'.repeat(depth) + esc(c.name) +'<\/option>');\n      walk(c.id, depth+1);\n    });\n  })('', 0);\n  sel.innerHTML = opts.join('');\n  sel.value = prev;                    // keep the current selection across rebuilds (e.g. language switch)\n  if(sel.value !== prev) sel.value = '';\n}\n// tag filter; an \"all tags\" option means no restriction\nfunction buildTagOptions(){\n  var sel = $('#tag'); if(!sel) return;\n  var prev = sel.value;\n  var opts = ['<option value=\"\">'+esc(tr('allTags'))+'<\/option>'];\n  allTagsSorted().forEach(function(tg){ opts.push('<option value=\"'+esc(tg)+'\">'+esc(tg)+'<\/option>'); });\n  sel.innerHTML = opts.join('');\n  sel.value = prev;\n  if(sel.value !== prev) sel.value = '';\n}\n// starred / my-publications / collection / tag are independent AND filters, so e.g.\n// \"starred AND a specific collection\" is expressible — mirrors the app's left pane.\nfunction buildFilterOptions(){ buildCollOptions(); buildTagOptions(); }\nfunction cleanLibraryLabel(s){\n  s = String(s || '').trim();\n  if(!s) return '';\n  s = s.split(/[\\\\/]/).filter(Boolean).pop() || s;\n  return s.replace(/\\.json$/i, '') || s;\n}\nfunction libraryLabelFromFile(file){\n  if(!file) return '';\n  if(file.libraryFolderName) return cleanLibraryLabel(file.libraryFolderName);\n  var rel = file.webkitRelativePath || '';\n  if(rel && rel.indexOf('/') >= 0){\n    var parts = rel.split('/').filter(Boolean);\n    if(parts.length > 1) return cleanLibraryLabel(parts[parts.length - 2]);\n  }\n  return '';\n}\nfunction libraryLabelFromData(data, file){\n  var fromData = data && (data.libraryFolderName || data.libraryFolder || data.libraryDir || data.folderName || data.folder || data.path);\n  return cleanLibraryLabel(fromData) || libraryLabelFromFile(file);\n}\nfunction updateLibraryButton(){\n  var btn = $('#btnLoad'); if(!btn) return;\n  var label = $('#libButtonLabel');\n  // show the folder name; if a library is loaded but its name is unknown, still signal\n  // \"loaded\" rather than the misleading \"select library\" prompt.\n  if(label) label.textContent = STATE.libraryLabel || (STATE.items.length ? tr('libLoaded') : tr('loadBtn'));\n  btn.title = STATE.libraryLabel ? tr('changeLibTitle') : tr('loadTitle');\n  btn.setAttribute('aria-label', btn.title);\n  var reload = $('#btnReloadLib');\n  if(reload){\n    reload.title = tr('reloadLibTitle');\n    reload.setAttribute('aria-label', tr('reloadLibTitle'));\n    reload.disabled = !STATE.items.length;\n  }\n}\nfunction updateLibInfo(){\n  var el = $('#libInfo'); if(!el) return;\n  if(!STATE.items.length){ el.textContent = tr('notLoaded'); updateLibraryButton(); return; }\n  el.textContent = tr('nRefs', activeItems().length);\n  updateLibraryButton();\n}\nfunction loadLibraryData(data, file){\n  var items = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : null);\n  if(!items) throw new Error(tr('badFormat'));\n  STATE.items = items; STATE.cached = false;\n  STATE.collections = (data && Array.isArray(data.collections)) ? data.collections : [];\n  var lbl = libraryLabelFromData(data, file);\n  if(lbl) STATE.libraryLabel = lbl;    // keep the previously known name if this source can't provide one\n  buildFilterOptions();\n  updateLibInfo();\n  var cacheOk = true;\n  try{\n    localStorage.setItem(LS_LIB, JSON.stringify({items:STATE.items, collections:STATE.collections, libraryLabel:STATE.libraryLabel}));\n  }catch(e){\n    // Do not leave an older library in storage: on the next launch it could be\n    // mistaken for the library the user just selected.\n    try{ localStorage.removeItem(LS_LIB); }catch(_e){}\n    cacheOk = false;\n  }\n  render();\n  return cacheOk;\n}\nfunction currentOpts(){ return { style: $('#style').value, includeTitle: $('#incTitle').checked, includeUrl: $('#incUrl').checked, authorScope:'all' }; }\nfunction segButtons(){ return Array.prototype.slice.call(document.querySelectorAll('#markerStyle .segBtn')); }\nfunction currentMarker(){ var b = document.querySelector('#markerStyle .segBtn.active'); return b ? b.dataset.val : 'bracket'; }\nfunction setMarkerActive(val){ segButtons().forEach(function(b){ b.classList.toggle('active', b.dataset.val === val); }); }\nfunction savePrefs(){\n  PREFS = { style: $('#style').value, includeTitle: $('#incTitle').checked, includeUrl: $('#incUrl').checked, marker: currentMarker() };\n  try{ localStorage.setItem(LS_PREFS, JSON.stringify(PREFS)); }catch(e){}\n}\nfunction authorsShort(authors){ return (authors||[]).map(function(a){ return a.family || a.given; }).filter(Boolean).join('; '); }\nfunction itemText(it){\n  return [it.title, (it.authors||[]).map(function(a){ return (a.family||'')+' '+(a.given||''); }).join(' '),\n    it.journal, it.journalAbbr, it.year, it.doi, it.citekey, (it.tags||[]).join(' ')].join(' ').toLowerCase();\n}\nfunction render(){\n  var box = $('#results');\n  if(!STATE.items.length){\n    box.innerHTML = '<div class=\"empty\">'+esc(tr('emptyLoad'))+'<\/div>';\n    $('#count').textContent = ''; return;\n  }\n  var q = $('#q').value.trim().toLowerCase();\n  var terms = q ? q.split(/\\s+/) : [];\n  var coll = $('#coll').value;\n  var tag = $('#tag').value;\n  var onlyStar = $('#fStar').checked;\n  var onlyMine = $('#fMine').checked;\n  var collIds = coll ? collectionDescendants(coll) : null;\n  var list = STATE.items.filter(function(it){\n    if(it.trashed) return false;\n    if(onlyStar && !it.starred) return false;\n    if(onlyMine && !it.myPublication) return false;\n    if(tag && (it.tags||[]).indexOf(tag) < 0) return false;\n    if(collIds && !(it.collections||[]).some(function(c){ return collIds.indexOf(c) >= 0; })) return false;\n    if(!terms.length) return true;\n    var hay = itemText(it);\n    return terms.every(function(t){ return hay.indexOf(t) >= 0; });\n  });\n  $('#count').textContent = tr('count', list.length, activeItems().length);\n  list.sort(function(a,b){ return String(b.year||'').localeCompare(String(a.year||'')); });\n  var shown = list.slice(0, 200);\n  box.innerHTML = shown.map(function(it, i){\n    var meta = [ journalDisplay(it) ? '<span class=\"journal\">'+esc(journalDisplay(it))+'<\/span>' : '',\n                 it.year ? '<span>'+esc(it.year)+'<\/span>' : '' ].filter(Boolean).join('');\n    return '<div class=\"card\">'\n      + '<div class=\"ct\">'+esc(it.title||tr('noTitle'))+'<\/div>'\n      + '<div class=\"cau\">'+esc(authorsShort(it.authors))+'<\/div>'\n      + '<div class=\"cmeta\">'+meta\n      +   '<span class=\"acts\">'\n      +     '<button class=\"btn\" data-num=\"'+i+'\" title=\"'+esc(tr('insertTitle'))+'\">'+IC_INSERT+esc(tr('insertBtn'))+'<\/button>'\n      +     '<button class=\"btn ghost\" data-copy=\"'+i+'\">'+IC_COPY+esc(tr('copyBtn'))+'<\/button>'\n      +   '<\/span>'\n      + '<\/div>'\n      + '<\/div>';\n  }).join('') + (list.length>shown.length ? '<div class=\"empty\">'+esc(tr('moreItems', shown.length))+'<\/div>' : '');\n  box.__list = shown;\n}\n\nasync function copyCitation(it){\n  var html = itemToCitationHtml(it, currentOpts());\n  var tmp = document.createElement('div'); tmp.innerHTML = html;\n  var text = (tmp.textContent||'').replace(/\\s+/g,' ').trim();\n  try{\n    if(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write){\n      await navigator.clipboard.write([new ClipboardItem({\n        'text/html': new Blob([html], {type:'text/html'}),\n        'text/plain': new Blob([text], {type:'text/plain'}),\n      })]);\n    } else { await navigator.clipboard.writeText(text); }\n    toast(tr('copied'));\n  }catch(e){ toast(tr('copyFail'), true); }\n}\n\n/* ================================================================\n   Numbered citations [1] + auto-linked bibliography.\n   Each in-text citation is a hidden Word content control tagged\n   \"PLCITE:<itemId>\"; the bibliography is one control tagged \"PLBIB\".\n================================================================ */\nvar CITE_TAG = 'PLCITE:';\nvar BIB_TAG = 'PLBIB';\n// in-text marker text; bibliography number label matches the same style\nfunction markerText(n){\n  if(PREFS.marker === 'super') return String(n);\n  if(PREFS.marker === 'superBracket') return '[' + n + ']';\n  return '[' + n + ']';\n}\n// collapse a set of numbers into a compact string: runs of 3+ become ranges (1–4),\n// everything else is comma separated (1, 3, 5).\nfunction collapseNums(nums){\n  var u = Array.from(new Set(nums)).filter(function(x){ return x; }).sort(function(a,b){ return a - b; });\n  var parts = [], i = 0;\n  while(i < u.length){\n    var j = i;\n    while(j + 1 < u.length && u[j + 1] === u[j] + 1) j++;\n    if(j - i >= 2) parts.push(u[i] + '–' + u[j]);\n    else for(var k = i; k <= j; k++) parts.push(String(u[k]));\n    i = j + 1;\n  }\n  return parts.join(', ');\n}\n// in-text text for a group of adjacent citations (e.g. \"[1–4]\" or superscript \"1–4\")\nfunction groupMarkerText(nums, marker){\n  var inner = collapseNums(nums);\n  if(!inner) return '';\n  return marker === 'super' ? inner : ('[' + inner + ']');\n}\nfunction bibLabel(n){ return PREFS.marker === 'super' ? (n + '.') : ('[' + n + ']'); }\nfunction assignNumbers(idsInOrder){\n  var order = [], numById = {};\n  idsInOrder.forEach(function(id){ if(!(id in numById)){ order.push(id); numById[id] = order.length; } });\n  return { order: order, numById: numById };\n}\n// hanging-indent paragraphs, Times New Roman 10.5pt, number floating at the left\nvar BIB_INDENT = 22; // pt — hanging indent / gap between number and citation\nfunction buildBibliographyHtml(items, opts){\n  if(!items.length) return '';\n  var base = \"font-family:'Times New Roman',serif;font-size:10.5pt;text-align:left;margin:0pt 0pt 6pt \" + BIB_INDENT + \"pt;text-indent:-\" + BIB_INDENT + \"pt;\";\n  return items.map(function(it, i){\n    var body = it ? itemToCitationHtml(it, opts) : esc(tr('notFound'));\n    return '<p style=\"' + base + '\">' + esc(bibLabel(i + 1)) + '&#9;' + body + '<\/p>';\n  }).join('');\n}\nfunction applyInsertFont(range, superscript){\n  range.font.name = INS_FONT; range.font.size = INS_SIZE;\n  range.font.superscript = !!superscript;\n}\nfunction wordReady(){ return officeReady && window.Word && typeof Word.run === 'function'; }\n\nasync function insertCitationNumber(it){\n  if(!wordReady()){ toast(tr('wordOnly'), true); return; }\n  try{\n    await Word.run(async function(context){\n      var sel = context.document.getSelection();\n      var r = sel.insertText(markerText(1), 'Replace'); // placeholder number; refresh fixes it\n      var cc = r.insertContentControl();\n      cc.tag = CITE_TAG + it.id;\n      cc.title = 'Paper Library citation';\n      cc.appearance = 'Hidden';\n      applyInsertFont(r, PREFS.marker === 'super' || PREFS.marker === 'superBracket');\n      await context.sync();\n    });\n    await refreshCitations({ silent: true });\n    toast(tr('inserted'));\n  }catch(e){ console.error(e); toast(tr('insertFail', e && e.message), true); }\n}\n\nasync function refreshCitations(o){\n  o = o || {};\n  if(!wordReady()){ if(!o.silent) toast(tr('wordOnlyUpdate'), true); return; }\n  var opts = currentOpts();\n  try{\n    await Word.run(async function(context){\n      var ccs = context.document.body.contentControls;\n      ccs.load('items/tag');\n      await context.sync();\n\n      var cites = ccs.items.filter(function(c){ return (c.tag || '').indexOf(CITE_TAG) === 0; });\n      var ids = cites.map(function(c){ return c.tag.slice(CITE_TAG.length); });\n      var num = assignNumbers(ids);\n      var sup = (PREFS.marker === 'super' || PREFS.marker === 'superBracket');\n\n      // group adjacent in-text citations so consecutive numbers collapse (1234 -> 1–4)\n      var clusters = null;\n      if(cites.length){\n        try{\n          var ranges = cites.map(function(c){ return c.getRange('Whole'); });\n          var cmps = [];\n          for(var ci = 0; ci < cites.length - 1; ci++) cmps.push(ranges[ci].compareLocationWith(ranges[ci + 1]));\n          await context.sync();\n          clusters = [];\n          var cur = [0];\n          for(var cj = 1; cj < cites.length; cj++){\n            if(cmps[cj - 1] && cmps[cj - 1].value === 'AdjacentBefore') cur.push(cj);\n            else { clusters.push(cur); cur = [cj]; }\n          }\n          clusters.push(cur);\n        }catch(e){ clusters = null; }\n      }\n\n      if(clusters){\n        clusters.forEach(function(cluster){\n          var nums = cluster.map(function(idx){ return num.numById[ids[idx]]; });\n          var text = groupMarkerText(nums, PREFS.marker);\n          cluster.forEach(function(idx, k){\n            // first control carries the whole group text; the rest are hidden with a zero-width space\n            var r = cites[idx].insertText(k === 0 ? text : '\\u200B', 'Replace');\n            applyInsertFont(r, sup);\n          });\n        });\n      }else{\n        cites.forEach(function(c){\n          var n = num.numById[c.tag.slice(CITE_TAG.length)];\n          var r = c.insertText(markerText(n), 'Replace');\n          applyInsertFont(r, sup);\n        });\n      }\n\n      var items = num.order.map(function(id){\n        var f = null; STATE.items.forEach(function(x){ if(x.id === id) f = x; }); return f;\n      });\n      var bib = null;\n      ccs.items.forEach(function(c){ if((c.tag || '') === BIB_TAG) bib = c; });\n      // only materialize a bibliography once there is at least one citation; a bare\n      // style change in an empty document must not inject an empty reference list.\n      if(!bib && cites.length){\n        var p = context.document.body.insertParagraph('', 'End');\n        bib = p.insertContentControl();\n        bib.tag = BIB_TAG;\n        bib.title = 'Paper Library bibliography';\n        bib.appearance = 'Hidden';\n      }\n      if(bib){\n        var html = buildBibliographyHtml(items, opts);\n        if(html) bib.insertHtml(html, 'Replace');\n        else bib.insertText(tr('noCites'), 'Replace');\n        bib.font.name = INS_FONT; bib.font.size = INS_SIZE;\n        await context.sync();\n\n        // enforce the hanging indent + left alignment reliably (insertHtml CSS is flaky)\n        if(html){\n          try{\n            var bibParas = bib.paragraphs;\n            bibParas.load('items');\n            await context.sync();\n            bibParas.items.forEach(function(p2){\n              p2.leftIndent = BIB_INDENT;\n              p2.firstLineIndent = -BIB_INDENT;\n              p2.alignment = 'Left';\n            });\n            await context.sync();\n          }catch(e){ /* older Word: rely on the inline CSS hanging indent */ }\n        }\n      }\n    });\n    if(!o.silent) toast(tr('updated'));\n  }catch(e){ console.error(e); toast(tr('updateFail', e && e.message), true); }\n}\n\n/* ---- events ---- */\nasync function readLibraryFileObject(f, label, silent){\n  var text = await f.text();\n  if(label) f.libraryFolderName = label;\n  var cached = loadLibraryData(JSON.parse(text), f);\n  toast(cached ? (silent ? tr('reloaded') : tr('loaded')) : tr('loadedNoCache'), !cached);\n}\nasync function loadLibraryFromHandle(silent){\n  if(!STATE.libraryFileHandle && STATE.dirHandle){\n    STATE.libraryFileHandle = await STATE.dirHandle.getFileHandle('library.json');\n  }\n  if(!STATE.libraryFileHandle) return false;\n  var f = await STATE.libraryFileHandle.getFile();\n  if(STATE.dirHandle && STATE.dirHandle.name) f.libraryFolderName = STATE.dirHandle.name;\n  await readLibraryFileObject(f, f.libraryFolderName, !!silent);\n  return true;\n}\nasync function reloadLibrary(){\n  try{\n    if(await loadLibraryFromHandle(true)) return;\n    toast(tr('reloadNeedsSelect'), true);\n    chooseLibrary();\n  }catch(err){\n    console.error(err);\n    toast(tr('loadFail', err && err.message ? err.message : err), true);\n  }\n}\nasync function loadLibraryFromSelectedFolder(files){\n  files = Array.from(files || []);\n  if(!files.length) return;\n  var f = files.find(function(x){ return /(^|\\/)library\\.json$/i.test(x.webkitRelativePath || x.name); })\n       || files.find(function(x){ return /library\\.json$/i.test(x.name); });\n  if(!f){ toast(tr('folderNoJson'), true); return; }\n  // File objects obtained via <input webkitdirectory> are snapshots.\n  // Keep the latest selection for display, but ask the user to reselect the folder for future updates.\n  STATE.lastFolderFiles = files;\n  var text = await f.text();\n  try{ var cached = loadLibraryData(JSON.parse(text), f); toast(cached ? tr('loaded') : tr('loadedNoCache'), !cached); }\n  catch(err){ toast(tr('loadFail', err.message), true); }\n}\nasync function chooseLibrary(){\n  if(window.showDirectoryPicker){\n    try{\n      var dir = await window.showDirectoryPicker();\n      var h = await dir.getFileHandle('library.json');\n      STATE.dirHandle = dir;\n      STATE.libraryFileHandle = h;\n      await loadLibraryFromHandle(false);\n      return;\n    }catch(err){\n      if(err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) return;\n      toast(tr('loadFail', err && err.message ? err.message : err), true);\n      return;\n    }\n  }\n  if($('#folder') && 'webkitdirectory' in $('#folder')) $('#folder').click();\n  else $('#file').click();\n}\nasync function libraryButtonAction(){\n  if(STATE.items.length) await reloadLibrary();\n  else await chooseLibrary();\n}\n$('#btnLoad').addEventListener('click', function(){ chooseLibrary(); });\n$('#btnReloadLib').addEventListener('click', function(){ reloadLibrary(); });\n$('#folder').addEventListener('change', function(e){\n  loadLibraryFromSelectedFolder(e.target.files);\n  e.target.value = '';\n});\n$('#file').addEventListener('change', async function(e){\n  var f = e.target.files[0]; e.target.value = '';\n  if(!f) return;\n  try{ await readLibraryFileObject(f, '', false); }\n  catch(err){ toast(tr('loadFail', err.message), true); }\n});\n$('#q').addEventListener('input', render);\n$('#coll').addEventListener('change', render);\n$('#tag').addEventListener('change', render);\n$('#fStar').addEventListener('change', render);\n$('#fMine').addEventListener('change', render);\n$('#style').addEventListener('change', function(){ savePrefs(); render(); refreshCitations({ silent: true }); });\n$('#incTitle').addEventListener('change', function(){ savePrefs(); render(); refreshCitations({ silent: true }); });\n$('#incUrl').addEventListener('change', function(){ savePrefs(); render(); refreshCitations({ silent: true }); });\nsegButtons().forEach(function(b){\n  b.addEventListener('click', function(){ setMarkerActive(b.dataset.val); savePrefs(); refreshCitations({ silent: true }); });\n});\n$('#btnRefresh').addEventListener('click', function(){ refreshCitations(); });\n$('#btnLang').addEventListener('click', function(){ setLang(LANG === 'ja' ? 'en' : 'ja'); });\n$('#results').addEventListener('click', function(e){\n  var num = e.target.closest('[data-num]'), cp = e.target.closest('[data-copy]');\n  var list = $('#results').__list || [];\n  if(num){ var it0 = list[+num.dataset.num]; if(it0) insertCitationNumber(it0); }\n  else if(cp){ var it2 = list[+cp.dataset.copy]; if(it2) copyCitation(it2); }\n});\n\n/* ---- i18n apply / language ---- */\nfunction applyI18n(){\n  document.querySelectorAll('[data-i18n]').forEach(function(el){ var v = I18N[LANG][el.dataset.i18n]; if(typeof v === 'string') el.textContent = v; });\n  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ var v = I18N[LANG][el.dataset.i18nPh]; if(typeof v === 'string') el.placeholder = v; });\n  document.querySelectorAll('[data-i18n-title]').forEach(function(el){ var v = I18N[LANG][el.dataset.i18nTitle]; if(typeof v === 'string') el.title = v; });\n  var refreshLabel = $('#refreshLabel'); if(refreshLabel) refreshLabel.textContent = tr('refreshBtn');\n  $('#btnLang').textContent = (LANG === 'ja') ? 'EN' : '日本語';\n  document.documentElement.lang = LANG;\n  if(STATE.items.length) buildFilterOptions();\n  updateLibInfo();\n  render();\n}\nfunction setLang(l){ LANG = l; try{ localStorage.setItem(LS_LANG, l); }catch(e){} applyI18n(); }\n\n/* ---- startup: restore prefs + cached library ---- */\nfunction restore(){\n  try{ LANG = localStorage.getItem(LS_LANG) || 'ja'; }catch(e){ LANG = 'ja'; }\n  if(LANG !== 'en' && LANG !== 'ja') LANG = 'ja';\n  try{ Object.assign(PREFS, JSON.parse(localStorage.getItem(LS_PREFS)||'{}')); }catch(e){}\n  $('#style').value = PREFS.style || 'acs';\n  $('#incTitle').checked = !!PREFS.includeTitle;\n  $('#incUrl').checked = !!PREFS.includeUrl;\n  setMarkerActive(PREFS.marker || 'bracket');\n  try{\n    var cached = JSON.parse(localStorage.getItem(LS_LIB)||'null');\n    if(cached && cached.items){ STATE.items = cached.items; STATE.collections = cached.collections||[]; STATE.libraryLabel = cached.libraryLabel || ''; STATE.cached = true; }\n  }catch(e){}\n  applyI18n();\n}\nrestore();\n\nif(window.Office && Office.onReady){\n  Office.onReady(function(info){ officeReady = !!(info && info.host); });\n} else {\n  officeReady = false;\n}\n<\/script>\n<\/body>\n<\/html>\n"},
};
/* === END WORDADDIN_FILES === */
function connectorSnapshot(){
  const saved = {};
  for(const it of lib.items){
    if(it.doi) saved['doi:' + String(it.doi).toLowerCase()] = it.collections || [];
    if(it.arxiv) saved['arxiv:' + String(it.arxiv).toLowerCase().replace(/v\d+$/,'')] = it.collections || [];
  }
  const persistent = !!(backend && backend.kind === 'fs');
  // Stable per-library id so the extension can offer a destination-library
  // picker and route each save to the right library (survives folder renames).
  if(persistent && !lib.libraryId){ lib.libraryId = uid(); touch(); }
  return {
    persistent,
    libraryId: lib.libraryId || '',
    libraryName: (backend && backend.name) || '',
    collections: lib.collections.map(c => ({ id:c.id, name:c.name, parent:c.parent || '' })),
    saved,
  };
}
let connectorTimer = null;
function connectorNotify(immediate){
  if(!backend) return;
  clearTimeout(connectorTimer);
  connectorTimer = setTimeout(()=>{
    window.postMessage({ source:'refshelf-app', action:'snapshot', snapshot:connectorSnapshot() }, '*');
  }, immediate ? 0 : 600);
}
function connectorAuthors(list){
  return (list || []).map(s=>{
    s = String(s).trim();
    if(!s) return null;
    if(s.includes(',')){ const p = s.split(','); return { family:p[0].trim(), given:p.slice(1).join(',').trim() }; }
    const p = s.split(/\s+/); return { family:p.pop() || '', given:p.join(' ') };
  }).filter(Boolean);
}
async function connectorImportOne(p){
  let it = null;
  if(p.doi){ try{ it = await fetchCrossref(normDoi(p.doi)); }catch(e){ console.warn('connector: CrossRef failed', e); } }
  if(!it && p.arxiv){ try{ it = await fetchArxiv(p.arxiv); }catch(e){ console.warn('connector: arXiv failed', e); } }
  if(!it){
    // offline / unresolvable → keep what the extension scraped from the page
    it = newItem({
      type: p.arxiv ? 'preprint' : (p.doi ? 'article' : 'web'),
      title: p.title || '', journal: p.journal || '', year: String(p.year || ''),
      doi: p.doi ? normDoi(p.doi) : '', arxiv: p.arxiv || '', url: p.url || '',
      abstract: p.abstract || '', authors: connectorAuthors(p.authors),
    });
  }
  if(!it.url && p.url) it.url = p.url;
  if(!it.abstract && p.abstract) it.abstract = p.abstract;
  const collIds = (p.collections || []).filter(id => lib.collections.some(c => c.id === id));
  if(collIds.length) it.collections = collIds;
  return it;
}
window.addEventListener('message', async (e)=>{
  const d = e.data;
  if(e.source !== window || !d || d.source !== 'refshelf-connector') return;
  if(!backend) return; // home screen: no library to report or import into
  if(d.action === 'hello'){ connectorNotify(true); return; }
  if(d.action === 'import' && Array.isArray(d.items)){
    const results = [], newOnes = [];
    for(const p of d.items){
      try{
        const it = await connectorImportOne(p);
        const res = addItems([it]);
        if(res.added) newOnes.push(it);
        results.push({ id:p.id, ok:true, added:res.added, skipped:res.skipped });
      }catch(err){
        console.error(err);
        results.push({ id:p.id, ok:false, error:String(err && err.message || err) });
      }
    }
    renderAll();
    window.postMessage({ source:'refshelf-app', action:'import-result', results }, '*');
    const n = results.filter(r=>r.ok).length;
    if(n) showToast(I18N[lang].connectorImported(n));
    for(const it of newOnes){
      try{ await tryAutoAttachPdf(it); }catch(err){ console.warn(err); }
    }
  }
});

// export
function collectionNamesForItem(item){
  return (item.collections||[]).map(id=>{
    const c = lib.collections.find(x=>x.id===id);
    return c ? c.name : id;
  }).filter(Boolean);
}
function itemToExportObject(item){
  const out = Object.assign({}, item);
  out.collections = collectionNamesForItem(item);
  out.attachments = (item.attachments||[]).map(a=>({name:a.name, type:a.type||''}));
  return out;
}
function csvCell(v){
  const s = Array.isArray(v) ? v.join('; ') : String(v==null ? '' : v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function itemsToCsv(items){
  const headers = ['Item type','Title','Authors','Journal','Year','Volume','Issue','Pages','DOI','URL','Keywords','Folders filed in','Citekey','Abstract','Notes'];
  const rows = items.map(it=>[
    it.type || '',
    it.title || '',
    authorsToText(it.authors).replace(/\n/g, '; '),
    journalDisplay(it),
    it.year || '',
    it.volume || '',
    it.issue || '',
    it.pages || '',
    it.doi || '',
    it.url || '',
    (it.tags||[]).join('; '),
    collectionNamesForItem(it).join('; '),
    it.citekey || '',
    it.abstract || '',
    it.notes || '',
  ]);
  return [headers, ...rows].map(r=>r.map(csvCell).join(',')).join('\n');
}
function doExport(fmt){
  const items = visibleItems();
  if(!items.length){ showToast(t('emptyMsg'), true); return; }
  const stamp = new Date().toISOString().slice(0,10);
  if(fmt==='bib') download(`paper-library-${stamp}.bib`, items.map(itemToBibTeX).join('\n'));
  else if(fmt==='ris') download(`paper-library-${stamp}.ris`, items.map(itemToRIS).join(''));
  else if(fmt==='csv') download(`paper-library-${stamp}.csv`, itemsToCsv(items), 'text/csv;charset=utf-8');
  else if(fmt==='json') download(`paper-library-${stamp}.json`, JSON.stringify(items.map(itemToExportObject), null, 1), 'application/json');
  showToast(I18N[lang].exported(items.length));
}
$('#miExportBib').addEventListener('click', ()=>{ doExport('bib'); closeMenus(); });
$('#miExportRis').addEventListener('click', ()=>{ doExport('ris'); closeMenus(); });
$('#miExportCsv').addEventListener('click', ()=>{ doExport('csv'); closeMenus(); });
$('#miExportShownJson').addEventListener('click', ()=>{ doExport('json'); closeMenus(); });
$('#miExportJson').addEventListener('click', ()=>{
  download(`paper-library-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(lib,null,1), 'application/json');
  closeMenus();
});

/* ---------------------------------------------------------------
   Init
---------------------------------------------------------------- */
(async function init(){
  applyI18n();
  applyTheme();
  initAdvSearchStyleChooser();
  const uaMobile = !!(navigator.userAgentData && navigator.userAgentData.mobile);
  const mobileDevice = uaMobile || /Android|iPhone|iPod|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
  if(mobileDevice){
    document.body.classList.add('mobileBlocked');
    renderIcons($('#mobileBlock'));
    return;
  }
  if(!HAS_FS){
    $('#fsWarn').style.display = 'block';
    $('#btnOpenFolder').style.display = 'none';
  }else{
    try{
      const last = await idbGet('lastDir');
      if(last){
        if(await canAutoOpenDir(last) && await dirHasLibrary(last)){
          if(await startWithBackend(fsBackend(last))) return;
        }
        const lastPath = last.path || last.fullPath || last.name || '';
        $('#btnOpenLast').style.display = '';
        $('#lastLibName').innerHTML = ic('folder') + ' ' + esc(lastPath);
        $('#lastLibName').title = lastPath;
      }
    }catch(e){ /* ignore */ }
  }
})();

// expose internals for testing in console
window.__refshelf = { parseBibTeX, parseRIS, parseZoteroRdf, itemToBibTeX, itemToRIS, parseIdInput, parseScienceDirectUrl, fetchScienceDirectPii, itemToCitation, itemToCitationHtml, normalizeRange, newItem,
  inputToSearchQuery, searchCrossref,
  resolveOpenAlexWork, fetchOpenAlexReferences, fetchOpenAlexCitedBy, openAlexToItem, openCitationsDialog,
  enrichCorresponding, oaCorrespondingAuthors, refreshCitedByCounts, refreshCorrespondingAuthors,
  buildGraphData, graphLayout, openGraphDialog, get graphState(){ return graphState; },
  get lib(){ return lib; }, startDemo: ()=>startWithBackend(memBackend()),
  buildZip, downloadConnectorZip, get connectorFiles(){ return CONNECTOR_FILES; } };
