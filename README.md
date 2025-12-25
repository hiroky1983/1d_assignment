# 🔍 GitHub Repository Search

## 🔒 工夫した点・設計思想

本リポジトリでは、「動くものを作る」だけでなく、

- Next.jsのエコシステムを活かした設計
- 実務のプロダクトチーム開発における保守性とルール設定
- PdM視点で課題要件からアプリケーションの拡張性を考えた設計とユーザービリティ、UXの設計
- セキュリティ対策

を意識して設計しています。

---

### 🚀 1. Next.js (App Router) エコシステムの最大活用

#### **トップページ（検索一覧ページ）`/`**

- **Server Component & Client Component**:
  - インタラクティブな検索フォームやリストコンポーネントからclient componentを使用
  - 検索フォームには将来、使用言語指定など検索フォームの拡張を考慮してReact-hook-formを採用しています。
  - 検索結果の状態管理にuseSWRを使用しています。SWRの使用意図としては、検索一覧画面 >> 検索詳細画面 >> 戻るボタン押したときに検索一覧画面に戻るときに、keepPreviousDataの設定をすることで検索結果のcacheを実現しています。
  - 検索一覧取得は最初10件で実装、利用上限のあるAPIのためAPIの実行回数を抑える目的で一律20件取得するように設計しています。（今後拡張でpre_pageの長さを選択できるように設計しています）

#### **検索結果詳細ページ`app/repo/[owner]/[name]`**

- **Partial Prerendering (PPR) & Suspenseの使用**:
  - 詳細画面において初期画面をserver componentで返し、動的コンテンツをPPRの遅延ハイドレーションすることで、コンテンツの一部を即座に表示し、詳細情報取得はpromiseの完了を待つことでパフォーマンスを確保しています。
  - 当初は `loading.tsx` を検討しましたが、「ローディング中に戻るボタンを押した際の URL 整合性（検索クエリの保持）」をより確実に制御するため、ページ内 Suspense と Skeleton UI による制御を採用しております。
- **BFF (Route Handler) パターンのAPI設計**:
  - クライアントから GitHub API を直接叩かず、必ず内部 API を経由させることで、GitHub Token の秘匿、キャッシュ制御、レート制限の一元管理を実現しています。
  - 拡張性をもたせたAPI設計を意識して作っています。例えば機能拡張としてGitLabからの検索も行いたい（一覧を一緒にしたい）などの要件が追加されたときにzodのスキーマで抽象化したリクエスト、レスポンスを定義することで、より柔軟な設計を実現できます。

---

### 🛠️ 2. チーム開発を想定した設計

- **環境の統一**:
  - AI エージェントの実行環境（Antigravity/Codex/claude code/cursor）との親和性を考慮し、Node.js v22.16.0 を厳格に指定してます。`package.json` の `engines`で設定。
  - 各AIエージェントのルールをGit管理し、メンバーがジョインしてもそのままルールを使えるように設計しています。
- **重層的なテスト戦略**:
  - **Vitest + MSW**: 高速なフィードバックサイクルを回すために採用。GitHub API の挙動をモックし、境界領域のテストを徹底しています。
  - **Playwright (E2E)**: ブラウザ間の挙動差異を吸収し、検索→一覧→詳細の一連のBUCユーザーフローをテストしています。
- **CI/CD パイプラインでのテスト実行**:
  - GitHub Actions にて Lint / Type Check / Test / E2E / Build の全行程を自動化。品質基準を満たさないコードのマージを未然に防ぎます。E2EテストはVercelプレビュー環境に対して行うように設定し環境差分で動かないがないように検証しています。（今回は想定だけでGit側のマージブロック設定は未設定）
- **コード品質**:
  - ESLint + Prettier でコード品質を保証。
  - tsconfigの設定、.vscodeなどである程度zero configで同じ開発環境を提供するように設計。(format on save)。
  - tailwindcssの設定も最低限のルールを設定して、同じコード品質を維持するように設計。

