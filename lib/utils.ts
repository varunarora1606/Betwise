import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


type RequestFunction<T> = (token: string) => Promise<T>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}