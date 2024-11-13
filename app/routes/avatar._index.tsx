import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { json, redirect, useLoaderData } from '@remix-run/react'
import { IndexItemCard } from '~/components/card/index-item-card'
import { IndexControls } from '~/components/controls/index-controls'
import { PaginationAnchor } from '~/components/element/pagination-anchor'
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

	// そのページに表示するアバターデータを取得
	const { data: avatarsData, error: avatarsError } = await supabase.rpc(
		'get_all_avatar_data',
		{
			sort_by: sort_by,
			page_limit: limit,
			page_offset: (page - 1) * limit,
		},
	)

	if (avatarsError) {
		console.error('アバター一覧の取得時にエラー', avatarsError)
		redirect('/')
	}

	// 公開アバターの総数を取得
	const { count: avatarCount } = await supabase
		.from('avatars')
		.select('*', { count: 'exact', head: true })
		.not('published_at', 'is', null)

	return json({
		avatars: avatarsData,
		count: avatarCount ? avatarCount : 0,
		sort: sort_by ? sort_by : '',
	})
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data
		? [
				{ title: 'アバター - rVRC' },
				{
					name: 'twitter:title',
					content: 'rVRC - アバター',
				},
				{
					property: 'og:title',
					content: 'rVRC - アバター',
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content:
						'VRChat用アバターを一覧で表示しています。関連衣装数などの様々な条件でソートをする事が出来ます。',
				},
				{
					name: 'twitter:description',
					content:
						'VRChat用アバターを一覧で表示しています。関連衣装数などの様々な条件でソートをする事が出来ます。',
				},
				{
					property: 'og:description',
					content:
						'VRChat用アバターを一覧で表示しています。関連衣装数などの様々な条件でソートをする事が出来ます。',
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
			content: 'https://r-vrc.net/avatar',
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/avatar',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content:
				'VRChat,VRC,BOOTH,アバター,ランキング,おすすめ,3Dモデル,人気,検索',
		},
	]
}

export default function Avatar() {
	const { avatars, count, sort } = useLoaderData<typeof loader>()

	return (
		<>
			{avatars && avatars.length > 0 ? (
				<div className="relative flex justify-center">
					<div>
						<div className="px-4 flex-1">
							<h1 className="text-2xl font-bold p-4">アバターリスト</h1>
							<div className="pb-4 px-4 text-xl">
								総数 {formatValue(count)}件
							</div>
							<IndexControls initialSort={sort} />
							<div className="mb-4">
								<Card className="mt-2 bg-transparent shadow-none border-none">
									<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-0">
										{avatars.map((avatar) => (
											<Card key={avatar.booth_id}>
												<IndexItemCard item={avatar} type="avatar" />
											</Card>
										))}
									</CardContent>
								</Card>
							</div>
						</div>
						<PaginationAnchor totalItems={count} itemsPerPage={12} />
					</div>
				</div>
			) : (
				<div className="text-xl pt-8">指定のデータは存在しません</div>
			)}
		</>
	)
}
