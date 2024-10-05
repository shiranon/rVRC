import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { getTodayDate } from '~/lib/date.server'
import { loadEnvironment } from '~/lib/utils'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'
import { createClient } from '~/module/supabase/create-client-server.server'

export const indexLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase, headers } = createClient(request, env)

	const url = new URL(request.url)
	const item = url.searchParams.get('item') || 'avatar'

	if (item === 'cloth') {
		const ranking = await getClothRanking('day', 1, supabase, getTodayDate())
		const trend = await getClothRanking('trend', 1, supabase, getTodayDate())
		return json({ ranking, trend, item })
	}
	const ranking = await getAvatarRanking('day', 1, supabase, getTodayDate())
	const trend = await getAvatarRanking('trend', 1, supabase, getTodayDate())
	return json({ ranking, trend, item })
}

export type indexLoader = typeof indexLoader
