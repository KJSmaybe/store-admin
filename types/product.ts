export interface Product {
  id: number
  name: string
  price: number
  stock: number
}
export type ProductInput = Omit<Product, 'id'>