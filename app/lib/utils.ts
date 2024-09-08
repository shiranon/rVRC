import crypto from 'node:crypto'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { AppLoadContext } from '@remix-run/cloudflare'

const truncateString = (input: string, maxLength: number) => {
	return input.length > maxLength ? `${input.slice(0, maxLength)}...` : input
}

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

const loadEnvironment = (context: AppLoadContext) => {
	try {
		return process.env as unknown as Env
	} catch {
		if (!context) {
			throw new Error('Context is required in Cloudflare Pages environment')
		}
		return context.cloudflare.env as Env
	}
}
const generateUniqueFileName = () => {
	const timestamp = new Date().getTime().toString()
	const hash = crypto.createHash('md5').update(timestamp).digest('hex')
	return hash.substring(0, 8)
}

export { cn, truncateString, loadEnvironment, generateUniqueFileName }
