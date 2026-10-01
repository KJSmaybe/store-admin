import type { ProductInput } from '~/types/product'

import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const body =
    await readBody<ProductInput>(event)

  if (!body.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product name is required'
    })
  }

  return await prisma.product.create({
    data: {
      name: body.name.trim(),
      price: body.price,
      stock: body.stock
    }
  })
})