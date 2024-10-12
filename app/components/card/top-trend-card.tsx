import { Link } from '@remix-run/react'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import type { RankingType } from '~/types/items'
import { TopItem } from '../element/top-item'
import { Button } from '../ui/button'

export const TopTrendCard = ({
	ranking,
	item,
}: {
	ranking: RankingType[] | null
	item: string
}) => {
	return (
		<Card className="bg-light-beige">
			<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-3 p-4">
				{ranking &&
					ranking.length > 0 &&
					ranking.map((data) => (
						<TopItem
							key={data.booth_id}
							data={data}
							category="trend"
							type={item}
						/>
					))}
			</CardContent>
			<CardFooter className="flex pt-2 pb-6 justify-center">
				<Button className="rounded-3xl h-12 p-2 px-10 text-lg text-light-gray border-[1px] border-beige hover:bg-white">
					{item === 'avatar' ? (
						<Link to={'/trend'}>もっと見る</Link>
					) : (
						<Link to={'/trend?item=cloth'}>もっと見る</Link>
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
