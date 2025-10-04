import { describe, it, expect } from 'vitest'
import { OPEN, FOR_REVIEW, COMPLETED } from '../src/utils/statusMap'

describe('status map', ()=>{
  it('contains sets for tabs', ()=>{
    expect(OPEN.has('New')).toBe(true)
    expect(OPEN.has('In Progress')).toBe(true)
    expect(FOR_REVIEW.has('Ready to Review')).toBe(true)
    expect(COMPLETED.has('Completed')).toBe(true)
  })
})