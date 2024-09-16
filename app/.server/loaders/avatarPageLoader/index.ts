import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-component.server'

type SortBy =
	| 'name_asc'
	| 'name_desc'
	| 'price_asc'
	| 'price_desc'
	| 'favorite_asc'
	| 'favorite_desc'
	| 'create_desc'
	| 'create_asc'
	| undefined

export const avatarPageLoader = async ({
	request,
	context,
	params,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const supabase = createClient(env)

	const { id } = params
	if (!id) {
		return null
	}

	const url = new URL(request.url)
	const search_keyword = url.searchParams.get('search') || ''
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortBy = (sort_by_param as SortBy) || undefined
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 10
	console.log(sort_by_param)

	const avatarData = await supabase.rpc('get_avatar_with_favorite', {
		page_id: Number.parseInt(id),
	})
	if (!avatarData.data) {
		return null
	}
	console.log(sort_by)

	const relationCloth = await supabase.rpc('get_relation_cloth_data', {
		avatar_booth_id: avatarData.data[0].booth_id,
		search_keyword: search_keyword,
		sort_by: sort_by,
		page_limit: limit,
		page_offset: (page - 1) * limit,
	})

	const totalClothCount = await supabase.rpc('get_relation_cloth_total', {
		avatar_booth_id: avatarData.data[0].booth_id,
	})

	if (!totalClothCount.data) {
		return null
	}
	console.log(totalClothCount.data[0])
	return json({
		avatar: avatarData.data[0],
		relationCloth: relationCloth.data,
		totalClothCount: totalClothCount.data[0].total_count,
	})
}

export type avatarPageLoader = typeof avatarPageLoader