---

### 🎨 3. ユーザビリティ

- **URL クエリでの状態管理**:
  - URLのクエリで検索クエリを保存することで、「検索一覧画面」 >> 「検索詳細画面」 >> 「検索一覧画面」の画面遷移のときに、検索結果の維持を可能にします。
- **堅牢なバリデーション (Zod)**:
  - 検索文字数制限（最大 100 文字）やページパラメータの型検証を BFF/Client の両レイヤーで実施。
  - スキーマベースの設計により、将来的に GitLab 等の別プロバイダ対応が必要になった際も、スキーマの拡張とAPI実装だけで対応可能な柔軟性を持たせています。
- **アクセシビリティ (A11y)**:
  - スクリーンリーダー対応（ARIA labels）やキーボードナビゲーションを考慮した UI 実装。特にEnterキー押したときに検索結果を表示するように設計しています。日本語入力時にEnterを押した際にsubmitしないようにIMEの設定を考慮して設計しています。

---

### 🛡️ 4. セキュリティと防護策 (Anti-Abuse)

- **多層的なレート制限**:
  - 1 IP で 10 秒間に 10 リクエストの制限をアプリ側で実装。Vercel 等のインフラ層だけでなくアプリ層でもガードを設けることで、API トークンの枯渇や不正アクセスを水際で防止します。（初期はvercelのbot-block設定で対応予定だったがE2Eテストが本番でできないため、アプリ側で実装する方針に転換）
- **脆弱性管理**:
  - CVE-2025-55183/CVE-2025-55184 の脆弱性チェック（改善されたバージョンの使用とチェック）。
- **コンパイル設定**:
  - `next.config.ts` にて `removeConsole` を設定し、本番環境での情報漏洩（debug ログ）を防止。

---

### ⚠️ 今回やらないこと

- **vercelの細かい本番設定**: ドメインマッピングやその他設定は今回のスコープからは外してます。
- **Gitの細かい設定**: 保守性の高いチーム開発を考慮していますが、実装側を優先としているためGit側の設定は対応しておりません。
- **課題要件以外の実装**: 今回の課題要件を満たすことが第一優先としています。また課題要件 = 実装の要件（依頼事項）と捉えているため、良しなに必要そうな機能などは実装しないように心がけております。

---

## 🤖 AI 利用方法レポート

### 👥 人間とAIの担当範囲

| 担当者   | 担当範囲                                                                                                                                 |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **人間** | 方針の決定や分析、設計、開発、レビュー、テスト、コードリーディング、デプロイなど、開発の全行程でAIを活用し最終的な方針や意思決定を担当。 |
| **AI**   | 実装の約 70% を委譲。規約遵守、README 更新、ライトな技術相談、コード生成など、開発の作業フェーズを支援。                                 |

### 📊 AI担当箇所内訳とツール活用

| フェーズ     | AI 活用内容                                                     | 使用ツール（モデル）         |
| :----------- | :-------------------------------------------------------------- | :--------------------------- |
| **設計**     | 初期構成(README)の整形、技術選定の妥当性検証、方針の壁打ち      | ChatGPT (GPT-5.2 Thinking)   |
| **開発**     | 実装の約 70% を委譲。規約遵守、README 更新、ライトな技術相談    | Antigravity (Gemini 3.0 Pro) |
| **レビュー** | PR 単位の自動レビュー、コーディング規約違反の検出、全体レビュー | CodeRabbit                   |

### 📈 担当割合

| フェーズ     | AI 担当比率 | 人間担当比率 |
| :----------- | :---------- | :----------- |
| **設計**     | 20%         | 80%          |
| **開発**     | 70%         | 30%          |
| **レビュー** | 30%         | 70%          |

### 💡 AI活用における工夫

