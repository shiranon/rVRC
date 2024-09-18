import { useSearchParams } from '@remix-run/react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { useState, useEffect } from 'react'
import { Calendar } from '../ui/calendar'
import { ja } from 'date-fns/locale'

export function RankingControls() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [open, setOpen] = useState(false)

	const [date, setDate] = useState<Date | undefined>(() => {
		const dateParam = searchParams.get('date')
		return dateParam ? new Date(dateParam) : undefined
	})

	useEffect(() => {
		if (date) {
			const localDate = date.toLocaleDateString('ja-JP').replace(/\//g, '-')
			setSearchParams((prev) => {
				prev.set('date', localDate)
				return prev
			})
		}
	}, [date, setSearchParams])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<div className="flex p-4 items-center justify-center sticky bottom-11 z-50 bg-[#DBB5B5] hover:bg-[#C39898] text-white rounded-lg">
					<div className="text-lg px-24">絞り込み</div>
				</div>
			</DialogTrigger>
			<DialogContent className='rounded-md'>
				<DialogHeader>
					<DialogTitle>カレンダー</DialogTitle>
				</DialogHeader>
				<DialogDescription className="sr-only">
					日付を選択してください。
				</DialogDescription>
				<div className="">
					<p>{date ? date.toLocaleDateString() : '日付が選択されていません'}</p>
					<Calendar
						mode="single"
						locale={ja}
						selected={date}
						onSelect={(newDate) => {
							if (newDate) {
								setDate(newDate)
								setOpen(false)
							}
						}}
						defaultMonth={date}
						disabled={{ after: new Date(), before: new Date('2024/08/18') }}
						className="rounded-md border bg-white"
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}