# AI Agents Guidelines

## プロジェクト概要

GitHub リポジトリ検索アプリケーション（Next.js 16 App Router）

- BFF パターンによる GitHub API の抽象化
- Server/Client コンポーネント分離
- URL 駆動の状態管理（`?q=&page=`）
- レート制限・入力検証によるセキュリティ対策

## よく使う開発コマンド

```bash
pnpm dev           # 開発サーバー起動
pnpm test          # ユニットテスト (Vitest)
pnpm test:ci       # ユニットテスト (CI用)
pnpm test:e2e      # E2Eテスト (Playwright)
pnpm lint          # ESLint実行
pnpm fmt           # lint + prettier自動修正
```

## 禁止事項

- `app/` 配下で無秩序に `use client` を付けない（可能な限り Server Component を維持）
- グローバルな状態管理（Context, Redux 等）を安易に導入しない
- 既存の型定義を無視して `any` を使わない

## レビュー観点

- **アーキテクチャ**: ディレクトリ構造は正しいか？責務は分離されているか？
- **パフォーマンス**: 無駄な再レンダリングや過剰なデータ取得はないか？
- **セキュリティ**: API キーやセンシティブな情報がクライアントに漏れていないか？
- **アクセシビリティ**: 適切な aria 属性やキーボード操作が考慮されているか？

## アーキテクチャ詳細

### BFF パターン（必須）

- **GitHub API は直接叩かない** - 必ず `/app/api/` 配下の Route Handler を経由
  - `/api/search` - リポジトリ検索（レート制限: 10req/10sec/IP）
  - `/api/repo/[owner]/[name]` - リポジトリ詳細
- **理由**: トークン秘匿、レート制限、入力検証（Zod、max 100文字）、キャッシュ制御

### Server/Client 分離

- **Server Component（デフォルト）**:
  - `app/**/page.tsx` - ルーティング
  - `screens/` - 画面単位の合成
  - `lib/` - サーバー専用ユーティリティ
- **Client Component（`"use client"`必須）**:
  - `features/*/components/` - インタラクティブUI
  - `features/*/hooks/` - useSearch（debounce、IME対応、AbortController）
  - `components/states/` - Error/Empty/Loading

### ディレクトリ責務

```
app/api/          - BFF（Route Handler）
screens/          - 画面合成（Server）
features/         - ユースケース固有UI（Client）
components/ui/    - 汎用UIコンポーネント
components/states/ - 状態UI（Client）
lib/              - ユーティリティ（Server）
```

## よくある落とし穴（必ず避けること）

1. **GitHub API を直接クライアントから叩く** → 必ず BFF 経由
2. **`app/` 配下に不要な `"use client"` を追加** → Server Component を維持
3. **グローバル状態を作る** → URL パラメータ（`?q=&page=`）で管理
4. **入力検証をスキップ** → Zod schema で必ず検証（max 100文字）
5. **IME 変換中に検索を発火** → `isComposing` チェック必須
6. **`else if` を使う** → Early Return、Switch、オブジェクトマッピングで対応
7. **検索ページで `loading.tsx` を使う** → 同一ページ内更新なので不要（詳細ページでのみ使用）

## テスト戦略

### 優先度

1. BFF Route Handler（正常系・異常系・レート制限）
2. 検索フォームのインタラクション（debounce、IME、validation）
3. E2E フロー（検索 → ページネーション → 詳細）

### ツール

- **ユニットテスト**: Vitest + Testing Library（`pnpm test`）
- **E2Eテスト**: Playwright（`pnpm test:e2e`）
- **APIモック**: MSW（`tests/mocks/handlers.ts`）

## コーディング規約 (Coding Standards)

- **JSDoc**: 関数やコンポーネントには必ず JSDoc を付与する (役割、引数、戻り値など)
- **関数定義**: `page.tsx`, `layout.tsx` 等の Next.js の仕様で必要な場合を除き、`function` キーワードは使わず `const` で定義する (アロー関数)
- **エクスポート**: `page.tsx`, `layout.tsx` 等の Next.js の仕様で必要な場合を除き、`export default` は使わず Named Export を使用する
- **制御構文**: `else if` は禁止。ネストが深くなるため、Early Return、Switch 文、またはオブジェクトマッピングで対応する
