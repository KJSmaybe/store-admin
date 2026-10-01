<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  delete: [id: number]
  update: [product: Product]
}>()

const editingProductId = ref<number | null>(null)

const editName = ref('')
const editPrice = ref(0)
const editStock = ref(0)

function startEdit(product: Product) {
  editingProductId.value = product.id

  editName.value = product.name
  editPrice.value = product.price
  editStock.value = product.stock
}

function saveEdit(product: Product) {
  if (!editName.value.trim()) {
    return
  }

  emit('update', {
    id: product.id,
    name: editName.value.trim(),
    price: Number(editPrice.value),
    stock: Number(editStock.value)
  })

  editingProductId.value = null
}

function cancelEdit() {
  editingProductId.value = null
}
</script>

<template>
  <div class="table-wrapper">
    <table class="products-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th class="actions-header">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
        >
          <td>
            <input
              v-if="editingProductId === product.id"
              v-model="editName"
              class="table-input"
              type="text"
            >

            <strong v-else>
              {{ product.name }}
            </strong>
          </td>

          <td>
            <input
              v-if="editingProductId === product.id"
              v-model.number="editPrice"
              class="table-input number-input"
              type="number"
              min="0"
            >

            <span v-else>
              ${{ product.price }}
            </span>
          </td>

          <td>
            <input
              v-if="editingProductId === product.id"
              v-model.number="editStock"
              class="table-input number-input"
              type="number"
              min="0"
            >

            <span v-else>
              {{ product.stock }}
            </span>
          </td>

          <td>
            <span
              v-if="product.stock > 0"
              class="status status-active"
            >
              In stock
            </span>

            <span
              v-else
              class="status status-empty"
            >
              Out of stock
            </span>
          </td>

          <td class="actions">
            <template v-if="editingProductId === product.id">
              <button
                class="button save-button"
                @click="saveEdit(product)"
              >
                Save
              </button>

              <button
                class="button cancel-button"
                @click="cancelEdit"
              >
                Cancel
              </button>
            </template>

            <template v-else>
              <button
                class="button edit-button"
                @click="startEdit(product)"
              >
                Edit
              </button>

              <button
                class="button delete-button"
                @click="emit('delete', product.id)"
              >
                Delete
              </button>
            </template>
          </td>
        </tr>

        <tr v-if="products.length === 0">
          <td
            colspan="5"
            class="empty-state"
          >
            No products found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
  padding: 14px 18px;

  background: #f9fafb;

  color: #6b7280;

  font-size: 12px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.products-table td {
  padding: 17px 18px;
  border-top: 1px solid #e5e7eb;
}

.products-table tbody tr:hover {
  background: #fafafa;
}

.actions-header {
  text-align: right !important;
}

.actions {
  text-align: right;
  white-space: nowrap;
}

.status {
  display: inline-block;

  padding: 5px 9px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-empty {
  background: #fee2e2;
  color: #991b1b;
}

.button {
  padding: 7px 11px;

  border: none;
  border-radius: 6px;

  cursor: pointer;
  font-weight: 500;

  margin-left: 6px;
}

.edit-button {
  background: #eef2ff;
  color: #4338ca;
}

.delete-button {
  background: #fef2f2;
  color: #dc2626;
}

.save-button {
  background: #dcfce7;
  color: #166534;
}

.cancel-button {
  background: #f3f4f6;
  color: #374151;
}

.table-input {
  width: 100%;
  max-width: 220px;

  padding: 7px 9px;

  border: 1px solid #d1d5db;
  border-radius: 6px;

  outline: none;
}

.number-input {
  max-width: 110px;
}

.table-input:focus {
  border-color: #4f46e5;
}

.empty-state {
  padding: 40px !important;

  color: #9ca3af;
  text-align: center;
}
</style>