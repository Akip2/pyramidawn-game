import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {RoleEnum} from "@/enums/role.enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function isRoleMummy(role: RoleEnum) {
  return role === RoleEnum.MUMMY;
}