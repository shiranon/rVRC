import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import type { trendLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card'
import { ItemControls } from '~/components/controls/item-controls'
import { OptionControls } from '~/components/controls/option-controls'
import { SideControls } from '~/components/controls/side-controls'
import { Pagination } from '~/components/element/pagination'
import { useWindowSize } from '~/hooks/use-window-size'
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
			content: 'https://r-vrc.net/trend',
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/trend',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content:
				'VRChat,BOOTH,VRC,ランキング,トレンド,アバター,衣装,おすすめ,3Dモデル',
		},
	]
}

export default function Ranking() {
	const { trend, item } = useLoaderData<trendLoader>()
	const [searchParams] = useSearchParams()
	const dateParam = searchParams.get('date')
	const rankingDate = formatJapaneseDate(dateParam)
	const [width] = useWindowSize()

	return (
		<>
			{trend && trend.length > 0 ? (
				<div className="relative flex justify-center">
					<div>
						{width > 1200 && (
							<div
								className="fixed bottom-28"
								style={{ left: `calc(50% + ${width / 4}px + 20px)` }}
							>
								<SideControls type="trend" />
							</div>
						)}
						<div className="px-4 flex-1 max-w-[640px]">
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
							{width < 1200 && <OptionControls type="trend" />}
						</div>
						<Pagination totalItems={item === 'avatar' ? 50 : 100} />
					</div>
				</div>
			) : (
				<div className="text-xl pt-8">指定のデータは存在しません</div>
			)}
		</>
	)
}
