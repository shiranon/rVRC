import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import type { FavoriteFilter, SortBy } from '~/types/items'

/**
 * 検索ページのデータを取得するローダー関数
 * アバターまたは衣装の検索結果を取得します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @returns 検索結果を含むJSONレスポンス
 */
export const searchLoader = async ({
	request,
	context,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// URLパラメータから検索条件を取得
	const url = new URL(request.url)
	const search_keyword = url.searchParams.get('search') || ''

	// ソート条件
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortBy = (sort_by_param as SortBy) || undefined

	//スキ数で絞り込み
	const favorite_filter_param = url.searchParams.get('favorite') || 'all'
	const favorite_filter: FavoriteFilter =
		favorite_filter_param as FavoriteFilter

	// 日付で絞り込み
	const fromParam = url.searchParams.get('from')
	const toParam = url.searchParams.get('to')
	const from = fromParam ? new Date(fromParam).toISOString() : undefined
	const to = toParam ? new Date(toParam).toISOString() : undefined

	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 12
	const item = url.searchParams.get('item') || 'avatar'

	if (item === 'cloth') {
		// 衣装の検索結果を取得
		const { data: result } = await supabase.rpc('get_search_cloth_data', {
			search_keyword: search_keyword,
			sort_by: sort_by,
			page_limit: limit,
			page_offset: (page - 1) * limit,
			favorite_filter: favorite_filter,
			published_from: from,
			published_to: to,
		})

		// 衣装の検索結果の総数を取得
		const { data: count } = await supabase.rpc('get_search_cloth_total', {
			search_keyword: search_keyword,
			favorite_filter: favorite_filter,
			published_from: from,
			published_to: to,
		})

		return json({
			result,
			count: count ? count : 0,
			item,
			search_keyword,
			favorite_filter,
		})
	}

	// アバターの検索結果を取得
	const { data: result } = await supabase.rpc('get_search_avatar_data', {
		search_keyword: search_keyword,
		sort_by: sort_by,
		page_limit: limit,
		page_offset: (page - 1) * limit,
		favorite_filter: favorite_filter,
		published_from: from,
		published_to: to,
	})

	// アバターの検索結果の総数を取得
	const { data: count } = await supabase.rpc('get_search_avatar_total', {
		search_keyword: search_keyword,
		favorite_filter: favorite_filter,
		published_from: from,
		published_to: to,
	})

	return json({
		result,
		count: count ? count : 0,
		item,
		search_keyword,
		favorite_filter,
	})
}

export type searchLoader = typeof searchLoader
