import {
  describe,
  expect,
  it
} from 'vitest'

import {
  filterOrders,
  getOrdersTotalPages,
  paginateOrders,
  sortOrders
} from '../utils/orders'

import type { Order } from '../types/order'

const orders: Order[] = [
  {
    id: 1,
    customerName: 'Gregory',
    status: 'PAID',
    total: 500,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
    items: []
  },
  {
    id: 2,
    customerName: 'Alex',
    status: 'PENDING',
    total: 200,
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-03T10:00:00.000Z',
    items: []
  },
  {
    id: 3,
    customerName: 'Maria',
    status: 'COMPLETED',
    total: 1200,
    createdAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
    items: []
  },
  {
    id: 4,
    customerName: 'Alexander',
    status: 'CANCELLED',
    total: 300,
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
    items: []
  },
  {
    id: 5,
    customerName: 'John',
    status: 'SHIPPED',
    total: 800,
    createdAt: '2026-09-30T10:00:00.000Z',
    updatedAt: '2026-09-30T10:00:00.000Z',
    items: []
  },
  {
    id: 6,
    customerName: 'Anna',
    status: 'PAID',
    total: 100,
    createdAt: '2026-09-29T10:00:00.000Z',
    updatedAt: '2026-09-29T10:00:00.000Z',
    items: []
  }
]

describe('order filtering', () => {
  it('filters orders by customer name', () => {
    const result = filterOrders(
      orders,
      'Gregory',
      'ALL'
    )

    expect(result).toHaveLength(1)
    expect(result[0]?.customerName)
      .toBe('Gregory')
  })

  it('search is case insensitive', () => {
    const result = filterOrders(
      orders,
      'gregory',
      'ALL'
    )

    expect(result).toHaveLength(1)
  })

  it('supports partial customer search', () => {
    const result = filterOrders(
      orders,
      'alex',
      'ALL'
    )

    expect(
      result.map(
        (order) => order.customerName
      )
    ).toEqual([
      'Alex',
      'Alexander'
    ])
  })

  it('filters orders by status', () => {
    const result = filterOrders(
      orders,
      '',
      'PAID'
    )

    expect(result).toHaveLength(2)

    expect(
      result.every(
        (order) =>
          order.status === 'PAID'
      )
    ).toBe(true)
  })

  it('combines search and status filter', () => {
    const result = filterOrders(
      orders,
      'anna',
      'PAID'
    )

    expect(result).toHaveLength(1)
    expect(result[0]?.customerName)
      .toBe('Anna')
  })
})

describe('order sorting', () => {
  it('sorts by total ascending', () => {
    const result = sortOrders(
      orders,
      'total',
      'asc'
    )

    expect(result[0]?.total).toBe(100)
    expect(result.at(-1)?.total).toBe(1200)
  })

  it('sorts by total descending', () => {
    const result = sortOrders(
      orders,
      'total',
      'desc'
    )

    expect(result[0]?.total).toBe(1200)
    expect(result.at(-1)?.total).toBe(100)
  })

  it('sorts customers alphabetically', () => {
    const result = sortOrders(
      orders,
      'customer',
      'asc'
    )

    expect(result[0]?.customerName)
      .toBe('Alex')

    expect(result.at(-1)?.customerName)
      .toBe('Maria')
  })

  it('sorts newest orders first', () => {
    const result = sortOrders(
      orders,
      'date',
      'desc'
    )

    expect(result[0]?.id).toBe(2)
    expect(result.at(-1)?.id).toBe(3)
  })

  it('does not modify original array', () => {
    const firstOrder = orders[0]

    sortOrders(
      orders,
      'total',
      'asc'
    )

    expect(orders[0]).toEqual(firstOrder)
  })
})

describe('order pagination', () => {
  it('calculates total pages', () => {
    expect(
      getOrdersTotalPages(23, 5)
    ).toBe(5)
  })

  it('returns at least one page', () => {
    expect(
      getOrdersTotalPages(0, 5)
    ).toBe(1)
  })

  it('returns correct second page', () => {
    const result = paginateOrders(
      orders,
      2,
      2
    )

    expect(
      result.map((order) => order.id)
    ).toEqual([
      3,
      4
    ])
  })
})