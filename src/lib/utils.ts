import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type SignInFields = {
  email: string;
  password: string;
};

type SignUpFields = {
  confirmPassword: string;
  fullName: string;
} & SignInFields;

type Fields = SignInFields | SignUpFields;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateFields(fields: Fields) {
  const isEmpty = Object.values(fields).some((value) => !value.trim());

  let passwordsMatch = true;

  if ("confirmPassword" in fields) {
    passwordsMatch = fields.confirmPassword === fields.password;
  }

  return { isEmpty, passwordsMatch };
}
