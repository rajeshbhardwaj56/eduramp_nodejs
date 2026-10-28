import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const ownerSelect = { owner: { select: { id: true, name: true } } };

// Express 5 forwards errors thrown in async handlers to the error handler,
// so no try/catch is needed here — ApiErrors keep their own status code (404, 403, ...)

async function findOwnedProductOrThrow(id, user) {
  const existedProduct = await prisma.product.findUnique({ where: { id } });

  if (!existedProduct) {
    throw ApiError.notFound("Product not available");
  }

  if (existedProduct.ownerId !== user.id && user.role !== "ADMIN") {
    throw ApiError.forbidden("you can not modify this");
  }
}

export async function listProducts(req, res) {
  const { page, limit, search, minPrice, maxPrice, sortBy, order, ownerId } = req.validated.query;

  const where = {};
  if(search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' }},
      { description: { contains: search, mode: 'insensitive' }},
      { ownerId: { equals: ownerId }}
    ]
  }

  if(minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if(minPrice !== undefined) where.price.gte = minPrice
    if(maxPrice !== undefined) where.price.lte = maxPrice
  }
if(ownerId !== undefined) {
    where.ownerId = ownerId;
  }
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: ownerSelect,
      orderBy: { [sortBy]: order},
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.product.count({ where })
  ])

  res.json({
    success: true,
    data: products,
    meta: { page, limit, total, totalPages: Math.ceil(total/limit)}
  })
}

export async function getProduct(req, res) {
  const { id } = req.validated.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: ownerSelect,
  });

  if (!product) {
    throw ApiError.notFound("Product not available");
  }

  res.json({ success: true, data: product });
}

export async function createProduct(req, res) {
  const product = await prisma.product.create({
    data: {
      ...req.validated.body,
      ownerId: req.user.id,
    },
    include: ownerSelect,
  });

  res.status(201).json({
    success: true,
    message: "Product created",
    data: product,
  });
}

export async function updateProduct(req, res) {
  const { id } = req.validated.params;

  await findOwnedProductOrThrow(id, req.user);

  const product = await prisma.product.update({
    where: { id },
    data: req.validated.body,
    include: ownerSelect,
  });

  res.json({
    success: true,
    message: "Product updated",
    data: product,
  });
}

export async function deleteProduct(req, res) {
  const { id } = req.validated.params;

  await findOwnedProductOrThrow(id, req.user);

  await prisma.product.delete({ where: { id } });

  res.status(204).send();
}
