import { Link } from '@remix-run/react'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import type { RankingType } from '~/types/items'
import { TopItem } from '../element/top-item'
import { Button } from '../ui/button'

export const TopRankingCard = ({
	ranking,
	item,
}: {
	ranking: RankingType[] | null
	item: string
}) => {
	return (
		<Card className="bg-light-beige">
			<CardContent className="grid grid-cols-2 gap-2 p-3">
				{ranking &&
					ranking.length > 0 &&
					ranking.map((data) => (
						<TopItem
							key={data.booth_id}
							data={data}
							category="rank"
							type={item}
						/>
					))}
			</CardContent>
			<CardFooter className="flex pb-4 justify-center">
				<Button className="rounded-3xl text-lg text-light-gray border-[1px] border-beige hover:bg-white">
					{item === 'avatar' ? (
						<Link to={'/ranking'}>もっと見る</Link>
					) : (
						<Link to={'/ranking?item=cloth'}>もっと見る</Link>
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
