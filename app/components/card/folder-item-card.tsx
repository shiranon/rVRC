import { Form, Link } from '@remix-run/react'
import { X } from 'lucide-react'
import { buildShopImage, buildSmallItemImage } from '~/lib/format'
import type { FolderItem } from '~/types/items'
import { FavoriteTag } from '../element/favorite-tag'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { CardContent, CardFooter, CardTitle } from '../ui/card'

interface FlexItemCardProp {
	item: FolderItem
	id: string
	isEdit: boolean
}

const intentMap = {
	avatar: 'deleteAvatar',
	cloth: 'deleteCloth',
}

const ConditionalLink: React.FC<{
	isDisabled: boolean
	to: string
	children: React.ReactNode
}> = ({ isDisabled, to, children }) => {
	if (isDisabled) {
		return <div>{children}</div>
	}
	return <Link to={to}>{children}</Link>
}

export const FolderItemCard = ({ item, id, isEdit }: FlexItemCardProp) => {
	return (
		<>
			<ConditionalLink isDisabled={isEdit} to={`/${item.item_type}/${item.id}`}>
				<CardContent className="p-4 relative">
					{isEdit ? (
						<div className="z-10 font-bold">
							<div className="absolute top-2 right-0 w-auto h-auto flex flex-col items-end px-1 min-w-[5ch]">
								<Form method="post" action={`/folder/${id}`}>
									<input type="hidden" name="folderId" value={id} />
									<input type="hidden" name="boothId" value={item.booth_id} />
									<Button
										type="submit"
										name="intent"
										value={intentMap[item.item_type as keyof typeof intentMap]}
										className="bg-red-500 rounded-full hover:bg-red-400 size-10 p-0"
									>
										<X className="text-white" />
									</Button>
								</Form>
							</div>
						</div>
					) : (
						<div className="z-10 font-bold">
							<FavoriteTag favorite_count={item.latest_favorite} />
						</div>
					)}
					<div className="block overflow-hidden aspect-square">
						<img
							className="rounded-md"
							src={buildSmallItemImage(item.image)}
							loading="lazy"
							alt={item.item_name}
						/>
					</div>
				</CardContent>
				<CardContent className="px-4 pt-0 pb-1">
					<CardTitle className="leading-relaxed text-lg h-[4rem]">
						<div className="line-clamp-2 break-words">{item.item_name}</div>
					</CardTitle>
					<div className="font-bold text-lg text-right">￥{item.price}</div>
				</CardContent>
			</ConditionalLink>
			<CardFooter className="pb-4">
				<Link to={`/shop/${item.shop_id}`}>
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage
								src={buildShopImage(item.shop_image)}
								loading="lazy"
								alt={item.shop_name}
							/>
							<AvatarFallback />
						</Avatar>
						<div className="pl-1 text-sm">{item.shop_name}</div>
					</div>
				</Link>
			</CardFooter>
		</>
	)
}
