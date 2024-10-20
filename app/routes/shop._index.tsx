import {
	type LoaderFunctionArgs,
	type MetaFunction,
	json,
	redirect,
} from '@remix-run/cloudflare'
import { Link, useLoaderData } from '@remix-run/react'
import type { PostgrestError } from '@supabase/supabase-js'
import { Pagination } from '~/components/element/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent } from '~/components/ui/card'
import avatar_svg from '~/images/avatar.svg'
import cloth_svg from '~/images/cloth.svg'
import { buildShopImage, buildSmallItemImage, formatValue } from '~/lib/format'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import type { SortShopBy } from '~/types/items'

interface PopularItem {
	name: string
	image_url: string
}

interface Shop {
	shop_id: string
	shop_name: string
	shop_image: string
	avatar_count: number
	cloth_count: number
	latest_item_published_at: string
	popular_items: PopularItem[]
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)
	// URLパラメータからページとソート条件を取得
	const url = new URL(request.url)
	const sort_by_param = url.searchParams.get('sort') || ''
	const sort_by: SortShopBy = (sort_by_param as SortShopBy) || undefined
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const limit = 12

	const { data: shopsData, error: shopsError } = (await supabase.rpc(
		'get_all_shop_data',
		{
			sort_by: sort_by,
			page_limit: limit,
			page_offset: (page - 1) * limit,
		},
	)) as { data: Shop[] | null; error: PostgrestError }

	if (shopsError) {
		console.error('ショップ一覧の取得時にエラー', shopsError)
		redirect('/')
	}
	// ショップの総数を取得
	const { count: shopCount } = await supabase
		.from('shops')
		.select('id', { count: 'exact', head: true })

	return json({
		shops: shopsData,
		count: shopCount ? shopCount : 0,
	})
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data
		? [
				{ title: 'ショップ - rVRC' },
				{
					name: 'twitter:title',
					content: 'rVRC - ショップ一覧',
				},
				{
					property: 'og:title',
					content: 'rVRC - ショップ一覧',
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content:
						'ショップを一覧で表示しています。販売アバター数、販売アイテムのお気に入り順などの様々な条件でソートをする事が出来ます。',
				},
				{
					name: 'twitter:description',
					content: 'rCRC - ショップ一覧',
				},
				{
					property: 'og:description',
					content: 'rCRC - ショップ一覧',
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
			content: 'https://r-vrc.net/shop',
		},
		{ property: 'og:type', content: 'article' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/shop',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content: 'VRChat, ランキング, アバター, オススメ, 衣装, 3Dモデル',
		},
	]
}

export default function Shop() {
	const { shops, count } = useLoaderData<typeof loader>()
	return (
		<>
			{shops && shops.length > 0 ? (
				<div className="w-full pb-2 px-4">
					<div>
						<div className="px-4 flex-1">
							<h1 className="text-2xl font-bold p-4">ショップリスト</h1>
							<div className="pb-4 px-4 text-xl">
								総数 {formatValue(count)}件
							</div>
							<div className="mb-4">
								<Card className="mt-2 bg-transparent shadow-none border-none">
									<CardContent className="grid grid-cols-1 gap-4 p-0">
										{shops.map((shop) => (
											<Link key={shop.shop_id} to={`/shop/${shop.shop_id}`}>
												<Card key={shop.shop_id}>
													<CardContent className="p-0 bg-white rounded-lg">
														<div className="relative max-w-full flex flex-row justify-between">
															<div className="flex">
																{Array.isArray(shop.popular_items) &&
																	shop.popular_items.length > 0 && (
																		<>
																			<img
																				src={buildSmallItemImage(
																					shop.popular_items[0]
																						.image_url as string,
																				)}
																				alt={
																					shop.popular_items[0].name as string
																				}
																				className="size-48 xl:size-64 object-cover rounded-l-lg"
																			/>
																			{shop.popular_items.length > 1 && (
																				<div className="flex flex-col">
																					{shop.popular_items
																						.slice(1, 3)
																						.map((item, index) => (
																							<img
																								key={item.name as string}
																								src={buildSmallItemImage(
																									item.image_url as string,
																								)}
																								alt={item.name as string}
																								className="hidden sm:block sm:size-24 xl:size-32 object-cover"
																							/>
																						))}
																					{/* 3枚目の画像がない場合、空のdivで高さを調整 */}
																					{shop.popular_items.length === 2 && (
																						<div className="size-24" />
																					)}
																				</div>
																			)}
																		</>
																	)}
															</div>
															<div className="grow grid place-items-center">
																<div className="p-3 w-full flex flex-col gap-1">
																	<div className="text-sm text-gray-500">
																		{shop.shop_id}
																	</div>
																</div>
															</div>
															<div className="p-2">
																<div className="flex items-center">
																	<img
																		src={avatar_svg}
																		alt="avatar"
																		className="size-5"
																	/>
																	<span>{shop.avatar_count}</span>
																</div>
																<div className="flex items-center">
																	<img
																		src={cloth_svg}
																		alt="cloth"
																		className="size-5"
																	/>
																	<span>{shop.avatar_count}</span>
																</div>
															</div>
															<div className="absolute flex items-center bottom-2 right-2">
																<Avatar className="size-8">
																	<AvatarImage
																		src={buildShopImage(shop.shop_image)}
																		loading="lazy"
																		alt={shop.shop_name}
																	/>
																	<AvatarFallback />
																</Avatar>
																<div className="pl-1 text-sm">
																	{shop.shop_name}
																</div>
															</div>
														</div>
													</CardContent>
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