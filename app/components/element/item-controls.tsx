import { useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import type { Item } from '~/types/items'
import { Button } from '../ui/button'

export const ItemControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentItem, setCurrentItem] = useState<Item>('avatar')

	const updateParams = (key: string, value: string) => {
		const newSearchParams = new URLSearchParams(searchParams)
		newSearchParams.set(key, value || '')
		setSearchParams(newSearchParams)
	}

	useEffect(() => {
		const itemPram = searchParams.get('item') || 'avatar'
		setCurrentItem(itemPram as Item)
	}, [searchParams])

	return (
		<div className="flex justify-center space-x-2 py-4">
			<Button
				onClick={() => updateParams('item', 'avatar')}
				className={`rounded-2xl text-lg text-light-gray border-[1px] border-beige ${currentItem !== 'avatar' ? 'hover:border-light-gray' : 'bg-beige hover:bg-beige'}`}
			>
				アバター
			</Button>
			<Button
				onClick={() => updateParams('item', 'cloth')}
				className={`rounded-2xl text-lg text-light-gray border-[1px] border-beige ${currentItem !== 'cloth' ? 'hover:border-light-gray' : 'bg-beige hover:bg-beige'}`}
			>
				衣装
			</Button>
		</div>
	)
}
