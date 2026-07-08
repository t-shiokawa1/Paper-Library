# Paper Library — Word アドイン / Word add-in

Word に「**Paper Library**」タブを追加し、そこから文献を検索して**引用文献をカーソル位置に挿入**する Office アドインです。Mac 版・Windows 版・Web 版の Word で動きます。

An Office add-in that adds a **Paper Library** ribbon tab to Word: search your references and **insert a formatted citation** at the cursor. Works in Word for Mac, Windows, and the web.

> この ZIP は Paper Library 本体（`index.html`）のマニュアル「**Word**」タブからダウンロードできます。図付きの導入手順もそちらにあります。
> This ZIP can be downloaded from the **Word** tab of the Paper Library manual (in `index.html`), which also has an illustrated setup guide.

---

## 中身 / Files

| File | 役割 |
|------|------|
| `manifest.xml` | アドインの定義（リボンタブ・タスクペインの場所）。Word に読み込ませるのはこれ |
| `taskpane.html` | パネル本体（検索 UI・引用整形・挿入）。単一ファイルで完結 |
| `functions.html` | Office 必須の初期化ファイル（中身はほぼ空） |
| `assets/icon-*.png` | リボン用アイコン |
| `serve-https.py` / `make-cert.sh` | ローカル HTTPS 配信用（テスト時のみ） |

> **重要**: Office アドインのパネルは **HTTPS でしか動きません**（`file://` 不可）。ローカルで試すには下記の HTTPS サーバーを使い、公開する場合は GitHub Pages 等に置きます。

---

## 使い方 / How to use（アドインが入ったあと）

1. Word のリボンに追加された **「Paper Library」タブ → 「文献を挿入」** を押すとパネルが開きます。
2. パネルの **「ライブラリ」ボタン**で `library.json` を読み込みます。
   - 場所: Paper Library の保存フォルダ内の `library.json`、または本体アプリの「エクスポート → ライブラリ全体 → JSON」で書き出したファイル。
   - 一度読み込むとアドイン内にキャッシュされ、次回から自動で復元します。文献を増やしたら再読み込みしてください。
3. 検索欄でタイトル・著者・雑誌・DOI などで絞り込み、スタイル（ACS / Nature / …）を選びます。
4. 各文献の **「引用を挿入」** で、カーソル位置に整形済みの引用文献が入ります（雑誌名は斜体、年は太字など）。

---

## A. ローカルで試す / Test locally（まずはこちら）

### 1. 証明書を作って信頼させる（初回のみ）
```bash
cd "paper-library-word-addin"
bash make-cert.sh
# macOS: 表示されるコマンドで localhost 証明書を信頼させる
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain localhost-cert.pem
```

### 2. HTTPS サーバーを起動
```bash
python3 serve-https.py      # https://localhost:3000 で配信
```
ブラウザで `https://localhost:3000/taskpane.html` を開き、鍵マークが有効（証明書エラーが出ない）ことを確認しておくと確実です。

### 3. Word にサイドロード（manifest を登録）

**macOS**: `manifest.xml` を次のフォルダにコピー
```
~/Library/Containers/com.microsoft.Word/Data/Documents/wef/
```
（`wef` が無ければ作成）。Word を再起動し、**挿入タブ → アドイン → 個人用アドイン (My Add-ins)** に「Paper Library」が出ます。リボンに「Paper Library」タブも追加されます。

**Windows**: 共有フォルダー方式が簡単です。任意のフォルダーを共有し、Word の **ファイル → オプション → セキュリティ センター → 信頼できるアドイン カタログ** にそのフォルダーの UNC パスを登録 → Word 再起動 → **挿入 → アドイン → 共有フォルダー** から追加。

> ヒント: Word for Mac では `manifest.xml` を変更するたびに Word の再起動が必要です。パネルの中身（taskpane.html）だけを変えた場合はパネルを閉じて開き直すだけで反映されます。

---

## B. 公開して常用する / Publish（GitHub Pages）

