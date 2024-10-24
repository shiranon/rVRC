import { useSearchParams } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'

import type { SortShopItemBy } from '~/types/items'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

type Item = 'all' | 'avatar' | 'cloth'

interface ShopFilterProps {
	clothCount: number
	avatarCount: number
	onItemChange: (item: Item) => void
}

const sortOptions = [
	{ value: 'price_asc', label: '価格が安い順' },
	{ value: 'price_desc', label: '価格が高い順' },
	{ value: 'favorite_desc', label: 'スキ数が多い順' },
	{ value: 'favorite_asc', label: 'スキ数が少ない順' },
	{ value: 'published_desc', label: '公開が新しい順' },
	{ value: 'published_asc', label: '公開が古い順' },
]

export const ShopFilterControls = ({
	clothCount,
	avatarCount,
	onItemChange,
}: ShopFilterProps) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentSort, setCurrentSort] = useState<SortShopItemBy>(undefined)
	const [currentItem, setCurrentItem] = useState<Item>(
		(searchParams.get('item') as Item) || 'all',
	)

	const [checkedItems, setCheckedItems] = useState({
		avatar: true,
		cloth: true,
	})

	const handleCheckboxChange =
		(type: 'avatar' | 'cloth') => (checked: boolean) => {
			const newCheckedItems = { ...checkedItems, [type]: checked }
			setCheckedItems(newCheckedItems)

			const value =
				newCheckedItems.avatar && newCheckedItems.cloth
					? 'all'
					: newCheckedItems.avatar
						? 'avatar'
						: 'cloth'
			updateParams('item', value)
			onItemChange(value)
		}

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
		const sortParam = searchParams.get('sort') as SortShopItemBy
		if (sortParam !== currentSort) {
			setCurrentSort(sortParam || undefined)
		}
	}, [searchParams, currentSort])

	useEffect(() => {
		const itemParam = searchParams.get('item') || 'all'
		setCurrentItem(itemParam as Item)
	}, [searchParams])

	return (
		<>
			<div className="flex justify-start space-x-2 py-4 border-y-[1px] border-slate-400">
				<div className="flex items-center space-x-2">
					<Checkbox
						className="size-6 bg-white data-[state=checked]:bg-white"
						checked={currentItem === 'avatar' || currentItem === 'all'}
						disabled={!checkedItems.cloth && checkedItems.avatar}
						id="avatar"
						onCheckedChange={handleCheckboxChange('avatar')}
					/>
					<label
						htmlFor="avatar"
						className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						アバター
					</label>
					<span>（{avatarCount}件）</span>
				</div>
				<div className="flex items-center space-x-2">
					<Checkbox
						className="size-6 bg-white data-[state=checked]:bg-white"
						checked={currentItem === 'cloth' || currentItem === 'all'}
						id="cloth"
						disabled={!checkedItems.avatar && checkedItems.cloth}
						onCheckedChange={handleCheckboxChange('cloth')}
					/>
					<label
						htmlFor="cloth"
						className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						衣装
					</label>
					<span>（{clothCount}件）</span>
				</div>
			</div>
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
