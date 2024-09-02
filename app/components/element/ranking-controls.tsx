import { useSearchParams } from '@remix-run/react'

export function RankingControls() {
	const [searchParams, setSearchParams] = useSearchParams()

	const updateType = (type: string) => {
		setSearchParams((prev) => {
			prev.set('type', type)
			return prev
		})
	}

	const updatePage = (page: number) => {
		setSearchParams((prev) => {
			prev.set('page', page.toString())
			return prev
		})
	}

	return (
		<div className="flex justify-center sticky bottom-10 bg-white z-10">
			<button type="button" onClick={() => updateType('day')}>
				日間
			</button>
			<button type="button" onClick={() => updateType('month')}>
				月間
			</button>
			<button type="button" onClick={() => updatePage(1)}>
				1ページ目
			</button>
			<button type="button" onClick={() => updatePage(2)}>
				2ページ目
			</button>
		</div>
	)
}
