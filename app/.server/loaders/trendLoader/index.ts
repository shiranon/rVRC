import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { formatMonth, getTodayDate } from '~/lib/date.server'
import { loadEnvironment } from '~/lib/utils'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'
import { createClient } from '~/module/supabase/create-client-server.server'

export const trendLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase, headers } = createClient(request, env)

	const url = new URL(request.url)
	const type = url.searchParams.get('type') || 'trend'
	const item = url.searchParams.get('item') || 'avatar'
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	let date = url.searchParams.get('date') || getTodayDate()
	if (type === 'month') {
		date = formatMonth(date)
	}

	if (item === 'cloth') {
		const { data } = await getClothRanking(type, page, supabase, date, 10)
		return json({ trend: data, item, type })
	}
	const { data } = await getAvatarRanking(type, page, supabase, date, 10)
	return json({ trend: data, item, type })
}

export type trendLoader = typeof trendLoader
