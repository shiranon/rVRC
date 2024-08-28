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
				className={`absolute top-0 left-0 w-1/4 h-1/4 ${colorClass} clip-triangle bg-opacity-90`}
			>
				<span className="relative top-[20%] left-[20%] text-2xl text-white">
					{rank}
				</span>
			</div>
		)
	}
	return (
		<Card>
			<CardContent className="p-4">
				<div className="relative block overflow-hidden aspect-square">
					<div className="z-10 font-bold">
						{rankingTag(item.rank)}
						<div className="absolute top-0 right-0 w-auto h-auto flex flex-col items-end bg-black text-white bg-opacity-70 px-1 min-w-[5ch]">
							<div className="pl-[2px] inline-flex items-center">
								<svg
									aria-hidden="true"
									focusable="false"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="w-4 h-4 mr-1"
								>
									<path
										d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
										fill="#FFFFFF"
									/>
								</svg>
								{item.favorite_count}
							</div>
							<div className="text-sm pb-[1px] inline-flex items-center text-[#32CD32]">
								<svg
									aria-hidden="true"
									focusable="false"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="w-3 h-3 mr-1"
								>
									<path
										d="M4 12H20M12 4V20"
										stroke="#32CD32"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								{item.difference}
							</div>
						</div>
					</div>
					<img
						className="rounded-md"
						src={getImageUrl(item.avatar_image)}
						loading="lazy"
						alt={item.avatar_name}
					/>
				</div>
			</CardContent>
			<CardContent className="px-4 pt-0 pb-1">
				<CardTitle className="leading-relaxed">
					{truncateString(item.avatar_name, 35)}
				</CardTitle>
				<div className="text-right font-bold text-lg">
					￥{item.avatar_price}
				</div>
			</CardContent>
			<CardFooter className="pb-4">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage
							src={getShopImageUrl(item.shop_image)}
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
