import { z } from "zod";


const email = z.string().trim().toLowerCase().pipe(z.email("Invalid email address"));


const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");


export const registerSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2, "Name Must be atleast 2 character").max(50),
        email,
        password
    })
})


export const loginSchema = z.object({
    body: z.object({
        email,
        password
    })
})