import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Link, json, useLoaderData } from '@remix-run/react'
import { FavoriteTag } from '~/components/element/favorite-tag'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { buildAvatarImage, buildShopImage, formatValue } from '~/lib/format'
import { loadEnvironment, truncateString } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-component.server'

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const supabase = createClient(env)

	const { id } = params
	if (!id) {
		return null
	}

	const clothData = await supabase.rpc('get_cloth_with_favorite', {
		page_id: Number.parseInt(id),
	})
	if (!clothData.data) {
		return null
	}

	const relationAvatar = await supabase.rpc('get_relation_avatar_data', {
		cloth_booth_id: clothData.data[0].booth_id,
	})
	console.log(relationAvatar.data)
	return json({ cloth: clothData.data[0], relationAvatar: relationAvatar.data })
}
export default function clothPage() {
	const { cloth, relationAvatar } = useLoaderData<typeof loader>() || {
		cloth: null,
		relationAvatar: null,
	}
	if (!cloth) return null
	return (
		<>
			<div className="flex flex-col pt-10 px-6">
				<img
					className="rounded-md"
					src={buildAvatarImage(cloth.image_url)}
					loading="lazy"
					alt={cloth.name}
				/>
				<div className="text-3xl pt-4 font-semibold tracking-tight leading-relaxed">
					{cloth.name}
				</div>
				<div className="text-3xl font-semibold tracking-tight leading-relaxed">
					{`￥${formatValue(cloth.price)}`}
				</div>
				<div className="flex items-center justify-end text-xl font-bold">
					<svg
						aria-hidden="true"
						focusable="false"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5 mr-1"
					>
						<path
							d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
							fill="#111111"
						/>
					</svg>

					<div>{formatValue(cloth.latest_favorite)}</div>
				</div>
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage
							src={buildShopImage(cloth.shop_image)}
							loading="lazy"
							alt={cloth.shop_name}
						/>
						<AvatarFallback />
					</Avatar>
					<div className="pl-1 text-sm">{cloth.shop_name}</div>
				</div>
				<div className="flex justify-center space-x-2 py-4">
					<Button className="rounded-2xl text-lg w-3/4 h-12 text-white font-bold border-[1px] bg-red-400  hover:bg-red-300">
						<Link
							to={`https://booth.pm/ja/items/${cloth.booth_id}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							BOOTHで購入する
						</Link>
					</Button>
				</div>
				{relationAvatar && relationAvatar.length > 0 && (
					<>
						<div className="text-2xl pt-2">関連アバター</div>
						<Card className="bg-light-beige">
							<CardContent className="grid grid-cols-2 gap-3 p-4">
								{relationAvatar.map((avatar) => (
									<Card key={avatar.booth_id}>
										<Link to={`/avatar/${avatar.id}`}>
											<CardContent className="p-4">
												<div className="relative block overflow-hidden aspect-square">
													<div className="z-10 font-bold">
														<FavoriteTag
															favorite_count={avatar.latest_favorite}
														/>
													</div>
													<img
														className="rounded-md"
														src={buildAvatarImage(avatar.image)}
														loading="lazy"
														alt={avatar.avatar_name}
													/>
												</div>
											</CardContent>
											<CardContent className="px-4 pt-0 pb-1">
												<CardTitle className="leading-relaxed text-lg">
													{truncateString(avatar.avatar_name, 35)}
												</CardTitle>
												<div className="text-right font-bold text-lg">
													￥{avatar.price}
												</div>
											</CardContent>
											<CardFooter className="pb-4 justify-between">
												<div className="flex items-center gap-2">
													<Avatar>
														<AvatarImage
															src={buildShopImage(avatar.shop_image)}
															loading="lazy"
															alt={avatar.shop_name}
														/>
														<AvatarFallback />
													</Avatar>
													<div className="pl-1 text-sm">{avatar.shop_name}</div>
												</div>
											</CardFooter>
										</Link>
									</Card>
								))}
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</>
	)
}
