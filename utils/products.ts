import type { Product } from '~/types/product'

export type StockFilter =
  | 'ALL'
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'

export type ProductSortField =
  | 'name'
  | 'price'
  | 'stock'

export type SortOrder =
  | 'asc'
  | 'desc'

export function filterProducts(
  products: Product[],
  searchQuery: string,
  stockFilter: StockFilter
) {
  const query = searchQuery
    .trim()
    .toLowerCase()

  return products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(query)

    let matchesStock = true

    if (stockFilter === 'IN_STOCK') {
      matchesStock = product.stock > 0
    }

    if (stockFilter === 'LOW_STOCK') {
      matchesStock =
        product.stock > 0 &&
        product.stock <= 5
    }

    if (stockFilter === 'OUT_OF_STOCK') {
      matchesStock = product.stock === 0
    }

    return matchesSearch && matchesStock
  })
}

export function sortProducts(
  products: Product[],
  sortBy: ProductSortField,
  sortOrder: SortOrder
) {
  return [...products].sort((a, b) => {
    let result = 0

    if (sortBy === 'name') {
      result = a.name.localeCompare(b.name)
    }

    if (sortBy === 'price') {
      result = a.price - b.price
    }

    if (sortBy === 'stock') {
      result = a.stock - b.stock
    }

    return sortOrder === 'asc'
      ? result
      : -result
  })
}

export function getTotalPages(
  totalItems: number,
  pageSize: number
) {
  if (pageSize <= 0) {
    return 1
  }

  return Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  )
}

export function paginateProducts(
  products: Product[],
  currentPage: number,
  pageSize: number
) {
  const start =
    (currentPage - 1) * pageSize

  return products.slice(
    start,
    start + pageSize
  )
}