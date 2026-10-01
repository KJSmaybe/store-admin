<script setup lang="ts">
import ProductForm from '~/components/products/ProductForm.vue'
import ProductTable from '~/components/products/ProductTable.vue'

import {
  filterProducts,
  getTotalPages,
  paginateProducts,
  sortProducts
} from '~/utils/products'

import type {
  ProductSortField,
  SortOrder,
  StockFilter
} from '~/utils/products'

const productsStore = useProductsStore()

const searchQuery = ref('')
const stockFilter = ref<StockFilter>('ALL')

const sortBy = ref<ProductSortField>('name')
const sortOrder = ref<SortOrder>('asc')

const currentPage = ref(1)
const pageSize = ref(5)

await productsStore.fetchProducts()

const filteredProducts = computed(() => {
  return filterProducts(
    productsStore.products,
    searchQuery.value,
    stockFilter.value
  )
})

const sortedProducts = computed(() => {
  return sortProducts(
    filteredProducts.value,
    sortBy.value,
    sortOrder.value
  )
})

const totalPages = computed(() => {
  return getTotalPages(
    sortedProducts.value.length,
    pageSize.value
  )
})

const paginatedProducts = computed(() => {
  return paginateProducts(
    sortedProducts.value,
    currentPage.value,
    pageSize.value
  )
})

const firstVisibleProduct = computed(() => {
  if (sortedProducts.value.length === 0) {
    return 0
  }

  return (
    (currentPage.value - 1) *
    pageSize.value +
    1
  )
})

const lastVisibleProduct = computed(() => {
  return Math.min(
    currentPage.value * pageSize.value,
    sortedProducts.value.length
  )
})

watch(
  [
    searchQuery,
    stockFilter,
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
  <div class="products-page">
    <header class="page-header">
      <div>
        <h1>Products</h1>

        <p>
          Manage products, prices and inventory.
        </p>
      </div>

      <div class="product-count">
        {{ productsStore.totalProducts }}
        products
      </div>
    </header>

    <ProductForm
      @add="productsStore.addProduct"
    />

    <div class="toolbar-header">
      <div>
        <h2>Product list</h2>

        <span>
          Search, sort and filter your inventory
        </span>
      </div>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        class="control search"
        type="text"
        placeholder="Search products..."
      >

      <select
        v-model="stockFilter"
        class="control"
      >
        <option value="ALL">
          All stock
        </option>

        <option value="IN_STOCK">
          In stock
        </option>

        <option value="LOW_STOCK">
          Low stock
        </option>

        <option value="OUT_OF_STOCK">
          Out of stock
        </option>
      </select>

      <select
        v-model="sortBy"
        class="control"
      >
        <option value="name">
          Sort by name
        </option>

        <option value="price">
          Sort by price
        </option>

        <option value="stock">
          Sort by stock
        </option>
      </select>

      <select
        v-model="sortOrder"
        class="control"
      >
        <option value="asc">
          Ascending
        </option>

        <option value="desc">
          Descending
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

    <div
      v-if="productsStore.pending"
      class="message"
    >
      Loading products...
    </div>

    <div
      v-else-if="productsStore.error"
      class="message error"
    >
      {{ productsStore.error }}
    </div>

    <template v-else>
      <ProductTable
        :products="paginatedProducts"
        @update="productsStore.updateProduct"
        @delete="productsStore.deleteProduct"
      />

      <div class="pagination">
        <span class="pagination-info">
          Showing
          {{ firstVisibleProduct }}
          –
          {{ lastVisibleProduct }}
          of
          {{ sortedProducts.length }}
        </span>

        <div class="pagination-controls">
          <button
            class="page-button"
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            Previous
          </button>

          <span class="page-number">
            Page {{ currentPage }}
            of {{ totalPages }}
          </span>

          <button
            class="page-button"
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
.products-page {
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

.product-count {
  padding: 8px 12px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  color: #6b7280;
  font-size: 14px;
}

.toolbar-header {
  margin: 30px 0 16px;
}

.toolbar-header h2 {
  margin: 0;
  font-size: 18px;
}

.toolbar-header span {
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
  width: 280px;
}

.page-size {
  margin-left: auto;
}

.message {
  padding: 30px;

  background: white;
  border-radius: 12px;

  text-align: center;
}

.error {
  color: #dc2626;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;
}

.pagination-info {
  color: #6b7280;
  font-size: 13px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-button {
  padding: 8px 13px;

  background: white;

  border: 1px solid #d1d5db;
  border-radius: 7px;

  cursor: pointer;
}

.page-button:hover:not(:disabled) {
  background: #f9fafb;
}

.page-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-number {
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 800px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
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

  .pagination-controls {
    justify-content: space-between;
  }
}
</style>