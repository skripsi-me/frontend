import { describe, it, expect } from 'vitest'
import { getLevenshteinDistance, isLevenshteinMatch } from './levenshtein'

describe('getLevenshteinDistance', () => {
  it('should return 0 for identical strings', () => {
    expect(getLevenshteinDistance('beras', 'beras')).toBe(0)
  })

  it('should return distance for single character replacement', () => {
    expect(getLevenshteinDistance('beras', 'beraz')).toBe(1)
  })

  it('should return distance for single character insertion', () => {
    expect(getLevenshteinDistance('bera', 'beras')).toBe(1)
  })

  it('should return distance for single character deletion', () => {
    expect(getLevenshteinDistance('beras', 'bera')).toBe(1)
  })

  it('should be case-insensitive', () => {
    expect(getLevenshteinDistance('Beras', 'beras')).toBe(0)
  })
})

describe('isLevenshteinMatch', () => {
  it('should return true for exact matches and substrings', () => {
    expect(isLevenshteinMatch('beras', 'Beras Cianjur')).toBe(true)
  })

  it('should return true within tolerance', () => {
    expect(isLevenshteinMatch('beraz', 'Beras Cianjur', 1)).toBe(true)
  })

  it('should return false if distance exceeds tolerance', () => {
    expect(isLevenshteinMatch('berax', 'Beras', 0)).toBe(false)
  })

  it('should require exact matches for very short words', () => {
    expect(isLevenshteinMatch('mi', 'Minyak Goreng')).toBe(true)
    expect(isLevenshteinMatch('mz', 'Minyak Goreng')).toBe(false)
  })
})
