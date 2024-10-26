import { useSearchParams } from '@remix-run/react'
import { ja } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { formatDateForParam } from '~/lib/format'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'

export const DateFilterControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [open, setOpen] = useState(false)

	const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
		const fromParam = searchParams.get('from')
		const toParam = searchParams.get('to')
		return {
			from: fromParam ? new Date(fromParam.replace(/-/g, '/')) : undefined,
			to: toParam ? new Date(toParam.replace(/-/g, '/')) : undefined,
		}
	})

	useEffect(() => {
		const fromParam = searchParams.get('from')
		const toParam = searchParams.get('to')

		if (!fromParam && !toParam) {
			setDateRange(undefined)
			return
		}

		setDateRange({
			from: fromParam ? new Date(fromParam.replace(/-/g, '/')) : undefined,
			to: toParam ? new Date(toParam.replace(/-/g, '/')) : undefined,
		})
	}, [searchParams])

	const handleFilter = () => {
		if (!dateRange) return
		if (dateRange.from) {
			const fromDate = formatDateForParam(dateRange.from)
			setSearchParams((prev) => {
				prev.set('from', fromDate)
				return prev
			})
		}
		if (dateRange.to) {
			const toDate = formatDateForParam(dateRange.to)
			setSearchParams((prev) => {
				prev.set('to', toDate)
				return prev
			})
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger>
					<div className="flex p-2 items-center justify-center sticky bottom-11 z-50 bg-[#DBB5B5] hover:bg-[#C39898] text-white rounded-lg">
						<div className="text-lg px-24">公開日でフィルター</div>
					</div>
				</DialogTrigger>
				<DialogContent className="rounded-md">
					<DialogHeader>
						<DialogTitle>公開日でフィルター</DialogTitle>
					</DialogHeader>
					<DialogDescription className="sr-only">
						日付を選択してください。
					</DialogDescription>
					<div>
						<Calendar
							mode="range"
							locale={ja}
							selected={dateRange}
							onSelect={setDateRange}
							defaultMonth={new Date()}
							disabled={{
								after: new Date(Date.now() - 86400000),
							}}
							className="rounded-md border bg-white"
						/>
					</div>
					<div className="flex justify-center">
						<Button
							className="w-1/2 bg-light-gray text-white hover:bg-slate-500"
							onClick={() => {
								handleFilter()
								setOpen(false)
							}}
						>
							実行
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
