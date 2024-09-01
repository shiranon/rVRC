import { getSupabaseClient } from '~/lib/supabaseClient'

export const getClothRanking = async (
	type: string,
	page: number,
	context: { cloudflare: { env: Env } },
	date: string,
	limit = 4,
) => {
	const supabase = getSupabaseClient({ context })
	const offset = (page - 1) * 20
	try {
		console.log(date)
		const { data, error } = await supabase.rpc('get_cloth_ranking', {
			date_param: date,
			ranking_type_param: type,
			offset_param: offset,
			limit_param: limit,
		})
		console.log('Fetched data:', data)
		console.log('Error:', error)
		return { data }
	} catch (error) {
		console.error('Error fetching avatar_ranking:', error)
		return { data: null }
	}
}
