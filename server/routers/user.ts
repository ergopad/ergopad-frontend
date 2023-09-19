import { verifySignature } from '@pages/api/auth/[...nextauth]';
import { prisma } from '@server/prisma';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { generateNonceForUser } from '../utils/nonce';

// const isErgoMainnetAddress = (value: string): boolean => {
//   const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
//   return value.startsWith('9') &&
//     value.length === 51 &&
//     [...value].every(char => base58Chars.includes(char));
// };

export const userRouter = createTRPCRouter({
  getNonce: publicProcedure
    .input(z.object({
      userAddress: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { userAddress } = input;

      if (!userAddress) {
        return { nonce: null }; // Return a default value or error if the input is not defined
      }

      const nonce = await generateNonceForUser(userAddress);

      return { nonce };
    }),
  checkAddressAvailable: publicProcedure
    .input(z.object({
      address: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { address } = input;

      if (!address) {
        return { status: "error", message: "Address not provided" };
      }

      const walletAddressToCheck = address;

      const [userWithAddress, walletWithChangeAddress, walletWithAddressInArrays] = await prisma.$transaction([
        prisma.user.findUnique({
          where: {
            defaultAddress: walletAddressToCheck
          },
          select: { id: true }
        }),
        prisma.wallet.findUnique({
          where: {
            changeAddress: walletAddressToCheck
          },
          select: { id: true }
        }),
        prisma.wallet.findFirst({
          where: {
            OR: [
              { unusedAddresses: { has: walletAddressToCheck } },
              { usedAddresses: { has: walletAddressToCheck } }
            ]
          },
          select: { id: true }
        })
      ]);

      if (userWithAddress) {
        return { status: "unavailable", message: "Address is in use as a defaultAddress" };
      }

      if (walletWithChangeAddress) {
        return { status: "unavailable", message: "Address is in use as a changeAddress" };
      }

      if (walletWithAddressInArrays) {
        return { status: "unavailable", message: "Address is in use in either unusedAddresses or usedAddresses" };
      }

      return { status: "available", message: "Address is not in use" };
    }),
  addAddress: protectedProcedure
    .input(z.object({
      nonce: z.string(),
      address: z.string(),
      signature: z.object({
        signedMessage: z.string(),
        proof: z.string()
      }),
      wallet: z.object({
        type: z.string(),
        defaultAddress: z.string(),
        usedAddresses: z.string().array().optional(),
        unusedAddresses: z.string().array().optional()
      })
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id
      const { address, nonce, signature, wallet } = input
      const { type, defaultAddress, usedAddresses, unusedAddresses } = wallet
      // TODO: verify that nonce is in the signed message
      // verify that signedMessage includes the correct source URL
      const verified = verifySignature(address, signature.signedMessage, signature.proof, wallet.type)
      if (verified) {
        const user = await prisma.user.findUnique({
          where: {
            id: userId
          }
        });

        if (!user) {
          throw new Error("User not found in database");
        }

        // Construct update data
        const updateData: {
          wallets: any,
          defaultAddress?: string
        } = {
          wallets: {
            create: {
              type,
              changeAddress: address,
              usedAddresses,
              unusedAddresses
            }
          }
        };

        // If the user does not have a default address, then set it.
        if (!user.defaultAddress) {
          updateData.defaultAddress = address;
        }

        try {
          return await prisma.user.update({
            where: {
              id: userId
            },
            data: updateData
          });
        } catch (prismaError) {
          console.error("Prisma error:", prismaError);
          throw new Error("Failed to update user and create wallet.");
        }
      }
      throw new Error("User not updated in db");
    }),
  initAddWallet: protectedProcedure
    .input(z.object({
      address: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id
      const verificationId = nanoid();
      const nonce = nanoid();

      const existingLoginRequests = await prisma.loginRequest.findMany({
        where: { user_id: userId },
      });

      for (const request of existingLoginRequests) {
        await prisma.loginRequest.delete({ where: { id: request.id } });
      }

      await prisma.loginRequest.create({
        data: {
          user_id: userId,
          verificationId: verificationId as string,
          message: nonce,
          status: 'PENDING',
        },
      });

      return { verificationId, nonce };
    }),
  getWallets: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          wallets: true,
        },
      })
      return user
    }),
  changeDefaultAddress: protectedProcedure
    .input(z.object({
      newDefault: z.string(),
      walletId: z.number()
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id
      const { newDefault, walletId } = input

      const wallet = await prisma.wallet.update({
        where: {
          id: walletId,
          user_id: userId
        },
        data: {
          changeAddress: newDefault
        }
      });

      if (!wallet) {
        throw new Error("Wallet does not match user");
      }

      return { success: true }
    }),
  removeWallet: protectedProcedure
    .input(z.object({
      walletId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id
      const walletId = input.walletId

      // Attempt to delete the wallet that belongs to the user
      const deleteResponse = await prisma.wallet.deleteMany({
        where: {
          id: walletId,
          user_id: userId
        }
      });

      // Check if any wallet was deleted
      if (deleteResponse.count === 0) {
        throw new Error("Wallet not found or doesn't belong to the user");
      }

      return { success: true }; // Return a success response or any other relevant data
    }),
});