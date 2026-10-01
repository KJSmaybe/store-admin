<script setup lang="ts">
import type { Product } from '~/types/product'
import type { CreateOrderInput } from '~/types/order'

const props = defineProps<{
  products: Product[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  create: [order: CreateOrderInput]
}>()

interface DraftItem {
  productId: number | null
  quantity: number
}

const customerName = ref('')

const items = ref<DraftItem[]>([
  {
    productId: null,
    quantity: 1
  }
])

const estimatedTotal = computed(() => {
  return items.value.reduce((total, item) => {
    const product = props.products.find(
      (product) => product.id === item.productId
    )

    if (!product) {
      return total
    }

    return total + product.price * item.quantity
  }, 0)
})

function addItem() {
  items.value.push({
    productId: null,
    quantity: 1
  })
}

function removeItem(index: number) {
  if (items.value.length === 1) {
    return
  }

  items.value.splice(index, 1)
}

function getProductStock(productId: number | null) {
  if (!productId) {
    return null
  }

  return props.products.find(
    (product) => product.id === productId
  )?.stock
}
function resetForm() {
  customerName.value = ''

  items.value = [
    {
      productId: null,
      quantity: 1
    }
  ]
}

defineExpose({
  resetForm
})
function submitOrder() {
  if (!customerName.value.trim()) {
    return
  }

  const validItems = items.value.filter(
    (item) =>
      item.productId !== null &&
      item.quantity > 0
  )

  if (validItems.length === 0) {
    return
  }

  emit('create', {
    customerName: customerName.value.trim(),

    items: validItems.map((item) => ({
      productId: item.productId as number,
      quantity: item.quantity
    }))
  })
}
</script>

<template>
  <form
    class="order-form"
    @submit.prevent="submitOrder"
  >
    <div class="form-header">
      <div>
        <h2>Create order</h2>
        <p>Create a new customer order.</p>
      </div>
    </div>

    <div class="field">
      <label>Customer name</label>

      <input
        v-model="customerName"
        type="text"
        placeholder="Customer name"
      >
    </div>

    <div class="items">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="order-item"
      >
        <div class="field product-field">
          <label v-if="index === 0">
            Product
          </label>

          <select
            v-model.number="item.productId"
          >
            <option :value="null">
              Select product
            </option>

            <option
              v-for="product in products"
              :key="product.id"
              :value="product.id"
              :disabled="product.stock === 0"
            >
              {{ product.name }}
              — ${{ product.price }}
              — {{ product.stock }} in stock
            </option>
          </select>
        </div>

        <div class="field quantity-field">
          <label v-if="index === 0">
            Quantity
          </label>

          <input
            v-model.number="item.quantity"
            type="number"
            min="1"
            :max="getProductStock(item.productId) ?? undefined"
          >
        </div>

        <button
          class="remove-button"
          type="button"
          :disabled="items.length === 1"
          @click="removeItem(index)"
        >
          Remove
        </button>
      </div>
    </div>

    <button
      class="add-item-button"
      type="button"
      @click="addItem"
    >
      + Add another product
    </button>

    <div class="form-footer">
      <div class="total">
        <span>Estimated total</span>

        <strong>
          ${{ estimatedTotal }}
        </strong>
      </div>

      <button
        class="create-button"
        type="submit"
        :disabled="submitting"
      >
        {{ submitting ? 'Creating...' : 'Create order' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.order-form {
  padding: 24px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  margin-bottom: 32px;
}

.form-header {
  margin-bottom: 22px;
}

.form-header h2 {
  margin: 0;
  font-size: 18px;
}

.form-header p {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.field input,
.field select {
  height: 42px;

  padding: 0 12px;

  background: white;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  outline: none;
}

.field input:focus,
.field select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.items {
  margin-top: 20px;
}

.order-item {
  display: grid;
  grid-template-columns: 1fr 130px auto;
  align-items: end;
  gap: 12px;

  margin-bottom: 12px;
}

.remove-button {
  height: 42px;

  padding: 0 14px;

  border: none;
  border-radius: 8px;

  background: #fef2f2;
  color: #dc2626;

  cursor: pointer;
}

.remove-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.add-item-button {
  padding: 9px 13px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  background: white;
  color: #374151;

  cursor: pointer;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 24px;
  padding-top: 20px;

  border-top: 1px solid #e5e7eb;
}

.total span,
.total strong {
  display: block;
}

.total span {
  margin-bottom: 4px;

  color: #6b7280;
  font-size: 12px;
}

.total strong {
  font-size: 24px;
}

.create-button {
  height: 42px;

  padding: 0 20px;

  border: none;
  border-radius: 8px;

  background: #4f46e5;
  color: white;

  font-weight: 600;
  cursor: pointer;
}

.create-button:hover {
  background: #4338ca;
}

.create-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 750px) {
  .order-item {
    grid-template-columns: 1fr;
  }

  .form-footer {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }
}
</style>