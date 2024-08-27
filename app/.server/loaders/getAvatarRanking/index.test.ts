import { describe, expect, it } from 'vitest'
import { getAvatarRankingLoader } from './index'

describe('ランキング関係のテスト', () => {
	it('ランキングが取得出来ているかのテスト', () => {
		const result = getAvatarRankingLoader('day', 1)
		expect(result).toBeDefined()
	})
})
