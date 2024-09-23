import { useSearchParams } from '@remix-run/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import type { Item } from '~/types/items'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type SortBy =
	| 'default'
	| 'name_asc'
	| 'name_desc'
	| 'price_asc'
	| 'price_desc'
	| 'favorite_asc'
	| 'favorite_desc'
	| 'create_desc'
	| 'create_asc'

type FavoriteFilter =
	| 'default'
	| 'all'
	| '0_99'
	| '100_499'
	| '500_999'
	| '1000_4999'
	| '5000_9999'
	| '10000_plus'

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

export const SearchControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentFavoriteFilter, setFavoriteFilter] =
		useState<FavoriteFilter>('default')
	const [currentSort, setCurrentSort] = useState<SortBy>('default')
	const [currentItem, setCurrentItem] = useState<Item>('avatar')
	const [searchKeyword, setSearchKeyword] = useState<string>('')

	const previousItem = useRef<string>('avatar')

	const updateParams = useCallback(
		(key: string, value: string) => {
			const newSearchParams = new URLSearchParams(searchParams)
			newSearchParams.set(key, value || '')
			setSearchParams(newSearchParams)
		},
		[searchParams, setSearchParams],
	)

	const clearParams = useCallback(() => {
		setSearchParams({})
	}, [setSearchParams])

	useEffect(() => {
		const itemPram = searchParams.get('item') || 'avatar'
		setCurrentItem(itemPram as Item)
		if (itemPram !== previousItem.current) {
			updateParams('page', '1')
			previousItem.current = itemPram
		}
	}, [searchParams, updateParams])

	useEffect(() => {
		setCurrentSort((searchParams.get('sort') as SortBy) || 'default')
		setFavoriteFilter(
			(searchParams.get('favorite') as FavoriteFilter) || 'default',
		)
		setSearchKeyword(searchParams.get('search') || '')
	}, [searchParams])

	return (
		<>
			<div className="flex justify-center space-x-2 py-4">
				<Button
					onClick={() => {
						clearParams()
						updateParams('item', 'avatar')
					}}
					className={`rounded-2xl text-lg text-light-gray border-[1px] border-beige ${currentItem !== 'avatar' ? 'hover:border-light-gray' : 'bg-beige hover:bg-beige'}`}
				>
					アバター
				</Button>
				<Button
					onClick={() => {
						clearParams()
						updateParams('item', 'cloth')
					}}
					className={`rounded-2xl text-lg text-light-gray border-[1px] border-beige ${currentItem !== 'cloth' ? 'hover:border-light-gray' : 'bg-beige hover:bg-beige'}`}
				>
					衣装
				</Button>
			</div>
			<div className="grid pt-2 grid-cols-[70%_30%] gap-y-1">
				<Input
					className="bg-white rounded-r-none"
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					onKeyDown={(e) =>
						e.key === 'Enter' && updateParams('search', searchKeyword)
					}
				/>
				<Button
					className="bg-light-gray rounded-l-none text-white hover:bg-slate-500"
					onClick={() => updateParams('search', searchKeyword)}
				>
					検索
				</Button>
			</div>
			<div className="grid pt-2 grid-cols-[40%_40%_20%] gap-y-1">
				<Select
					value={
						currentFavoriteFilter === 'default' ? '' : currentFavoriteFilter
					}
					onValueChange={(value) => {
						updateParams('favorite', value as SortBy)
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
					value={currentSort === 'default' ? '' : currentSort}
					onValueChange={(value) => {
						updateParams('sort', value as SortBy)
					}}
				>
					<SelectTrigger className="bg-white rounded-none">
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
