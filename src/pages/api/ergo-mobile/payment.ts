import { prisma } from '@server/prisma';
import { getUnsignedTransaction } from '@server/utils/ergoClient';
import type { NextApiRequest, NextApiResponse } from 'next';

// model KeyValuePair {
//   key       String   @id
//   value     String
//   createdAt DateTime @default(now()) @map("created_at")
//   updatedAt DateTime @updatedAt @map("updated_at")

//   @@map("key_value_pair")
// }

const deleteExpiredKeyPairs = async () => {
  const now = new Date();
  try {
    const result = await prisma.keyValuePair.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    console.log(`Deleted ${result.count} expired key-value pairs.`);
    return "Successfully completed cleanup function. "
  } catch (error) {
    console.error("Error deleting expired key-value pairs:", error);
    throw new Error("Failed to delete expired key-value pairs.");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { verificationId, address } = req.query;

  if (!verificationId || typeof verificationId !== 'string' ||
    !address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Missing verification ID or Address' });
  }

  try {
    const transaction = await prisma.keyValuePair.findFirst({
      where: {
        key: verificationId
      }
    })

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction data not found.",
        message: "Transaction data not found for the provided verification ID."
      });
    }

    const txObject = JSON.parse(transaction.value)

    console.log(txObject)

    const tx = await getUnsignedTransaction(address, txObject.recipientAddress, JSON.parse(txObject.payment))

    console.log(tx)

    if (!tx) {
      return res.status(500).json({
        error: "Unable to build transaction.",
        message: "The server could not build this transaction due to an unknown error. "
      });
    }

    const updateKv = await prisma.keyValuePair.update({
      where: {
        key: verificationId
      },
      data: {
        value: JSON.stringify({ txId: tx.id, address })
      }
    })

    if (!updateKv) {
      return res.status(502).json({
        error: "Unable to complete transaction.",
        message: "The server encountered an issue connecting to an internal service. "
      });
    }

    const del = await deleteExpiredKeyPairs();

    if (!del) {
      return res.status(500).json({
        error: "Server cleanup function failed.",
        message: "The server encountered an issue connecting to an internal service. "
      });
    }

    return res.status(200).json({
      message: "Sign the transaction to complete your Crux request. ",
      reducedTx: tx.rawReducedTx,
      address: address
    });
  } catch (error: unknown) {
    // Initialize default error message
    let errorMessage = 'An unexpected error occurred';
    let errorStack = '';

    // Check if error is an instance of Error
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || '';
      console.error('Error:', errorMessage, 'Stack:', errorStack);
    } else {
      // Handle non-Error types gracefully
      errorMessage = 'Unexpected error: ' + error;
      console.error(errorMessage);
    }

    // Respond with error message and optionally include the stack in development mode
    res.status(500).json({
      error: 'Internal server error',
      details: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: errorStack }) // Include stack trace only in development environment
    });
  }
}