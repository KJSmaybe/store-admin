<script setup lang="ts">
import type { ProductInput } from '~/types/product'

const emit = defineEmits<{
  add: [product: ProductInput]
}>()

const name = ref('')
const price = ref(0)
const stock = ref(0)

function submitForm() {
  if (!name.value.trim()) {
    return
  }

  emit('add', {
    name: name.value.trim(),
    price: price.value,
    stock: stock.value
  })

  name.value = ''
  price.value = 0
  stock.value = 0
}
</script>

<template>
  <form
    class="product-form"
    @submit.prevent="submitForm"
  >
    <div class="form-field">
      <label>Product name</label>

      <input
        v-model="name"
        type="text"
        placeholder="MacBook Pro"
      >
    </div>

    <div class="form-field">
      <label>Price</label>

      <input
        v-model.number="price"
        type="number"
        min="0"
        placeholder="2499"
      >
    </div>

    <div class="form-field">
      <label>Stock</label>

      <input
        v-model.number="stock"
        type="number"
        min="0"
        placeholder="10"
      >
    </div>

    <button
      class="add-button"
      type="submit"
    >
      + Add product
    </button>
  </form>
</template>

<style scoped>
.product-form {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  align-items: end;
  gap: 16px;

  padding: 20px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-field input {
  height: 42px;

  padding: 0 12px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  outline: none;
}

.form-field input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.add-button {
  height: 42px;

  padding: 0 18px;

  border: none;
  border-radius: 8px;

  background: #4f46e5;
  color: white;

  cursor: pointer;
  font-weight: 600;
}

.add-button:hover {
  background: #4338ca;
}

@media (max-width: 900px) {
  .product-form {
    grid-template-columns: 1fr;
  }
}
</style>