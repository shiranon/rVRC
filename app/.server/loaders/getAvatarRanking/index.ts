import { supabase } from '~/utils/supabaseClient'
import { todayDate } from '~/utils/date'
import { json } from '@remix-run/node'

export async function getAvatarRankingLoader(type: string, page: number, date: string = todayDate) {
  const offset = (page - 1) * 20
  try {
    console.log(todayDate)
    const { data } = await supabase.from('avatar_ranking')
      .select('booth_id,rank,favorite_count,difference, avatars!inner(name,price,image_url)')
      .eq('ranking_type', type)
      .eq('date', date)
      .order('rank', { ascending: true })
      .limit(1)
      .range(offset, offset + 4)
    console.log(data)
    return json({ data })
  } catch (error) {
    console.error('Error fetching avatar_ranking:', error)
    return json({ data: null })
  }
}