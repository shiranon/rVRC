import { useLoaderData, useSearchParams } from '@remix-run/react'
import type { rankingLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card/ranking-item-card'
import { ItemControls } from '~/components/element/item-controls'
import { Pagination } from '~/components/element/pagination'
import { RankingControls } from '~/components/element/ranking-controls'
import { formatJapaneseDate } from '~/lib/format'
import type { RankingType } from '~/types/items'

const formatType = (type: string): string => {
	const typeMap: Record<string, string> = {
		month: 'マンスリー',
		day: 'デイリー',
	}
	return typeMap[type] || ''
}

export { rankingLoader as loader } from '~/.server/loaders'

export default function Ranking() {
	const { ranking, type, item } = useLoaderData<rankingLoader>()
	const [searchParams] = useSearchParams()
	const dateParam = searchParams.get('date')
	const rankingDate = formatJapaneseDate(dateParam)

	return (
		<>
			{ranking && ranking.length > 0 ? (
				<div className="relative">
					<div className="px-4 flex-1">
						<ItemControls />
						<h1 className="text-2xl font-bold p-4">
							{formatType(type)}ランキング
						</h1>
						<div className="pb-4 px-4 text-xl">{rankingDate}</div>
						{ranking.map((ranking: RankingType) => (
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