- **AGENTS.md**: AIエージェントが遵守すべきルール（BFFパターン必須、else if禁止など）を明文化
- **再現性の担保**: 異なるAIツールを使っても同じアーキテクチャ・コード品質を維持できるよう設計
- **人間の役割**: 意思決定・アーキテクチャ設計・最終レビューは人間が責任を持つ

### 🌊 開発の流れ

1. 📝 **（人）設計 (READMEの記載)**  
   開発のゴールと技術スタック、アーキテクチャ方針を決定しREADMEに明文化。
2. 🤖 **（AI）READMEをもとにコードを生成**  
   設計書をインプットに、AIがプロトタイプとなるコードを生成。
3. 🔎 **（人）成果物の確認**  
   生成されたコードが設計方針に沿っているか人間が確認。（コードリーディング/動作確認/追加ライブラリ選定など）
4. 📋 **（人）課題のリスト化**  
   不足機能や修正が必要な箇所をTODOリストとして整理。
5. 🛠️ **（AI）記載したtodoを実装**  
   TODOリストに基づき、AIが具体的なロジックやコンポーネントを実装。
6. ✅ **（人/AI）レビュー、動作確認**  
   人間とAIで相互にレビューを行い、ブラウザでの実動作を確認。
7. 🧪 **(人/AI)テスト拡張**  
   安定稼働のため、ユニットテストやE2Eテストを追加・強化。
8. 📄 **(人/AI)README.mdの更新**  
   最終確認としてREADME.mdを更新。添削や見やすくするための絵文字付けなどはAIに依頼。

---

## 開発環境 (Development Setup)

### 前提条件 (Prerequisites)

- **Node.js**: v22.16.0 以上(codex利用エンジニア向けの設定)
- **pnpm**: パッケージマネージャーとして使用
- **Next.js**: v16.0.10
- **React**: v19.2.1

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
   PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 # E2Eテスト用 (任意)
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
- **Lint (ESLint)**
  ```bash
  pnpm lint
  ```

## 1. 要件定義

- GitHub REST API **`GET /search/repositories`** を使用（固定）
- Next.js **14 以降 / App Router**
- 検索 → 一覧 → 詳細（**ページ遷移**、モーダル不可）
- 一覧は **ページネーション方式**を採用（20件）
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
  - 検索入力（Enter / 検索ボタン）
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

- ボタン検索または Enter キーによる明示的な検索実行
- 検索状態は **URL（`?q=&page=`）で管理**
  - 戻る / 共有 / 再訪が自然

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
│           └── page.tsx
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
| `app/**/error.tsx`       | エラーバウンダリ                   | Client        |
| `app/api/**/route.ts`    | BFF（外部 API 呼び出し・DTO 整形） | Server        |
| `screens/`               | 画面単位の合成・初期レンダリング   | Server        |
| `features/*/components/` | ユースケース固有 UI                | 両対応        |
| `features/*/hooks/`      | インタラクティブ処理               | Client        |
| `features/*/types/`      | DTO・型定義                        | 両対応        |
| `components/ui/`         | 汎用 UI コンポーネント             | 両対応        |
| `components/states/`     | 状態 UI（Error/Empty/Loading）     | Client        |
| `lib/`                   | ユーティリティ                     | Server        |

---

## 8. CSS / UI 方針

- **TailwindCSS 4.0** を使用：
  - `@theme inline` による CSS 変数ベースのテーマ定義
  - 意味論（Semantic）に基づいたカラー定義（例: `app-bg`, `app-text-main`）により、保守性を向上
- **ダークモード対応への配慮**：
  - ハードコードされた色を排除し、`:root` で定義された CSS 変数を参照
  - 将来的なダークモード導入時には `media (prefers-color-scheme: dark)` で変数を上書きするだけで対応可能な設計
- レスポンシブ：
  - 最低限のレスポンシブ対応
- アクセシビリティ：
  - キーボード操作可能
  - 適切な aria 属性

---

## 9. 詳細ページ設計

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

