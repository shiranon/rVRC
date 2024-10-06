import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { createClient } from '~/module/supabase/create-client.server'
import { profileLoader } from '.'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
}

const context = createTestContext(env)

describe('profileLoaderのテスト(開発環境DBにアクセス)', () => {
	const mockRequest = {
		headers: {
			get: vi.fn().mockReturnValue('http://localhost:3000'),
		},
		url: 'http://localhost:3000/profile/',
	} as unknown as Request

	it('ログインしていない場合トップページにリダイレクト', async () => {
		const result = await profileLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(302)
		expect(result.headers.get('Location')).toBe('/')
	})
})

describe('profileLoaderのテスト(mock)', () => {
	beforeEach(() => {
		vi.resetModules()
	})

	it('ログインしている場合ユーザープロファイルを取得できる', async () => {
		const mockUser = { id: 'test-user-id' }

		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/',
		} as unknown as Request

		vi.doMock('~/module/supabase/create-client.server', () => ({
			createClient: vi.fn(() => ({
				supabase: {
					from: vi.fn().mockReturnValue({
						select: vi.fn().mockReturnThis(),
						eq: vi.fn().mockReturnThis(),
						single: vi.fn().mockResolvedValue({
							data: {
								name: 'テストユーザー',
								avatar: 'http://example.com/avatar.png',
							},
							error: null,
						}),
					}),
					rpc: vi.fn().mockImplementation((procedureName) => {
						if (procedureName === 'get_user_folder') {
							return {
								data: {},
								error: null,
								single: () => ({
									data: {},
									error: null,
								}),
							}
						}
						return Promise.resolve({ data: null, error: null })
					}),
					auth: {
						getUser: vi.fn().mockResolvedValue({
							data: { user: mockUser },
							error: null,
						}),
					},
				},
			})),
		}))

		const { profileLoader } = await import('.')

		const result = await profileLoader({
			request: mockRequest,
			context: context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body).toEqual({
			profile: {
				name: 'テストユーザー',
				avatar: 'http://example.com/avatar.png',
			},
			folders: {},
		})
	})
})
