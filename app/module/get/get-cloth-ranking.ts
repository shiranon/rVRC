import type { SupabaseClient } from '@supabase/supabase-js'
import type { RankingType } from '~/types/items'

export const getClothRanking = async (
	type: string,
	page: number,
	supabase: SupabaseClient,
	date: string,
	limit = 4,
): Promise<{ data: RankingType[] | null }> => {
	const offset = (page - 1) * 10
	try {
		const { data, error } = await supabase.rpc('get_cloth_ranking', {
			date_param: date,
			ranking_type_param: type,
			offset_param: offset,
			limit_param: limit,
		})
		return { data }
	} catch (error) {
		console.error('Error fetching avatar_ranking:', error)
		return { data: null }
	}
}
