import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import {
	buildItemImage,
	buildShopImage,
	excludeOldDate,
	formatValue,
} from '~/lib/format'
import type { RankingType } from '~/types/items'
import { FavoriteTag } from '../element/favorite-tag'
import { RankingTag } from '../element/ranking-tag'

export const RankingItemCard = ({
	item,
	category,
	type,
}: { item: RankingType; category: string; type: string }) => {
	return (
		<Card>
			<Link to={`/${type}/${item.id}`}>
				<CardContent className="p-4">
					<div className="relative block overflow-hidden aspect-square">
						<div className="z-10 font-bold">
							<RankingTag className="text-xl sm:text-3xl" rank={item.rank} />
							<FavoriteTag
								className={`text-lg sm:text-xl ${category === 'rank' ? 'pl-3' : 'p-1'}`}
								favorite_count={item.favorite_count}
								{...(category === 'rank'
									? { difference: item.difference }
									: {})}
							/>
						</div>
						<img
							className="rounded-md"
							src={buildItemImage(item.item_image)}
							loading="lazy"
							alt={item.item_name}
						/>
					</div>
				</CardContent>
			</Link>
			<CardContent className="px-6 pt-0 pb-1">
				<Link to={`/avatar/${item.id}`}>
					<CardTitle className="leading-relaxed text-2xl sm:text-3xl sm:pt-2">
						<div className="line-clamp-2 break-words">{item.item_name}</div>
					</CardTitle>
					<div className="text-right font-bold text-xl sm:text-2xl pt-2">
						￥{formatValue(item.item_price)}
					</div>
				</Link>
			</CardContent>
			<CardFooter className="pb-4 justify-between">
				<div className="flex items-center gap-2">
					<Avatar className="size-10 sm:size-12">
						<AvatarImage
							src={buildShopImage(item.shop_image)}
							loading="lazy"
							alt={item.shop_name}
						/>
						<AvatarFallback />
					</Avatar>
					<div className="pl-1 text-sm sm:text-base">{item.shop_name}</div>
				</div>
				<div>{excludeOldDate(item.item_added)}</div>
			</CardFooter>
		</Card>
	)
}
