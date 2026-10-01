import {
  describe,
  expect,
  it
} from 'vitest'

import {
  filterProducts,
  getTotalPages,
  paginateProducts,
  sortProducts
} from '../utils/products'

import type { Product } from '../types/product'

const products: Product[] = [
  {
    id: 1,
    name: 'Monitor',
    price: 500,
    stock: 8
  },
  {
    id: 2,
    name: 'Mouse',
    price: 50,
    stock: 0
  },
  {
    id: 3,
    name: 'Keyboard',
    price: 100,
    stock: 3
  },
  {
    id: 4,
    name: 'Laptop',
    price: 1500,
    stock: 1
  },
  {
    id: 5,
    name: 'Webcam',
    price: 200,
    stock: 10
  },
  {
    id: 6,
    name: 'Headphones',
    price: 300,
    stock: 5
  }
]

describe('product filtering', () => {
  it('filters products by name', () => {
    const result = filterProducts(
      products,
      'monitor',
      'ALL'
    )

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Monitor')
  })

  it('search is case insensitive', () => {
    const result = filterProducts(
      products,
      'MONITOR',
      'ALL'
    )

    expect(result).toHaveLength(1)
  })

  it('returns only in-stock products', () => {
    const result = filterProducts(
      products,
      '',
      'IN_STOCK'
    )

    expect(
      result.every(
        (product) => product.stock > 0
      )
    ).toBe(true)

    expect(result).toHaveLength(5)
  })

  it('returns low-stock products', () => {
    const result = filterProducts(
      products,
      '',
      'LOW_STOCK'
    )

    expect(
      result.map((product) => product.name)
    ).toEqual([
      'Keyboard',
      'Laptop',
      'Headphones'
    ])
  })

  it('returns out-of-stock products', () => {
    const result = filterProducts(
      products,
      '',
      'OUT_OF_STOCK'
    )

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Mouse')
  })
})

describe('product sorting', () => {
  it('sorts products by price ascending', () => {
    const result = sortProducts(
      products,
      'price',
      'asc'
    )

    expect(result[0]?.name).toBe('Mouse')
    expect(result.at(-1)?.name).toBe('Laptop')
  })

  it('sorts products by price descending', () => {
    const result = sortProducts(
      products,
      'price',
      'desc'
    )

    expect(result[0]?.name).toBe('Laptop')
    expect(result.at(-1)?.name).toBe('Mouse')
  })

  it('sorts products by stock ascending', () => {
    const result = sortProducts(
      products,
      'stock',
      'asc'
    )

    expect(result[0]?.stock).toBe(0)
    expect(result.at(-1)?.stock).toBe(10)
  })

  it('does not modify original array', () => {
    const originalFirst = products[0]

    sortProducts(
      products,
      'price',
      'asc'
    )

    expect(products[0]).toEqual(originalFirst)
  })
})

describe('product pagination', () => {
  it('calculates number of pages', () => {
    expect(
      getTotalPages(21, 5)
    ).toBe(5)
  })

  it('returns at least one page for empty list', () => {
    expect(
      getTotalPages(0, 5)
    ).toBe(1)
  })

  it('returns correct products for second page', () => {
    const result = paginateProducts(
      products,
      2,
      2
    )

    expect(
      result.map((product) => product.id)
    ).toEqual([
      3,
      4
    ])
  })
})