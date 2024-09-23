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
import { formatValue } from '~/lib/format'
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

export const RelationControls = ({
	totalClothCount,
}: { totalClothCount: number }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentSort, setCurrentSort] = useState<SortBy>('default')
	const [searchKeyword, setSearchKeyword] = useState<string>('')

	const updateParams = useCallback(
		(key: string, value: string) => {
			const newSearchParams = new URLSearchParams(searchParams)
			newSearchParams.set(key, value || '')
			setSearchParams(newSearchParams)
		},
		[searchParams, setSearchParams],
	)

	const clearParams = useCallback(() => {
		if (!searchParams.toString()) return
		setSearchParams({})
	}, [setSearchParams, searchParams])

	useEffect(() => {
		setCurrentSort((searchParams.get('sort') as SortBy) || 'default')
		setSearchKeyword(searchParams.get('search') || '')
	}, [searchParams])

	const formatCount = formatValue(totalClothCount)

	return (
		<>
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
			<div className="grid pt-2 grid-cols-[30%_70%] gap-y-1">
				<div className="flex items-center text-lg">
					対応衣装（{formatCount}点）
				</div>

				<div className="flex">
					<Select
						value={currentSort === 'default' ? '' : currentSort}
						onValueChange={(value) => {
							updateParams('sort', value as SortBy)
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
						className="w-40 bg-light-gray text-white rounded-l-none hover:bg-slate-500"
						onClick={clearParams}
					>
						クリア
					</Button>
				</div>
			</div>
		</>
	)
}
