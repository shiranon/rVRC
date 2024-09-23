import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { buildAvatarImage, buildShopImage, formatValue } from '~/lib/format'
import { truncateString } from '~/lib/utils'
import type { SearchType } from '~/types/items'
import { FavoriteTag } from './favorite-tag'

export const SearchItem = ({
	data,
	type,
}: { data: SearchType; type: string }) => {
	return (
		<Card>
			<Link to={`/${type}/${data.id}`}>
				<CardContent className="p-4">
					<div className="relative block overflow-hidden aspect-square">
						<div className="z-10 font-bold">
							<FavoriteTag
								className="pl-[2px]"
								favorite_count={data.latest_favorite}
							/>
						</div>
						<img
							className="rounded-md pointer-events-none"
							src={buildAvatarImage(data.item_image)}
							loading="lazy"
							alt={data.item_name}
						/>
					</div>
				</CardContent>
			</Link>
			<Link to={`/${type}/${data.id}`}>
				<CardContent className="px-4 pt-0 pb-1">
					<CardTitle className="leading-relaxed text-lg">
						{truncateString(data.item_name, 35)}
					</CardTitle>
					<div className="text-right font-bold text-lg">
						￥{formatValue(data.item_price)}
					</div>
				</CardContent>
			</Link>
			<CardFooter className="pb-4 justify-between">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage
							src={buildShopImage(data.shop_image)}
							loading="lazy"
							alt={data.shop_name}
						/>
						<AvatarFallback />
					</Avatar>
					<div className="pl-1 text-sm">{data.shop_name}</div>
				</div>
			</CardFooter>
		</Card>
	)
}
