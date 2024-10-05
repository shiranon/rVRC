import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
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
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortBy = (sort_by_param as SortBy) || undefined
	const favorite_filter_param = url.searchParams.get('favorite') || 'all'
	const favorite_filter: FavoriteFilter =
		favorite_filter_param as FavoriteFilter
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 10
	const item = url.searchParams.get('item') || 'avatar'

	if (item === 'cloth') {
		// 衣装の検索結果を取得
		const { data: result } = await supabase.rpc('get_search_cloth_data', {
			search_keyword: search_keyword,
			sort_by: sort_by,
			page_limit: limit,
			page_offset: (page - 1) * limit,
			favorite_filter: favorite_filter,
		})

		// 衣装の検索結果の総数を取得
		const { data: count } = await supabase.rpc('get_search_cloth_total', {
			search_keyword: search_keyword,
			favorite_filter: favorite_filter,
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
	})

	// アバターの検索結果の総数を取得
	const { data: count } = await supabase.rpc('get_search_avatar_total', {
		search_keyword: search_keyword,
		favorite_filter: favorite_filter,
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
