import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ItemUrl, ShopUrl } from '~/config/urls'

const getImageUrl = (imageUrl: string | null) => {
	if (imageUrl != null) {
		return `${ItemUrl.IMAGE_URL}${imageUrl}${ItemUrl.IMAGE_SIZE}`
	}
}

const getShopImageUrl = (imageUrl: string | null) => {
	if (imageUrl != null) {
		return `${ShopUrl.IMAGE_URL}${imageUrl}${ShopUrl.IMAGE_SIZE}`
	}
}

const truncateString = (input: string, maxLength: number) => {
	return input.length > maxLength ? `${input.slice(0, maxLength)}...` : input
}

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export { cn, getImageUrl, getShopImageUrl, truncateString }
