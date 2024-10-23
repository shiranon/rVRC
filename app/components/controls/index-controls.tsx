import { useSearchParams } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'
import type { SortBy } from '~/types/items'
import { Button } from '../ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

const sortOptions = [
	{ value: 'name_asc', label: '名前順' },
	{ value: 'name_desc', label: '名前逆順' },
	{ value: 'price_asc', label: '価格が安い順' },
	{ value: 'price_desc', label: '価格が高い順' },
	{ value: 'favorite_desc', label: 'スキ数が多い順' },
	{ value: 'favorite_asc', label: 'スキ数が少ない順' },
	{ value: 'relation_desc', label: '関連アイテムが多い順' },
	{ value: 'relation_asc', label: '関連アイテムが少ない順' },
	{ value: 'create_desc', label: '登録が新しい順' },
	{ value: 'create_asc', label: '登録が古い順' },
]

export const IndexControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentSort, setCurrentSort] = useState<SortBy>(undefined)

	const updateParams = useCallback(
		(key: string, value: string) => {
			const newSearchParams = new URLSearchParams(searchParams)
			newSearchParams.set(key, value || '')
			newSearchParams.delete('page')
			setSearchParams(newSearchParams)
		},
		[searchParams, setSearchParams],
	)
	const clearParams = useCallback(() => {
		if (!searchParams.toString()) return
		setSearchParams({})
	}, [setSearchParams, searchParams])

	useEffect(() => {
		const sortParam = searchParams.get('sort') as SortBy
		if (sortParam !== currentSort) {
			setCurrentSort(sortParam || undefined)
		}
	}, [searchParams, currentSort])

	return (
		<>
			<div className="w-full max-w-[640px] grid p-2 grid-cols-[70%_30%] gap-y-1">
				<Select
					value={currentSort === undefined ? '' : currentSort}
					onValueChange={(value) => {
						updateParams('sort', value)
					}}
				>
					<SelectTrigger className="bg-white rounded-r-none">
						<SelectValue placeholder="ソート" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{sortOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button
					className="bg-light-gray text-white rounded-l-none hover:bg-slate-500"
					onClick={clearParams}
				>
					クリア
				</Button>
			</div>
		</>
	)
}
