# 📚 積読タワー

積読を楽しく管理する読書アプリです。本を「積むことも含めて楽しい体験」として捉え、読書のモチベーションを高めることを目的としています。

## ✨ 機能

### MVP機能
- **📖 書籍検索・登録**: ISBNまたはタイトルでGoogle Books APIから書籍情報を取得
- **🏗️ 積読タワー表示**: 登録した本を視覚的なタワー形式で表示
- **📊 読書ステータス管理**: 未読・読書中・読了の管理
- **💾 ローカルストレージ**: SQLite WebAssemblyによるブラウザ内データ保存

### 特徴
- **🌐 ブラウザ完結**: インストール・アカウント不要
- **📱 PWA対応**: オフライン利用・ホーム画面追加可能
- **🎨 直感的UI**: 本を積む楽しさを表現した視覚的デザイン
- **📊 統計表示**: 未読・読書中・読了の冊数を一目で確認

## 🛠️ 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **データベース**: SQLite (WebAssembly)
- **API**: Google Books API
- **PWA**: Service Worker + Web App Manifest

## 🚀 開発・実行

### 必要な依存関係のインストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

## 📁 プロジェクト構成

```
src/
├── components/          # Reactコンポーネント
│   ├── BookSearch.tsx  # 書籍検索コンポーネント
│   ├── BookTower.tsx   # 積読タワー表示
│   └── BookModal.tsx   # 書籍詳細モーダル
├── db/                 # データベース関連
│   ├── database.ts     # SQLite WebAssembly管理
│   └── schema.sql      # データベーススキーマ
├── services/           # 外部API連携
│   └── bookApi.ts      # Google Books API
├── types/              # 型定義
│   └── book.ts         # 書籍関連の型
└── App.tsx             # メインアプリケーション
```

## 🎯 使い方

1. **書籍を検索**: ISBNまたはタイトルで書籍を検索
2. **本を追加**: 検索結果から本を選択して積読タワーに追加
3. **タワーを眺める**: 積み上がった本のタワーを楽しむ
4. **読書管理**: 本をクリックしてステータスを更新
5. **統計確認**: 読書の進捗を数値で確認

## 🔮 今後の拡張予定

- バーコード読み取り機能
- メモ・感想記録
- 読書統計・グラフ表示
- SNS共有機能
- ダークモード対応

## 🚀 デプロイ

### GitHub Pagesへの自動デプロイ

このプロジェクトはGitHub Actionsを使用してGitHub Pagesへの自動デプロイが設定されています。

#### 初回デプロイ設定

1. **GitHubリポジトリを作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/tundoku-tower.git
   git push -u origin main
   ```

2. **GitHub Pagesの有効化**
   - GitHubリポジトリの「Settings」→「Pages」へ移動
   - Source: 「GitHub Actions」を選択
   - 自動的にワークフローが実行され、デプロイされます

3. **アクセス**
   - デプロイ後、`https://USERNAME.github.io/tundoku-tower/` でアクセス可能

#### 自動デプロイの仕組み

- `main`ブランチへのpush時に自動実行
- Node.js環境でビルド
- 静的ファイルをGitHub Pagesにデプロイ
- PWA対応でオフライン利用も可能

### 手動デプロイ

```bash
npm run deploy
```

## 📝 ライセンス

MIT License
