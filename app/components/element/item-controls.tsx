import { useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export const ItemControls = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentItem, setCurrentItem] = useState('avatar')

	const updateItem = (item: string) => {
		setSearchParams((prev) => {
			prev.set('item', item)
			return prev
		})
	}

	useEffect(() => {
		const itemPram = searchParams.get('item') || 'avatar'
		setCurrentItem(itemPram)
	}, [searchParams])
	return (
		<div className="flex justify-center space-x-2 py-4">
			<Button
				onClick={() => updateItem('avatar')}
				className={`rounded-2xl text-lg text-light-gray border-[1px] border-beige ${currentItem !== 'avatar' ? 'hover:border-light-gray' : 'bg-beige hover:bg-beige'}`}
			>
				アバター
			</Button>
			<Button
				onClick={() => updateItem('cloth')}
				className={`rounded-2xl text-lg text-light-gray border-[1px] border-beige ${currentItem !== 'cloth' ? 'hover:border-light-gray' : 'bg-beige hover:bg-beige'}`}
			>
				衣装
			</Button>
		</div>
	)
}
