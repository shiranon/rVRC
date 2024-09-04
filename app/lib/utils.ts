import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const truncateString = (input: string, maxLength: number) => {
	return input.length > maxLength ? `${input.slice(0, maxLength)}...` : input
}

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export { cn, truncateString }
