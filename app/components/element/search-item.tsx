import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import {
	buildShopImage,
	buildSmallItemImage,
	formatDateWithHyphen,
	formatValue,
} from '~/lib/format'
import type { SearchItemType } from '~/types/items'
import { FavoriteTag } from './favorite-tag'

export const SearchItem = ({
	data,
	type,
}: { data: SearchItemType; type: string }) => {
	return (
		<Card>
			<Link to={`/${type}/${data.id}`}>
				<CardContent className="p-3 sm:p-4">
					<div className="relative block overflow-hidden aspect-square">
						<div className="z-10 font-bold">
							<FavoriteTag
								className="pl-[2px]"
								favorite_count={data.latest_favorite}
							/>
						</div>
						<img
							className="rounded-md pointer-events-none"
							src={buildSmallItemImage(data.item_image)}
							loading="lazy"
							alt={data.item_name}
						/>
					</div>
				</CardContent>
			</Link>
			<Link to={`/${type}/${data.id}`}>
				<CardContent className="px-2 sm:px-4 pt-0 pb-1">
					<CardTitle className="leading-relaxed text-base sm:text-lg h-[4rem] overflow-hidden">
						<div className="line-clamp-2 break-words">{data.item_name}</div>
					</CardTitle>
					<div className="text-right font-bold text-base sm:text-lg">
						￥{formatValue(data.item_price)}
					</div>
				</CardContent>
			</Link>
			<CardFooter className="px-4 pb-4 flex-col justify-start items-start">
				<div className="flex items-center gap-2">
					<Avatar className="size-8 sm:size-10">
						<AvatarImage
							src={buildShopImage(data.shop_image)}
							loading="lazy"
							alt={data.shop_name}
						/>
						<AvatarFallback />
					</Avatar>
					<div className="pl-1 text-xs sm:text-sm">{data.shop_name}</div>
				</div>
				<div className="w-full pl-1 text-end text-xs sm:text-sm">
					公開日: {formatDateWithHyphen(data.published)}
				</div>
			</CardFooter>
		</Card>
	)
}
