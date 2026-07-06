# Paper Library

[English](#english) | [日本語](#japanese)

---

<a id="english"></a>
## English

A local-first browser-based reference manager for papers, books, and other academic references.

Paper Library runs as a single HTML file in your browser. It can manage reference metadata, collections, tags, PDF attachments, citation-related information, and import/export files without requiring a server or installation.

## Features

- Add references manually or from DOI, arXiv, and URL information
- Manage papers, books, reports, theses, and other reference types
- Organize items using collections and tags
- Search references by title, author, DOI, journal, year, notes, and other metadata
- Import reference data from BibTeX, RIS, CSV, and JSON files
- Export displayed items or the entire library as BibTeX, RIS, CSV, or JSON
- Attach and manage PDF files
- Refresh citation counts and corresponding-author information when available
- View citation-related information and reference networks
- Detect duplicate or incomplete records
- Switch between table view and card view
- Use light mode or dark mode
- Switch between English and Japanese UI
- Store library data locally in a selected folder

## Usage

You can use this tool in either of the following ways.

### 1. Use the online version

If GitHub Pages is enabled for this repository, open the site below:

```text
https://t-shiokawa1.github.io/Paper-Library/
```

### 2. Use the local HTML file

Download `index.html` from this repository and open it in a supported browser.

For full functionality, use a browser that supports the File System Access API, such as Google Chrome or Microsoft Edge.

## First-time setup

1. Open the application in Chrome or Edge.
2. Click **Open / create a library folder**.
3. Select a folder where the library data should be stored.
4. Allow the browser to edit files in that folder when prompted.
5. Start adding references.

The application stores data locally, typically as a library file and an attachments folder inside the selected directory.

## Import and export

Supported import formats:

- BibTeX `.bib`
- RIS `.ris`
- CSV `.csv`
- JSON `.json`

Supported export formats:

- BibTeX
- RIS
- CSV
- JSON

## Browser compatibility

Recommended browsers:

- Google Chrome
- Microsoft Edge

Some features may not work in browsers that do not support the File System Access API.

## Privacy

Paper Library is designed as a local-first application. Reference data and PDF attachments are stored in the folder selected by the user.

Some features may access external services to retrieve metadata, citation counts, or related reference information. Do not use those features for private or confidential reference data if external lookup is not desired.

## File structure

```text
.
└── index.html
```

## Technologies used

- HTML
- CSS
- JavaScript
- File System Access API

## License

This project is licensed under the MIT License.

---

<a id="japanese"></a>
## 日本語

Paper Library は，論文，書籍，その他の学術文献を管理するための，ローカルファーストなブラウザベースの文献管理ツールです．

単一の HTML ファイルとして動作し，サーバーやインストールを必要とせず，文献情報，コレクション，タグ，PDF 添付，引用関連情報，インポート・エクスポートをブラウザ上で扱えます．

## 機能

- DOI，arXiv，URL から文献情報を追加
- 手動で文献情報を追加
- 論文，書籍，レポート，学位論文などの文献タイプに対応
- コレクションとタグによる文献整理
- タイトル，著者，DOI，雑誌名，年，メモなどによる検索
- BibTeX，RIS，CSV，JSON 形式のインポート
- 表示中の文献またはライブラリ全体のエクスポート
- PDF ファイルの添付と管理
- 利用可能な場合，被引用数や責任著者情報を取得
- 引用関連情報や文献ネットワークの表示
- 重複候補や不完全なレコードの検出
- テーブル表示とカード表示の切り替え
- ライトモード・ダークモードの切り替え
- 日本語・英語 UI の切り替え
- 選択したローカルフォルダへのライブラリ保存

## 使い方

このツールは，以下のどちらかの方法で使用できます．

### 1. オンライン版を使う

このリポジトリで GitHub Pages を有効化している場合は，以下のサイトにアクセスしてください．

```text
https://t-shiokawa1.github.io/Paper-Library/
```

### 2. HTML ファイルをローカルで開く

このリポジトリから `index.html` をダウンロードし，対応ブラウザで開いてください．

すべての機能を使用するには，File System Access API に対応した Google Chrome または Microsoft Edge の使用を推奨します．

## 初回設定

1. Chrome または Edge でアプリを開きます．
2. **Open / create a library folder** をクリックします．
3. ライブラリデータを保存するフォルダを選択します．
4. ブラウザからフォルダ編集の許可を求められた場合は，許可します．
5. 文献の追加を開始します．

ライブラリデータは，選択したフォルダ内にローカル保存されます．通常は，ライブラリファイルと添付ファイル用フォルダとして管理されます．

## インポート・エクスポート

対応インポート形式：

- BibTeX `.bib`
- RIS `.ris`
- CSV `.csv`
- JSON `.json`

対応エクスポート形式：

- BibTeX
- RIS
- CSV
- JSON

## 対応ブラウザ

推奨ブラウザ：

- Google Chrome
- Microsoft Edge

File System Access API に対応していないブラウザでは，一部の機能が使用できない場合があります．

## プライバシー

Paper Library は，ローカルファーストなアプリケーションとして設計されています．文献情報や PDF 添付ファイルは，ユーザーが選択したフォルダ内に保存されます．

一部の機能では，メタデータ，被引用数，関連文献情報を取得するために外部サービスへアクセスする場合があります．外部検索を避けたい非公開・機密性の高い文献データでは，それらの機能を使用しないでください．

## ファイル構成

```text
.
└── index.html
```

## 使用技術

- HTML
- CSS
- JavaScript
- File System Access API

## ライセンス

This project is licensed under the MIT License.

本プロジェクトは MIT License の下で公開されています．
