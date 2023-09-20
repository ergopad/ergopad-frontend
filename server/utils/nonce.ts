import { prisma } from '@server/prisma';
import { nanoid } from 'nanoid';
import { checkAddressAvailability, getUserIdByAddress } from './checkAddress';

export async function generateNonceForLogin(userAddress: string) {
  let user = await prisma.user.findUnique({
    where: { defaultAddress: userAddress },
  });

  if (!user) {
    const userId = await getUserIdByAddress(userAddress);
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    }
    else {
      user = await prisma.user.create({
        data: {
          defaultAddress: userAddress,
        },
      });
    }
  }

  if (!user) {
    throw new Error('Unable to create new user')
  }

  const nonce = nanoid();

  // Update the user's nonce in the database
  await prisma.user.update({
    where: { id: user.id },
    data: { nonce },
  });

  return { nonce, userId: user.id };
}

export async function generateNonceForAddWallet(userAddress: string) {
  // Check if a user with the given address already exists
  let user = await prisma.user.findUnique({
    where: { defaultAddress: userAddress },
  });

  // If the user doesn't exist, create a new user model in the database
  if (!user) {
    const addressAvailability = await checkAddressAvailability(userAddress);

    console.log(addressAvailability)

    if (addressAvailability?.status === 'available') {
      user = await prisma.user.create({
        data: {
          defaultAddress: userAddress,
        },
      });
    }
    else return null
  }

  const nonce = nanoid();

  // Update the user's nonce in the database
  await prisma.user.update({
    where: { id: user.id },
    data: { nonce },
  });

  return nonce;
}