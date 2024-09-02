import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { getAvatarRanking, getClothRanking } from '~/.server/loaders'
import { AvatarCard, ClothCard } from '~/components/card'
import { ItemControls } from '~/components/element/item-controls'
import { formatMonth, getTodayDate } from '~/lib/date'
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

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
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

export default function Ranking() {
	const initialData = useLoaderData<RankingAvatarData | RankingClothData>()
	const fetcher = useFetcher<RankingAvatarData | RankingClothData>()

	const [searchParams] = useSearchParams()
	const prevSearchParamsRef = useRef(searchParams.toString())

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

	return (
		<>
			{data && data.length > 0 ? (
				<div className="px-4 flex-1">
					<ItemControls />
					<h1 className="text-2xl font-semibold p-4 my-2">
						{formatType(type)}ランキング
					</h1>
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
			) : (
				<div>No data</div>
			)}
		</>
	)
}
