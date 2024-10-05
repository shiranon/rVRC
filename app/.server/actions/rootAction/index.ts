import { type ActionFunctionArgs, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import { signInWithDiscord } from '~/module/supabase/discord-auth.server'

/**
 * ルートアクション関数
 * Discordを使用したユーザー認証を処理します。
 *
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @returns 認証URLへのリダイレクト、またはundefined（エラー時）
 */
export const rootAction = async ({ request, context }: ActionFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase, headers } = createClient(request, env)
	const { data, error } = await signInWithDiscord(supabase, env)

	if (error) {
		console.error('Discordログインエラー:', error)
	}

	if (data.url) {
		return redirect(data.url, { headers })
	}
}

export type rootAction = typeof rootAction
