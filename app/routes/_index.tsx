import type { MetaFunction } from '@remix-run/cloudflare'
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import type { indexLoader } from '~/.server/loaders'
import { TopRankingCard, TopTrendCard } from '~/components/card'
import { ItemControls } from '~/components/element/item-controls'
import type { RankingType } from '~/types/items'

export const meta: MetaFunction = () => {
	return [
		{ title: 'rVRC - VRChat用アイテムランキング' },
		{
			name: 'description',
			content:
				'rVRCはVRChat用アイテムのスキ数を集計してランキング化しているサービスです。',
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
			{ranking && ranking.length > 0 && (
				<TopRankingCard ranking={ranking as RankingType[]} item={item} />
			)}
			<h1 className="text-3xl py-4 pl-4">デイリートレンド</h1>
			{trend && trend.length > 0 && (
				<TopTrendCard ranking={trend as RankingType[]} item={item} />
			)}
		</div>
	)
}
