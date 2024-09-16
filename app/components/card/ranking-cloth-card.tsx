import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { buildAvatarImage, buildShopImage, excludeOldDate } from '~/lib/format'
import { truncateString } from '~/lib/utils'
import type { RankingClothType } from '~/types/items'
import { FavoriteTag } from '../element/favorite-tag'
import { RankingTag } from '../element/ranking-tag'

export const ClothCard = ({
	item,
	category,
}: { item: RankingClothType; category: string }) => {
	return (
		<Card>
			<Link to={`/cloth/${item.id}`}>
				<CardContent className="p-4">
					<div className="relative block overflow-hidden aspect-square">
						<div className="z-10 font-bold">
							<RankingTag rank={item.rank} />
							<FavoriteTag
								className={category === 'rank' ? 'pl-3' : 'p-1'}
								favorite_count={item.favorite_count}
								{...(category === 'rank'
									? { difference: item.difference }
									: {})}
							/>
						</div>
						<img
							className="rounded-md"
							src={buildAvatarImage(item.cloth_image)}
							loading="lazy"
							alt={item.cloth_name}
						/>
					</div>
				</CardContent>
				<CardContent className="px-6 pt-0 pb-1">
					<CardTitle className="leading-relaxed">
						{truncateString(item.cloth_name, 35)}
					</CardTitle>
					<div className="text-right font-bold text-lg">
						￥{item.cloth_price}
					</div>
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
					<div>{excludeOldDate(item.cloth_added)}</div>
				</CardFooter>
			</Link>
		</Card>
	)
}
