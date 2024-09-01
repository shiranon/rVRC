import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'

import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { getAvatarRanking } from '~/.server/loaders/getAvatarRanking'
import { RankingCard } from '~/components/card/ranking-card'
import { formatMonth, getTodayDate } from '~/lib/date'
import type { RankingType } from '~/types/items'

type RankingData = {
	result: {
		data: RankingType[] | null
	}
	type: string
}

const formatType = (type: string): string => {
	if (type === 'month') {
		return 'マンスリー'
	}
	if (type === 'day') {
		return 'デイリー'
	}
	return ''
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const type = url.searchParams.get('type') || 'day'
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	let date = url.searchParams.get('date') || getTodayDate()
	if (type === 'month') {
		date = formatMonth(date)
	}
	const result = await getAvatarRanking(type, page, context, date)
	return json({ result, type })
}

export default function Ranking() {
	const initialData = useLoaderData<RankingData>()
	const fetcher = useFetcher<RankingData>()

	const [searchParams] = useSearchParams()
	const prevSearchParamsRef = useRef(searchParams.toString())

	useEffect(() => {
		const currentSearchParams = searchParams.toString()
		if (currentSearchParams !== prevSearchParamsRef.current) {
			fetcher.load(`/ranking?${currentSearchParams}`)
			prevSearchParamsRef.current = currentSearchParams
		}
	}, [searchParams, fetcher])

	const { data } = fetcher.data?.result || initialData.result
	const type = initialData.type

	return (
		<div>
			{data && data.length > 0 ? (
				<div className="px-4 flex-1">
					<h1 className="text-2xl font-semibold p-4 my-2">
						{formatType(type)}ランキング
					</h1>
					{data.map((avatar: RankingType) => (
						<div key={avatar.booth_id} className="mb-4">
							<RankingCard item={avatar} />
						</div>
					))}
				</div>
			) : (
				<div>No data</div>
			)}
		</div>
	)
}
