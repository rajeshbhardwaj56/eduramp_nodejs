import { success } from "zod";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const ownerSelect = { owner: { select: { id: true, name: true } } };

<<<<<<< HEAD
// only the owner of a product (or an admin) can change it
async function findOwnedProduct(id, user) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw ApiError.notFound("Product not found");
=======
async function findOwnedProductOrThrow(id, userId) {
  const existedProduct = await prisma.product.findUnique({ where: { id } });

  if (!existedProduct) {
    throw ApiError.notFound("Product not available");
  }

  if (existedProduct.ownerId !== userId) {
    throw ApiError.conflict("you can not modify this");
  }
}

export async function listProducts(req, res) {
  const { page, limit, search, minPrice, maxPrice, sortBy, order } = req.validated.query;

  const where = {};
  if(search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' }},
      { description: { contains: search, mode: 'insensitive' }},
    ]
  }
  

  if(minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if(minPrice !== undefined) where.price.gte = minPrice
    if(maxPrice !== undefined) where.price.lte = maxPrice 
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
    meta: { page, limit, totalPages: Math.ceil(total/limit)}
  })

}

export async function getProduct(req, res) {
  try {
    const { id } = req.validated.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { owner: { select: { id: true, name: true } } },
    });

    console.log(product.ownerId);

    
    res.json({ success: true, data: product });
  } catch (error) {
    throw ApiError.conflict(error.message);
  }
}

export async function createProduct(req, res) {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.validated.body,
        ownerId: req.user.id,
      },
      include: { owner: { select: { id: true, name: true } } },
    });

    res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    throw ApiError.conflict(error.message);
>>>>>>> 776ca92d261e9776119635c3ea95ffbcd19fd012
  }

  if (product.ownerId !== user.id && user.role !== "ADMIN") {
    throw ApiError.forbidden("You can only modify your own products");
  }

  return product;
}

<<<<<<< HEAD
export async function listProducts(req, res) {
  const { page, limit, search, minPrice, maxPrice, sortBy, order } = req.validated.query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: ownerSelect,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getProduct(req, res) {
  const product = await prisma.product.findUnique({
    where: { id: req.validated.params.id },
    include: ownerSelect,
  });

  if (!product) {
    throw ApiError.notFound("Product not found");
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
  await findOwnedProduct(id, req.user);

  const product = await prisma.product.update({
    where: { id },
    data: req.validated.body,
    include: ownerSelect,
  });

  res.json({ success: true, message: "Product updated", data: product });
}

export async function deleteProduct(req, res) {
  const { id } = req.validated.params;
  await findOwnedProduct(id, req.user);

  await prisma.product.delete({ where: { id } });

  res.json({ success: true, message: "Product deleted" });
=======
export async function updateProduct(req, res) {
  try {
    const { id } = req.validated.params;

    await findOwnedProductOrThrow(id, req.user.id);

    const product = await prisma.product.update({
      where: { id },
      data: req.validated.body,
      include: { owner: { select: { id: true, name: true } } },
    });

    res.json({
      success: true,
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    throw ApiError.conflict(error.message);
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.validated.params;

    await findOwnedProductOrThrow(id, req.user.id);

    await prisma.product.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    throw ApiError.conflict(error.message);
  }
>>>>>>> 776ca92d261e9776119635c3ea95ffbcd19fd012
}
