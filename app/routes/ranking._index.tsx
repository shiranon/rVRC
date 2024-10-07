import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import type { rankingLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card/ranking-item-card'
import { ItemControls } from '~/components/controls/item-controls'
import { RankingControls } from '~/components/controls/ranking-controls'
import { Pagination } from '~/components/element/pagination'
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

export const meta: MetaFunction<typeof rankingLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data
		? [
				{ title: 'ランキング - rVRC' },
				{
					name: 'twitter:title',
					content: 'rVRC - ランキング',
				},
				{
					property: 'og:title',
					content: 'rVRC - ランキング',
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content:
						'スキ数の前日比でVRChat用アイテムのランキングを作成しています。',
				},
				{
					name: 'twitter:description',
					content:
						'スキ数の前日比でVRChat用アイテムのランキングを作成しています。',
				},
				{
					property: 'og:description',
					content:
						'スキ数の前日比でVRChat用アイテムのランキングを作成しています。',
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
			content: 'VRChat, ランキング, アバター, オススメ, 衣装, 3Dモデル',
		},
	]
}

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
				<div className="text-xl pt-8">指定のデータは存在しません</div>
			)}
		</>
	)
}
