import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTodayDate, isBeforeRankingUpdate } from './date'

describe('日付関係のテスト', () => {
	beforeEach(() => {
		// 日付をモック
		vi.useFakeTimers()
		vi.mock('import.meta', () => ({
			env: {
				PROD: false,
			},
		}))
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.resetAllMocks()
	})

	it('21時前の場合は昨日の日にちを返す', () => {
		vi.setSystemTime(new Date('2024-08-20T20:59:59'))
		expect(isBeforeRankingUpdate()).toBe(true)
		expect(getTodayDate()).eq('2024-08-19')
	})

	it('21時以降の場合は本日の日にちを返す', () => {
		vi.setSystemTime(new Date('2024-08-20T22:00:00'))
		expect(isBeforeRankingUpdate()).toBe(false)
		expect(getTodayDate()).eq('2024-08-20')
	})
})
