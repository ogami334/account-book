// src/lib/env.ts
/**
 * 実行環境 (サーバ / ブラウザ) を判定して API のベース URL を返す。
 * - サーバ側: API_BASE_SERVER (.env.* で宣言)
 * - ブラウザ側: NEXT_PUBLIC_API_BASE_CLIENT (.env.* で宣言)
 *
 * どちらかが未定義の場合は、ビルド時に型エラー & 実行時に例外を出す
 * ので早期に気付きやすいようにしておく。
 */
export function getApiBase(): string {
    const base =
      typeof window === 'undefined'
        ? process.env.API_BASE_SERVER
        : process.env.NEXT_PUBLIC_API_BASE_CLIENT;

    if (!base) {
      throw new Error(
        'API_BASE が設定されていません。環境変数 (API_BASE_SERVER / NEXT_PUBLIC_API_BASE_CLIENT) を確認してください。',
      );
    }
    return base;
  }
