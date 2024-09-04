import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { formatMonth, getTodayDate } from '~/lib/date.server'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'

export const trendLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const type = url.searchParams.get('type') || 'trend'
	const item = url.searchParams.get('item') || 'avatar'
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	let date = url.searchParams.get('date') || getTodayDate()
	if (type === 'month') {
		date = formatMonth(date)
	}
	if (item === 'cloth') {
		const trend = await getClothRanking(type, page, context, date)
		return json({ trend, item, type })
	}
	const trend = await getAvatarRanking(type, page, context, date)
	return json({ trend, item, type })
}
