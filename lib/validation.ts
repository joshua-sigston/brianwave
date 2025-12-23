import {z} from "zod";

export const signUpSchema = z.object({
    email: z.email(),  // let Zod handle default validation
    password: z.string().min(8, "Password must be at least 8 characters.").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters.").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
    
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters.").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
})

export type LoginSchema = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
    email: z.email(),
})

export type RequestPasswordResetSchema = z.infer<typeof requestPasswordResetSchema>;

export const newPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters.").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters.").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
})

export type NoteSchema = z.infer<typeof noteSchema>;