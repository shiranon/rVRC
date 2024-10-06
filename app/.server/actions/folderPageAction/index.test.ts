import type { ActionFunctionArgs } from '@remix-run/cloudflare'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { folderCreateSchema } from '~/lib/zod'
import { FolderManager } from '~/module/supabase/folder-manager'
import { folderPageAction } from './index'

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
const mockUpdateFolder = vi.fn()
const mockDeleteFolder = vi.fn()
const mockDeleteAvatar = vi.fn()
const mockDeleteCloth = vi.fn()

vi.mock('~/module/supabase/folder-manager', () => ({
	FolderManager: vi.fn().mockImplementation(() => ({
		initialize: mockInitialize,
		updateFolder: mockUpdateFolder,
		deleteFolder: mockDeleteFolder,
		deleteAvatar: mockDeleteAvatar,
		deleteCloth: mockDeleteCloth,
	})),
}))

describe('folderPageActionのテスト', () => {
	it('idが無い場合はエラー', async () => {
		const result = await folderPageAction({
			request: new Request('http://localhost'),
			context: {},
			params: {},
		} as unknown as ActionFunctionArgs)

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body).toEqual({ success: false, message: 'ページエラー' })
	})

	it('フォームに値が無い場合はエラー', async () => {
		const formData = new FormData()
		const result = await folderPageAction({
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

	it('intentがupdateFolderの場合にupdateFolderを呼び出せる', async () => {
		const formData = new FormData()
		formData.append('intent', 'updateFolder')

		await folderPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({}, '123')
		expect(mockInitialize).toHaveBeenCalled()
		expect(mockUpdateFolder).toHaveBeenCalledWith(formData)
	})

	it('intentがdeleteFolderの場合にdeleteFolderを呼び出せる', async () => {
		const formData = new FormData()
		formData.append('intent', 'deleteFolder')

		await folderPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({}, '123')
		expect(mockInitialize).toHaveBeenCalled()
		expect(mockDeleteFolder).toHaveBeenCalledWith(formData)
	})

	it('intentがdeleteAvatarの場合にdeleteAvatarを呼び出せる', async () => {
		const formData = new FormData()
		formData.append('intent', 'deleteAvatar')

		await folderPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({}, '123')
		expect(mockInitialize).toHaveBeenCalled()
		expect(mockDeleteAvatar).toHaveBeenCalledWith(formData)
	})

	it('intentがdeleteClothの場合にdeleteClothを呼び出せる', async () => {
		const formData = new FormData()
		formData.append('intent', 'deleteCloth')

		await folderPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({}, '123')
		expect(mockInitialize).toHaveBeenCalled()
		expect(mockDeleteCloth).toHaveBeenCalledWith(formData)
	})

	it('intentが不正な値の場合にエラーになる', async () => {
		const formData = new FormData()
		formData.append('intent', 'unknownIntent')

		await expect(
			folderPageAction({
				request: new Request('http://localhost', {
					method: 'POST',
					body: formData,
				}),
				context: {},
				params: { id: '123' },
			} as unknown as ActionFunctionArgs),
		).rejects.toThrow('予期せぬアクション')
	})

	it('フォルダが正しく編集できる', async () => {
		const formData = new FormData()
		formData.append('intent', 'updateFolder')
		formData.append('foldername', 'テストフォルダ')
		formData.append('folderDescription', 'テスト用の説明')
		formData.append('visibility', 'public')

		mockUpdateFolder.mockImplementation(async (formData) => {
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

		const result = await folderPageAction({
			request: new Request('http://localhost', {
				method: 'POST',
				body: formData,
			}),
			context: {},
			params: { id: '123' },
		} as unknown as ActionFunctionArgs)

		expect(FolderManager).toHaveBeenCalledWith({}, '123')
		expect(mockInitialize).toHaveBeenCalled()
		expect(mockUpdateFolder).toHaveBeenCalledWith(formData)

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body).toEqual({ success: true, message: 'フォルダを編集しました' })
	})

	it('編集時フォルダ名が長すぎる場合はエラーになる', async () => {
		const formData = new FormData()
		formData.append('intent', 'updateFolder')
		formData.append('foldername', 'a'.repeat(26)) // 26文字の名前（最大は25文字）
		formData.append('folderDescription', 'テスト用の説明')
		formData.append('visibility', 'public')

		mockUpdateFolder.mockImplementation(async (formData) => {
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

		const result = await folderPageAction({
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
