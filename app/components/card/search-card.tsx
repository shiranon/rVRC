import { Card, CardContent } from '~/components/ui/card'
import type { SearchItemType } from '~/types/items'
import { SearchItem } from '../element/search-item'

export const SearchCard = ({
	search,
	item,
}: {
	search: SearchItemType[] | null
	item: string
}) => {
	return (
		<Card className="mt-2 bg-transparent shadow-none border-none">
			<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-0">
				{search &&
					search.length > 0 &&
					search.map((data) => (
						<SearchItem key={data.booth_id} data={data} type={item} />
					))}
			</CardContent>
		</Card>
	)
}
