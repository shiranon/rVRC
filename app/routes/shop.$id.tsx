import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { json, redirect, useLoaderData } from '@remix-run/react'
import { Separator } from '~/components/ui/separator'
import { buildShopImage } from '~/lib/format'
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

	return json({
		shop: shopData,
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
	const { shop } = useLoaderData<typeof loader>()
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
					<div className="mx-3 p-1 h-7 text-sm xl:h-9 xl:text-lg text-white font-bold bg-red-400">
						BOOTH
					</div>
				</div>
				<div className="flex justify-center mt-4 bg-light-beige">
					<Separator className="bg-slate-400" />
				</div>
				<div className="pt-4">
					<div className="grid gap-2 pt-4">test</div>
				</div>
			</div>
		</>
	)
}
