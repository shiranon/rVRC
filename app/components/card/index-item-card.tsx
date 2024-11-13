import { Link } from '@remix-run/react'
import {
	buildShopImage,
	buildSmallItemImage,
	formatDateWithHyphen,
	formatValue,
} from '~/lib/format'
import type { IndexItemType } from '~/types/items'
import { FavoriteTag } from '../element/favorite-tag'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CardContent, CardFooter, CardTitle } from '../ui/card'

interface IndexItemCardProp {
	item: IndexItemType
	type: string
}

export const IndexItemCard = ({ item, type }: IndexItemCardProp) => {
	return (
		<>
			<Link to={`/${type}/${item.id}`}>
				<CardContent className="p-3 sm:p-4">
					<div className="relative block overflow-hidden aspect-square">
						<div className="z-10 font-bold">
							<FavoriteTag favorite_count={item.latest_favorite} />
						</div>
						<img
							className="rounded-md w-full h-auto aspect-square object-contain"
							src={buildSmallItemImage(item.item_image)}
							loading="lazy"
							alt={item.item_name}
						/>
					</div>
				</CardContent>
			</Link>
			<CardContent className="px-2 sm:px-4 pt-0 pb-1">
				<Link to={`/${type}/${item.id}`}>
					<CardTitle className="leading-relaxed text-base sm:text-lg h-[4rem]">
						<div className="line-clamp-2 break-words">{item.item_name}</div>
					</CardTitle>
				</Link>
				<div className="text-right font-bold text-base sm:text-lg">
					￥{formatValue(item.item_price)}
				</div>
			</CardContent>
			<CardFooter className="px-4 pb-4 flex-col justify-start items-start">
				<Link to={`/shop/${item.shop_id}`}>
					<div className="flex items-center gap-2">
						<Avatar className="size-8 sm:size-10">
							<AvatarImage
								src={buildShopImage(item.shop_image)}
								loading="lazy"
								alt={item.shop_name}
							/>
							<AvatarFallback />
						</Avatar>
						<div className="pl-1 text-xs sm:text-sm">{item.shop_name}</div>
					</div>
				</Link>
				<div className="w-full pl-1 text-end text-xs sm:text-sm">
					公開日: {formatDateWithHyphen(item.published)}
				</div>
			</CardFooter>
		</>
	)
}
