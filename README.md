# quotation-generator-app

「PPバンド5000本、関東向け」のような自然文入力から、梱包資材の見積書を作成する Vite + React アプリです。
製品マスタ、単価、送料、値引率はデモ用の仮定値としてアプリ内に定義しています。

## セットアップ

```bash
npm install
npm run dev
```

## 主な機能

- 依頼内容の自然文から製品・数量・配送エリアを抽出
- 仮定の製品マスタ、地域別送料、大口値引、消費税で見積金額を自動計算
- 宛先と発行日を編集可能
- 一般的な見積書レイアウトを画面右側に即時プレビュー
- PC の印刷ダイアログから印刷または PDF 保存が可能

## 入力例

- `PPバンド5000本、関東向け`
- `PPバンド 1200本 関西向け`
- `ストレッチフィルム240巻、中部向け`

## Render デプロイ手順

1. GitHub にこのリポジトリを push する。
2. Render ダッシュボードで **New +** → **Static Site** を選択。
3. GitHub リポジトリを接続。
4. Build Command に `npm install && npm run build` を設定。
5. Publish Directory に `dist` を設定。
6. **Create Static Site** をクリックしてデプロイ完了。

## Vercel デプロイ手順

1. Vercel にログインし、**Add New...** → **Project** を選択。
2. GitHub リポジトリを Import。
3. Framework Preset が `Vite` になっていることを確認。
4. Build Command は `npm run build`、Output Directory は `dist` を確認。
5. **Deploy** をクリックして公開完了。
