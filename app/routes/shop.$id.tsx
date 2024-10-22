import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { Link, json, redirect, useLoaderData } from '@remix-run/react'
import { FavoriteTag } from '~/components/element/favorite-tag'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import {
	buildShopImage,
	buildSmallItemImage,
	formatDateWithHyphen,
	formatValue,
} from '~/lib/format'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'

export const loader = async ({
	request,
	context,
	params,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// URLパラメータからフィルター条件を取得
	const url = new URL(request.url)
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
	const item = url.searchParams.get('item') || 'all'
	const limit = 12

	// ショップIDの検証
	const { id } = params
	if (!id) {
		return redirect('/')
	}

	const { data: shopData, error: shopError } = await supabase
		.from('shops')
		.select('name,shop_id,image_url')
		.eq('shop_id', id)
		.single()

	if (shopError) {
		console.error('衣装データの取得時にエラー', shopError)
		return redirect('/')
	}

	console.log(id)

	const { data: items, error: itemsError } = await supabase.rpc(
		'get_shop_items',
		{
			page_shop_id: id,
			filter_item_type: item,
			page_offset: (page - 1) * limit,
			page_limit: limit,
		},
	)

	if (itemsError) {
		console.error('販売アイテムデータの取得時にエラー', itemsError)
		return redirect('/')
	}

	// 販売しているアバターと衣装の件数を取得
	const { count: avatarCount } = await supabase
		.from('shop_avatar')
		.select('*', { count: 'exact', head: true })
		.eq('shop_id', id)

	const { count: clothCount } = await supabase
		.from('shop_cloth')
		.select('*', { count: 'exact', head: true })
		.eq('shop_id', id)

	console.log(clothCount)

	return json({
		shop: shopData,
		items,
		avatarCount,
		clothCount,
	})
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data.shop.name
		? [
				{ title: `${data.shop.name} - ショップ rVRC` },
				{
					name: 'twitter:title',
					content: `${data.shop.name} - ショップ rVRC`,
				},
				{
					property: 'og:title',
					content: `${data.shop.name} - ショップ rVRC`,
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content: `${data.shop.name} - ショップ rVRC`,
				},
				{
					name: 'twitter:description',
					content: `${data.shop.name} - ショップ rVRC`,
				},
				{
					property: 'og:description',
					content: `${data.shop.name} - ショップ rVRC`,
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
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/shop',
		},
		{ name: 'author', content: 'rVRC' },
	]
}

export default function Folder() {
	const { shop, items, avatarCount, clothCount } =
		useLoaderData<typeof loader>()
	return (
		<>
			<div className="w-full p-6 mx-auto">
				<div className="flex justify-between">
					<div className="flex justify-start items-center">
						<img
							src={buildShopImage(shop.image_url)}
							alt={shop.name}
							className="size-28 rounded-xl"
						/>
						<div className="grid pl-8 pb-4">
							<div className="text-sm">ショップ</div>
							<div className="text-xl font-bold">{shop.name}</div>
						</div>
					</div>
					<Link
						to={`https://${shop.shop_id}.booth.pm`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="mx-3 m-6 p-1 h-7 text-sm xl:h-9 xl:text-lg text-white font-bold bg-red-400">
							BOOTH
						</div>
					</Link>
				</div>
				<div className="flex justify-center mt-4 bg-light-beige">
					<Separator className="bg-slate-400" />
				</div>
				<div className="pt-4">
					<div className="grid gap-2 pt-4">
						<Card className="mt-2 bg-transparent shadow-none border-none">
							<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-0">
								{items.map((item) => (
									<Card key={item.booth_id}>
										<Link to={`/${item.item_type}/${item.id}`}>
											<CardContent className="p-4 relative">
												<div className="z-10 font-bold">
													<FavoriteTag favorite_count={item.latest_favorite} />
												</div>
												<div className="block overflow-hidden aspect-square">
													<img
														className="rounded-md"
														src={buildSmallItemImage(item.item_image)}
														loading="lazy"
														alt={item.item_name}
													/>
												</div>
											</CardContent>
											<CardContent className="px-4 pt-0 pb-1">
												<CardTitle className="leading-relaxed text-lg h-[4rem]">
													<div className="line-clamp-2 break-words">
														{item.item_name}
													</div>
												</CardTitle>
												<div className="font-bold text-lg text-right">
													￥{formatValue(item.item_price)}
												</div>
											</CardContent>
										</Link>
										<CardFooter className="px-4 pb-4 flex-col justify-start items-end">
											<Link
												to={`https://booth.pm/ja/items/${item.booth_id}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<div className="w-full pl-1 text-end text-xs sm:text-sm">
													公開日: {formatDateWithHyphen(item.published)}
												</div>
											</Link>
										</CardFooter>
									</Card>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	)
}
