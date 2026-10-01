import type {
  Order,
  OrderStatus
} from '~/types/order'

export type OrderStatusFilter =
  | 'ALL'
  | OrderStatus

export type OrderSortField =
  | 'date'
  | 'total'
  | 'customer'

export type OrderSortOrder =
  | 'asc'
  | 'desc'

export function filterOrders(
  orders: Order[],
  searchQuery: string,
  statusFilter: OrderStatusFilter
) {
  const query = searchQuery
    .trim()
    .toLowerCase()

  return orders.filter((order) => {
    const matchesSearch =
      order.customerName
        .toLowerCase()
        .includes(query)

    const matchesStatus =
      statusFilter === 'ALL' ||
      order.status === statusFilter

    return matchesSearch && matchesStatus
  })
}

export function sortOrders(
  orders: Order[],
  sortBy: OrderSortField,
  sortOrder: OrderSortOrder
) {
  return [...orders].sort((a, b) => {
    let result = 0

    if (sortBy === 'date') {
      result =
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    }

    if (sortBy === 'total') {
      result = a.total - b.total
    }

    if (sortBy === 'customer') {
      result =
        a.customerName.localeCompare(
          b.customerName
        )
    }

    return sortOrder === 'asc'
      ? result
      : -result
  })
}

export function getOrdersTotalPages(
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

export function paginateOrders(
  orders: Order[],
  currentPage: number,
  pageSize: number
) {
  const start =
    (currentPage - 1) * pageSize

  return orders.slice(
    start,
    start + pageSize
  )
}