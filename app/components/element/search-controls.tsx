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
	onSearchChange,
}: { onSearchChange: () => void }) => {
	const [searchParams] = useSearchParams()
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
		const newSearchParams = new URLSearchParams(searchParams)
		newSearchParams.set('sort', sort || '')
		navigate(`?${newSearchParams.toString()}`, { replace: true })
	}

	const updateSearch = (search: string) => {
		const newSearchParams = new URLSearchParams(searchParams)
		newSearchParams.set('search', search || '')
		navigate(`?${newSearchParams.toString()}`, { replace: true })
		// onSearchChange()
	}

	const clearSearchParams = () => {
		if (!searchParams.toString()) return
		navigate('', { replace: true })
		setCurrentSort('default')
		setSearchKeyword('')
		// onSearchChange()
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
				/>
				<Button
					className="bg-light-gray rounded-l-none text-white hover:bg-slate-500"
					onClick={() => updateSearch(searchKeyword)}
				>
					検索
				</Button>
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
					className="bg-light-gray text-white rounded-l-none hover:bg-slate-500"
					onClick={clearSearchParams}
				>
					クリア
				</Button>
			</div>
		</>
	)
}
