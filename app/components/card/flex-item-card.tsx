import { buildAvatarImage, buildShopImage } from '~/lib/format'
import type { ItemType } from '~/types/items'
import { FavoriteTag } from '../element/favorite-tag'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CardContent, CardFooter, CardTitle } from '../ui/card'

interface FlexItemCardProp {
	item: ItemType
}

export const FlexItemCard = ({ item }: FlexItemCardProp) => {
	return (
		<>
			<CardContent className="p-4">
				<div className="relative block overflow-hidden aspect-square">
					<div className="z-10 font-bold">
						<FavoriteTag favorite_count={item.latest_favorite} />
					</div>
					<img
						className="rounded-md"
						src={buildAvatarImage(item.image)}
						loading="lazy"
						alt={item.item_name}
					/>
				</div>
			</CardContent>
			<CardContent className="px-4 pt-0 pb-1">
				<CardTitle className="leading-relaxed text-lg h-[4rem]">
					<div className="line-clamp-2 break-words">{item.item_name}</div>
				</CardTitle>
				<div className="text-right font-bold text-lg">￥{item.price}</div>
			</CardContent>
			<CardFooter className="pb-4 justify-between">
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
			</CardFooter>
		</>
	)
}
