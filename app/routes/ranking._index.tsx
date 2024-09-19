import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import type { rankingLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card/ranking-item-card'
import { ItemControls } from '~/components/element/item-controls'
import { Pagination } from '~/components/element/pagination'
import { RankingControls } from '~/components/element/ranking-controls'
import type { RankingType } from '~/types/items'

const formatType = (type: string): string => {
	if (type === 'month') {
		return 'マンスリー'
	}
	if (type === 'day') {
		return 'デイリー'
	}
	return ''
}

export { rankingLoader as loader } from '~/.server/loaders'

export default function Ranking() {
	const initialData = useLoaderData<rankingLoader>()
	const fetcher = useFetcher<rankingLoader>()

	const [searchParams] = useSearchParams()
	const prevSearchParamsRef = useRef(searchParams.toString())
	const dateParam = searchParams.get('date')

	useEffect(() => {
		const currentSearchParams = searchParams.toString()
		if (currentSearchParams !== prevSearchParamsRef.current) {
			fetcher.load(`/ranking?${currentSearchParams}`)
			prevSearchParamsRef.current = currentSearchParams
		}
	}, [searchParams, fetcher])

	const { data } = fetcher.data?.ranking || initialData.ranking
	const type = fetcher.data?.type || initialData.type
	const item = fetcher.data?.item || initialData.item
	let rankingDate: string | null
	if (dateParam) {
		const date = new Date(dateParam)
		rankingDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
	} else {
		const date = new Date()
		rankingDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
	}
	return (
		<>
			{data && data.length > 0 ? (
				<div className="relative">
					<div className="px-4 flex-1e">
						<ItemControls />
						<div className="pt-4 pb-2 px-4 my-2">
							<h1 className="text-2xl font-semibold">
								{formatType(type)}ランキング
							</h1>
							<div className="pt-2">{rankingDate}</div>
						</div>
						{data.map((ranking: RankingType) => (
							<div key={ranking.booth_id} className="mb-4">
								<RankingItemCard item={ranking} category="rank" type={item} />
							</div>
						))}
					</div>
					<div className="flex items-center justify-center sticky bottom-6 z-50">
						<RankingControls />
					</div>
					<Pagination totalItems={item === 'avatar' ? 50 : 100} />
				</div>
			) : (
				<div>No data</div>
			)}
		</>
	)
}
