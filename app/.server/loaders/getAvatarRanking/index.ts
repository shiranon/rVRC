import { json } from '@remix-run/node'
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
		// const { data } = await supabase
		// 	.from('avatar_ranking')
		// 	.select(`
		// 		booth_id,
		// 		rank,
		// 		favorite_count,
		// 		difference,
		// 		avatars!inner(
		// 			name,
		// 			price,
		// 			image_url,
		// 			shop:shop_avatar(
		// 				shops(name)
		// 			)
		// 		)
		// 	`)
		// 	.eq('ranking_type', type)
		// 	.eq('date', date)
		// 	.order('rank', { ascending: true })
		// 	.limit(5)
		// 	.range(offset, offset + 4)
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
