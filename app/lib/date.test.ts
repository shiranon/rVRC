import { afterEach, describe, expect, it, vi } from 'vitest'
import { getTodayDate, isBeforeRankingUpdate } from './date'

const devDefaultDate = new Date('2024-08-30')
const today = new Date(devDefaultDate)

describe('日付関係のテスト', () => {
	it('21時前の場合は昨日の日にちを返す', () => {
		today.setHours(0, 0, 0, 0)
		vi.setSystemTime(today)
		expect(getTodayDate()).eq(new Date().toISOString().split('T')[0])
	})

	it('21時以降の場合は本日の日にちを返す', () => {
		today.setHours(21, 0, 0, 0)
		vi.setSystemTime(new Date(today))
		expect(isBeforeRankingUpdate()).toBe(false)
		expect(getTodayDate()).eq(new Date().toISOString().split('T')[0])
	})
})
