import type { ActionFunctionArgs } from '@remix-run/cloudflare'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { folderCreateSchema } from '~/lib/zod'
import { FolderManager } from '~/module/supabase/folder-manager'
import { avatarPageAction } from './index'

// モックの設定
vi.mock('~/lib/utils.server', () => ({
	loadEnvironment: vi.fn(() => ({
		SUPABASE_URL: 'test',
		SUPABASE_ANON_KEY: 'test',
	})),
}))

vi.mock('~/module/supabase/create-client.server', () => ({
	createClient: vi.fn(() => ({ supabase: {} })),
}))

const mockInitialize = vi.fn()
const mockCreateFolder = vi.fn()
const mockAddAvatar = vi.fn()

vi.mock('~/module/supabase/folder-manager', () => ({
	FolderManager: vi.fn().mockImplementation(() => ({
		initialize: mockInitialize,
		createFolder: mockCreateFolder,
		addAvatar: mockAddAvatar,
	})),
}))

describe('avatarPageActionのテスト', () => {
	it('idに数字以外がある場合はエラーになる', async () => {
		const result = await avatarPageAction({
			request: new Request('http://localhost'),
			context: {},
			params: { id: 'char' },
		} as unknown as ActionFunctionArgs)

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body).toEqual({ success: false, message: '不正なアイテムIDです。' })
	})

	it('フォームに値が無い場合はエラー', async () => {
		const formData = new FormData()
		const result = await avatarPageAction({
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

		await avatarPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({})
		expect(mockInitialize).toHaveBeenCalled()
		expect(mockCreateFolder).toHaveBeenCalledWith(formData)
	})

	it('intentがaddFolderの場合にaddAvatarを呼び出せる', async () => {
		const formData = new FormData()
		formData.append('intent', 'addFolder')

		await avatarPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({}, '123')
		expect(mockInitialize).toHaveBeenCalled()
		expect(mockAddAvatar).toHaveBeenCalledWith(formData, '123')
	})

	it('intentが不正な値の場合にエラーになる', async () => {
		const formData = new FormData()
		formData.append('intent', 'unknownIntent')

		await expect(
			avatarPageAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: { id: '123' },
			} as unknown as ActionFunctionArgs),
		).rejects.toThrow('予期せぬアクション')
	})

	it('フォルダが正しく作成できる', async () => {
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

		const result = await avatarPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({})
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
				return { success: true, message: 'フォルダを作成しました' }
			} catch (error) {
				if (error instanceof z.ZodError) {
					return { folderErrors: error.errors }
				}
				return { folderError: '予期せぬエラー' }
			}
		})

		const result = await avatarPageAction({
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
		if ('folderErrors' in body && body.folderErrors) {
			expect(body.folderErrors[0]).toHaveProperty('path', ['foldername'])
			expect(body.folderErrors[0].message).toBe(
				'フォルダ名は25文字以内で入力してください',
			)
		} else {
			throw new Error('folderErrorsがbodyに含まれていません')
		}
	})
})
