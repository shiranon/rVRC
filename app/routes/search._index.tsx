import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import type { searchLoader } from '~/.server/loaders'
import { SearchCard } from '~/components/card/search-card'
import { DateFilterControls } from '~/components/controls/date-filter-controls'
import { ItemControls } from '~/components/controls/item-controls'
import { SearchControls } from '~/components/controls/search-controls'
import { SideFilterControls } from '~/components/controls/side-filter-controls'
import { Pagination } from '~/components/element/pagination'
import { useWindowSize } from '~/hooks/use-window-size'
import { formatValue } from '~/lib/format'

export { searchLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof searchLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data
		? [
				{ title: '検索 - rVRC' },
				{
					name: 'twitter:title',
					content: 'rVRC 検索ページ',
				},
				{
					property: 'og:title',
					content: 'rVRC 検索ページ',
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content:
						'VRChat用アイテムの高度な検索ページ。BOOTHで販売中のアバターや衣装をキーワード、スキ数で絞り込み可能。多彩なソート機能で理想のアイテムを効率的に探せます。最新トレンドの発見にも最適。',
				},
				{
					name: 'twitter:description',
					content:
						'VRChat用アバター・衣装を検索、スキ数で絞り込みする事が出来ます。',
				},
				{
					property: 'og:description',
					content:
						'VRChat用アバター・衣装を検索、スキ数で絞り込みする事が出来ます。',
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
			content: 'https://r-vrc.net/search',
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/search',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content:
				'VRChat,VRC,BOOTH,検索,ランキング,アバター,衣装,おすすめ,3Dモデル,人気',
		},
	]
}

export default function Search() {
	const { result, count, item } = useLoaderData<typeof searchLoader>()
	const [width] = useWindowSize()
	return (
		<div className="w-full pb-2 px-4">
			{width > 1540 && (
				<div
					className="fixed bottom-28"
					style={{ left: `calc(54% + ${width / 4}px + 20px)` }}
				>
					<SideFilterControls />
				</div>
			)}
			<ItemControls />
			<SearchControls />
			<div className="py-4 text-xl">検索結果（{formatValue(count)}件）</div>
			{result && result.length > 0 && (
				<>
					<SearchCard search={result} item={item} />
					<div className="flex pt-6 items-center justify-center sticky bottom-6 z-50">
						{width < 1540 && <DateFilterControls />}
					</div>
					<Pagination totalItems={count} itemsPerPage={12} />
				</>
			)}
		</div>
	)
}
