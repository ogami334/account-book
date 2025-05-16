// components/EditDialog.tsx
import { Transaction, FormState } from "@/types";
import { getApiBase } from "@/lib/env";
import { useState } from "react";
import { mutate } from 'swr'

type Props = {
  initial: Transaction;
  onClose: () => void;
};

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE
const API_BASE = getApiBase();
// const API_BASE = "https://backend-75oql5vo4a-an.a.run.app"


export default function EditDialog({ initial, onClose }: Props) {
  const [form, setForm] = useState<FormState>({
    tx_date: initial.tx_date,
    kind:    initial.kind,
    amount:  initial.amount,
    name:    initial.name,
    category_id: initial.category_id,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/transactions/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      await mutate(`${API_BASE}/transactions?user_id=${initial.user_id}`)
      onClose();
    } catch (err) {
      alert(`更新に失敗しました: ${err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">取引を編集</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <div className="space-y-4">
          {[
            { label:'日付',       name:'tx_date',     type:'date' },
            { label:'種別',       name:'kind',        type:'select', options:['income','expense'] },
            { label:'金額',       name:'amount',      type:'number' },
            { label:'名称',       name:'name',        type:'text' },
            { label:'カテゴリID', name:'category_id', type:'number' },
          ].map((f,i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              {f.type==='select' ? (
                <select
                  name={f.name}
                  value={form[f.name as keyof FormState]}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {f.options!.map(o=>(
                    <option key={o} value={o}>{o==='income'?'収入':'支出'}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={f.name}
                  type={f.type}
                  value={form[f.name as keyof FormState]}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
