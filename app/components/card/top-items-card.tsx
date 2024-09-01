import { Card, CardContent, CardFooter } from '~/components/ui/card'
import type { RankingAvatarType, RankingClothType } from '~/types/items'
import { TopAvatarRanking } from '../element/top-avatar-ranking'
import { TopClothCard } from '../element/top-cloth-ranking'

export const TopItemsCard = ({
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
						<TopAvatarRanking key={item.booth_id} item={item} />
					))}
				{cloth &&
					cloth.length > 0 &&
					item === 'cloth' &&
					cloth.map((item) => <TopClothCard key={item.booth_id} item={item} />)}
			</CardContent>
			<CardFooter className="pb-4 justify-between">もっと見る</CardFooter>
		</Card>
	)
}
