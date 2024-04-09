import { type ClassValue, clsx } from 'clsx'
import { Metadata } from 'next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (str: string | undefined) => {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
};


export function formatUniversitySlug({ name }: any) {
  const capitalized = name.split('-').map((word: string) => capitalizeFirstLetter(word)).join(' ');
  return capitalized.replace(/-/g, '');
}

