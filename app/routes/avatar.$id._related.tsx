import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Link } from '@remix-run/react'
import { FavoriteTag } from '~/components/element/favorite-tag'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { buildAvatarImage, buildShopImage } from '~/lib/format'
import { truncateString } from '~/lib/utils'

type RelationClothType = {
	id: number
	cloth_name: string
	price: number
	latest_favorite: number
	booth_id: number
	image: string
	shop_name: string
	shop_id: string
	shop_image: string
}

type RelatedClothesProps = {
	relationCloth: RelationClothType[]
}

export default function RelatedClothes({ relationCloth }: RelatedClothesProps) {
	console.log('Rendering related clothes:', relationCloth)

	if (!relationCloth || relationCloth.length === 0) {
		console.log('No related clothes found')
		return <div className="text-xl pt-4">関連衣装はありません</div>
	}
	console.log('Rendering related clothes:', relationCloth)

	return (
		<>
			<Card className="bg-light-beige mt-4">
				<CardContent className="grid grid-cols-2 gap-2 p-2">
					{relationCloth.map((cloth) => (
						<Card key={cloth.booth_id}>
							<Link to={`/cloth/${cloth.id}`}>
								<CardContent className="p-4">
									<div className="relative block overflow-hidden aspect-square">
										<div className="z-10 font-bold">
											<FavoriteTag favorite_count={cloth.latest_favorite} />
										</div>
										<img
											className="rounded-md"
											src={buildAvatarImage(cloth.image)}
											loading="lazy"
											alt={cloth.cloth_name}
										/>
									</div>
								</CardContent>
								<CardContent className="px-4 pt-0 pb-1">
									<CardTitle className="leading-relaxed text-lg">
										{truncateString(cloth.cloth_name, 35)}
									</CardTitle>
									<div className="text-right font-bold text-lg">
										￥{cloth.price}
									</div>
								</CardContent>
								<CardFooter className="pb-4 justify-between">
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage
												src={buildShopImage(cloth.shop_image)}
												loading="lazy"
												alt={cloth.shop_name}
											/>
											<AvatarFallback />
										</Avatar>
										<div className="pl-1 text-sm">{cloth.shop_name}</div>
									</div>
								</CardFooter>
							</Link>
						</Card>
					))}
				</CardContent>
			</Card>
		</>
	)
}
