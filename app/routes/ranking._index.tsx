import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import type { rankingLoader } from '~/.server/loaders'
import { RankingItemCard } from '~/components/card/ranking-item-card'
import { ItemControls } from '~/components/controls/item-controls'
import { OptionControls } from '~/components/controls/option-controls'
import { SideControls } from '~/components/controls/side-controls'
import { Pagination } from '~/components/element/pagination'
import { useWindowSize } from '~/hooks/use-window-size'
import { formatJapaneseDate } from '~/lib/format'
import type { RankingType } from '~/types/items'

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
						'VRChat用アイテムの最新人気ランキング。Boothで販売中のアバターと衣装を前日比スキ数増加順で表示。カレンダー機能で過去のランキングも閲覧可能。トレンドの変化を簡単にチェックできます。',
				},
				{
					name: 'twitter:description',
					content:
						'VRChat用アイテムの最新人気ランキング。Boothで販売中のアバターと衣装を前日比スキ数増加順で表示。カレンダー機能で過去のランキングも閲覧可能。トレンドの変化を簡単にチェックできます。',
				},
				{
					property: 'og:description',
					content:
						'VRChat用アイテムの最新人気ランキング。Boothで販売中のアバターと衣装を前日比スキ数増加順で表示。カレンダー機能で過去のランキングも閲覧可能。トレンドの変化を簡単にチェックできます。',
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
	const { ranking, item } = useLoaderData<rankingLoader>()
	const [searchParams] = useSearchParams()
	const dateParam = searchParams.get('date')
	const rankingDate = formatJapaneseDate(dateParam)
	const [width] = useWindowSize()

	return (
		<>
			{ranking && ranking.length > 0 ? (
				<div className="relative flex justify-center">
					<div>
						{width > 1200 && (
							<div
								className="fixed bottom-28"
								style={{ left: `calc(50% + ${width / 4}px + 20px)` }}
							>
								<SideControls type="ranking" />
							</div>
						)}
						<div className="px-4 flex-1 max-w-[640px]">
							<ItemControls />
							<h1 className="text-2xl font-bold p-4">デイリーランキング</h1>
							<div className="pb-4 px-4 text-xl">{rankingDate}</div>
							{ranking.map((ranking: RankingType) => (
								<div key={ranking.booth_id} className="mb-4">
									<RankingItemCard item={ranking} category="rank" type={item} />
								</div>
							))}
						</div>
						<div className="flex items-center justify-center sticky bottom-6 z-50">
							{width < 1200 && <OptionControls type="ranking" />}
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
