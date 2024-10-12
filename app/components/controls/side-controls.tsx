import { useSearchParams } from '@remix-run/react'
import { ja } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { formatDateForParam } from '~/lib/format'
import { Calendar } from '../ui/calendar'

interface Props {
	type: string
}

export function SideControls({ type }: Props) {
	const [searchParams, setSearchParams] = useSearchParams()
	const [shouldUpdateParams, setShouldUpdateParams] = useState(false)

	const [date, setDate] = useState<Date | undefined>(() => {
		const dateParam = searchParams.get('date')
		return dateParam ? new Date(dateParam.replace(/-/g, '/')) : undefined
	})

	useEffect(() => {
		if (date && shouldUpdateParams) {
			const localDate = formatDateForParam(date)
			setSearchParams((prev) => {
				prev.set('date', localDate)
				return prev
			})
			setShouldUpdateParams(false)
		}
	}, [date, setSearchParams, shouldUpdateParams])

	return (
		<>
			<div className="text-lg pb-4 font-semibold leading-none tracking-tight">
				過去の{type === 'ranking' ? 'ランキング' : 'トレンド'}を見る
			</div>
			<div>
				<Calendar
					mode="single"
					locale={ja}
					selected={date}
					onSelect={(newDate) => {
						if (newDate) {
							setDate(newDate)
							setShouldUpdateParams(true)
							setSearchParams((prev) => {
								prev.set('page', '1')
								return prev
							})
						}
					}}
					defaultMonth={date}
					disabled={{
						after: new Date(Date.now() - 86400000),
						before: new Date(type === 'ranking' ? '2024/08/18' : '2024/08/25'),
					}}
					className="rounded-md border bg-white"
				/>
			</div>
		</>
	)
}
