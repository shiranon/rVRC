import { json } from '@remix-run/cloudflare'
import { todayDate } from '~/lib/date'
import { supabase } from '~/lib/supabaseClient'

export async function getAvatarRankingLoader(
	type: string,
	page: number,
	date: string = todayDate,
) {
	const offset = (page - 1) * 20
	try {
		console.log(todayDate)
		const { data, error } = await supabase.rpc('get_avatar_ranking', {
			date_param: date,
			ranking_type_param: type,
			offset_param: offset,
			limit_param: 10,
		})
		console.log('Fetched data:', data)
		console.log('Error:', error)
		return json({ data })
	} catch (error) {
		console.error('Error fetching avatar_ranking:', error)
		return json({ data: null })
	}
}
