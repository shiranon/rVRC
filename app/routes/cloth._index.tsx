import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { Link, json, useLoaderData } from '@remix-run/react'
import { IndexItemCard } from '~/components/card/index-item-card'
import { IndexControls } from '~/components/controls/index-controls'
import { Pagination } from '~/components/element/pagination'
import { Card, CardContent } from '~/components/ui/card'
import { formatValue } from '~/lib/format'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import type { SortBy } from '~/types/items'

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// URLパラメータからページとソート条件を取得
	const url = new URL(request.url)
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortBy = (sort_by_param as SortBy) || undefined
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 12

	// そのページに表示する衣装データを取得
	const { data: clothsData } = await supabase.rpc('get_all_cloth_data', {
		sort_by: sort_by,
		page_limit: limit,
		page_offset: (page - 1) * limit,
	})

	// 衣装の検索結果の総数を取得
	const { count: clothCount } = await supabase
		.from('cloths')
		.select('*', { count: 'exact', head: true })

	return json({
		cloths: clothsData,
		count: clothCount ? clothCount : 0,
	})
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
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
						'VRChat用衣装を一覧で表示しています。関連アバター数などの様々な条件でソートをする事が出来ます。',
				},
				{
					name: 'twitter:description',
					content:
						'VRChat用衣装を一覧で表示しています。関連アバター数などの様々な条件でソートをする事が出来ます。',
				},
				{
					property: 'og:description',
					content:
						'VRChat用衣装を一覧で表示しています。関連アバター数などの様々な条件でソートをする事が出来ます。',
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
			content: 'https://r-vrc.net/cloth',
		},
		{ property: 'og:type', content: 'article' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/cloth',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content: 'VRChat, ランキング, 衣装, オススメ, アバター, 3Dモデル',
		},
	]
}

export default function Avatar() {
	const { cloths, count } = useLoaderData<typeof loader>()

	return (
		<>
			{cloths && cloths.length > 0 ? (
				<div className="relative flex justify-center">
					<div>
						<div className="px-4 flex-1">
							<h1 className="text-2xl font-bold p-4">衣装リスト</h1>
							<div className="pb-4 px-4 text-xl">
								総数 {formatValue(count)}件
							</div>
							<IndexControls />
							<div className="mb-4">
								<Card className="mt-2 bg-transparent shadow-none border-none">
									<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-0">
										{cloths.map((cloth) => (
											<Link key={cloth.booth_id} to={`/cloth/${cloth.id}`}>
												<Card>
													<IndexItemCard item={cloth} />
												</Card>
											</Link>
										))}
									</CardContent>
								</Card>
							</div>
						</div>
						<Pagination totalItems={count} itemsPerPage={12} />
					</div>
				</div>
			) : (
				<div className="text-xl pt-8">指定のデータは存在しません</div>
			)}
		</>
	)
}