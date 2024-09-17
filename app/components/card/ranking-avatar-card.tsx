import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import {
	buildAvatarImage,
	buildShopImage,
	excludeOldDate,
	formatValue,
} from '~/lib/format'
import { truncateString } from '~/lib/utils'
import type { RankingAvatarType } from '~/types/items'
import { FavoriteTag } from '../element/favorite-tag'
import { RankingTag } from '../element/ranking-tag'

export const AvatarCard = ({
	item,
	category,
}: { item: RankingAvatarType; category: string }) => {
	return (
		<Card>
			<Link to={`/avatar/${item.id}`}>
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
							src={buildAvatarImage(item.avatar_image)}
							loading="lazy"
							alt={item.avatar_name}
						/>
					</div>
				</CardContent>
			</Link>
			<CardContent className="px-6 pt-0 pb-1">
				<Link to={`/avatar/${item.id}`}>
					<CardTitle className="leading-relaxed">
						{truncateString(item.avatar_name, 35)}
					</CardTitle>
					<div className="text-right font-bold text-lg">
						￥{formatValue(item.avatar_price)}
					</div>
				</Link>
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
				<div>{excludeOldDate(item.avatar_added)}</div>
			</CardFooter>
		</Card>
	)
}