このリポジトリの GitHub Pages（`https://t-shiokawa1.github.io/Paper-Library/`）で公開する前提の **URL 置換済み manifest** を同梱しています → **`manifest.github.xml`**。自分で `localhost` を書き換える必要はありません。

1. `taskpane.html`・`functions.html`・`assets/` を、リポジトリ直下の `word-addin/` フォルダに置く（GitHub の «Add file → Upload files» でフォルダごとアップロード可）。公開先は `https://t-shiokawa1.github.io/Paper-Library/word-addin/`。
2. `manifest.github.xml` を上記 A-3 と同じ手順でサイドロード（ローカルの `manifest.xml` の代わりに、これを使う）。以後はローカルサーバー不要です。
3. 別のリポジトリ／URL に公開する場合だけ、`manifest.github.xml` 内の `https://t-shiokawa1.github.io/Paper-Library/word-addin` を自分の公開 URL に置換（`<AppDomain>` はオリジン `https://ホスト名` のみ）。
4. 更新時：`taskpane.html` を差し替えて push すれば、各自パネルを開き直すだけで反映。`manifest.github.xml` を変えていなければ再サイドロード不要です。

**English:** A ready-to-publish manifest with URLs already pointing at this repo's GitHub Pages is bundled as **`manifest.github.xml`** — no localhost editing needed. Put `taskpane.html`, `functions.html` and `assets/` into a `word-addin/` folder at the repo root (served at `https://t-shiokawa1.github.io/Paper-Library/word-addin/`), then sideload `manifest.github.xml` (in place of `manifest.xml`). To publish elsewhere, replace `https://t-shiokawa1.github.io/Paper-Library/word-addin` in `manifest.github.xml` with your own host (`<AppDomain>` is the origin only). To update, push a new `taskpane.html`; users just reopen the panel.

---

## できること / できないこと（MVP）

- ✅ library.json を読み込んでオフライン検索、コレクションで絞り込み
- ✅ アプリと同じ引用スタイル（ACS / Nature / Science / RSC / CSJ / Angew.(GDCh)）で、斜体・太字付きのまま挿入
- ✅ **番号付き引用 [1]（または上付き）＋末尾の文献リストを自動連動**（下記）
- ✅ 引用のコピー（他アプリ貼り付け用）
- ⛔ ローカルフォルダの自動同期は不可（サンドボックス制約）。library.json を読み込む方式です

## 番号付き引用と文献リスト / Numbered citations & bibliography

- 各文献カードの **「挿入」** で、カーソル位置に番号（[1] など）を挿入します。中身は Word の非表示コンテンツコントロールに文献IDを埋め込んでいます。
- 番号は**出現順**に自動採番。同じ文献を再引用すると**同じ番号**を使い回します。
- 挿入するたびに、本文の番号と**末尾の文献リストが自動で更新**されます。文献を消したり並べ替えたりしたら、パネル上部の **「文献リストを更新」** で再同期してください。
- **番号の見た目**はパネルの「番号」で **[1]（角括弧）／上付き ¹** を切替え可能（切替えると既存の番号も一括変換）。角括弧のときは文献リストの番号も **[1]** で揃います。
- 文献リストは選んだスタイル（ACS / Nature / …）で番号順に組まれ、**ぶら下げインデント**（番号だけ左に浮く）で文書末尾に入ります。
- **挿入される文字は Times New Roman 10.5pt** が既定です（本文の番号・文献リスト・全文いずれも）。
- 従来の **「全文」** ボタンは、番号ではなく整形済みの引用文をそのまま挿入します（用途で使い分け）。
- パネル右上の **EN / 日本語** ボタンで表示言語を切り替えられます。

---

## 仕組み / Notes

- パネルの引用整形は本体 `index.html` の `itemToCitationHtml` などを移植したものです。本体の引用ロジックを変えたら `taskpane.html` 側も合わせてください。
- 挿入は Office.js の `setSelectedDataAsync(html, {coercionType: Html})` を使用（斜体・太字が保持されます）。
- ライブラリはブラウザ（Word の WebView）の localStorage にキャッシュします。非常に大きい library.json はキャッシュされずメモリ保持になる場合があります（その場合は起動ごとに再読み込み）。
