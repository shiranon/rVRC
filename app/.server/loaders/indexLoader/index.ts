import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { getTodayDate } from '~/lib/date.server'
import { loadEnvironment } from '~/lib/utils'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'
import { createClient } from '~/module/supabase/create-client.server'

/**
 * インデックスページのデータを取得するローダー関数
 * アバターまたは衣装のランキングとトレンドデータを取得します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @returns ランキングとトレンドデータを含むJSONレスポンス
 */
export const indexLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// URLパラメータからアイテムタイプを取得（デフォルトは'avatar'）
	const url = new URL(request.url)
	const item = url.searchParams.get('item') || 'avatar'

	// アイテムタイプがclothの場合は衣装データを返す
	if (item === 'cloth') {
		const ranking = await getClothRanking('day', 1, supabase, getTodayDate())
		const trend = await getClothRanking('trend', 1, supabase, getTodayDate())
		return json({ ranking, trend, item })
	}
	const ranking = await getAvatarRanking('day', 1, supabase, getTodayDate())
	const trend = await getAvatarRanking('trend', 1, supabase, getTodayDate())
	return json({ ranking, trend, item })
}

export type indexLoader = typeof indexLoader
