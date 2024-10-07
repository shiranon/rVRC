const localEnv: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
	R2_ACCESS_KEY: '',
	R2_SECRET_KEY: '',
	R2_ENDPOINT: '',
}

export { localEnv }
