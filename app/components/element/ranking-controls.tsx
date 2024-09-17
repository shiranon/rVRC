import { useSearchParams } from '@remix-run/react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'

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
		<Dialog>
			<DialogTrigger>
				<div className="flex p-4 items-center justify-center sticky bottom-11 z-50 bg-[#DBB5B5] hover:bg-[#C39898] text-white rounded-lg">
					<div className="text-lg px-24">絞り込み</div>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
