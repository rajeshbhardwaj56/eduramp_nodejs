import { prisma } from "../lib/prisma.js";

const ownerSelect = { owner: { select: { id: true, name: true } } };

export async function listProducts(req, res) {}

export async function getProduct(req, res) {}

export async function createProduct(req, res) {
  try {
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
  } catch (error) {
    throw ApiError.conflict(error.message)
  }
}

export async function updateProduct(req, res) {}

export async function deleteProduct(req, res) {}