### BFF API 一覧

| エンドポイント                 | 項目           | 概要                                               |
| ------------------------------ | -------------- | -------------------------------------------------- |
| `GET /api/search`              | リポジトリ検索 | クエリに基づいたリポジトリ一覧の取得（要認証対応） |
| `GET /api/repo/[owner]/[name]` | リポジトリ詳細 | 特定のリポジトリの統計情報を含む詳細データの取得   |

### Zod スキーマ定義 (Request/Response)

API の入出力は Zod スキーマによって型安全に定義・検証されています。
zodスキーマでAPIのリクエストとレスポンスを定義することで、アプリの設計の拡張性と型の安全性を確保できます。

#### 1. リポジトリ検索 (`/api/search`)

**Request (Query Parameters):**

```typescript
{
  q: string // 最大100文字
  page: number // 1以上の整数 (default: 1)
  per_page: number // 1以上の整数 (default: 20)
}
```

**Response:**

```typescript
{
  total_count: number
  incomplete_results: boolean
  items: Array<{
    id: number
    name: string
    owner: { login: string; avatar_url: string }
    description: string | null
    stargazers_count: number
    // ...その他基本情報
  }>
}
```

#### 2. リポジトリ詳細 (`/api/repo/[owner]/[name]`)

**Response:**

```typescript
{
  id: number;
  name: string;
  owner: { login: string; avatar_url: string };
  description: string | null;
  language: string | null;
  stargazers_count: number;
  subscribers_count: number; // Watcher数として表示
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  topics: string[];
}
```

## 10. テスト方針

- **Unit / Component**: Vitest + Testing Library
- **API**: MSW でモック
- **E2E**: Playwright で主要フロー
- BFF 境界があることでテストが書きやすい

### テスト優先度

1. BFF（Route Handler）の正常系・異常系
2. 検索フォームのインタラクション
3. E2E で検索 → 詳細の導線

---

## 11. CI/CD 戦略

品質を担保し、デプロイ後の「動かない」を防ぐために GitHub Actions を用いた多層的な検証パイプラインを構築しています。

### パイプラインの全行程

1.  **静的解析 & ユニットテスト**
    - `pnpm lint`: コード規約のチェック
    - `pnpm tsc`: TypeScript の型整合性チェック
    - `pnpm test:ci`: Vitest によるロジック・コンポーネントの高速なテスト
2.  **Vercel Preview 環境 E2E テスト (`Preview E2E`)**
    - Vercel の Preview Deployment が完了するのを待機し、**実際にデプロイされた URL に対して** Playwright を実行します。
    - これにより、本番に近い環境（エッジ、環境変数の注入状態、ネットワーク遅延）での動作をマージ前に保証します。
3.  **プロダクションビルドチェック**
    - `pnpm build`: 本番ビルドが正常に完了することを確認し、サーバーサイドコードのエラーを未然に防ぎます。

### 継続的デプロイ (CD)

- `main` ブランチへのマージにより、Vercel 経由で自動的に本番環境へデプロイされます。
- 全ての CI ステップがパスしない限り、マージは推奨されない運用を想定しています。

## 12. AI駆動開発設定

以下のツールに対して事前にルールファイルを用意しGit管理しています。

| AI ツール       | ルールファイル / フォルダ |
| :-------------- | :------------------------ |
| **Antigravity** | `.agent/rules/rules.md`   |
| **Cursor**      | `.cursor/rules/rules.mdc` |
| **Codex**       | `AGENTS.md`               |
| **Claude Code** | `.claude/CLAUDE.md`       |

これらのルールファイルをリポジトリに含めることで、新しい開発者（または新しいAIエージェント）がジョインした際も、即座にプロジェクト固有のコンテキストを理解し、一貫性と再現性のあるコード出力を得ることが可能になります。

※ すべてのルールはAGENTS.mdに集約しておりルールの管理は一元でAGENTS.mdで行います。
