import type { SupabaseClient } from '@supabase/supabase-js'

export const getAvatarRanking = async (
	type: string,
	page: number,
	supabase: SupabaseClient,
	date: string,
	limit = 4,
) => {
	const offset = (page - 1) * 10
	try {
		const { data, error } = await supabase.rpc('get_avatar_ranking', {
			date_param: date,
			ranking_type_param: type,
			offset_param: offset,
			limit_param: limit,
		})
		// console.log('Fetched data:', data)
		// console.log('Error:', error)
		return { data }
	} catch (error) {
		console.error('Error fetching avatar_ranking:', error)
		return { data: null }
	}
}
