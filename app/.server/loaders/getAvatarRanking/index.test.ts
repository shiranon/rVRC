import { getAvatarRankingLoader } from './index'
import { describe, it, expect } from 'vitest'

describe('ランキング関係のテスト', () => {
  it('ランキングが取得出来ているかのテスト', () => {
    const result = getAvatarRankingLoader('day', 1)
    expect(result).toBeDefined()
  })
})