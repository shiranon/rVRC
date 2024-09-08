// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import crypto from 'crypto'

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

const generateUniqueFileName = async () => {
	const timestamp = new Date().getTime().toString()
	const encoder = new TextEncoder()
	const data = encoder.encode(timestamp)
	const hashBuffer = await crypto.subtle.digest('SHA-256', data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
	return hashHex.substring(0, 8)
}

export { cn, truncateString, loadEnvironment, generateUniqueFileName }
