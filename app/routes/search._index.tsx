import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import type { searchLoader } from '~/.server/loaders'
import { SearchCard } from '~/components/card/search-card'
import { ItemControls } from '~/components/controls/item-controls'
import { SearchControls } from '~/components/controls/search-controls'
import { Pagination } from '~/components/element/pagination'
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
					content: 'VRChat用アイテムを検索/絞り込みする事が出来ます。',
				},
				{
					name: 'twitter:description',
					content: 'VRChat用アイテムを検索/絞り込みする事が出来ます。',
				},
				{
					property: 'og:description',
					content: 'VRChat用アイテムを検索/絞り込みする事が出来ます。',
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
	]
}

export default function Search() {
	const { result, count, item } = useLoaderData<typeof searchLoader>()
	return (
		<div className="w-full pb-2 px-4">
			<ItemControls />
			<SearchControls />
			<div className="py-4 text-xl">検索結果（{formatValue(count)}件）</div>
			{result && result.length > 0 && (
				<>
					<SearchCard search={result} item={item} />
					<Pagination totalItems={count} />
				</>
			)}
		</div>
	)
}
