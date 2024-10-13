import { useSearchParams } from '@remix-run/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Item } from '~/types/items'
import { Button } from '../ui/button'

export const ItemControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentItem, setCurrentItem] = useState<Item>(
		() => (searchParams.get('item') as Item) || 'avatar',
	)
	const previousItem = useRef<string | null>(null)

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
		setSearchParams({})
	}, [setSearchParams])

	useEffect(() => {
		const itemParam = searchParams.get('item') || 'avatar'
		setCurrentItem(itemParam as Item)
		if (previousItem.current === null) {
			previousItem.current = itemParam
		} else if (itemParam !== previousItem.current) {
			updateParams('item', itemParam)
			previousItem.current = itemParam
		}
	}, [searchParams, updateParams])

	return (
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
	)
}
