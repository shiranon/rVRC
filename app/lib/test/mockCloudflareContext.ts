import type {
	Cache,
	ExecutionContext,
	IncomingRequestCfProperties,
} from '@cloudflare/workers-types'
import type { AppLoadContext } from '@remix-run/cloudflare'

export function createTestContext(env: Env): AppLoadContext {
	return {
		cloudflare: {
			env: env,
			cf: {
				asn: 0,
				asOrganization: '',
				colo: '',
				edgeRequestKeepAliveStatus: 0,
			} as IncomingRequestCfProperties,
			ctx: {
				waitUntil: () => {},
				passThroughOnException: () => {},
			} as ExecutionContext,
			caches: {
				default: {} as Cache,
				delete: () => Promise.resolve(false),
				has: () => Promise.resolve(false),
				keys: () => Promise.resolve([]),
				match: () => Promise.resolve(null as unknown as Response),
				open: () => Promise.resolve({} as Cache),
			} as unknown as CacheStorage & { default: Cache },
		},
	}
}
