import {
  ALLOWED_ORDER_TRANSITIONS,
  ORDER_STATUSES,
  canTransitionOrderStatus,
  getAvailableOrderStatuses
} from '../utils/order-status'

import { describe, expect, it } from 'vitest'

describe('order status logic', () => {
  it('contains all supported statuses', () => {
    expect(ORDER_STATUSES).toEqual([
      'PENDING',
      'PAID',
      'SHIPPED',
      'COMPLETED',
      'CANCELLED'
    ])
  })

  it('allows PENDING to PAID', () => {
    expect(
      canTransitionOrderStatus(
        'PENDING',
        'PAID'
      )
    ).toBe(true)
  })

  it('allows PENDING to CANCELLED', () => {
    expect(
      canTransitionOrderStatus(
        'PENDING',
        'CANCELLED'
      )
    ).toBe(true)
  })

  it('does not allow PENDING to COMPLETED', () => {
    expect(
      canTransitionOrderStatus(
        'PENDING',
        'COMPLETED'
      )
    ).toBe(false)
  })

  it('allows PAID to SHIPPED', () => {
    expect(
      canTransitionOrderStatus(
        'PAID',
        'SHIPPED'
      )
    ).toBe(true)
  })

  it('allows PAID to CANCELLED', () => {
    expect(
      canTransitionOrderStatus(
        'PAID',
        'CANCELLED'
      )
    ).toBe(true)
  })

  it('allows SHIPPED to COMPLETED', () => {
    expect(
      canTransitionOrderStatus(
        'SHIPPED',
        'COMPLETED'
      )
    ).toBe(true)
  })

  it('does not allow COMPLETED to another status', () => {
    expect(
      ALLOWED_ORDER_TRANSITIONS.COMPLETED
    ).toHaveLength(0)
  })

  it('does not allow CANCELLED to another status', () => {
    expect(
      ALLOWED_ORDER_TRANSITIONS.CANCELLED
    ).toHaveLength(0)
  })

  it('returns current and available statuses for PENDING', () => {
    expect(
      getAvailableOrderStatuses('PENDING')
    ).toEqual([
      'PENDING',
      'PAID',
      'CANCELLED'
    ])
  })

  it('returns only COMPLETED for completed order', () => {
    expect(
      getAvailableOrderStatuses('COMPLETED')
    ).toEqual([
      'COMPLETED'
    ])
  })
})