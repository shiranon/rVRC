import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { AvatarCard, ClothCard } from '~/components/card'
import { ItemControls } from '~/components/element/item-controls'
import { Pagination } from '~/components/element/pagination'
import { RankingControls } from '~/components/element/ranking-controls'
import type {
	RankingAvatarData,
	RankingAvatarType,
	RankingClothData,
	RankingClothType,
} from '~/types/items'

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
	const initialData = useLoaderData<RankingAvatarData | RankingClothData>()
	const fetcher = useFetcher<RankingAvatarData | RankingClothData>()

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
						{item === 'avatar' &&
							data.map((avatar) => (
								<div key={avatar.booth_id} className="mb-4">
									<AvatarCard
										item={avatar as RankingAvatarType}
										category="rank"
									/>
								</div>
							))}
						{item === 'cloth' &&
							data.map((cloth) => (
								<div key={cloth.booth_id} className="mb-4">
									<ClothCard item={cloth as RankingClothType} category="rank" />
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
