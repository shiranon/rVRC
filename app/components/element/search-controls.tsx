import { useNavigate, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
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
	| undefined

export const SearchControls = ({
	totalClothCount,
}: { totalClothCount: number }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentSort, setCurrentSort] = useState<SortBy>('default')
	const [searchKeyword, setSearchKeyword] = useState<string>('')
	const navigate = useNavigate()

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

	const updateSort = (sort: SortBy) => {
    if (sort === 'default') return
    setSearchParams((prev) => {
        prev.set('sort', sort || '')
        return prev
    })
    navigate(`?${searchParams.toString()}`, { replace: true })
}

	const updateSearch = (search: string) => {
    setSearchParams((prev) => {
			prev.set('search', search || '')
			return prev
	})
		navigate(`?${searchParams.toString()}`, { replace: true })
	}

	const clearSearchParams = () => {
		if (!searchParams.toString()) return
		navigate('', { replace: true })
		setCurrentSort('default')
		setSearchKeyword('')
	}

	useEffect(() => {
		const sortParam = (searchParams.get('sort') as SortBy) || 'default'
		const searchKeywordParam = searchParams.get('search') || ''
		setCurrentSort(sortParam)
		if (searchKeywordParam) {
			setSearchKeyword(searchKeywordParam)
		}
	}, [searchParams])
	return (
		<>
			<div className="grid pt-2 grid-cols-[70%_30%] gap-y-1">
				<Input
					className="bg-white rounded-r-none"
					value={searchKeyword}
					onBlur={() => setSearchKeyword(searchKeyword)}
					onChange={(e) => setSearchKeyword(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							updateSearch(searchKeyword)
						}
					}}
				/>
				<Button
					className="bg-light-gray rounded-l-none text-white hover:bg-slate-500"
					onClick={() => updateSearch(searchKeyword)}
				>
					検索
				</Button>
			</div>
			<div className="grid pt-2 grid-cols-[30%_70%] gap-y-1">
				<div className="flex items-center text-lg">
					対応衣装（{formatValue(totalClothCount)}点）
				</div>
				<div className="flex">
					<Select
						value={currentSort === 'default' ? '' : currentSort}
						onValueChange={(value) => {
							updateSort(value as SortBy)
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
						onClick={clearSearchParams}
					>
						クリア
					</Button>
				</div>
			</div>
		</>
	)
}
