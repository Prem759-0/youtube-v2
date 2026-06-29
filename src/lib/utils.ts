import { env } from "@/env/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}



export const absoluteUrl = (path: string): string => {
	const formattedPath = path.trim();
	if (formattedPath.startsWith('http')) return formattedPath;

	let baseUrl = env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

	// Note: Don't use env from @/server/env here.
	const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
	const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

	if (!!vercelEnv && vercelEnv === 'preview' && !!vercelUrl) baseUrl = `https://${vercelUrl}`;

	return `${baseUrl}${formattedPath.startsWith('/') ? '' : '/'}${formattedPath}`;
};

export const getSecureCookieName = (cookieName: string) => {
	const baseUrl = absoluteUrl('');
	const isSecure = baseUrl.startsWith('https://');

	return isSecure ? `__Secure-${cookieName}` : cookieName;
};

export const formatDuration = (duration: number) => {
  const totalSeconds = Math.floor(duration / 1000)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

export const snakeCaseToTitle = (str: string) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) =>
    char.toUpperCase()
  )
}