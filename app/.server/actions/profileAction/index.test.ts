import type { ActionFunctionArgs } from '@remix-run/cloudflare'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { folderCreateSchema, profileUpdateSchema } from '~/lib/zod'
import { FolderManager } from '~/module/supabase/folder-manager'
import { updateUserProfile } from '~/module/supabase/update-user-profile.server'
import { profileAction } from './index'

// モックの設定
vi.mock('~/lib/utils.server', () => ({
	loadEnvironment: vi.fn(() => ({
		SUPABASE_URL: 'test',
		SUPABASE_ANON_KEY: 'test',
	})),
}))
const mockUser = { id: 'test-user-id' }

vi.mock('~/module/supabase/create-client.server', () => ({
	createClient: vi.fn(() => ({
		supabase: {
			auth: {
				getUser: vi.fn().mockResolvedValue({
					data: { user: mockUser },
					error: null,
				}),
			},
		},
	})),
}))

const mockInitialize = vi.fn()
const mockCreateFolder = vi.fn()

vi.mock('~/module/supabase/folder-manager', () => ({
	FolderManager: vi.fn().mockImplementation(() => ({
		initialize: mockInitialize,
		createFolder: mockCreateFolder,
	})),
}))

vi.mock('~/module/supabase/update-user-profile.server', () => ({
	updateUserProfile: vi.fn(),
}))

describe('profileActionテスト', () => {
	describe('フォルダ関連テスト', () => {
		it('フォームに値が無い場合はエラー', async () => {
			const formData = new FormData()
			const result = await profileAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: { id: '123' },
			} as unknown as ActionFunctionArgs)

			expect(result.status).toBe(200)
			const body = await result.json()
			expect(body).toEqual({
				success: false,
				message: 'フォームに値がありません。',
			})
		})

		it('intentがcreateFolderの場合にcreateFolderを呼び出せる', async () => {
			const formData = new FormData()
			formData.append('intent', 'createFolder')

			await profileAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: { id: '123' },
			} as unknown as ActionFunctionArgs)

			expect(FolderManager).toHaveBeenCalledWith(
				expect.objectContaining({
					auth: expect.any(Object),
				}),
			)
			expect(mockInitialize).toHaveBeenCalled()
			expect(mockCreateFolder).toHaveBeenCalledWith(formData)
		})

		it('intentが不正な値の場合にエラーになる', async () => {
			const formData = new FormData()
			formData.append('intent', 'unknownIntent')

			await expect(
				profileAction({
					request: new Request('http://localhost', {
						method: 'POST',
						body: formData,
					}),
					context: {},
					params: { id: '123' },
				} as unknown as ActionFunctionArgs),
			).rejects.toThrow('予期せぬアクション')
		})

		it('フォルダを正しく作成できる', async () => {
			const formData = new FormData()
			formData.append('intent', 'createFolder')
			formData.append('foldername', 'テストフォルダ')
			formData.append('folderDescription', 'テスト用の説明')
			formData.append('visibility', 'public')

			mockCreateFolder.mockImplementation(async (formData) => {
				const rawInput = Object.fromEntries(formData)
				try {
					folderCreateSchema.parse(rawInput)
					return { success: true, message: 'フォルダを作成しました' }
				} catch (error) {
					if (error instanceof z.ZodError) {
						return { folderErrors: error.errors }
					}
					return { folderError: '予期せぬエラー' }
				}
			})

			const result = await profileAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: { id: '123' },
			} as unknown as ActionFunctionArgs)

			expect(FolderManager).toHaveBeenCalledWith(
				expect.objectContaining({
					auth: expect.any(Object),
				}),
			)

			expect(mockInitialize).toHaveBeenCalled()
			expect(mockCreateFolder).toHaveBeenCalledWith(formData)

			expect(result.status).toBe(200)
			const body = await result.json()
			expect(body).toEqual({ success: true, message: 'フォルダを作成しました' })
		})

		it('作成時フォルダ名が長すぎる場合はエラーになる', async () => {
			const formData = new FormData()
			formData.append('intent', 'createFolder')
			formData.append('foldername', 'a'.repeat(26)) // 26文字の名前（最大は25文字）
			formData.append('folderDescription', 'テスト用の説明')
			formData.append('visibility', 'public')

			mockCreateFolder.mockImplementation(async (formData) => {
				const rawInput = Object.fromEntries(formData)
				try {
					folderCreateSchema.parse(rawInput)
					return { success: true, message: 'フォルダを編集しました' }
				} catch (error) {
					if (error instanceof z.ZodError) {
						return { folderErrors: error.errors }
					}
					return { folderError: '予期せぬエラー' }
				}
			})

			const result = await profileAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: { id: '123' },
			} as unknown as ActionFunctionArgs)

			expect(result.status).toBe(200)
			const body = await result.json()
			expect(body).toHaveProperty('folderErrors')
			if (body && 'folderErrors' in body && body.folderErrors) {
				expect(body.folderErrors[0]).toHaveProperty('path', ['foldername'])
				expect(body.folderErrors[0].message).toBe(
					'フォルダ名は25文字以内で入力してください',
				)
			} else {
				throw new Error('folderErrorsがbodyに含まれていません')
			}
		})
	})

	describe('プロフィール更新テスト', () => {
		beforeEach(() => {
			vi.mocked(updateUserProfile).mockReset()
		})

		it('プロフィールを正しく更新できる', async () => {
			const formData = new FormData()
			formData.append('intent', 'editProfile')
			formData.append('username', '新しいユーザー名')

			vi.mocked(updateUserProfile).mockResolvedValue({
				success: true,
				message: 'プロフィールを更新しました',
			})

			const result = await profileAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: { id: '123' },
			} as unknown as ActionFunctionArgs)

			expect(updateUserProfile).toHaveBeenCalledWith(
				expect.any(FormData),
				expect.any(Object),
				'test-user-id',
			)

			expect(result.status).toBe(200)
			const body = await result.json()
			expect(body).toEqual({
				success: true,
				message: 'プロフィールを更新しました',
			})
		})

		it('名前が25文字以上で長すぎる場合はエラーになる', async () => {
			const formData = new FormData()
			formData.append('intent', 'editProfile')
			formData.append('username', 'a'.repeat(26))

			vi.mocked(updateUserProfile).mockResolvedValue({
				profileErrors: [
					{
						code: 'too_big',
						maximum: 25,
						type: 'string',
						inclusive: true,
						exact: false,
						message: 'ユーザー名は25文字以内で入力してください',
						path: ['username'],
					},
				],
			})

			const result = await profileAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: {},
			} as unknown as ActionFunctionArgs)

			expect(result.status).toBe(200)
			const body = await result.json()
			expect(body).toHaveProperty('profileErrors')
			if (body && 'profileErrors' in body && body.profileErrors) {
				expect(body.profileErrors[0]).toHaveProperty('path', ['username'])
				expect(body.profileErrors[0].message).toBe(
					'ユーザー名は25文字以内で入力してください',
				)
			} else {
				throw new Error('folderErrorsがbodyに含まれていません')
			}
		})
	})
})
