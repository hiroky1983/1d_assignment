# GitHub Repository Search

## 開発環境 (Development Setup)

### 前提条件 (Prerequisites)

- **Node.js**: v22.16.0 以上
- **pnpm**: パッケージマネージャーとして使用

### セットアップ手順 (Setup)

1. **パッケージのインストール**

   ```bash
   pnpm install
   ```

2. **環境変数の設定**
   `.env.local` ファイルを作成し、GitHub Personal Access Token を設定してください。

   ```bash
   cp .env.example .env.local
   ```

   `.env.local` 内:

   ```
   GITHUB_TOKEN=your_github_token_here
   ```

   ※ Token がなくても動作しますが、API レート制限（60 回/時）がかかりやすくなります。

3. **開発サーバーの起動**
   ```bash
   pnpm dev
   ```
   http://localhost:3000 にアクセスしてください。

### テスト (Testing)

- **ユニットテスト (Vitest)**
  ```bash
  pnpm test        # ウォッチモード
  pnpm test:ci     # CI用 (シングルラン)
  ```
- **E2Eテスト (Playwright)**
  ```bash
  pnpm test:e2e    # ヘッドレスモード
  pnpm test:e2e:ui # UIモード
  ```
- **リント (ESLint)**
  ```bash
  pnpm lint
  ```

## 0. 全体方針

本課題は「GitHub 検索アプリを作る」こと自体よりも、

- **Next.js App Router を正しく理解して使えているか**
- **プロダクション・チーム開発・保守を意識した設計ができているか**
- **AI を使った開発を再現性のある形で設計できているか**

を示すことを目的とする。

---

## 1. 要件の解釈（ブレない前提）

- GitHub REST API **`GET /search/repositories`** を使用（固定）
- Next.js **14 以降 / App Router**
- 検索 → 一覧 → 詳細（**ページ遷移**、モーダル不可）
- 一覧は **ページネーション方式**
- テストコード必須
- UI はデザイン性より **見やすさ・操作しやすさ**
- プロダクションを想定した実装

---

## 2. アーキテクチャ方針（App Router 前提）

### Server / Client の責務分離

- **Server Component**
  - ルーティング
  - レイアウト・初期レンダリング
  - メタデータ生成（SEO/OGP）
- **Client Component**
  - 検索入力（debounce / IME 対応 / Enter）
  - ページネーション操作
  - インタラクティブな UI 更新

※ Global Context は将来のバグ温床になりやすいため極力使わない。

---

## 3. データ取得設計

- GitHub API は直接フロントから叩かず、**Route Handler（BFF）経由**
  - token 秘匿
  - レート制限対策（認証なし 60req/h → 認証あり 5000req/h）
  - レスポンス整形（DTO）
  - キャッシュ制御
- Server Actions は今回は使用しない
  - 理由: 検索は GET 相当の操作であり、Server Actions は POST 的な mutation 向け
  - Route Handler なら HTTP キャッシュヘッダーを細かく制御可能

---

## 4. 検索・UX 設計

- 検索方法：
  - ボタン検索
  - 入力停止（1〜2 秒）で自動検索
  - IME 変換中は検索を発火させない
- 検索状態は **URL（`?q=&page=`）で管理**
  - 戻る / 共有 / 再訪が自然
- リクエスト競合は `AbortController` で最新のみ反映

---

## 5. ページネーション設計

- **page 指定で都度取得**を採用
  - 全件取得は非現実的・スケールしない
- 並び順は `sort/order/per_page` を固定し、揺れを最小化
- UX 対策：
  - `n–m / total`、`page / totalPages` 表示
  - 最終ページで「これ以上ありません」を明示
- ページ戻りは **BFF キャッシュ**で体感を担保

---

## 6. パフォーマンス・表示制御

- **loading.tsx**
  - 検索一覧：基本使わない（同一ページ内更新のため）
  - **詳細ページでは使用**（遷移＋ Server fetch）
- **Skeleton UI**
  - 一覧・詳細ともにページ内 Skeleton を用意
- **error.tsx**
  - ルートレベルのエラーバウンダリとして実装

---

## 7. コンポーネント設計

### ディレクトリ設計

```
app/
├── page.tsx
├── error.tsx
├── repo/
│   └── [owner]/
│       └── [name]/
│           ├── page.tsx
│           └── loading.tsx
└── api/
    ├── search/
    │   └── route.ts
    └── repo/
        └── [owner]/
            └── [name]/
                └── route.ts

screens/
├── SearchScreen.tsx
└── RepoDetailScreen.tsx

features/
├── search/
│   ├── components/
│   ├── hooks/
│   └── types/
└── repo-detail/
    ├── components/
    └── types/

components/
├── ui/
├── layout/
│   └── Header.tsx
└── states/
    ├── ErrorState.tsx
    ├── EmptyState.tsx
    └── LoadingState.tsx

lib/
├── fetcher.ts
└── env.ts
```

### 責務一覧

| ディレクトリ             | 責務                               | Server/Client |
| ------------------------ | ---------------------------------- | ------------- |
| `app/**/page.tsx`        | ルーティングのエントリーポイント   | Server        |
| `app/**/loading.tsx`     | ルート遷移時のフォールバック       | Server        |
| `app/**/error.tsx`       | エラーバウンダリ                   | Client        |
| `app/api/**/route.ts`    | BFF（外部 API 呼び出し・DTO 整形） | Server        |
| `screens/`               | 画面単位の合成・初期レンダリング   | Server        |
| `features/*/components/` | ユースケース固有 UI                | Client        |
| `features/*/hooks/`      | インタラクティブ処理               | Client        |
| `features/*/types/`      | DTO・型定義                        | 両対応        |
| `components/ui/`         | 汎用 UI コンポーネント             | 両対応        |
| `components/states/`     | 状態 UI（Error/Empty/Loading）     | Client        |
| `lib/`                   | ユーティリティ                     | Server        |

