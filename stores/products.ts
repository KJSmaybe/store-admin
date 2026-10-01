import type { Product, ProductInput } from '~/types/product'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const totalProducts = computed(() => {
    return products.value.length
  })

  const totalStock = computed(() => {
    return products.value.reduce(
      (sum, product) => sum + product.stock,
      0
    )
  })

  const outOfStockProducts = computed(() => {
    return products.value.filter(
      (product) => product.stock === 0
    ).length
  })

  const inventoryValue = computed(() => {
    return products.value.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    )
  })

  async function fetchProducts() {
    pending.value = true
    error.value = null

    try {
      products.value = await $fetch<Product[]>('/api/products')
    } catch (err) {
      console.error(err)
      error.value = 'Failed to load products'
    } finally {
      pending.value = false
    }
  }

  async function addProduct(productData: ProductInput) {
    const product = await $fetch<Product>('/api/products', {
      method: 'POST',
      body: productData
    })

    products.value.push(product)
  }

  async function updateProduct(updatedProduct: Product) {
    const product = await $fetch<Product>(
      `/api/products/${updatedProduct.id}`,
      {
        method: 'PUT',
        body: {
          name: updatedProduct.name,
          price: updatedProduct.price,
          stock: updatedProduct.stock
        }
      }
    )

    const index = products.value.findIndex(
      (item) => item.id === product.id
    )

    if (index !== -1) {
      products.value[index] = product
    }
  }

  async function deleteProduct(id: number) {
    await $fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })

    products.value = products.value.filter(
      (product) => product.id !== id
    )
  }

  return {
    products,
    pending,
    error,

    totalProducts,
    totalStock,
    outOfStockProducts,
    inventoryValue,

    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
})