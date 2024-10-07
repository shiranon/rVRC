import type { AppLoadContext } from '@remix-run/cloudflare'

/**
 * アプリケーションの環境設定を読み込む関数
 *
 * @param context - Cloudflare Pagesのアプリケーションコンテキスト
 * @returns Env - 環境設定オブジェクト
 * @throws Error - 環境設定が取得できない場合
 */
const loadEnvironment = (context: AppLoadContext): Env => {
	// Cloudflare環境変数を取得できなかった場合、Local環境変数を取得
	let env: Env
	try {
		env = context.cloudflare.env as Env
	} catch {
		env = process.env as unknown as Env
	}

	// 環境変数が正しく設定されていなかった場合エラーをスロー
	if (!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY)) {
		throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY is not defined')
	}
	if (!(env.R2_ACCESS_KEY && env.R2_SECRET_KEY && env.R2_ENDPOINT)) {
		throw new Error(
			'R2_ACCESS_KEY or R2_SECRET_KEY or R2_ENDPOINT is not defined',
		)
	}
	if (!env.SITE_URL) {
		throw new Error('SITE_URL is not defined')
	}
	return env
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
