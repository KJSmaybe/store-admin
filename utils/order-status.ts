import type { OrderStatus } from '~/types/order'

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED'
]

export const ALLOWED_ORDER_TRANSITIONS: Record<
  OrderStatus,
  OrderStatus[]
> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
}

export function canTransitionOrderStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
) {
  return ALLOWED_ORDER_TRANSITIONS[
    currentStatus
  ].includes(newStatus)
}

export function getAvailableOrderStatuses(
  currentStatus: OrderStatus
) {
  return [
    currentStatus,
    ...ALLOWED_ORDER_TRANSITIONS[currentStatus]
  ]
}