---

## 8. エラー設計

- **ErrorState コンポーネントに統合**
  - エラーが起きたことを明示
  - ステータスコード別のメッセージ表示
  - 再試行ボタン
  - `aria-live="polite"` で読み上げ対応
- ステータスコード別メッセージ例：
  - 401: 認証エラー
  - 403: レート制限超過（しばらく待ってから再試行）
  - 404: 見つかりません
  - 422: 検索条件が不正
  - 503: GitHub サーバーエラー

---

## 9. CSS / UI 方針

- **TailwindCSS**を使用
- shadcn/ui は使わない（設定より実装に時間を使う）
- レスポンシブ：
  - モバイルで横スクロールが出ない
  - カードは `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - タップ領域 44px 以上確保
- アクセシビリティ：
  - `focus-visible` を統一
  - キーボード操作可能
  - 適切な aria 属性

---

## 10. 詳細ページ設計

### 表示項目（課題要件）

- リポジトリ名
- オーナーアイコン
- プロジェクト言語
- Star 数
- Watcher 数
- Fork 数
- Issue 数

### API 設計

- `search/repositories` のレスポンスには正確な Watcher 数が含まれない
- 詳細ページでは `GET /repos/{owner}/{repo}` を追加で叩く
- BFF (`/api/repo/[owner]/[name]`) で統合

### SEO 対応

- `generateMetadata` でリポジトリ名・説明を OGP に設定

---

## 11. 環境変数設計

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1),
})

export const env = envSchema.parse({
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
})
```

---

## 12. テスト方針

- **Unit / Component**: Vitest + Testing Library
- **API**: MSW でモック
- **E2E**: Playwright で主要フロー
- BFF 境界があることでテストが書きやすい

### テスト優先度

1. BFF（Route Handler）の正常系・異常系
2. 検索フォームのインタラクション
3. E2E で検索 → 詳細の導線

---

## 13. CI/CD

- GitHub Actions
  - lint / type-check / test を PR 時に実行
  - main マージで Vercel デプロイ（任意）

---

## 14. AI 駆動開発方針

- **再現性のある AI 駆動開発**
  - 誰がやっても同じ進め方になる
- **AGENTS.md**を用意
  - 役割・禁止事項・レビュー観点を明記
- AI 利用方法は **README に明記**（課題要件）

---

## 15. 保守性・メンテナンス性

- 関数には **JSDoc を付与**
  - 役割 / 引数 / 戻り値 / エラー条件
- 特に BFF・マッパー・ユーティリティを重点対象

---

## 16. README 構成（案）

```markdown
# GitHub Repository Search

## 概要

## セットアップ

## 環境変数

## 開発コマンド

## アーキテクチャ

## 工夫した点

- URL 駆動の状態管理
- BFF パターンによる API 抽象化
- エラーハンドリング（ステータスコード別対応）
- A11y 対応

## AI 利用レポート

- **使用ツール**:
- **AGENTS.md の設計意図**:
  - AI と人間の協業におけるルールを明文化し、コード品質の均質化を図るため。
  - 特にアーキテクチャの制約（BFF, Server Component）を AI に遵守させるためのコンテキストとして利用。
- **具体的な活用例**:
  - ディレクトリ構成の提案と作成
  - ボイラープレートコード（設定ファイル、型定義）の自動生成
  - UI コンポーネント（特に TailwindCSS スタイリング）の実装
  - エラーハンドリングロジックの統合

## 今後の改善点（時間があれば）
```

---

## まとめ

| 評価軸                 | 対応                              |
| ---------------------- | --------------------------------- |
| 課題要件               | 全項目カバー                      |
| 本番想定               | BFF / エラー設計 / 環境変数 / SEO |
| チーム開発             | JSDoc / AGENTS.md / テスト        |
| 見やすさ・操作しやすさ | レスポンシブ / A11y / ErrorState  |

todo

- pnpm-lock.yaml の frozen 設定
- ライブラリ選定理由
- テスト設計

## Security & Anti-Abuse (Bot対策)

公開APIを利用するアプリケーションとして、Botによる乱用やDoS攻撃（APIレートリミット枯渇）を防ぐために、多層的な防御策を講じています。

### 1. Rate Limiting (速度制限)

- **Tech**: `lru-cache` (In-Memory)
- **Strategy**: IPアドレスごとに **10秒間に10リクエスト** の制限を設けています。
- **Benefit**: 特定のユーザーやBotによる短期間の大量アクセスを遮断し、GitHub APIのトークン枯渇を防ぎます（全ユーザーへのサービス停止を回避）。

### 2. Input Validation (入力検証)

- **Server-Side**: Zodによる厳格な型チェックに加え、検索クエリの最大文字数を **100文字** に制限。異常に長いペイロードによる攻撃を水際で阻止します。
- **Client-Side**: `react-hook-form` によるリアルタイムバリデーション。100文字を超えた時点でエラーメッセージを表示し、無駄なリクエスト送信を抑制します。

### 3. Architecture

- **BFF Pattern**: クライアントからGitHub APIを直接叩かず、Next.js Route Handlerを経由することで、アクセストークンを隠蔽し、上記のような統制ポイントを一箇所に集約しています。
