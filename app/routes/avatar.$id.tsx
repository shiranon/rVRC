import type { MetaFunction } from '@remix-run/cloudflare'
import {
	Form,
	Link,
	useLoaderData,
	useParams,
	useSearchParams,
} from '@remix-run/react'
import { Folder, FolderPlus, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { avatarPageLoader } from '~/.server/loaders'
import { FlexItemCard } from '~/components/card/flex-item-card'
import { CreateFolder } from '~/components/element/create-folder'
import { Pagination } from '~/components/element/pagination'
import { SearchControls } from '~/components/element/search-controls'
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
	buildSmallItemImage,
	formatValue,
} from '~/lib/format'
import { truncateString } from '~/lib/format'

export { avatarPageAction as action } from '~/.server/actions'
export { avatarPageLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof avatarPageLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data.avatar.name
		? [
				{ title: `${data.avatar.name} - アバター rVRC` },
				{
					name: 'twitter:title',
					content: data.avatar.name,
				},
				{
					property: 'og:title',
					content: data.avatar.name,
				},
			]
		: []
	const descriptionElements = data.avatar.price
		? [
				{
					name: 'description',
					content: `${data.avatar.name} / ${data.avatar.shop_name} / 価格:${data.avatar.price}円 / ♥${data.avatar.latest_favorite}`,
				},
				{
					name: 'twitter:description',
					content: `${data.avatar.shop_name} / 価格:${data.avatar.price}円 / ♥${data.avatar.latest_favorite}`,
				},
				{
					property: 'og:description',
					content: `${data.avatar.shop_name} / 価格:${data.avatar.price}円 / ♥${data.avatar.latest_favorite}`,
				},
			]
		: []
	const imageElements = [
		{
			name: 'twitter:image',
			content: `${buildSmallItemImage(data.avatar.image_url)}`,
		},
		{
			property: 'og:image',
			content: `${buildSmallItemImage(data.avatar.image_url)}`,
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image',
		},
		{
			property: 'og:image:alt',
			content: data.avatar.name,
		},
	]
	return [
		...titleElements,
		...descriptionElements,
		...imageElements,
		{
			property: 'og:url',
			content: `https://r-vrc.net/avatar/${data.avatar.booth_id}`,
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: `https://r-vrc.net/avatar/${data.avatar.booth_id}`,
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content: `VRChat, アバター, 3Dモデル, ランキング, ${data.avatar.name}, ${data.avatar.shop_name}, `,
		},
	]
}

export default function avatarPage() {
	const { avatar, relationCloth, totalClothCount, foldersData, isLoggedIn } =
		useLoaderData<typeof avatarPageLoader>()
	const [isOpen, setIsOpen] = useState(false)
	const relatedClothRef = useRef<HTMLDivElement>(null)
	const [searchParams] = useSearchParams()
	const { id } = useParams()

	const scrollToRelatedCloth = useCallback(() => {
		if (relatedClothRef.current) {
			const offset = 50
			const elementPosition =
				relatedClothRef.current.getBoundingClientRect().top + window.scrollY
			window.scrollTo({ top: elementPosition - offset, behavior: 'instant' })
		}
	}, [])

	useActionToast()

	useEffect(() => {
		if (searchParams.toString()) {
			scrollToRelatedCloth()
		}
	}, [scrollToRelatedCloth, searchParams])

	return (
		<>
			<div className="pt-2 px-4">
				<div className="flex flex-col pt-10 px-6">
					<img
						className="rounded-md"
						src={buildItemImage(avatar.image_url)}
						loading="lazy"
						alt={avatar.name}
					/>
					<div className="text-3xl pt-4 font-semibold tracking-tight leading-relaxed">
						{avatar.name}
					</div>
					<div className="flex items-center justify-end text-xl font-bold">
						<HeartIcon
							className="w-4 h-4 mr-1"
							pathProps={{ fill: '#111111' }}
						/>
						<div>{formatValue(avatar.latest_favorite)}</div>
					</div>
					<div className="text-3xl font-semibold tracking-tight leading-relaxed text-right">
						{`￥${formatValue(avatar.price)}`}
					</div>
					<div className="flex pt-3 items-center gap-2">
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
					<div className="flex justify-center items-center space-x-2 py-4">
						<Button className="rounded-2xl text-lg w-[65%] h-12 text-white font-bold border-[1px] bg-red-400  hover:bg-red-300">
							<Link
								to={`https://booth.pm/ja/items/${avatar.booth_id}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								BOOTHで購入する
							</Link>
						</Button>
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

										<CreateFolder actionPath={`/avatar/${id}`}>
											<div>
												<Button className="p-2 flex justify-start rounded-b-lg bg-white w-full hover:bg-slate-200">
													<Plus />
													<div>新規作成</div>
												</Button>
											</div>
										</CreateFolder>
									</PopoverContent>
								</Popover>
							)}
							<div className="size-8">
								<XIcon />
							</div>
						</div>
					</div>
				</div>
				<div ref={relatedClothRef} className="text-2xl pt-4">
					関連衣装
				</div>
				<SearchControls />
				<div className="py-4 text-lg">
					対応衣装（{formatValue(totalClothCount.total_count)}件）
				</div>
				{relationCloth && relationCloth.length > 0 ? (
					<>
						<Card className="bg-light-beige mt-4">
							<CardContent className="grid grid-cols-2 gap-2 p-2">
								{relationCloth.map((cloth) => (
									<Card key={cloth.booth_id}>
										<Link to={`/cloth/${cloth.id}`}>
											<FlexItemCard item={cloth} />
										</Link>
									</Card>
								))}
							</CardContent>
						</Card>
						{totalClothCount && (
							<Pagination totalItems={totalClothCount.total_count} />
						)}
					</>
				) : (
					<div className="text-xl pt-4">関連衣装はありません</div>
				)}
			</div>
		</>
	)
}
