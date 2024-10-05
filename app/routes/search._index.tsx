import {
	type LoaderFunctionArgs,
	type MetaFunction,
	json,
} from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { SearchCard } from '~/components/card/search-card'
import { ItemControls } from '~/components/element/item-controls'
import { Pagination } from '~/components/element/pagination'
import { SearchControls } from '~/components/element/search-controls'
import { formatValue } from '~/lib/format'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-component.server'
import type { FavoriteFilter, SortBy } from '~/types/items'

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const supabase = createClient(env)

	const url = new URL(request.url)
	const search_keyword = url.searchParams.get('search') || ''
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortBy = (sort_by_param as SortBy) || undefined
	const favorite_filter_param = url.searchParams.get('favorite') || 'all'
	const favorite_filter: FavoriteFilter =
		favorite_filter_param as FavoriteFilter
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 10
	const item = url.searchParams.get('item') || 'avatar'

	if (item === 'cloth') {
		const result = await supabase.rpc('get_search_cloth_data', {
			search_keyword: search_keyword,
			sort_by: sort_by,
			page_limit: limit,
			page_offset: (page - 1) * limit,
			favorite_filter: favorite_filter,
		})
		const count = await supabase.rpc('get_search_cloth_total', {
			search_keyword: search_keyword,
			favorite_filter: favorite_filter,
		})

		return json({
			result: result.data,
			count: count.data ? count.data : 0,
			item,
			search_keyword,
			favorite_filter,
		})
	}
	const result = await supabase.rpc('get_search_avatar_data', {
		search_keyword: search_keyword,
		sort_by: sort_by,
		page_limit: limit,
		page_offset: (page - 1) * limit,
		favorite_filter: favorite_filter,
	})
	const count = await supabase.rpc('get_search_avatar_total', {
		search_keyword: search_keyword,
		favorite_filter: favorite_filter,
	})

	return json({
		result: result.data,
		count: count.data ? count.data : 0,
		item,
		search_keyword,
		favorite_filter,
	})
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
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
	const { result, count, item } = useLoaderData<typeof loader>()
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
