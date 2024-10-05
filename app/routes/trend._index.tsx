import { useLoaderData, useSearchParams } from '@remix-run/react'
import type { trendLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card'
import { ItemControls } from '~/components/element/item-controls'
import { Pagination } from '~/components/element/pagination'
import { RankingControls } from '~/components/element/ranking-controls'
import { formatJapaneseDate } from '~/lib/format'
import type { RankingType } from '~/types/items'

export { trendLoader as loader } from '~/.server/loaders'

export default function Ranking() {
	const { trend, type, item } = useLoaderData<trendLoader>()
	const [searchParams] = useSearchParams()
	const dateParam = searchParams.get('date')
	const rankingDate = formatJapaneseDate(dateParam)
	return (
		<>
			{trend && trend.length > 0 ? (
				<div className="relative">
					<div className="px-4 flex-1">
						<ItemControls />
						<h1 className="text-2xl font-bold p-4">デイリートレンド</h1>
						<div className="pb-4 px-4 text-xl">{rankingDate}</div>
						{trend.map((trend: RankingType) => (
							<div key={trend.booth_id} className="mb-4">
								<RankingItemCard item={trend} category="trend" type={item} />
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
