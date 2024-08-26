import { supabase } from './supabaseClient'
import { describe, it, expect } from 'vitest'

describe('supabaseClient', () => {
  it('Supabaseが定義されているかを確認', () => {
    expect(supabase).toBeDefined()
  })

  it('DBと連携できているかをavatarsテーブルで確認', async () => {
    const { data, error } = await supabase.from('avatars').select('*').limit(10)
    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
  }, 20000)
})