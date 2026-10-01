import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined")
}

const adapter = new PrismaPg({
  connectionString
})

const prisma = new PrismaClient({
  adapter
})

const products = [
  { name: "MacBook Air M4", price: 1199, stock: 12 },
  { name: "MacBook Pro M4", price: 1999, stock: 6 },
  { name: "iPhone 17 Pro", price: 1099, stock: 15 },
  { name: "iPhone 17", price: 799, stock: 20 },
  { name: "iPad Pro", price: 1299, stock: 4 },
  { name: "iPad Air", price: 699, stock: 8 },
  { name: "AirPods Pro", price: 249, stock: 3 },
  { name: "AirPods Max", price: 549, stock: 0 },
  { name: "Apple Watch Ultra", price: 799, stock: 2 },
  { name: "Apple Watch Series 11", price: 429, stock: 9 },
  { name: "Samsung Galaxy S26", price: 999, stock: 14 },
  { name: "Samsung Galaxy Tab S11", price: 899, stock: 5 },
  { name: "Dell XPS 14", price: 1599, stock: 7 },
  { name: "Lenovo ThinkPad X1", price: 1799, stock: 1 },
  { name: "ASUS ROG Zephyrus", price: 2199, stock: 4 },
  { name: "Logitech MX Master", price: 99, stock: 18 },
  { name: "Keychron K8 Pro", price: 129, stock: 10 },
  { name: "Sony WH-1000XM6", price: 449, stock: 0 },
  { name: "LG UltraGear 27", price: 599, stock: 3 },
  { name: "Samsung Odyssey G8", price: 899, stock: 6 },
  { name: "Webcam 4K Pro", price: 149, stock: 11 },
  { name: "USB-C Hub", price: 79, stock: 25 },
  { name: "Mechanical Keyboard Pro", price: 159, stock: 5 },
  { name: "Portable SSD 2TB", price: 199, stock: 2 },
  { name: "Gaming Mouse Wireless", price: 89, stock: 16 }
]

async function main() {
  const productCount = await prisma.product.count()

  if (productCount > 0) {
    console.log(
      `Seed skipped: database already contains ${productCount} products`
    )
    return
  }

  const result = await prisma.product.createMany({
    data: products
  })

  console.log(
    `Seed complete: created ${result.count} products`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })    