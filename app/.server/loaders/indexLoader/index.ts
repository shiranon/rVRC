import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { getTodayDate } from '~/lib/date.server'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'

export const indexLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const item = url.searchParams.get('item') || 'avatar'
	if (item === 'cloth') {
		const ranking = await getClothRanking('day', 1, context, getTodayDate())
		const trend = await getClothRanking('trend', 1, context, getTodayDate())
		return json({ ranking, trend, item })
	}
	const ranking = await getAvatarRanking('day', 1, context, getTodayDate())
	const trend = await getAvatarRanking('trend', 1, context, getTodayDate())
	return json({ ranking, trend, item })
}
