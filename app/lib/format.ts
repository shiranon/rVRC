import avatar_holder from '~/images/avatar.svg'
import { URLS } from '~/lib/constants/urls'

/**
 * 数値を2桁の文字列に変換し、必要に応じて先頭に0を付加
 * @param {number} date - 変換する数値
 * @returns {string} 2桁の文字列
 */
const zeroPad = (date: number): string => {
	return String(date).padStart(2, '0')
}

/**
 * 指定された日付が2024年8月18日より前の場合は空文字を、
 * それ以降の場合は'YYYY-MM-DD'形式の文字列を返す
 * @param {string} timestamp - チェックするタイムスタンプ
 * @returns {string} 'YYYY-MM-DD'形式の日付文字列または空文字
 */
const excludeOldDate = (timestamp: string): string => {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const formattedDate = `${year}-${zeroPad(month)}-${zeroPad(day)}`

	if (year <= 2024 && month <= 8 && day < 18) {
		return ''
	}
	return formattedDate
}

/**
 * アイテム画像のURLを構築
 * @param {string | null} imageUrl - 画像のパス
 * @returns {string | undefined} 完全な画像URL
 */
const buildItemImage = (imageUrl: string | null) => {
	if (imageUrl != null) {
		return `${URLS.ITEM_IMAGE}${imageUrl}${URLS.BASE_SIZE}`
	}
}

/**
 * 小さいアイテム画像のURLを構築
 * @param {string | null} imageUrl - 画像のパス
 * @returns {string | undefined} 完全な画像URL
 */
const buildSmallItemImage = (imageUrl: string | null) => {
	if (imageUrl != null) {
		return `${URLS.TOP_IMAGE}${imageUrl}${URLS.BASE_SIZE}`
	}
}

/**
 * ショップ画像のURLを構築(画像がない場合はデフォルト画像を返す)
 * @param {string | null} imageUrl - 画像のパス
 * @returns {string} 完全な画像URLまたはデフォルト画像
 */
const buildShopImage = (imageUrl: string | null) => {
	if (imageUrl != null) {
		return `${URLS.SHOP_IMAGE}${imageUrl}${URLS.BASE_SIZE}`
	}
	return avatar_holder
}

/**
 * 数値を3桁区切りでフォーマット
 * @param {number} number - フォーマットする数値
 * @returns {string} フォーマットされた数値文字列
 */
const formatValue = (number: number) => {
	return new Intl.NumberFormat().format(number)
}

/**
 * 指定した文字数まで切り詰める
 * @param input
 * @param maxLength
 * @returns
 */
const truncateString = (input: string, maxLength: number) => {
	return input.length > maxLength ? `${input.slice(0, maxLength)}...` : input
}

const formatJapaneseDate = (dateString: string | null): string => {
	const date = dateString ? new Date(dateString) : new Date()
	return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export {
	excludeOldDate,
	buildItemImage,
	buildShopImage,
	formatValue,
	formatJapaneseDate,
	buildSmallItemImage,
	truncateString,
}
