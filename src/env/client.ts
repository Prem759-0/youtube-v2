import { z } from 'zod';

const clientEnvSchema = z.object({
	NEXT_PUBLIC_APP_BASE_URL: z.string().url().optional(),
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().trim().min(1).optional(),
	NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().trim().min(1).regex(/^\//).optional(),
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().trim().min(1).regex(/^\//).optional(),
	NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().trim().min(1).regex(/^\//).optional(),
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().trim().min(1).regex(/^\//).optional(),
	NEXT_PUBLIC_MUX_IMAGE_BASE_URL: z.string().url().optional(),
	NEXT_PUBLIC_MUX_STREAM_BASE_URL: z.string().url().optional(),
}).partial();

const parsedEnv = clientEnvSchema.safeParse({
	NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
		process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
	NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
		process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
	NEXT_PUBLIC_MUX_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_MUX_IMAGE_BASE_URL,
	NEXT_PUBLIC_MUX_STREAM_BASE_URL: process.env.NEXT_PUBLIC_MUX_STREAM_BASE_URL,
});

if (!parsedEnv.success) {
	console.error('❌ Invalid client environment variables:', parsedEnv.error.format());
	throw new Error('❌ Invalid client environment variables');
}

export const env = parsedEnv.data;
