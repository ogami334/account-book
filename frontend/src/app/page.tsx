// app/page.tsx
import { getApiBase } from '@/lib/env';
import TransactionsTable from '@/components/TransactionsTable'

/** ───────────── 変更したい場合 ─────────────
 *   バックエンド URL は .env.local に
 *   NEXT_PUBLIC_API_BASE=http://localhost:8000
 *   のように書いておくとビルド時に上書きできます。
 */
const API_BASE = getApiBase();
const USER_ID  = 1                                   // ←固定ユーザー ID

export default async function HomePage() {
  console.log(API_BASE)
  // ❶ 初期データを SSR で取得
  const res  = await fetch(`${API_BASE}/transactions?user_id=${USER_ID}`, {
    cache: 'no-store',          // 最新を常に取得 (開発用途)
  })

  // ❷ 失敗時はエラー表示のみ
  if (!res.ok) {
    return (
      <main className="p-6">
        <p className="text-red-600">
          バックエンドに接続できませんでした (status {res.status})
        </p>
      </main>
    )
  }

  const data = await res.json()

  return (
    <main className="max-w-4xl mx-auto p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">家計簿トランザクション一覧</h1>
      <TransactionsTable initialData={data} />
    </main>
  )
}
