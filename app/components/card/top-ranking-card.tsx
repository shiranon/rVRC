import { Link } from '@remix-run/react'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import type { RankingAvatarType, RankingClothType } from '~/types/items'
import { TopAvatar } from '../element/top-avatar'
import { TopCloth } from '../element/top-cloth'
import { Button } from '../ui/button'

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
			<CardContent className="grid grid-cols-2 gap-3 p-4">
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
