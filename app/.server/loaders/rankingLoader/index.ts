import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { formatMonth, getTodayDate } from '~/lib/date.server'
import { loadEnvironment } from '~/lib/utils'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'
import { createClient } from '~/module/supabase/create-client-server.server'

export const rankingLoader = async ({
	request,
	context,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase, headers } = createClient(request, env)

	const url = new URL(request.url)
	const type = url.searchParams.get('type') || 'day'
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const item = url.searchParams.get('item') || 'avatar'

	let date = url.searchParams.get('date') || getTodayDate()
	if (type === 'month') {
		date = formatMonth(date)
	}

	if (item === 'cloth') {
		const ranking = await getClothRanking(type, page, supabase, date)
		return json({ ranking, type, item })
	}

	const ranking = await getAvatarRanking(type, page, supabase, date)
	return json({ ranking, type, item })
}
