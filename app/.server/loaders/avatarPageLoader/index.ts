import { type LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'

import type { FavoriteFilter, SortBy } from '~/types/items'

export const avatarPageLoader = async ({
	request,
	context,
	params,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const { id } = params
	if (!id || !/^\d+$/.test(id)) {
		return redirect('/')
	}

	const url = new URL(request.url)
	const search_keyword = url.searchParams.get('search') || ''
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortBy = (sort_by_param as SortBy) || undefined
	const favorite_filter_param = url.searchParams.get('favorite') || 'all'
	const favorite_filter: FavoriteFilter =
		favorite_filter_param as FavoriteFilter
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 10

	// avatar情報の取得
	const avatarData = await supabase
		.rpc('get_avatar_with_favorite', {
			page_id: Number.parseInt(id),
		})
		.single()

	if (!avatarData.data) {
		return redirect('/')
	}

	// 関連衣装データの取得
	const relationCloth = await supabase.rpc('get_relation_cloth_data', {
		avatar_booth_id: avatarData.data.booth_id,
		search_keyword: search_keyword,
		sort_by: sort_by,
		page_limit: limit,
		page_offset: (page - 1) * limit,
		favorite_filter: favorite_filter,
	})

	const totalCloth = await supabase.rpc('get_relation_cloth_total', {
		avatar_booth_id: avatarData.data.booth_id,
		search_keyword: search_keyword,
		favorite_filter: favorite_filter,
	})

	if (!totalCloth.data) {
		throw new Response('Error retrieving related clothing count', {
			status: 500,
		})
	}

	// ログインしている場合は、フォルダーデータを取得
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

	const { data: avatar } = avatarData
	const { data: relationClothData } = relationCloth
	const totalClothCount = Array.isArray(totalCloth.data)
		? totalCloth.data[0]?.total_count ?? 0
		: 0

	const foldersData = folders?.data || null

	return json({
		avatar,
		relationCloth: relationClothData,
		totalClothCount,
		foldersData,
	})
}

export type avatarPageLoader = typeof avatarPageLoader
