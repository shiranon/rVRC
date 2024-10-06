import type { AppLoadContext } from '@remix-run/cloudflare'

/**
 * アプリケーションの環境設定を読み込む関数
 *
 * @param context - Cloudflare Pagesのアプリケーションコンテキスト
 * @returns Env - 環境設定オブジェクト
 * @throws Error - 環境設定が取得できない場合
 */
const loadEnvironment = (context: AppLoadContext): Env => {
	// まず、Cloudflare Pagesのコンテキストをチェック
	if (context?.cloudflare?.env) {
		return context.cloudflare.env as Env
	}

	// コンテキストが利用できない場合、process.envを試す
	if (typeof process !== 'undefined' && process.env) {
		return process.env as unknown as Env
	}

	// どちらの方法でも環境設定が取得できない場合はエラーをスロー
	throw new Error('Unable to load environment variables')
}

/**
 * ユニークなファイル名を生成する非同期関数
 * @returns Promise<string> - 8文字のユニークな16進数文字列
 */
const generateUniqueFileName = async () => {
	// 現在のタイムスタンプを文字列として取得
	const timestamp = new Date().getTime().toString()

	// タイムスタンプをUint8Array形式にエンコード
	const encoder = new TextEncoder()
	const data = encoder.encode(timestamp)

	// SHA-256ハッシュを計算
	const hashBuffer = await crypto.subtle.digest('SHA-256', data)

	// ハッシュバッファーを16進数文字列に変換
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
	return hashHex.substring(0, 8)
}

export { loadEnvironment, generateUniqueFileName }
