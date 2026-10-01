<script setup lang="ts">
import OrderForm from '~/components/orders/OrderForm.vue'

import type {
  CreateOrderInput,
  OrderStatus
} from '~/types/order'

import {
  ALLOWED_ORDER_TRANSITIONS,
  getAvailableOrderStatuses
} from '~/utils/order-status'

import {
  filterOrders,
  getOrdersTotalPages,
  paginateOrders,
  sortOrders
} from '~/utils/orders'

import type {
  OrderSortField,
  OrderSortOrder,
  OrderStatusFilter
} from '~/utils/orders'

const ordersStore = useOrdersStore()
const productsStore = useProductsStore()

const orderFormRef =
  ref<InstanceType<typeof OrderForm> | null>(null)

const creatingOrder = ref(false)
const createError = ref<string | null>(null)
const statusError = ref<string | null>(null)

const searchQuery = ref('')

const statusFilter =
  ref<OrderStatusFilter>('ALL')

const sortBy =
  ref<OrderSortField>('date')

const sortOrder =
  ref<OrderSortOrder>('desc')

const currentPage = ref(1)
const pageSize = ref(5)

await Promise.all([
  ordersStore.fetchOrders(),
  productsStore.fetchProducts()
])

const filteredOrders = computed(() => {
  return filterOrders(
    ordersStore.orders,
    searchQuery.value,
    statusFilter.value
  )
})

const sortedOrders = computed(() => {
  return sortOrders(
    filteredOrders.value,
    sortBy.value,
    sortOrder.value
  )
})

const totalPages = computed(() => {
  return getOrdersTotalPages(
    sortedOrders.value.length,
    pageSize.value
  )
})

const paginatedOrders = computed(() => {
  return paginateOrders(
    sortedOrders.value,
    currentPage.value,
    pageSize.value
  )
})

watch(
  [
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    pageSize
  ],
  () => {
    currentPage.value = 1
  }
)

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

async function createOrder(
  orderData: CreateOrderInput
) {
  creatingOrder.value = true
  createError.value = null

  try {
    await ordersStore.createOrder(orderData)

    await productsStore.fetchProducts()

    orderFormRef.value?.resetForm()
  } catch (error) {
    console.error(error)

    createError.value =
      'Failed to create order'
  } finally {
    creatingOrder.value = false
  }
}

async function changeOrderStatus(
  orderId: number,
  event: Event
) {
  const select =
    event.target as HTMLSelectElement

  const newStatus =
    select.value as OrderStatus

  statusError.value = null

  try {
    await ordersStore.updateOrderStatus(
      orderId,
      newStatus
    )

    if (newStatus === 'CANCELLED') {
      await productsStore.fetchProducts()
    }
  } catch (error) {
    console.error(error)

    statusError.value =
      'Failed to update order status'

    await ordersStore.fetchOrders()
  }
}

function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString()
}

function statusClass(status: OrderStatus) {
  return status.toLowerCase()
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (
    currentPage.value <
    totalPages.value
  ) {
    currentPage.value++
  }
}
</script>

