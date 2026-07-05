import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { absoluteUrl } from '@/lib/utils';

export const GET = async () => {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.redirect(absoluteUrl('/sign-in'));
	}

	const [existingUser] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.clerkId, userId));

	if (!existingUser) {
		return NextResponse.redirect(absoluteUrl('/sign-in'));
	}

	return NextResponse.redirect(absoluteUrl(`/users/${existingUser.id}`));
};
