import type { SupabaseClient, User } from '@supabase/supabase-js'
import { z } from 'zod'
import { folderCreateSchema } from '~/lib/zod'

export class FolderManager {
	private supabase
	private user: User | null

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase
		this.user = null
	}

	async initialize() {
		const {
			data: { user },
			error: authError,
		} = await this.supabase.auth.getUser()
		if (authError || !user) {
			throw new Response('認証エラー', { status: 401 })
		}

		this.user = user
		const folderCount = (
			await this.supabase
				.from('folders')
				.select('id')
				.eq('user_id', this.user.id)
		).count
		console.log(folderCount)
	}

	async createFolder(formData: FormData) {
		if (!this.user) {
			throw new Error('ユーザーが初期化されていません')
		}

		const rawInput = Object.fromEntries(formData)

		const folderCount = (
			await this.supabase
				.from('folders')
				.select('id')
				.eq('user_id', this.user.id)
		).count

		try {
			const validatedData = folderCreateSchema.parse(rawInput)

			const { error } = await this.supabase
				.from('folders')
				.insert([
					{
						name: validatedData.foldername,
						user_id: this.user.id,
						description: validatedData.folderDescription,
						is_private: validatedData.visibility === 'private',
					},
				])
				.select('id, name, is_private')

			if (error) {
				console.error('フォルダ作成エラー:', error)
				return { success: false, message: 'フォルダの作成に失敗' }
			}

			return { success: true, message: 'フォルダを作成しました' }
		} catch (error) {
			if (error instanceof z.ZodError) {
				return { folderErrors: error.errors }
			}
			return { folderError: '予期せぬエラー' }
		}
	}

	async deleteFolder(formData: FormData) {
		if (!this.user) {
			throw new Error('ユーザーが初期化されていません')
		}

		const input = Object.fromEntries(formData)

		try {
			const { error } = await this.supabase
				.from('folders')
				.delete()
				.eq('id', input.folderId)
				.eq('user_id', this.user.id)

			if (error) {
				console.error('フォルダ削除エラー:', error)
				return { success: false, message: 'フォルダの削除に失敗' }
			}

			return { success: true, message: 'フォルダを削除しました' }
		} catch (error) {
			if (error instanceof z.ZodError) {
				return { folderErrors: error.errors }
			}
			return { folderError: '予期せぬエラー' }
		}
	}

	async addCloth(formData: FormData, id: string) {
		if (!this.user) {
			throw new Error('ユーザーが初期化されていません')
		}

		const input = Object.fromEntries(formData)

		console.log('フォーム', input)

		// フォルダの確認
		const { data: folderData, error: folderError } = await this.supabase
			.from('folders')
			.select('*')
			.eq('id', input.folderId)
			.eq('user_id', this.user.id)
			.single()

		console.log('フォルダ確認', folderData, folderError)
		if (folderError || !folderData) {
			console.error('フォルダの確認に失敗しました')
			return { success: false, message: 'フォームから送信してください' }
		}

		// 衣装の確認
		const { data: clothData, error: clothError } = await this.supabase
			.from('cloths')
			.select('booth_id')
			.eq('id', id)
			.single()

		console.log('衣装確認', clothData, clothError)
		if (clothError || !clothData) {
			console.error('衣装が存在しません')
			return { success: false, message: '衣装が存在しません' }
		}

		// 衣装とフォルダの関連確認
		const { data: relationData, error: relationError } = await this.supabase
			.from('folder_cloth')
			.select('*')
			.eq('folder_id', input.folderId)
			.eq('booth_id', clothData.booth_id)

		console.log('関連確認', relationData, relationError)
		if (relationError || relationData?.length > 0) {
			console.error('既に衣装がフォルダに存在しています')
			return { success: false, message: '既に衣装がフォルダ内にあります' }
		}

		// 衣装の追加
		const { error: addClothError } = await this.supabase
			.from('folder_cloth')
			.insert([{ folder_id: input.folderId, booth_id: clothData.booth_id }])

		console.log('衣装追加', addClothError)
		if (addClothError) {
			console.error('衣装の追加に失敗しました')
			return { success: false, message: '衣装の追加に失敗しました' }
		}
		return { success: true, message: '衣装をフォルダに追加しました' }
	}

	async addAvatar(formData: FormData, id: string) {
		if (!this.user) {
			throw new Error('ユーザーが初期化されていません')
		}

		const input = Object.fromEntries(formData)

		// フォルダの確認
		const { data: folderData, error: folderError } = await this.supabase
			.from('folders')
			.select('*')
			.eq('id', input.folderId)
			.eq('user_id', this.user.id)
			.single()

		console.log('フォルダ確認', folderData, folderError)
		if (folderError || !folderData) {
			console.error('フォルダの確認に失敗しました')
			return { success: false, message: 'フォームから送信してください' }
		}

		// アバターの確認
		const { data: avatarData, error: avatarError } = await this.supabase
			.from('avatars')
			.select('booth_id')
			.eq('id', id)
			.single()

		console.log('アバター確認', avatarData, avatarError)
		if (avatarError || !avatarData) {
			console.error('アバターが存在しません')
			return { success: false, message: 'アバターが存在しません' }
		}

		// アバターとフォルダの関連確認
		const { data: relationData, error: relationError } = await this.supabase
			.from('folder_avatar')
			.select('*')
			.eq('folder_id', input.folderId)
			.eq('booth_id', avatarData.booth_id)

		console.log('関連確認', relationData, relationError)
		if (relationError || relationData?.length > 0) {
			console.error('既にアバターがフォルダに存在しています')
			return { success: false, message: '既にアバターがフォルダ内にあります' }
		}

		// アバターの追加
		const { error: addAvatarError } = await this.supabase
			.from('folder_avatar')
			.insert([{ folder_id: input.folderId, booth_id: avatarData.booth_id }])

		console.log('アバター追加', addAvatarError)
		if (addAvatarError) {
			console.error('アバターの追加に失敗しました')
			return { success: false, message: 'アバターの追加に失敗しました' }
		}
		return { success: true, message: 'アバターをフォルダに追加しました' }
	}
}
