/* ─── 型定義 ─── */
export type Transaction = {
    id:          number
    user_id:     number
    tx_date:     string          // YYYY-MM-DD
    kind:        'income' | 'expense'
    amount:      number
    name:        string
    category_id: number
    created_at:  string          // ISO datetime
  }

export type FormState = {
    tx_date: string
    kind: 'income' | 'expense'
    amount: number
    name: string
    category_id: number
  }