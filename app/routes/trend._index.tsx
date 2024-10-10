import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import type { trendLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card'
import { ItemControls } from '~/components/controls/item-controls'
import { RankingControls } from '~/components/controls/ranking-controls'
import { Pagination } from '~/components/element/pagination'
import { formatJapaneseDate } from '~/lib/format'
import type { RankingType } from '~/types/items'

export { trendLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof trendLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data
		? [
				{ title: 'トレンド - rVRC' },
				{
					name: 'twitter:title',
					content: 'rVRC - トレンド',
				},
				{
					property: 'og:title',
					content: 'rVRC - トレンド',
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content:
						'VRChat用新作アイテムのトレンドページ。指定日から1週間以内にBOOTHで公開されたアバターと衣装を対象に、スキ数でランキング化。最新の人気アイテムをいち早くチェック。新しいトレンドの発見に最適です。',
				},
				{
					name: 'twitter:description',
					content:
						'販売から1週間以内のVRChat用アイテムのスキ数を集計してトレンドを作成しています。',
				},
				{
					property: 'og:description',
					content:
						'販売から1週間以内のVRChat用アイテムのスキ数を集計してトレンドを作成しています。',
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
			content: 'summary',
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
			content: 'https://r-vrc.net/ranking',
		},
		{ property: 'og:type', content: 'article' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/ranking',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content:
				'VRChat, ランキング, トレンド, アバター, オススメ, 衣装, 3Dモデル',
		},
	]
}

export default function Ranking() {
	const { trend, item } = useLoaderData<trendLoader>()
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
				<div>指定のデータは存在しません</div>
			)}
		</>
	)
}
