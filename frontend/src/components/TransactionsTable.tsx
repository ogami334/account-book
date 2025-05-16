// components/TransactionsTable.tsx
'use client'

import { Transaction, FormState } from '@/types'
import { useState, FormEvent } from 'react'
import useSWR, { mutate } from 'swr';
import EditDialog from './EditDialog'
import { getApiBase } from '@/lib/env';

/* ─── 定数 ─── */
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE
const API_BASE = getApiBase();
// const API_BASE = "https://backend-75oql5vo4a-an.a.run.app"
const USER_ID  = 1


const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((res) => {
    console.log(res);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });

type Props = { initialData?: Transaction[] }

export default function TransactionsTable({ initialData }: Props) {
  const { data, error, isLoading } = useSWR<Transaction[]>(
    `${API_BASE}/transactions?user_id=${USER_ID}`,
    fetcher,
    { fallbackData: initialData }
  );
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState<FormState>({
    tx_date:     '',
    kind:        'income' as 'income' | 'expense',
    amount:      0,
    name:        '',
    category_id: 1,
  })
  const [loading, setLoading] = useState(false)
  const [form_error, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    const key = `${API_BASE}/transactions?user_id=${USER_ID}`

    try {
      const payload = { ...form, user_id: USER_ID}

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`API Error: ${res.status}`)

      const created: Transaction = await res.json()
      mutate(
        key,
        (current: Transaction[] = []) => [...current, created], // 新レコードを末尾に追加
        false                                                   // 第3引数=false で再フェッチ抑制
      );

      /* フォーム初期化 */
      setForm({ tx_date: '', kind: 'income', amount: 0, name: '', category_id: 1 })
    } catch (err: unknown) {
      // 型ガードでエラーメッセージを取得
      if (err instanceof Error) {
        setFormError(err.message)
        console.error(err)
      } else {
        setFormError('Unknown error')
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  /* ------------- 画面状態ハンドリング ------------- */
  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-600">取得に失敗しました</p>;
  if (!data || data.length === 0) return <p>取引がありません</p>;



  /* ------------- JSX ------------- */
  return (
    <>
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2 font-medium">日付</th>
            <th className="px-3 py-2 font-medium">名称</th>
            <th className="px-3 py-2 font-medium text-right">金額 (円)</th>
            <th className="px-3 py-2 font-medium">種別</th>
            <th className="px-3 py-2 font-medium">カテゴリ</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>

        <tbody>
          {data.map((tx) => (
            <tr key={tx.id} className="border-b last:border-0">
              <td className="px-3 py-2">{tx.tx_date}</td>
              <td className="px-3 py-2">{tx.name}</td>
              <td className="px-3 py-2 text-right">
                {tx.amount.toLocaleString()}
              </td>
              <td className="px-3 py-2">
                {tx.kind === 'expense' ? '支出' : '収入'}
              </td>
              <td className="px-3 py-2">{tx.category_id}</td>
              <td className="px-3 py-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setEditing(tx)}
                >
                  編集
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== 編集モーダル ===== */}
      {editing && (
        <EditDialog
          initial={editing}
          /* 保存完了 or キャンセル時 */
          onClose={() => {
            setEditing(null);
            /* SWR キャッシュを無効化して再取得 */
            mutate(`${API_BASE}/transactions?user_id=${USER_ID}`);
          }}
        />
      )}
      <h2 className="font-semibold mb-2">新規トランザクション追加</h2>
      {form_error && <p className="mb-2 text-red-600">{form_error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
      <div>
          <label className="block text-sm font-medium mb-1">
            日付
            <input
              type="date"
              value={form.tx_date}
              onChange={e => setForm({ ...form, tx_date: e.target.value })}
              required
              className="border rounded p-1 w-full"
            />
          </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          種別
          <select
            value={form.kind}
            onChange={e =>
              setForm({ ...form, kind: e.target.value as 'income' | 'expense' })
            }
            className="border rounded p-1 w-full"
          >
            <option value="income">収入</option>
            <option value="expense">支出</option>
          </select>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          金額
          <input
            type="number"
            min="0"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
            required
            className="border rounded p-1 w-full"
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          名前
          <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="border rounded p-1 w-full"
            />
          </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          カテゴリID
          <input
            type="number"
            min="1"
            value={form.category_id}
              onChange={e =>
                setForm({ ...form, category_id: Number(e.target.value) })
              }
              required
              className="border rounded p-1 w-full"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? '送信中…' : '追加'}
        </button>
      </form>
    </>
  );
}
