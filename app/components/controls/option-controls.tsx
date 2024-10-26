import { useLocation, useNavigate, useSearchParams } from '@remix-run/react'
import { ja } from 'date-fns/locale'
import { useEffect, useState } from 'react'
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

interface Props {
	type: string
}

export const OptionControls = ({ type }: Props) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [open, setOpen] = useState(false)
	const [shouldUpdateParams, setShouldUpdateParams] = useState(false)

	const [date, setDate] = useState<Date | undefined>(() => {
		const dateParam = searchParams.get('date')
		return dateParam ? new Date(dateParam.replace(/-/g, '/')) : undefined
	})

	const location = useLocation()
	const navigate = useNavigate()

	const handleClear = () => {
		setDate(undefined)
		setShouldUpdateParams(false)
		navigate(location.pathname, { replace: true })
	}

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
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger>
					<div className="flex p-2 items-center justify-center sticky bottom-11 z-50 bg-[#DBB5B5] hover:bg-[#C39898] text-white rounded-lg">
						<div className="text-lg px-24">オプション</div>
					</div>
				</DialogTrigger>
				<DialogContent className="rounded-md">
					<DialogHeader>
						<DialogTitle>
							過去の{type === 'ranking' ? 'ランキング' : 'トレンド'}を見る
						</DialogTitle>
					</DialogHeader>
					<DialogDescription className="sr-only">
						日付を選択してください。
					</DialogDescription>
					<div>
						<Calendar
							mode="single"
							locale={ja}
							selected={date}
							onSelect={(newDate) => {
								if (newDate) {
									setDate(newDate)
									setShouldUpdateParams(true)
									setOpen(false)
									setSearchParams((prev) => {
										prev.set('page', '1')
										return prev
									})
								}
							}}
							defaultMonth={date}
							disabled={{
								after: new Date(Date.now() - 86400000),
								before: new Date('2024/08/18'),
							}}
							className="rounded-md border bg-white"
						/>
					</div>
					<div className="flex justify-center">
						<Button
							className="w-1/2 bg-light-gray text-white hover:bg-slate-500"
							onClick={handleClear}
						>
							クリア
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
