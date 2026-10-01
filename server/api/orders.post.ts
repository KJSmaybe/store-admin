import type { CreateOrderInput } from '~/types/order'
import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/require-auth'


export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody<CreateOrderInput>(event)

  const customerName = body.customerName?.trim()

  if (!customerName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer name is required'
    })
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order must contain at least one product'
    })
  }

  /*
   * Объединяем одинаковые товары.
   *
   * Например:
   *
   * productId: 1, quantity: 2
   * productId: 1, quantity: 3
   *
   * превратятся в:
   *
   * productId: 1, quantity: 5
   */
  const quantities = new Map<number, number>()

  for (const item of body.items) {
    const productId = Number(item.productId)
    const quantity = Number(item.quantity)

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid order item'
      })
    }

    quantities.set(
      productId,
      (quantities.get(productId) ?? 0) + quantity
    )
  }

  const normalizedItems = Array.from(
    quantities.entries()
  ).map(([productId, quantity]) => ({
    productId,
    quantity
  }))

  return await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: {
          in: normalizedItems.map(
            (item) => item.productId
          )
        }
      }
    })

    if (products.length !== normalizedItems.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'One or more products were not found'
      })
    }

    const productsById = new Map(
      products.map((product) => [
        product.id,
        product
      ])
    )

    let total = 0

    const orderItems = normalizedItems.map((item) => {
      const product = productsById.get(item.productId)

      if (!product) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found'
        })
      }

      if (product.stock < item.quantity) {
        throw createError({
          statusCode: 409,
          statusMessage:
            `Not enough stock for ${product.name}`
        })
      }

      total += product.price * item.quantity

      return {
        productId: product.id,
        quantity: item.quantity,

        // Сохраняем цену на момент заказа.
        price: product.price
      }
    })

    /*
     * Уменьшаем остаток товара.
     *
     * stock >= quantity проверяем ещё раз непосредственно
     * в UPDATE. Это защищает от ситуации, когда одновременно
     * оформляются два заказа.
     */
    for (const item of normalizedItems) {
      const result = await tx.product.updateMany({
        where: {
          id: item.productId,

          stock: {
            gte: item.quantity
          }
        },

        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })

      if (result.count !== 1) {
        const product = productsById.get(item.productId)

        throw createError({
          statusCode: 409,
          statusMessage:
            `Not enough stock for ${product?.name ?? 'product'}`
        })
      }
    }

    return await tx.order.create({
      data: {
        customerName,
        total,

        items: {
          create: orderItems
        }
      },

      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
  })
})