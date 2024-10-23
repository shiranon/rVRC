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
import { RelationControls } from '~/components/controls/relation-controls'
import { CreateFolder } from '~/components/element/create-folder'
import { Pagination } from '~/components/element/pagination'
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
	formatDateWithHyphen,
	formatValue,
	truncateString,
} from '~/lib/format'

export { avatarPageAction as action } from '~/.server/actions'
export { avatarPageLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof avatarPageLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data.avatar.item_name
		? [
				{ title: `${data.avatar.item_name} - アバター rVRC` },
				{
					name: 'twitter:title',
					content: data.avatar.item_name,
				},
				{
					property: 'og:title',
					content: data.avatar.item_name,
				},
			]
		: []
	const descriptionElements = data.avatar.item_price
		? [
				{
					name: 'description',
					content: `${data.avatar.item_name} / ${data.avatar.shop_name} / 価格:${formatValue(data.avatar.item_price)}円 / ♥${data.avatar.latest_favorite}スキ / 対応アイテム数 ${formatValue(data.relationCloth.length)} 対応アイテムの検索はこちらから！`,
				},
				{
					name: 'twitter:description',
					content: `${data.avatar.shop_name} / 価格:${data.avatar.item_price}円 / ♥${data.avatar.latest_favorite}`,
				},
				{
					property: 'og:description',
					content: `${data.avatar.shop_name} / 価格:${data.avatar.item_price}円 / ♥${data.avatar.latest_favorite}`,
				},
			]
		: []
	const imageElements = [
		{
			name: 'twitter:image',
			content: `${buildItemImage(data.avatar.item_image)}`,
		},
		{
			property: 'og:image',
			content: `${buildItemImage(data.avatar.item_image)}`,
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image',
		},
		{
			property: 'og:image:alt',
			content: data.avatar.item_name,
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
			content: `VRChat, アバター, 3Dモデル, ランキング, ${data.avatar.item_name}, ${data.avatar.shop_name}, `,
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

	const hashtags = ['VRChat']
	const encodedHashtags = encodeURIComponent(hashtags.join(','))

	const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${avatar.item_name} ♥${formatValue(avatar.latest_favorite)}`)}&url=${encodeURIComponent(`https://r-vrc/avatar/${id}`)}&hashtags=${encodedHashtags}`

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
				<div className="flex justify-center">
					<div className="flex flex-col max-w-[640px] pt-10 px-6">
						<img
							className="rounded-md"
							src={buildItemImage(avatar.item_image)}
							loading="lazy"
							alt={avatar.item_name}
						/>
						<div className="text-2xl sm:text-3xl pt-4 font-semibold tracking-tight leading-relaxed">
							{avatar.item_name}
						</div>
						<div className="flex pt-4 items-center justify-end text-xl font-bold">
							<HeartIcon
								className="size-4 sm:size-5 mr-1"
								pathProps={{ fill: '#444444' }}
							/>
							<div className="text-base sm:text-lg">
								{formatValue(avatar.latest_favorite)}
							</div>
						</div>
						<div className="text-2xl sm:text-3xl font-semibold tracking-tight leading-relaxed text-right">
							{`￥${formatValue(avatar.item_price)}`}
						</div>
						<Link to={`/shop/${avatar.shop_id}`}>
							<div className="flex p-1 pl-3 sm:pt-3 items-center gap-2">
								<Avatar className="size-10 sm:size-12">
									<AvatarImage
										src={buildShopImage(avatar.shop_image)}
										loading="lazy"
										alt={avatar.shop_name}
									/>
									<AvatarFallback />
								</Avatar>
								<div className="pl-1 text-sm sm:text-base">
									{avatar.shop_name}
								</div>
							</div>
						</Link>
						<div className="w-full pl-1 text-end text-sm sm:text-base">
							公開日 {formatDateWithHyphen(avatar.published)}
						</div>
						<div className="flex justify-center items-center space-x-2 py-4">
							<Link
								to={`https://booth.pm/ja/items/${avatar.booth_id}`}
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
												<CreateFolder actionPath={`/avatar/${id}`}>
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
				<div className="max-w-[640px] m-auto">
					<div ref={relatedClothRef} className="text-2xl pt-4 pl-2">
						関連アイテム
					</div>
					<RelationControls />
				</div>
				<div className="py-4 text-lg">
					対応衣装（{formatValue(totalClothCount.total_count)}件）
				</div>
				{relationCloth && relationCloth.length > 0 ? (
					<>
						<Card className="bg-light-beige mt-4">
							<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-1 sm:p-2">
								{relationCloth.map((cloth) => (
									<Card key={cloth.booth_id}>
										<FlexItemCard item={cloth} type={'cloth'} />
									</Card>
								))}
							</CardContent>
						</Card>
						{totalClothCount && (
							<Pagination
								totalItems={totalClothCount.total_count}
								itemsPerPage={12}
							/>
						)}
					</>
				) : (
					<div className="text-xl pt-4">関連衣装はありません</div>
				)}
			</div>
		</>
	)
}
