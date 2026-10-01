import type { Product } from '~/types/product'

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  id: number
  customerName: string
  status: OrderStatus
  total: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface CreateOrderItemInput {
  productId: number
  quantity: number
}

export interface CreateOrderInput {
  customerName: string
  items: CreateOrderItemInput[]
}