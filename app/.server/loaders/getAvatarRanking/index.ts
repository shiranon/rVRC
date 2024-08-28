import { getSupabaseClient } from '~/lib/supabaseClient'

export const getAvatarRanking = async (
	type: string,
	page: number,
	context: { cloudflare: { env: Env } },
	date: string,
) => {
	const supabase = getSupabaseClient({ context })
	const offset = (page - 1) * 20
	try {
		console.log(date)
		const { data, error } = await supabase.rpc('get_avatar_ranking', {
			date_param: date,
			ranking_type_param: type,
			offset_param: offset,
			limit_param: 10,
		})
		console.log('Fetched data:', data)
		console.log('Error:', error)
		return { data }
	} catch (error) {
		console.error('Error fetching avatar_ranking:', error)
		return { data: null }
	}
}
