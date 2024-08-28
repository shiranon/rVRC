import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/schema'

declare const env: {
	SUPABASE_URL?: string
	SUPABASE_ANON_KEY?: string
}

const getEnv = (key: string): string => {
	if (typeof env !== 'undefined' && env[key as keyof typeof env]) {
		return env[key as keyof typeof env] as string
	}
	return process.env[key] || ''
}

const supabaseUrl = getEnv('SUPABASE_URL')
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY')

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
