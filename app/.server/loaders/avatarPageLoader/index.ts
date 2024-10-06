import { type LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'

import type { FavoriteFilter, SortBy } from '~/types/items'

/**
 * アバターデータを取得するためのローダー関数
 * リクエストに基づいて、アバター、関連衣装のデータを取得します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @param params - URLパラメータ
 * @returns アバターページデータを含むJSONレスポンス
 */
export const avatarPageLoader = async ({
	request,
	context,
	params,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// アバターIDの検証
	const { id } = params
	if (!id || !/^\d+$/.test(id)) {
		return redirect('/')
	}

	// URLパラメータの取得と処理
	const url = new URL(request.url)
	const search_keyword = url.searchParams.get('search') || ''
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortBy = (sort_by_param as SortBy) || undefined
	const favorite_filter_param = url.searchParams.get('favorite') || 'all'
	const favorite_filter: FavoriteFilter =
		favorite_filter_param as FavoriteFilter
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 10

	// アバターデータの取得
	const { data: avatarData, error: avatarDataError } = await supabase
		.rpc('get_avatar_with_favorite', {
			page_id: Number.parseInt(id),
		})
		.single()

	if (!avatarData) {
		console.error('アバターデータがありません', avatarDataError)
		return redirect('/')
	}
	if (avatarDataError) {
		console.error('アバターデータの取得時にエラー', avatarDataError)
		return redirect('/')
	}

	// 関連衣装データの取得
	const { data: relationClothData, error: relationClothError } =
		await supabase.rpc('get_relation_cloth_data', {
			avatar_booth_id: avatarData.booth_id,
			search_keyword: search_keyword,
			sort_by: sort_by,
			page_limit: limit,
			page_offset: (page - 1) * limit,
			favorite_filter: favorite_filter,
		})

	if (relationClothError) {
		console.error('関連衣装の取得時にエラー', relationClothError)
		return redirect('/')
	}

	// 関連衣装の総数を取得
	const { data: totalClothData, error: totalClothError } = await supabase
		.rpc('get_relation_cloth_total', {
			avatar_booth_id: avatarData.booth_id,
			search_keyword: search_keyword,
			favorite_filter: favorite_filter,
		})
		.single()

	if (!totalClothData) {
		console.error('関連衣装の総数が取得出来ませんでした', totalClothData)
		return redirect('/')
	}

	if (totalClothError) {
		console.error('関連衣装の総数取得時にエラー', totalClothError)
		return redirect('/')
	}

	// ログインしている場合はフォルダーデータを取得
	const {
		data: { user },
	} = await supabase.auth.getUser()

	interface Folder {
		id: string
		name: string
	}

	let folders: { data: Folder[] | null } | null = null

	if (user) {
		folders = await supabase
			.from('folders')
			.select('id,name')
			.eq('user_id', user.id)
	}

	const foldersData = folders?.data || null

	return json({
		avatar: avatarData,
		relationCloth: relationClothData,
		totalClothCount: totalClothData,
		foldersData,
		isLoggedIn: !!user,
	})
}

export type avatarPageLoader = typeof avatarPageLoader
