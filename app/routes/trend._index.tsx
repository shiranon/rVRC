import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import type { trendLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card'

import { ItemControls } from '~/components/element/item-controls'
import { Pagination } from '~/components/element/pagination'
import type { RankingType } from '~/types/items'

const formatType = (type: string): string => {
	if (type === 'trend_month') {
		return 'マンスリー'
	}
	if (type === 'trend') {
		return 'デイリー'
	}
	return ''
}

export { trendLoader as loader } from '~/.server/loaders'

export default function Ranking() {
	const initialData = useLoaderData<trendLoader>()
	const fetcher = useFetcher<trendLoader>()

	const [searchParams] = useSearchParams()
	const prevSearchParamsRef = useRef(searchParams.toString())

	useEffect(() => {
		const currentSearchParams = searchParams.toString()
		if (currentSearchParams !== prevSearchParamsRef.current) {
			fetcher.load(`/trend?${currentSearchParams}`)
			prevSearchParamsRef.current = currentSearchParams
		}
	}, [searchParams, fetcher])

	const { data } = fetcher.data?.trend || initialData.trend
	const type = fetcher.data?.type || initialData.type
	const item = fetcher.data?.item || initialData.item

	return (
		<>
			{data && data.length > 0 ? (
				<div className="px-4 flex-1">
					<ItemControls />
					<h1 className="text-2xl font-semibold p-4 my-2">
						{formatType(type)}トレンド
					</h1>
					{data.map((trend: RankingType) => (
						<div key={trend.booth_id} className="mb-4">
							<RankingItemCard item={trend} category="trend" type={item} />
						</div>
					))}
					<Pagination totalItems={item === 'avatar' ? 50 : 100} />
				</div>
			) : (
				<div>No data</div>
			)}
		</>
	)
}
