import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { formatMonth, getTodayDate } from '~/lib/date.server'
import { getAvatarRanking, getClothRanking } from '~/module/get/get-ranking'

export const rankingLoader = async ({
	request,
	context,
}: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const type = url.searchParams.get('type') || 'day'
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const item = url.searchParams.get('item') || 'avatar'
	let date = url.searchParams.get('date') || getTodayDate()
	if (type === 'month') {
		date = formatMonth(date)
	}
	if (item === 'cloth') {
		const ranking = await getClothRanking(type, page, context, date)
		return json({ ranking, type, item })
	}
	const ranking = await getAvatarRanking(type, page, context, date)
	return json({ ranking, type, item })
}
