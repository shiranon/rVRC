import type { MetaFunction } from '@remix-run/cloudflare'
import { Form, Link, useLoaderData, useParams } from '@remix-run/react'
import { Folder, FolderPlus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { clothPageLoader } from '~/.server/loaders'
import { FlexItemCard } from '~/components/card/flex-item-card'
import { CreateFolder } from '~/components/element/create-folder'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { HeartIcon, XIcon } from '~/components/ui/icons'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { useActionToast } from '~/hooks/use-action-toast'
import {
	buildItemImage,
	buildShopImage,
	formatValue,
	truncateString,
} from '~/lib/format'

export { clothPageAction as action } from '~/.server/actions'
export { clothPageLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof clothPageLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data.cloth.item_name
		? [
				{ title: `${data.cloth.item_name} - 衣装 rVRC` },
				{
					name: 'twitter:title',
					content: data.cloth.item_name,
				},
				{
					property: 'og:title',
					content: data.cloth.item_name,
				},
			]
		: []
	const descriptionElements = [
		{
			name: 'description',
			content: `${data.cloth.item_name} / ${data.cloth.shop_name} / 価格:${formatValue(data.cloth.item_price)}円 / ♥${data.cloth.latest_favorite ? data.cloth.latest_favorite : 0}スキ /  対応アイテム数 ${formatValue(data.relationAvatar.length)} 対応アバターの詳細はこちらから。`,
		},
		{
			name: 'twitter:description',
			content: `${data.cloth.shop_name} / 価格:${formatValue(data.cloth.item_price)}円 / ♥${data.cloth.latest_favorite ? data.cloth.latest_favorite : 0}`,
		},
		{
			property: 'og:description',
			content: `${data.cloth.shop_name} / 価格:${formatValue(data.cloth.item_price)}円 / ♥${data.cloth.latest_favorite ? data.cloth.latest_favorite : 0}`,
		},
	]
	const imageElements = [
		{
			name: 'twitter:image',
			content: `${buildItemImage(data.cloth.item_image)}`,
		},
		{
			property: 'og:image',
			content: `${buildItemImage(data.cloth.item_image)}`,
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image',
		},
		{
			property: 'og:image:alt',
			content: data.cloth.item_name,
		},
	]
	return [
		...titleElements,
		...descriptionElements,
		...imageElements,
		{
			property: 'og:url',
			content: `https://r-vrc.net/avatar/${data.cloth.booth_id}`,
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: `https://r-vrc.net/cloth/${data.cloth.booth_id}`,
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content: `VRChat, 衣装, 3Dモデル, ランキング, ${data.cloth.item_name}, ${data.cloth.shop_name}, `,
		},
	]
}

export default function clothPage() {
	const { cloth, relationAvatar, foldersData, isLoggedIn } = useLoaderData<
		typeof clothPageLoader
	>() || {
		cloth: null,
		relationAvatar: null,
	}
	const [isOpen, setIsOpen] = useState(false)
	const { id } = useParams()

	const hashtags = ['VRChat']
	const encodedHashtags = encodeURIComponent(hashtags.join(','))

	const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${cloth.item_name} ♥${formatValue(cloth.latest_favorite)}`)}&url=${encodeURIComponent(`https://r-vrc/cloth/${id}`)}&hashtags=${encodedHashtags}`

	useActionToast()

	if (!cloth) return null
	return (
		<>
			<div className="pt-2 px-4">
				<div className="flex justify-center">
					<div className="flex flex-col max-w-[640px] pt-10 px-6">
						<img
							className="rounded-md"
							src={buildItemImage(cloth.item_image)}
							loading="lazy"
							alt={cloth.item_name}
						/>
						<div className="text-2xl sm:text-3xl pt-4 font-semibold tracking-tight leading-relaxed">
							{cloth.item_name}
						</div>
						<div className="flex pt-4 items-center justify-end text-xl font-bold">
							<HeartIcon
								className="size-4 sm:size-5 mr-1"
								pathProps={{ fill: '#444444' }}
							/>
							<div className="text-base sm:text-lg">
								{formatValue(cloth.latest_favorite)}
							</div>
						</div>
						<div className="text-2xl sm:text-3xl font-semibold tracking-tight leading-relaxed text-right">
							{`￥${formatValue(cloth.item_price)}`}
						</div>
						<Link to={`/shop/${cloth.shop_id}`}>
							<div className="flex p-1 pl-3 sm:pt-3 items-center gap-2">
								<Avatar className="size-10 sm:size-12">
									<AvatarImage
										src={buildShopImage(cloth.shop_image)}
										loading="lazy"
										alt={cloth.shop_name}
									/>
									<AvatarFallback />
								</Avatar>
								<div className="pl-1 text-sm sm:text-base">
									{cloth.shop_name}
								</div>
							</div>
						</Link>
						<div className="flex justify-center items-center space-x-2 py-4">
							<Link
								to={`https://booth.pm/ja/items/${cloth.booth_id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-[60%]"
							>
								<Button className="rounded-2xl text-lg w-full h-12 text-white font-bold border-[1px] bg-red-400  hover:bg-red-300">
									BOOTHで購入する
								</Button>
							</Link>
							<div className="flex items-center pl-2">
								{isLoggedIn && (
									<Popover open={isOpen} onOpenChange={setIsOpen}>
										<PopoverTrigger className="px-2">
											<FolderPlus className="size-10" />
										</PopoverTrigger>
										<PopoverContent className="p-0 space-y-1 z-[1000]">
											{foldersData &&
												foldersData.length > 0 &&
												foldersData.map((folder) => (
													<Form method="post" key={folder.id}>
														<div>
															<input
																type="hidden"
																name="folderId"
																value={folder.id}
															/>
															<Button
																className="p-2 flex justify-start bg-white hover:bg-slate-200 w-full"
																type="submit"
																name="intent"
																value="addFolder"
																onClick={() => setIsOpen(false)}
															>
																<Folder />
																<div className="pl-2">
																	{truncateString(folder.name, 15)}
																</div>
															</Button>
														</div>
													</Form>
												))}
											{foldersData && foldersData.length < 10 && (
												<CreateFolder actionPath={`/cloth/${id}`}>
													<div>
														<Button className="p-2 flex justify-start rounded-b-lg bg-white w-full hover:bg-slate-200">
															<Plus />
															<div>新規作成</div>
														</Button>
													</div>
												</CreateFolder>
											)}
										</PopoverContent>
									</Popover>
								)}
								<div className="size-8">
									<Link
										to={twitterShareUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<XIcon />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="pb-4">
					{relationAvatar && relationAvatar.length > 0 ? (
						<>
							<div className="text-2xl pt-2 pl-2">
								関連アバター（{relationAvatar.length}件）
							</div>
							<Card className="bg-light-beige mt-4">
								<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-1 sm:p-2">
									{relationAvatar.map((avatar) => (
										<Card key={avatar.booth_id}>
											<FlexItemCard item={avatar} type="avatar" />
										</Card>
									))}
								</CardContent>
							</Card>
						</>
					) : (
						<div className="text-xl pt-4">関連アバターはありません</div>
					)}
				</div>
			</div>
		</>
	)
}
