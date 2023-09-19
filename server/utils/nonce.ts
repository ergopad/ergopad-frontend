import { prisma } from '@server/prisma';
import { nanoid } from 'nanoid';

export async function generateNonceForUser(userAddress: string) {
  // Check if a user with the given address already exists
  let user = await prisma.user.findUnique({
    where: { defaultAddress: userAddress },
  });

  // If the user doesn't exist, create a new user model in the database
  if (!user) {
    user = await prisma.user.create({
      data: {
        defaultAddress: userAddress,
      },
    });
  }

  const nonce = nanoid();

  // Update the user's nonce in the database
  await prisma.user.update({
    where: { id: user.id },
    data: { nonce },
  });

  return nonce;
}