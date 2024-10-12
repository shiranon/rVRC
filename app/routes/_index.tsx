import type { MetaFunction } from '@remix-run/cloudflare'
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import type { indexLoader } from '~/.server/loaders'
import { TopRankingCard, TopTrendCard } from '~/components/card'
import { ItemControls } from '~/components/controls/item-controls'
import type { RankingType } from '~/types/items'

export { indexLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof indexLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data
		? [
				{ title: 'rVRC - VRChat用アイテムランキング' },
				{
					name: 'twitter:title',
					content: 'rVRC - VRChat用アイテムランキング',
				},
				{
					property: 'og:title',
					content: 'rVRC - VRChat用アイテムランキング',
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content:
						'VRChat用アイテムのランキングサイト。Boothで販売中の人気アバター・衣装をスキ数で分析。前日比や過去のランキング表示、詳細検索、条件別ソート機能で理想のアイテムを簡単に発見。トレンド把握や新作チェックに最適。',
				},
				{
					name: 'twitter:description',
					content:
						'VRChat用アイテムのランキングサイト。Boothで販売中の人気アバター・衣装をスキ数で分析。前日比や過去のランキング表示、詳細検索、条件別ソート機能で理想のアイテムを簡単に発見。トレンド把握や新作チェックに最適。',
				},
				{
					property: 'og:description',
					content:
						'VRChat用アイテムのランキングサイト。Boothで販売中の人気アバター・衣装をスキ数で分析。前日比や過去のランキング表示、詳細検索、条件別ソート機能で理想のアイテムを簡単に発見。トレンド把握や新作チェックに最適。',
				},
			]
		: []
	const imageElements = [
		{
			name: 'twitter:image',
			content: 'https://r-vrc.net/og-image.png',
		},
		{
			property: 'og:image',
			content: 'https://r-vrc.net/og-image.png',
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image',
		},
		{
			property: 'og:image:alt',
			content: 'rVRC',
		},
	]
	return [
		...titleElements,
		...descriptionElements,
		...imageElements,
		{
			property: 'og:url',
			content: 'https://r-vrc.net/',
		},
		{ property: 'og:type', content: 'article' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content: 'VRChat, ランキング, アバター, 衣装 , オススメ, 3Dモデル',
		},
	]
}

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
		<>
			<ItemControls />
			<h1 className="text-3xl py-4 pl-4">デイリーランキング</h1>
			{ranking && ranking.length > 0 && (
				<TopRankingCard ranking={ranking as RankingType[]} item={item} />
			)}
			<h1 className="text-3xl py-4 pl-4">デイリートレンド</h1>
			{trend && trend.length > 0 && (
				<TopTrendCard ranking={trend as RankingType[]} item={item} />
			)}
		</>
	)
}
