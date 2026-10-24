import { z } from "zod";

const id = z.coerce.number().int().positive("id must be positive int");

const productFields = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  description: z.string().trim().max(1000).nullable().optional(),
  price: z.coerce.number().max(99_999_999.99).multipleOf(0.01),
  stock: z.coerce.number().int().positive("stock must be positive number"),
});

export const PoruductIdSchema = z.object({
  params: z.object({ id }),
});

export const createProductSchema = z.object({
  body: z.object({ productFields }),
});

export const updatedProductSchema = z.object({
  params: z.object({ id }),
  body: productFields
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "send at least one filed to update",
    ),
});

export const listProductSchema = z.object({
    query: z.
    object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        search: z.string().trim().min(1).optional(),
        minPrice: z.coerce.number().min(0).optional(),
        maxPrice: z.coerce.number().min(0).optional(),
        sortBy: z.enum(["createdAt", "price", "name", "stock"]).default("createdAt"),
        order: z.enum(["asc", "desc"]).default("desc"),
    })
    .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
        message: "Min price can not be greathere then max price",
        path: ['minPirce']
    })
})
