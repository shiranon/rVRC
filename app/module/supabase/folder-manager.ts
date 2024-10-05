import { redirect } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { z } from 'zod'
import { folderCreateSchema } from '~/lib/zod'

/**
 * フォルダ管理クラス
 * ユーザーのフォルダ操作（作成、更新、削除）や、
 * フォルダへのアイテム（衣装、アバター）の追加・削除を管理します。
 */
export class FolderManager {
	private supabase
	private user: User | null
	private id: string | null = null

	/**
	 * フォルダマネージャーを初期化するコンストラクタ
	 * @param supabase Supabaseクライアントインスタンス
	 * @param id ページID（オプション）
	 */
	constructor(supabase: SupabaseClient, id: string | null = null) {
		this.supabase = supabase
		this.user = null
		this.id = id
	}

	/**
	 * ユーザー認証、ユーザー情報を初期化
	 * @throws {Response} 認証エラーの場合
	 */
	async initialize() {
		const {
			data: { user },
			error: authError,
		} = await this.supabase.auth.getUser()
		if (authError || !user) {
			throw new Response('認証エラー', { status: 401 })
		}

		this.user = user
	}

	/**
	 * 新しいフォルダを作成するメソッド
	 * @param formData フォルダ作成に必要なデータを含むFormData
	 * @returns 作成結果を含むオブジェクト
	 */
	async createFolder(formData: FormData) {
		if (!this.user) {
			throw new Error('ユーザーが初期化されていません')
		}

		const rawInput = Object.fromEntries(formData)

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

	/**
	 * 既存のフォルダを更新するメソッド
	 * @param formData フォルダ更新に必要なデータを含むFormData
	 * @returns 更新結果を含むオブジェクト
	 */
	async updateFolder(formData: FormData) {
		if (!this.user) {
			throw new Error('ユーザーが初期化されていません')
		}

		const rawInput = Object.fromEntries(formData)

		try {
			const validatedData = folderCreateSchema.parse(rawInput)

			const { error } = await this.supabase
				.from('folders')
				.update([
					{
						name: validatedData.foldername,
						user_id: this.user.id,
						description: validatedData.folderDescription,
						is_private: validatedData.visibility === 'private',
					},
				])
				.eq('id', this.id)
				.eq('user_id', this.user.id)
				.select('id, name, is_private')

			if (error) {
				console.error('フォルダ編集エラー:', error)
				return { success: false, message: 'フォルダの編集に失敗' }
			}

			return { success: true, message: 'フォルダを編集しました' }
		} catch (error) {
			if (error instanceof z.ZodError) {
				return { folderErrors: error.errors }
			}
			return { folderError: '予期せぬエラー' }
		}
	}

	/**
	 * フォルダを削除するメソッド
	 * @param formData 削除するフォルダのIDを含むFormData
	 * @returns 削除結果を含むオブジェクト
	 */
	async deleteFolder(formData: FormData) {
		if (!this.user) {
			throw new Error('ユーザーが初期化されていません')
		}

		const input = Object.fromEntries(formData)

		try {
			const { data, error } = await this.supabase
				.from('folders')
				.delete()
				.eq('id', input.id)
				.eq('user_id', this.user.id)

			if (error) {
				console.error('フォルダ削除エラー:', error)
				return { success: false, message: 'フォルダの削除に失敗' }
			}
			if (data === null) {
				return {
					success: true,
					message: 'フォルダを削除しました',
					redirect: '/profile',
				}
			}
		} catch (error) {
			return { folderError: '予期せぬエラー' }
		}
	}

	/**
	 * フォルダに衣装を追加するメソッド
	 * @param formData フォルダIDを含むFormData
	 * @param id 追加する衣装のID
	 * @returns 追加結果を含むオブジェクト
	 */
	async addCloth(formData: FormData, id: string) {
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

		if (relationError || relationData?.length > 0) {
			console.error('既に衣装がフォルダに存在しています')
			return { success: false, message: '既に衣装がフォルダ内にあります' }
		}

		// 衣装の追加
		const { error: addClothError } = await this.supabase
			.from('folder_cloth')
			.insert([{ folder_id: input.folderId, booth_id: clothData.booth_id }])

		if (addClothError) {
			console.error('衣装の追加に失敗しました')
			return { success: false, message: '衣装の追加に失敗しました' }
		}
		return { success: true, message: '衣装をフォルダに追加しました' }
	}

	/**
	 * フォルダから衣装を削除するメソッド
	 * @param formData フォルダIDと衣装のbooth_idを含むFormData
	 * @returns 削除結果を含むオブジェクト
	 */
	async deleteCloth(formData: FormData) {
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

		if (folderError || !folderData) {
			console.error('フォルダの確認に失敗しました')
			return { success: false, message: 'フォームから送信してください' }
		}

		// 衣装の確認
		const { data: clothData, error: clothError } = await this.supabase
			.from('cloths')
			.select('booth_id')
			.eq('booth_id', input.boothId)
			.single()

		if (clothError || !clothData) {
			console.error('衣装が存在しません')
			return { success: false, message: '衣装が存在しません' }
		}

		// 衣装とフォルダの関連削除
		const { error: deleteError } = await this.supabase
			.from('folder_cloth')
			.delete()
			.eq('folder_id', input.folderId)
			.eq('booth_id', input.boothId)

		if (deleteError) {
			console.error('衣装の削除に失敗しました')
			return { success: false, message: '衣装の削除に失敗しました' }
		}

		return { success: true, message: '衣装をフォルダから削除しました' }
	}

	/**
	 * フォルダにアバターを追加するメソッド
	 * @param formData フォルダIDを含むFormData
	 * @param id 追加するアバターのID
	 * @returns 追加結果を含むオブジェクト
	 */
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

		if (relationError || relationData?.length > 0) {
			console.error('既にアバターがフォルダに存在しています')
			return { success: false, message: '既にアバターがフォルダ内にあります' }
		}

		// アバターの追加
		const { error: addAvatarError } = await this.supabase
			.from('folder_avatar')
			.insert([{ folder_id: input.folderId, booth_id: avatarData.booth_id }])

		if (addAvatarError) {
			console.error('アバターの追加に失敗しました')
			return { success: false, message: 'アバターの追加に失敗しました' }
		}
		return { success: true, message: 'アバターをフォルダに追加しました' }
	}

	/**
	 * フォルダからアバターを削除するメソッド
	 * @param formData フォルダIDとアバターのbooth_idを含むFormData
	 * @returns 削除結果を含むオブジェクト
	 */
	async deleteAvatar(formData: FormData) {
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

		if (folderError || !folderData) {
			console.error('フォルダの確認に失敗しました')
			return { success: false, message: 'フォームから送信してください' }
		}

		// アバターの確認
		const { data: avatarData, error: avatarError } = await this.supabase
			.from('avatars')
			.select('booth_id')
			.eq('booth_id', input.boothId)
			.single()

		if (avatarError || !avatarData) {
			console.error('アバターが存在しません')
			return { success: false, message: 'アバターが存在しません' }
		}

		// アバターとフォルダの関連削除
		const { error: deleteError } = await this.supabase
			.from('folder_avatar')
			.delete()
			.eq('folder_id', input.folderId)
			.eq('booth_id', input.boothId)

		if (deleteError) {
			console.error('アバターの削除に失敗しました')
			return { success: false, message: 'アバターの削除に失敗しました' }
		}

		return { success: true, message: 'アバターをフォルダから削除しました' }
	}
}
