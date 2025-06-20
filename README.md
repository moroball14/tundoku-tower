# 📚 積読タワー

積読を楽しく管理する読書アプリです。本を「積むことも含めて楽しい体験」として捉え、読書のモチベーションを高めることを目的としています。

## ✨ 機能

### MVP 機能

- **📖 書籍検索・登録**: ISBN またはタイトルで Google Books API から書籍情報を取得
- **🏗️ 積読タワー表示**: 登録した本を視覚的なタワー形式で表示
- **📊 読書ステータス管理**: 未読・読書中・読了の管理
- **💾 ローカルストレージ**: SQLite WebAssembly によるブラウザ内データ保存

### 特徴

- **🌐 ブラウザ完結**: インストール・アカウント不要
- **📱 PWA 対応**: オフライン利用・ホーム画面追加可能
- **🎨 直感的 UI**: 本を積む楽しさを表現した視覚的デザイン
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

1. **書籍を検索**: ISBN またはタイトルで書籍を検索
2. **本を追加**: 検索結果から本を選択して積読タワーに追加
3. **タワーを眺める**: 積み上がった本のタワーを楽しむ
4. **読書管理**: 本をクリックしてステータスを更新
5. **統計確認**: 読書の進捗を数値で確認

## 🔮 今後の拡張予定

- バーコード読み取り機能
- メモ・感想記録
- 読書統計・グラフ表示
- SNS 共有機能
- ダークモード対応

## 🚀 デプロイ

### GitHub Pages への自動デプロイ

このプロジェクトは GitHub Actions を使用して GitHub Pages への自動デプロイが設定されています。

#### デプロイ設定

- `main`ブランチへの push 時に自動実行
- Node.js 環境でビルド
- 静的ファイルを GitHub Pages にデプロイ

### 手動デプロイ

```bash
npm run deploy
```

## 📝 ライセンス

MIT License
