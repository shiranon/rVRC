import { useSearchParams } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import type { FavoriteFilter, SortBy } from '~/types/items'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const sortOptions = [
	{ value: 'name_asc', label: '名前順' },
	{ value: 'name_desc', label: '名前逆順' },
	{ value: 'price_asc', label: '価格が安い順' },
	{ value: 'price_desc', label: '価格が高い順' },
	{ value: 'favorite_desc', label: 'スキ数が多い順' },
	{ value: 'favorite_asc', label: 'スキ数が少ない順' },
	{ value: 'create_desc', label: '登録が新しい順' },
	{ value: 'create_asc', label: '登録が古い順' },
]

const favoriteFilterOptions = [
	{ value: 'all', label: 'すべて' },
	{ value: '10000_plus', label: '10000以上' },
	{ value: '5000_9999', label: '5000〜9999' },
	{ value: '1000_4999', label: '1000〜4999' },
	{ value: '500_999', label: '500〜999' },
	{ value: '100_499', label: '100〜499' },
	{ value: '0_99', label: '0〜99' },
]

export const RelationControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentSort, setCurrentSort] = useState<SortBy>(undefined)
	const [inputValue, setInputValue] = useState<string>('')

	const [currentFavoriteFilter, setFavoriteFilter] =
		useState<FavoriteFilter>(undefined)

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
		setInputValue('')
	}, [setSearchParams, searchParams])

	useEffect(() => {
		const searchParam = searchParams.get('search')
		if (searchParam !== null) {
			setInputValue(searchParam)
		}
	}, [searchParams])

	useEffect(() => {
		const sortParam = searchParams.get('sort') as SortBy
		if (sortParam !== currentSort) {
			setCurrentSort(sortParam || undefined)
		}
	}, [searchParams, currentSort])

	useEffect(() => {
		const favoriteParam = searchParams.get('favorite') as FavoriteFilter
		if (favoriteParam !== currentFavoriteFilter) {
			setFavoriteFilter(favoriteParam || undefined)
		}
	}, [searchParams, currentFavoriteFilter])

	return (
		<>
			<div className="grid pt-2 grid-cols-[70%_30%] gap-y-1">
				<Input
					className="bg-white rounded-r-none"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) =>
						e.key === 'Enter' && updateParams('search', inputValue)
					}
				/>
				<Button
					className="bg-light-gray rounded-l-none text-white hover:bg-slate-500"
					onClick={() => updateParams('search', inputValue)}
				>
					検索
				</Button>
			</div>
			<div className="grid pt-2 grid-cols-[40%_40%_20%] gap-y-1">
				<Select
					value={
						currentFavoriteFilter === undefined ? '' : currentFavoriteFilter
					}
					onValueChange={(value) => {
						updateParams('favorite', value)
					}}
				>
					<SelectTrigger className="bg-white rounded-r-none">
						<SelectValue placeholder="スキ数で絞り込み" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{favoriteFilterOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
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
