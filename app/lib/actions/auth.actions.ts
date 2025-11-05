// app/lib/actions/auth.actions.ts
"use server";

import connectDB from "../db";
import User from "@/app/models/user.model";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {  handlers} from "../auth";
// import { AuthError } from "next-auth";

// --- Validation Schemas ---
const SignUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- SIGN UP ACTION ---
export async function signUpAction(formData: FormData) {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      username: formData.get("username") as string,
    };

    const validated = SignUpSchema.parse(data);

    await connectDB();

    const existingUser = await User.findOne({
      $or: [
        { email: validated.email.toLowerCase() },
        { username: validated.username },
      ],
    });

    if (existingUser) {
      return {
        error:
          existingUser.email === validated.email.toLowerCase()
            ? "Email already exists"
            : "Username already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    await User.create({
      email: validated.email.toLowerCase(),
      password: hashedPassword,
      username: validated.username,
    });

    return { success: true };
  } catch (error) {
    // if (error instanceof z.ZodError) {
    //   return { error: error.errors[0].message };
    // }
    console.error("Sign up error:", error);
    throw error;
  }
}
















// --- SIGN IN ACTION (Corrected) ---
export async function signInAction(formData: FormData) {
  try {
    // ✅ Validate fields before passing to NextAuth
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    SignInSchema.parse(data);

    
    // ✅ Call NextAuth’s built-in signIn for server-side (v5 syntax)
    // Pass formData directly (credentials are read automatically)
    // await signIn("credentials", formData, { redirectTo: "/" });

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);

    // if (error instanceof z.ZodError) {
    //   return { error: error.errors[0].message };
    // }

    // if (error instanceof AuthError) {
    //   if (error.type === "CredentialsSignin") {
    //     return { error: "Invalid email or password" };
    //   }
    //   return { error: "Authentication error" };
    // }

    throw error;
  }
}

// --- SIGN OUT ACTION (Server-side) ---
export async function signOutAction() {
  // await signOut({ redirectTo: "/login" });
}
