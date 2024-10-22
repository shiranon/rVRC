import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { buildShopImage, buildSmallItemImage, formatValue } from '~/lib/format'
import type { RankingType } from '~/types/items'
import { FavoriteTag } from './favorite-tag'
import { RankingTag } from './ranking-tag'

export const TopItem = ({
	data,
	category,
	type,
}: { data: RankingType; category: string; type: string }) => {
	return (
		<Card>
			<Link to={`/${type}/${data.id}`}>
				<CardContent className="p-3 sm:p-4">
					<div className="relative block overflow-hidden aspect-square">
						<div className="z-10 font-bold">
							<RankingTag
								rank={data.rank}
								className=" text-sm sm:text-base top-[15%] left-[15%] sm:top-[20%] sm:left-[20%]"
							/>
							<FavoriteTag
								className="pl-[2px]"
								favorite_count={data.favorite_count}
								{...(category === 'rank'
									? { difference: data.difference }
									: {})}
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
			<CardFooter className="pb-4 justify-between">
				<Link to={`/shop/${data.shop_id}`}>
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
				</Link>
			</CardFooter>
		</Card>
	)
}
