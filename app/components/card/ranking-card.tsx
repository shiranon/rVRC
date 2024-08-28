import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { getImageUrl, getShopImageUrl, truncateString } from '~/lib/utils'
import type { RankingType } from '~/types/items'

export const RankingCard = ({ item }: { item: RankingType }) => {
	const rankingTag = (rank: number) => {
		const colors: { [key: number]: string } = {
			1: 'bg-amber-400',
			2: 'bg-zinc-400',
			3: 'bg-yellow-600',
		}
		const colorClass = colors[rank] || 'bg-slate-300'
		return (
			<div
				className={`absolute top-0 left-0 w-1/4 h-1/4 ${colorClass} clip-triangle opacity-95`}
			>
				<span className="relative top-[20%] left-[20%] text-2xl font-bold text-white">
					{rank}
				</span>
			</div>
		)
	}
	return (
		<Card>
			<CardContent className="p-4">
				<div className="relative block overflow-hidden aspect-square">
					{rankingTag(item.rank)}
					<img
						className="rounded-md"
						src={getImageUrl(item.avatar_image)}
						loading="lazy"
						alt={item.avatar_name}
					/>
				</div>
				<CardTitle className="pt-4 leading-relaxed">
					{truncateString(item.avatar_name, 35)}
				</CardTitle>
			</CardContent>
			<CardFooter>
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage
							src={getShopImageUrl(item.shop_image)}
							loading="lazy"
							alt={item.shop_name}
						/>
						<AvatarFallback />
					</Avatar>
					<p className="text-sm">{item.shop_name}</p>
				</div>
			</CardFooter>
		</Card>
	)
}
