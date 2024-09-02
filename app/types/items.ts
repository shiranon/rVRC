export type ItemType = {
	name: string
	booth_id: number
	deleted: boolean
	image_url: string | null
	price: number
}
export type RankingAvatarType = {
	booth_id: number
	rank: number
	favorite_count: number
	difference: number
	avatar_name: string
	avatar_price: number
	avatar_image: string
	avatar_added: string
	shop_name: string
	shop_id: string
	shop_image: string
}

export type RankingAvatarData = {
	ranking: {
		data: RankingAvatarType[] | null
	}
	trend: {
		data: RankingAvatarType[] | null
	}
	type: string
	item: string
}
export type TopAvatarData = {
	ranking: {
		data: RankingAvatarType[] | null
	}
	trend: {
		data: RankingAvatarType[] | null
	}
	item: string
}

export type RankingClothType = {
	booth_id: number
	rank: number
	favorite_count: number
	difference: number
	cloth_name: string
	cloth_price: number
	cloth_image: string
	cloth_added: string
	shop_name: string
	shop_id: string
	shop_image: string
}

export type RankingClothData = {
	ranking: {
		data: RankingClothType[] | null
	}
	trend: {
		data: RankingClothType[] | null
	}
	type: string
	item: string
}
export type TopClothData = {
	ranking: {
		data: RankingClothType[] | null
	}
	trend: {
		data: RankingClothType[] | null
	}
	item: string
}
