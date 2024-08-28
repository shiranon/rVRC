import type { LoaderFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { getAvatarRankingLoader } from '~/.server/loaders/getAvatarRanking'
import { RankingCard } from '~/components/card/ranking-card'
import type { RankingType } from '~/types/items'

export const loader: LoaderFunction = ({ request }) => {
	const url = new URL(request.url)
	const type = url.searchParams.get('type') || 'day'
	const page = url.searchParams.get('page') || '1'
	return getAvatarRankingLoader(type, Number(page))
}

export default function Avatar() {
	const { data } = useLoaderData<{ data: RankingType[] }>()

	return (
		<div>
			{data && data.length > 0 ? (
				<div className="px-4 flex-1">
					<h1 className="text-2xl font-semibold pl-4 my-2">ランキング</h1>
					{data.map((avatar: RankingType) => (
						<div key={avatar.booth_id} className="mb-4">
							<RankingCard item={avatar} />
						</div>
					))}
				</div>
			) : (
				<div>No data</div>
			)}
		</div>
	)
}
