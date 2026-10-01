import type {
  Order,
  OrderStatus,
  CreateOrderInput
} from '~/types/order'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const totalOrders = computed(() => {
    return orders.value.length
  })

  const pendingOrders = computed(() => {
    return orders.value.filter(
      (order) => order.status === 'PENDING'
    ).length
  })

  const totalRevenue = computed(() => {
  return orders.value
    .filter((order) =>
      ['PAID', 'SHIPPED', 'COMPLETED'].includes(order.status)
    )
    .reduce(
      (sum, order) => sum + order.total,
      0
    )
})
    async function updateOrderStatus(
    id: number,
    status: OrderStatus
  ) {
    const updatedOrder = await $fetch<Order>(
      `/api/orders/${id}`,
      {
        method: 'PUT',
        body: {
          status
        }
      }
    )

    const index = orders.value.findIndex(
      (order) => order.id === id
    )

    if (index !== -1) {
      orders.value[index] = updatedOrder
    }
  }  
  async function fetchOrders() {
    pending.value = true
    error.value = null

    try {
      orders.value = await $fetch<Order[]>('/api/orders')
    } catch (err) {
      console.error(err)
      error.value = 'Failed to load orders'
    } finally {
      pending.value = false
    }
  }
  
  async function createOrder(
    orderData: CreateOrderInput
  ) {
    error.value = null

    try {
      const order = await $fetch<Order>('/api/orders', {
        method: 'POST',
        body: orderData
      })

      orders.value.unshift(order)

      return order
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return {
    orders,
    pending,
    error,

    totalOrders,
    pendingOrders,
    totalRevenue,

    fetchOrders,
    createOrder,
    updateOrderStatus
  }
})