import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { getTodayDate } from '~/lib/date.server'
import { loadEnvironment } from '~/lib/utils'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'
import { createClient } from '~/module/supabase/create-client.server'

/**
 * ランキングページのデータを取得するローダー関数
 * アバターまたは衣装のランキングデータを取得します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @returns ランキングデータを含むJSONレスポンス
 */
export const rankingLoader = async ({
	request,
	context,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// WIP:月間ランキング
	const type = 'day'

	const url = new URL(request.url)
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const item = url.searchParams.get('item') || 'avatar'

	// 日付の処理
	const date = url.searchParams.get('date') || getTodayDate()

	if (item === 'cloth') {
		const { data } = await getClothRanking(type, page, supabase, date, 10)
		return json({ ranking: data, type, item })
	}

	const { data } = await getAvatarRanking(type, page, supabase, date, 10)
	return json({ ranking: data, type, item })
}

export type rankingLoader = typeof rankingLoader
