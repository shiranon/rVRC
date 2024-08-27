import { describe, expect, it } from 'vitest'
import { todayDate } from './date'

const today = new Date()

describe('日付関係のテスト', () => {
	it('本番環境では本日の日付、開発環境では特定の日付を出力', () => {
		if (process.env.NODE_ENV === 'production') {
			expect(todayDate).eq(today.toISOString().split('T')[0])
		} else {
			expect(todayDate).eq('2024-08-20')
		}
	})
})
