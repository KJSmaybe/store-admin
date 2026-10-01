<script setup lang="ts">
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

await Promise.all([
  productsStore.fetchProducts(),
  ordersStore.fetchOrders()
])

const lowStockProducts = computed(() => {
  return productsStore.products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= 5
  )
})

const recentOrders = computed(() => {
  return ordersStore.orders.slice(0, 5)
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function statusClass(status: string) {
  return status.toLowerCase()
}
</script>

<template>
  <div class="dashboard">
    <header class="page-header">
      <div>
        <h1>Dashboard</h1>

        <p>
          Overview of your store performance.
        </p>
      </div>
    </header>

    <div class="stats">
      <div class="stat-card">
        <span class="stat-label">
          Products
        </span>

        <strong>
          {{ productsStore.totalProducts }}
        </strong>

        <small>
          {{ productsStore.totalStock }} units in stock
        </small>
      </div>

      <div class="stat-card">
        <span class="stat-label">
          Orders
        </span>

        <strong>
          {{ ordersStore.totalOrders }}
        </strong>

        <small>
          {{ ordersStore.pendingOrders }} pending
        </small>
      </div>

      <div class="stat-card">
        <span class="stat-label">
          Revenue
        </span>

        <strong>
          ${{ ordersStore.totalRevenue }}
        </strong>

        <small>
          Paid orders
        </small>
      </div>

      <div class="stat-card">
        <span class="stat-label">
          Out of stock
        </span>

        <strong>
          {{ productsStore.outOfStockProducts }}
        </strong>

        <small>
          Products unavailable
        </small>
      </div>
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Recent orders</h2>

            <p>
              Latest customer orders
            </p>
          </div>

          <NuxtLink
            to="/orders"
            class="panel-link"
          >
            View all
          </NuxtLink>
        </div>

        <div
          v-if="recentOrders.length === 0"
          class="empty"
        >
          No orders yet
        </div>

        <div
          v-else
          class="orders-list"
        >
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="order-row"
          >
            <div>
              <strong>
                #{{ order.id }}
              </strong>

              <span class="customer">
                {{ order.customerName }}
              </span>
            </div>

            <div class="order-meta">
              <strong>
                ${{ order.total }}
              </strong>

              <span
                class="status"
                :class="statusClass(order.status)"
              >
                {{ order.status }}
              </span>

              <small>
                {{ formatDate(order.createdAt) }}
              </small>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Inventory alerts</h2>

            <p>
              Products with low stock
            </p>
          </div>

          <NuxtLink
            to="/products"
            class="panel-link"
          >
            Products
          </NuxtLink>
        </div>

        <div
          v-if="
            lowStockProducts.length === 0 &&
            productsStore.outOfStockProducts === 0
          "
          class="empty"
        >
          Inventory looks good
        </div>

        <div v-else>
          <div
            v-for="product in lowStockProducts"
            :key="product.id"
            class="stock-row"
          >
            <div>
              <strong>
                {{ product.name }}
              </strong>

              <span>
                Low stock
              </span>
            </div>

            <strong class="stock-number">
              {{ product.stock }}
            </strong>
          </div>

          <div
            v-for="product in productsStore.products.filter(
              (product) => product.stock === 0
            )"
            :key="product.id"
            class="stock-row"
          >
            <div>
              <strong>
                {{ product.name }}
              </strong>

              <span class="out-text">
                Out of stock
              </span>
            </div>

            <strong class="stock-number">
              0
            </strong>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
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

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  margin-bottom: 30px;
}

.stat-card {
  padding: 22px;

  background: white;

  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.stat-label {
  display: block;

  margin-bottom: 12px;

  color: #6b7280;
  font-size: 13px;
}

.stat-card strong {
  display: block;

  margin-bottom: 7px;

  font-size: 28px;
}

.stat-card small {
  color: #9ca3af;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.panel {
  padding: 22px;

  background: white;

  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
}

.panel-header p {
  margin: 4px 0 0;

  color: #9ca3af;
  font-size: 13px;
}

.panel-link {
  color: #4f46e5;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.order-row,
.stock-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 0;

  border-top: 1px solid #f3f4f6;
}

.order-row:first-child,
.stock-row:first-child {
  border-top: none;
}

.customer {
  display: block;

  margin-top: 4px;

  color: #6b7280;
  font-size: 13px;
}

.order-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-meta small {
  color: #9ca3af;
}

.status {
  padding: 5px 8px;

  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;
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

.stock-row span {
  display: block;

  margin-top: 4px;

  color: #d97706;
  font-size: 12px;
}

.stock-row .out-text {
  color: #dc2626;
}

.stock-number {
  font-size: 20px;
}

.empty {
  padding: 30px 0;

  color: #9ca3af;
  text-align: center;
}

@media (max-width: 1000px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .order-meta {
    align-items: flex-end;
    flex-direction: column;
  }
}
</style>