import type { MetaFunction } from '@remix-run/cloudflare'
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import type { indexLoader } from '~/.server/loaders'
import { TopRankingCard, TopTrendCard } from '~/components/card'
import { ItemControls } from '~/components/element/item-controls'
import type { RankingAvatarType, RankingClothType } from '~/types/items'

export const meta: MetaFunction = () => {
	return [
		{ title: 'rVRc' },
		{
			name: 'description',
			content:
				'rVRcはVRChat用アイテムのスキ数を集計してランキング化しているサイトです。',
		},
	]
}

export { indexLoader as loader } from '~/.server/loaders'

export default function Index() {
	const initialData = useLoaderData<indexLoader>()
	const fetcher = useFetcher<indexLoader>()

	const [searchParams] = useSearchParams()
	const prevSearchParamsRef = useRef(searchParams.toString())

	useEffect(() => {
		const currentSearchParams = searchParams.toString()
		if (currentSearchParams !== prevSearchParamsRef.current) {
			fetcher.load(`/?${currentSearchParams}`)
			prevSearchParamsRef.current = currentSearchParams
		}
	}, [searchParams, fetcher])

	const ranking =
		fetcher.data?.ranking?.data || initialData?.ranking?.data || []
	const trend = fetcher.data?.trend?.data || initialData?.trend?.data || []
	const item = fetcher.data?.item || initialData?.item

	return (
		<div className="px-2 flex-1">
			<ItemControls />
			<h1 className="text-3xl py-4 pl-4">デイリーランキング</h1>
			{ranking && ranking.length > 0 && item === 'avatar' && (
				<TopRankingCard
					avatar={ranking as RankingAvatarType[]}
					item={item}
					cloth={null}
				/>
			)}
			{ranking && ranking.length > 0 && item === 'cloth' && (
				<TopRankingCard
					cloth={ranking as RankingClothType[]}
					item={item}
					avatar={null}
				/>
			)}
			<h1 className="text-3xl py-4 pl-4">トレンドランキング</h1>
			{trend && trend.length > 0 && item === 'avatar' && (
				<TopTrendCard
					avatar={trend as RankingAvatarType[]}
					item={item}
					cloth={null}
				/>
			)}
			{trend && trend.length > 0 && item === 'cloth' && (
				<TopTrendCard
					cloth={trend as RankingClothType[]}
					item={item}
					avatar={null}
				/>
			)}
		</div>
	)
}
