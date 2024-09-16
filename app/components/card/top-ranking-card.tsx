import { Link } from '@remix-run/react'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import type { RankingClothType } from '~/types/items'
import { TopAvatar } from '../element/top-avatar'
import { TopCloth } from '../element/top-cloth'
import { Button } from '../ui/button'

type RankingAvatarType = {
	id: number
	booth_id: number
	rank: number
	favorite_count: number
	difference: number
	avatar_name: string
	avatar_price: number
	avatar_image: string
	avatar_added: string
	shop_name: string
	shop_id: string
	shop_image: string
}

export const TopRankingCard = ({
	avatar,
	cloth,
	item,
}: {
	avatar: RankingAvatarType[] | null
	cloth: RankingClothType[] | null
	item: string
}) => {
	return (
		<Card className="bg-light-beige">
			<CardContent className="grid grid-cols-2 gap-2 p-3">
				{avatar &&
					avatar.length > 0 &&
					item === 'avatar' &&
					avatar.map((item) => (
						<TopAvatar key={item.booth_id} item={item} category="rank" />
					))}
				{cloth &&
					cloth.length > 0 &&
					item === 'cloth' &&
					cloth.map((item) => (
						<TopCloth key={item.booth_id} item={item} category="rank" />
					))}
			</CardContent>
			<CardFooter className="flex pb-4 justify-center">
				<Button className="rounded-3xl text-lg text-light-gray border-[1px] border-beige hover:bg-white">
					<Link to={'/ranking'}>もっと見る</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
