import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { buildAvatarImage, buildShopImage } from '~/lib/format'
import { truncateString } from '~/lib/utils'
import type { RankingAvatarType } from '~/types/items'
import { FavoriteTag } from './favorite-tag'
import { RankingTag } from './ranking-tag'

export const TopAvatar = ({
	item,
	category,
}: { item: RankingAvatarType; category: string }) => {
	return (
		<Card>
			<Link to={`/avatar/${item.id}`}>
				<CardContent className="p-4">
					<div className="relative block overflow-hidden aspect-square">
						<div className="z-10 font-bold">
							<RankingTag rank={item.rank} className="text-base" />
							<FavoriteTag
								className="pl-[2px]"
								favorite_count={item.favorite_count}
								{...(category === 'rank'
									? { difference: item.difference }
									: {})}
							/>
						</div>
						<img
							className="rounded-md pointer-events-none"
							src={buildAvatarImage(item.avatar_image)}
							loading="lazy"
							alt={item.avatar_name}
						/>
					</div>
				</CardContent>
			</Link>
			<Link to={`/avatar/${item.id}`}>
				<CardContent className="px-4 pt-0 pb-1">
					<CardTitle className="leading-relaxed text-lg">
						{truncateString(item.avatar_name, 35)}
					</CardTitle>
					<div className="text-right font-bold text-lg">
						￥{item.avatar_price}
					</div>
				</CardContent>
			</Link>
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
		</Card>
	)
}
