import { env } from "../config/env.js";

const errorResponse = (description) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
});

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
  description: "Product ID",
};

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "EduRamp API",
    version: "1.0.0",
    description:
      "Auth and product endpoints. Call **POST /api/auth/login**, copy `data.accessToken`, then click **Authorize** and paste it to call protected endpoints.",
  },
  servers: [{ url: `http://localhost:${env.PORT}` }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Products" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Rajesh" },
          email: { type: "string", format: "email", example: "rajesh@example.com" },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Registered Successfully" },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
              accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
            },
          },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 50, example: "Rajesh" },
          email: { type: "string", format: "email", example: "rajesh@example.com" },
          password: {
            type: "string",
            minLength: 8,
            description: "Min 8 chars with an uppercase, a lowercase, a number and a special character",
            example: "Secret@123",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "rajesh@example.com" },
          password: { type: "string", example: "Secret@123" },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "price", "stock"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 120, example: "Wireless Mouse" },
          description: { type: "string", maxLength: 1000, nullable: true, example: "2.4GHz, USB receiver" },
          price: { type: "number", maximum: 99999999.99, multipleOf: 0.01, example: 499.99 },
          stock: { type: "integer", minimum: 1, example: 25 },
        },
      },
      ProductUpdateInput: {
        type: "object",
        minProperties: 1,
        description: "Send at least one field",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 120 },
          description: { type: "string", maxLength: 1000, nullable: true },
          price: { type: "number", maximum: 99999999.99, multipleOf: 0.01 },
          stock: { type: "integer", minimum: 1 },
        },
        example: { price: 449.0 },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Wireless Mouse" },
          description: { type: "string", nullable: true, example: "2.4GHz, USB receiver" },
          price: { type: "string", description: "Decimal(10,2), serialized as a string", example: "499.99" },
          stock: { type: "integer", example: 25 },
          ownerId: { type: "integer", example: 1 },
          owner: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "Rajesh" },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Product created" },
          data: { $ref: "#/components/schemas/Product" },
        },
      },
      ProductListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "array", items: { $ref: "#/components/schemas/Product" } },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              total: { type: "integer", example: 42 },
              totalPages: { type: "integer", example: 5 },
            },
          },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Product deleted" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                in: { type: "string", example: "body" },
                message: { type: "string", example: "Invalid email address" },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Server is up",
            content: {
              "application/json": {
                example: { success: true, status: "ok", time: "2026-10-26T12:56:14.209Z" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } },
        },
        responses: {
          201: {
            description: "User created; returns the user and an access token",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
          },
          400: errorResponse("Validation failed"),
          409: errorResponse("Email already exists"),
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and get an access token",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } },
        },
        responses: {
          200: {
            description: "Logged in",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
          },
          400: errorResponse("Validation failed"),
          401: errorResponse("Invalid email or password"),
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
          { name: "search", in: "query", schema: { type: "string", minLength: 1 } },
          { name: "minPrice", in: "query", schema: { type: "number", minimum: 0 } },
          { name: "maxPrice", in: "query", schema: { type: "number", minimum: 0 } },
          {
            name: "sortBy",
            in: "query",
            schema: { type: "string", enum: ["createdAt", "price", "name", "stock"], default: "createdAt" },
          },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        description: "`search` matches name or description (case-insensitive). Price filters are inclusive.",
        responses: {
          200: {
            description: "Paginated list of products",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ProductListResponse" } } },
          },
          400: errorResponse("Validation failed (e.g. minPrice greater than maxPrice)"),
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } } },
        },
        responses: {
          201: {
            description: "Product created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ProductResponse" } } },
          },
          400: errorResponse("Validation failed"),
          401: errorResponse("Missing, invalid or expired token"),
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a product by ID",
        parameters: [idParam],
        responses: {
          200: {
            description: "The product",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ProductResponse" } } },
          },
          400: errorResponse("Invalid id"),
          404: errorResponse("Product not found"),
        },
      },
      patch: {
        tags: ["Products"],
        summary: "Update a product",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductUpdateInput" } } },
        },
        description: "Only the product's owner or an ADMIN can update it.",
        responses: {
          200: {
            description: "Product updated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ProductResponse" } } },
          },
          400: errorResponse("Validation failed"),
          401: errorResponse("Missing, invalid or expired token"),
          403: errorResponse("Not the owner of this product"),
          404: errorResponse("Product not found"),
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete a product",
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        description: "Only the product's owner or an ADMIN can delete it.",
        responses: {
          200: {
            description: "Product deleted",
            content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } },
          },
          400: errorResponse("Invalid id"),
          401: errorResponse("Missing, invalid or expired token"),
          403: errorResponse("Not the owner of this product"),
          404: errorResponse("Product not found"),
        },
      },
    },
  },
};
