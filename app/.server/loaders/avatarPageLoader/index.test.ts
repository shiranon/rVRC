import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { avatarPageLoader } from '.'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
}

const context = createTestContext(env)

describe('avatarPageLoaderのテスト(開発環境DBにアクセス)', () => {
	describe('URLのテスト', () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/avatar/',
		} as unknown as Request

		it('idが無い場合トップページにリダイレクト', async () => {
			const result = await avatarPageLoader({
				request: mockRequest,
				context,
				params: {},
			})

			expect(result.status).toBe(302)
			expect(result.headers.get('Location')).toBe('/')
		})
	})

	describe('存在しないアバターページにアクセスされた場合のテスト', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/avatar/',
		} as unknown as Request
		const result = await avatarPageLoader({
			request: mockRequest,
			context,
			params: { id: '1000000000' },
		})

		it('トップページにリダイレクト', () => {
			expect(result.status).toBe(302)
			expect(result.headers.get('Location')).toBe('/')
		})
	})

	describe('関連衣装ありアバターデータの取得テスト', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/avatar/',
		} as unknown as Request
		const result = await avatarPageLoader({
			request: mockRequest,
			context,
			params: { id: '2835' },
		})
		const { avatar, relationCloth, totalClothCount, foldersData } =
			await result.json()

		it('アバターが取得できる', () => {
			expect(avatar).toBeDefined()
			if (avatar) {
				expect(result.status).toBe(200)
				expect(typeof avatar.id).toBe('number')
				expect(typeof avatar.name).toBe('string')
				expect(typeof avatar.latest_favorite).toBe('number')
				expect(typeof avatar.booth_id).toBe('number')
				expect(typeof avatar.image_url).toBe('string')
				expect(typeof avatar.shop_id).toBe('string')
				expect(typeof avatar.shop_image).toBe('string')
				expect(typeof avatar.shop_name).toBe('string')
			} else {
				fail('avatarがnull')
			}
		})

		it('関連衣装がある', () => {
			expect(relationCloth).toBeDefined()
			expect(relationCloth.length).toBeGreaterThan(0)
		})

		it('関連衣装数が0以上', () => {
			expect(totalClothCount).toBeDefined()
			expect(totalClothCount.total_count).toBeGreaterThan(0)
		})

		it('ログインしていないので、ユーザーフォルダは取得出来ない', () => {
			expect(foldersData).toBeDefined()
			expect(foldersData).toEqual(null)
		})
	})
	describe('関連衣装無しアバターデータの取得テスト', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/avatar/',
		} as unknown as Request
		const result = await avatarPageLoader({
			request: mockRequest,
			context,
			params: { id: '1' },
		})
		const { avatar, relationCloth, totalClothCount, foldersData } =
			await result.json()

		it('アバターが取得できる', () => {
			expect(avatar).toBeDefined()
			if (avatar) {
				expect(result.status).toBe(200)
				expect(typeof avatar.id).toBe('number')
				expect(typeof avatar.name).toBe('string')
				expect(typeof avatar.latest_favorite).toBe('number')
				expect(typeof avatar.booth_id).toBe('number')
				expect(typeof avatar.image_url).toBe('string')
				expect(typeof avatar.shop_id).toBe('string')
				expect(typeof avatar.shop_image).toBe('string')
				expect(typeof avatar.shop_name).toBe('string')
			} else {
				fail('avatarがnull')
			}
		})

		it('関連衣装が空', () => {
			expect(relationCloth).toBeDefined()
			expect(relationCloth).toHaveLength(0)
		})

		it('関連衣装数が0', () => {
			expect(totalClothCount).toBeDefined()
			expect(totalClothCount.total_count).toEqual(0)
		})

		it('ログインしていないので、ユーザーフォルダは取得出来ない', () => {
			expect(foldersData).toBeDefined()
			expect(foldersData).toEqual(null)
		})
	})
})

describe('ログイン状態時のテスト(mock)', () => {
	beforeEach(() => {
		vi.resetModules()
	})

	const mockRequest = {
		headers: {
			get: vi.fn().mockReturnValue('http://localhost:3000'),
		},
		url: 'http://localhost:3000/avatar/1',
	} as unknown as Request

	it('ログインしている場合、フォルダーデータを取得する', async () => {
		vi.doMock('~/module/supabase/create-client.server', () => ({
			createClient: vi.fn(() => ({
				supabase: {
					auth: {
						getUser: vi.fn().mockResolvedValue({
							data: { user: { id: 'test-user' } },
							error: null,
						}),
					},
					rpc: vi.fn().mockImplementation((procedureName) => {
						if (procedureName === 'get_avatar_with_favorite') {
							return {
								data: {},
								error: null,
								single: () => ({
									data: {},
									error: null,
								}),
							}
						}
						if (procedureName === 'get_relation_cloth_data') {
							return Promise.resolve({
								data: {},
								error: null,
							})
						}
						if (procedureName === 'get_relation_cloth_total') {
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
					from: vi.fn().mockReturnValue({
						select: vi.fn().mockReturnThis(),
						eq: vi.fn().mockResolvedValue({ data: [], error: null }),
					}),
				},
			})),
		}))

		const { avatarPageLoader } = await import('.')

		const result = await avatarPageLoader({
			request: mockRequest,
			context,
			params: { id: '1' },
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.isLoggedIn).toBe(true)
		expect(body.foldersData).toBeDefined()
	})
	it('ログインしてない場合、フォルダーデータは空', async () => {
		vi.doMock('~/module/supabase/create-client.server', () => ({
			createClient: vi.fn(() => ({
				supabase: {
					auth: {
						getUser: vi.fn().mockResolvedValue({
							data: { user: null },
							error: null,
						}),
					},
					rpc: vi.fn().mockImplementation((procedureName) => {
						if (procedureName === 'get_avatar_with_favorite') {
							return {
								data: {},
								error: null,
								single: () => ({
									data: {},
									error: null,
								}),
							}
						}
						if (procedureName === 'get_relation_cloth_data') {
							return Promise.resolve({
								data: {},
								error: null,
							})
						}
						if (procedureName === 'get_relation_cloth_total') {
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
					from: vi.fn().mockReturnValue({
						select: vi.fn().mockReturnThis(),
						eq: vi.fn().mockResolvedValue({ data: [], error: null }),
					}),
				},
			})),
		}))

		const { avatarPageLoader } = await import('.')

		const result = await avatarPageLoader({
			request: mockRequest,
			context,
			params: { id: '1' },
		})
		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.isLoggedIn).toBe(false)
		expect(body.foldersData).toBeDefined()
		expect(body.foldersData).toEqual(null)
	})
})

function fail(arg0: string) {
	throw new Error('Function not implemented.')
}