<template>
  <div class="orders-page">
    <header class="page-header">
      <div>
        <h1>Orders</h1>

        <p>
          Manage customer orders and track their status.
        </p>
      </div>

      <div class="orders-count">
        {{ ordersStore.totalOrders }} orders
      </div>
    </header>

    <OrderForm
      ref="orderFormRef"
      :products="productsStore.products"
      :submitting="creatingOrder"
      @create="createOrder"
    />

    <p
      v-if="createError"
      class="error"
    >
      {{ createError }}
    </p>

    <div class="stats">
      <div class="stat-card">
        <span>Total orders</span>

        <strong>
          {{ ordersStore.totalOrders }}
        </strong>
      </div>

      <div class="stat-card">
        <span>Pending</span>

        <strong>
          {{ ordersStore.pendingOrders }}
        </strong>
      </div>

      <div class="stat-card">
        <span>Revenue</span>

        <strong>
          ${{ ordersStore.totalRevenue }}
        </strong>
      </div>
    </div>

    <div class="section-header">
      <div>
        <h2>Order list</h2>

        <span>
          Search and filter customer orders
        </span>
      </div>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        class="control search"
        type="text"
        placeholder="Search customer..."
      >

      <select
        v-model="statusFilter"
        class="control"
      >
        <option value="ALL">
          All statuses
        </option>

        <option value="PENDING">
          Pending
        </option>

        <option value="PAID">
          Paid
        </option>

        <option value="SHIPPED">
          Shipped
        </option>

        <option value="COMPLETED">
          Completed
        </option>

        <option value="CANCELLED">
          Cancelled
        </option>
      </select>

      <select
        v-model="sortBy"
        class="control"
      >
        <option value="date">
          Sort by date
        </option>

        <option value="total">
          Sort by total
        </option>

        <option value="customer">
          Sort by customer
        </option>
      </select>

      <select
        v-model="sortOrder"
        class="control"
      >
        <option value="desc">
          Descending
        </option>

        <option value="asc">
          Ascending
        </option>
      </select>

      <select
        v-model.number="pageSize"
        class="control page-size"
      >
        <option :value="5">
          5 per page
        </option>

        <option :value="10">
          10 per page
        </option>

        <option :value="20">
          20 per page
        </option>
      </select>
    </div>

    <p
      v-if="statusError"
      class="error"
    >
      {{ statusError }}
    </p>

    <div
      v-if="ordersStore.pending"
      class="message"
    >
      Loading orders...
    </div>

    <div
      v-else-if="ordersStore.error"
      class="message error"
    >
      {{ ordersStore.error }}
    </div>

    <template v-else>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
            >
              <td>
                <strong>
                  #{{ order.id }}
                </strong>
              </td>

              <td>
                {{ order.customerName }}
              </td>

              <td>
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="order-item"
                >
                  {{ item.product?.name }}
                  ×
                  {{ item.quantity }}
                </div>
              </td>

              <td>
                <strong>
                  ${{ order.total }}
                </strong>
              </td>

              <td>
                <select
                  class="status-select"
                  :class="statusClass(order.status)"
                  :value="order.status"
                  :disabled="
                    ALLOWED_ORDER_TRANSITIONS[
                      order.status
                    ].length === 0
                  "
                  @change="
                    changeOrderStatus(
                      order.id,
                      $event
                    )
                  "
                >
                  <option
                    v-for="status in getAvailableOrderStatuses(
                      order.status
                    )"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </td>

              <td>
                {{ formatDate(order.createdAt) }}
              </td>
            </tr>

            <tr v-if="paginatedOrders.length === 0">
              <td
                colspan="6"
                class="empty"
              >
                No orders found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span>
          {{ sortedOrders.length }}
          orders found
        </span>

        <div class="pagination-controls">
          <button
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            Previous
          </button>

          <span>
            Page {{ currentPage }}
            of {{ totalPages }}
          </span>

          <button
            :disabled="
              currentPage === totalPages
            "
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.orders-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
}

.page-header p {
  margin: 7px 0 0;
  color: #6b7280;
}

.orders-count {
  padding: 8px 12px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  color: #6b7280;
  font-size: 14px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  margin: 28px 0;
}

.stat-card {
  padding: 20px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.stat-card span {
  display: block;
  margin-bottom: 10px;

  color: #6b7280;
  font-size: 13px;
}

.stat-card strong {
  font-size: 26px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
}

.section-header span {
  display: block;

  margin-top: 4px;

  color: #9ca3af;
  font-size: 13px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 16px;
}

.control {
  height: 40px;

  padding: 0 12px;

  background: white;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  outline: none;
}

.control:focus {
  border-color: #4f46e5;

  box-shadow:
    0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search {
  width: 270px;
}

.page-size {
  margin-left: auto;
}

.table-wrapper {
  overflow-x: auto;

  background: white;

  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 14px 18px;

  background: #f9fafb;

  color: #6b7280;

  font-size: 12px;
  text-align: left;
  text-transform: uppercase;
}

td {
  padding: 17px 18px;

  border-top: 1px solid #e5e7eb;
}

.order-item {
  margin-bottom: 4px;
}

.status-select {
  padding: 6px 9px;

  border: none;
  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;

  cursor: pointer;
}

.status-select:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.pending {
  background: #fef3c7;
  color: #92400e;
}

.paid {
  background: #dbeafe;
  color: #1d4ed8;
}

.shipped {
  background: #e0e7ff;
  color: #4338ca;
}

.completed {
  background: #dcfce7;
  color: #166534;
}

.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;

  color: #6b7280;
  font-size: 13px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination button {
  padding: 8px 13px;

  background: white;

  border: 1px solid #d1d5db;
  border-radius: 7px;

  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.message {
  padding: 30px;

  background: white;
  border-radius: 12px;

  text-align: center;
}

.error {
  color: #dc2626;
  font-size: 13px;
}

.empty {
  padding: 40px;

  color: #9ca3af;
  text-align: center;
}

@media (max-width: 800px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
  }

  .control,
  .search {
    width: 100%;
  }

  .page-size {
    margin-left: 0;
  }

  .pagination {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }
}
</style>