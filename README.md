# persona-task-app

感覚派で継続が苦手な 24 歳女性ペルソナ向けに、
「小さな達成を積み重ねてやる気を育てる」体験を意識したタスク管理アプリです。

## セットアップ

```bash
npm install
npm run dev
```

## 主な機能

- 進捗バーで達成度を可視化
- 気分を邪魔しない柔らかい配色と UI
- タスク完了数に応じた励ましメッセージ
- 「今できそうなこと」を素早く追加できる入力導線

## Render デプロイ手順

1. GitHub にこのリポジトリを push する。
2. Render ダッシュボードで **New +** → **Static Site** を選択。
3. GitHub リポジトリ `persona-task-app` を接続。
4. Build Command に `npm install && npm run build` を設定。
5. Publish Directory に `dist` を設定。
6. **Create Static Site** をクリックしてデプロイ完了。

## Vercel デプロイ手順

1. Vercel にログインし、**Add New...** → **Project** を選択。
2. GitHub リポジトリ `persona-task-app` を Import。
3. Framework Preset が `Vite` になっていることを確認。
4. Build Command は `npm run build`、Output Directory は `dist` を確認。
5. **Deploy** をクリックして公開完了。

