---
trigger: always_on
---

This file provides guidance to Claude Code when working with code in this repository.

---

## 🚨 CRITICAL - MANDATORY REQUIREMENT

**Before doing ANY work in this repository, you MUST:**

1. **READ `AGENTS.md` FIRST** - This is NOT optional. This is REQUIRED.
2. Follow ALL rules, prohibitions, and coding standards defined in `AGENTS.md`
3. If you skip reading `AGENTS.md`, you WILL violate critical architectural constraints

**Failure to read `AGENTS.md` will result in:**

- Breaking the BFF pattern (calling GitHub API directly from client)
- Adding unnecessary `"use client"` directives
- Using prohibited patterns (`else if`, `any` type, `function` keyword)
- Violating Server/Client component separation
- Creating global state instead of URL-driven state

---

## ⚡ Quick Reference (Full details in AGENTS.md)

### Absolute Prohibitions

1. ❌ GitHub API を直接クライアントから叩く → 必ず `/app/api/` 経由
2. ❌ `app/` 配下に不要な `"use client"` を追加
3. ❌ グローバル状態管理（Context, Redux）を導入
4. ❌ `else if` を使う → Early Return または Switch を使用
5. ❌ `any` 型を使う
6. ❌ `function` キーワードを使う（Next.js 特殊ファイル以外）
7. ❌ `export default` を使う（Next.js 特殊ファイル以外）
8. ❌ JSDoc なしで関数を定義

### Essential Commands

```bash
pnpm dev           # Development server
pnpm test          # Unit tests (Vitest)
pnpm test:ci       # Unit tests (CI)
npx playwright test # E2E tests
pnpm lint          # ESLint
pnpm fmt           # Auto-fix (lint + prettier)
```

### Architecture Rules

- **BFF Pattern**: All GitHub API calls go through `/app/api/` Route Handlers
- **Server/Client Split**: Keep Server Components by default, only use `"use client"` when necessary
- **URL-driven State**: Use `?q=&page=` instead of global state
- **Input Validation**: Always validate with Zod schemas (max 100 chars for search)

---

## 📋 Before Writing Code - Checklist

- [ ] I have read `AGENTS.md`
- [ ] I have read the files I'm about to modify using the Read tool
- [ ] I understand the Server/Client component separation
- [ ] I will NOT call GitHub API directly from client
- [ ] I will NOT add unnecessary `"use client"`
- [ ] I will use Zod validation for all inputs
- [ ] I will write JSDoc for all functions
- [ ] I will NOT use `else if`, `any`, or `function` keyword (except Next.js special files)

---

**REMEMBER: Read `AGENTS.md` before starting ANY task. This is MANDATORY, not optional.**
