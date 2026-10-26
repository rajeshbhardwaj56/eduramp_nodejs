import { success } from "zod";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const ownerSelect = { owner: { select: { id: true, name: true } } };

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
    
}

export async function getProduct(req, res) {
  try {
    const { id } = req.validated.params;

    const product = await prisma.product.findUnique({ where: { id }, include: ownerSelect });

    res.json({ success: true, data: product})
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
  }
}

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
}
