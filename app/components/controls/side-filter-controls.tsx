import { useSearchParams } from '@remix-run/react'
import { ja } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { formatDateForParam } from '~/lib/format'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'

export const SideFilterControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()

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
		if (!dateRange) {
			setSearchParams((prev) => {
				prev.delete('from')
				return prev
			})
			setSearchParams((prev) => {
				prev.delete('to')
				return prev
			})
			return setDateRange(undefined)
		}
		console.log(dateRange)
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
			<div className="text-lg pl-4 pb-4 font-semibold leading-none tracking-tight">
				公開日でフィルター
			</div>
			<div className="p-1">
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
			<div className="flex justify-center pt-2">
				<Button
					className="w-1/2 bg-light-gray text-white hover:bg-slate-500"
					onClick={() => {
						handleFilter()
					}}
				>
					実行
				</Button>
			</div>
		</>
	)
}
