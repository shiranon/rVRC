import { Card, CardContent } from '~/components/ui/card'
import type { SearchType } from '~/types/items'
import { SearchItem } from '../element/search-item'

export const SearchCard = ({
	search,
	item,
}: {
	search: SearchType[] | null
	item: string
}) => {
	return (
		<Card className="bg-light-beige">
			<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-1 sm:p-3">
				{search &&
					search.length > 0 &&
					search.map((data) => (
						<SearchItem key={data.booth_id} data={data} type={item} />
					))}
			</CardContent>
		</Card>
	)
}
