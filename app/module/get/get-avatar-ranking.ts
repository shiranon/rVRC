import type { SupabaseClient } from '@supabase/supabase-js'
import type { RankingType } from '~/types/items'

export const getAvatarRanking = async (
	type: string,
	page: number,
	supabase: SupabaseClient,
	date: string,
	limit = 4,
): Promise<{ data: RankingType[] | null }> => {
	const offset = (page - 1) * 10
	try {
		const { data, error } = await supabase.rpc('get_avatar_ranking', {
			date_param: date,
			ranking_type_param: type,
			offset_param: offset,
			limit_param: limit,
		})
		if (error) {
			console.error('アバターランキングデータの取得時にエラー', error)
			return { data: null }
		}
		return { data }
	} catch (error) {
		console.error('予期せぬエラー', error)
		return { data: null }
	}
}
