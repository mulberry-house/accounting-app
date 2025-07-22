# Accounting App

このアプリは、React + TypeScript + Tailwind CSS を使用した簡易的な会計管理ツールです。
ローカルストレージを利用して注文や売上を保存・表示します。

## 主な機能

- メニューの追加・編集
- 商品価格の変更
- 注文の追加・削除
- 会計済み/未会計の切り替え
- 会計状況ごとの注文履歴表示
- 商品別・全体の売上集計表示

## 起動方法

```bash
git clone https://github.com/mulberry-house/accounting-app.git
cd accounting-app
npm install
npm start
```

## デプロイ方法（Vercel）

1. GitHubとVercelを連携し、本リポジトリをインポート
2. 設定値は以下の通り：

- Framework Preset: `React`
- Build Command: `npm run build`
- Output Directory: `build`

3. デプロイ完了後、表示されたURLからアクセスできます。