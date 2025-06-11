"use server"

import { revalidatePath } from "next/cache"
import { getClient } from "@/db/db"

export async function signUpAction(email: string, password: string, fullName = "") {
  const supabase = await getClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return "Please check your email to confirm your account."
}

export async function signInAction(email: string, password: string) {
  const supabase = await getClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
}

export async function signOutAction() {
  const supabase = await getClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
}

export async function getUser() {
  const supabase = await getClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
