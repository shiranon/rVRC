export type RankingType = {
	id: number
	booth_id: number
	rank: number
	favorite_count: number
	difference: number
	item_name: string
	item_price: number
	item_image: string
	item_added: string
	shop_name: string
	shop_id: string
	shop_image: string
}

export type IndexItemType = {
	id: number
	booth_id: number
	item_name: string
	item_price: number
	item_image: string
	latest_favorite: number
	relation_count: number
	shop_name: string
	shop_id: string
	shop_image: string
}

export type ItemType = {
	id: number
	booth_id: number
	item_name: string
	item_price: number
	item_image: string
	latest_favorite: number
	shop_name: string
	shop_id: string
	shop_image: string
}

export type FolderItem = {
	id: number
	item_type: string
	item_name: string
	price: number
	booth_id: number
	image: string
	latest_favorite: number
	created_at: string
	shop_name: string
	shop_id: string
	shop_image: string
}

export type SortBy =
	| 'name_asc'
	| 'name_desc'
	| 'price_asc'
	| 'price_desc'
	| 'favorite_asc'
	| 'favorite_desc'
	| 'create_desc'
	| 'create_asc'
	| undefined

export type FavoriteFilter =
	| 'all'
	| '0_99'
	| '100_499'
	| '500_999'
	| '1000_4999'
	| '5000_9999'
	| '10000_plus'
	| undefined

export type Item = 'avatar' | 'cloth'
