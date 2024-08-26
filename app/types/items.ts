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
  avatars: {
    name: string
    price: number
    image_url: string | null
  }
}