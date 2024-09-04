import { URLS } from '~/lib/constants/urls'

const zeroPad = (date: number): string => {
	return String(date).padStart(2, '0')
}

const formatTimestamp = (timestamp: string): string => {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = zeroPad(date.getMonth() + 1)
	const day = zeroPad(date.getDate())
	return `${year}-${month}-${day}`
}

const excludeOldDate = (timestamp: string): string => {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const formattedDate = `${year}-${zeroPad(month)}-${zeroPad(day)}`

	if (year <= 2024 && month <= 8 && day < 18) {
		return ''
	}
	return formattedDate
}

const buildAvatarImage = (imageUrl: string | null) => {
	if (imageUrl != null) {
		return `${URLS.ITEM_IMAGE}${imageUrl}${URLS.BASE_SIZE}`
	}
}

const buildShopImage = (imageUrl: string | null) => {
	if (imageUrl != null) {
		return `${URLS.SHOP_IMAGE}${imageUrl}${URLS.BASE_SIZE}`
	}
}

export { formatTimestamp, excludeOldDate, buildAvatarImage, buildShopImage }
