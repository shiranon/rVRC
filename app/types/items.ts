export type ItemType = {
	name: string
	booth_id: number
	deleted: boolean
	image_url: string | null
	price: number
}
export type RankingType = {
	booth_id: number
	rank: number
	favorite_count: number
	difference: number
	avatar_name: string
	avatar_price: number
	avatar_image: string
	shop_name: string
	shop_id: string
	shop_image: string
}
