import { prisma } from '@server/prisma';
import bs58 from 'bs58';
import { NextApiRequest, NextApiResponse } from 'next';

interface ErgoAuthRequest {
  address: string;
  signingMessage: string;
  sigmaBoolean: string;
  userMessage: string;
  messageSeverity: "INFORMATION";
  replyTo: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { verificationId, address } = req.query;
  const addressString = address?.toString()

  // Fetch the login request using the verificationId
  const loginRequest = await prisma.loginRequest.findUnique({
    where: { verificationId: verificationId as string },
  });

  if (!loginRequest) {
    return res.status(422).json({ error: 'Invalid login request' });
  }

  const user = await prisma.user.findUnique({
    where: { id: loginRequest.user_id },
  });

  if (!user) {
    return res.status(422).json({ error: 'User not found' });
  }

  if (!addressString) {
    return res.status(422).json({ error: 'Address missing' });
  }

  try {
    const replyTo = `${process.env.AUTH_DOMAIN}/api/mobile-auth/verify?verificationId=${verificationId}`;

    const decodedBuffer = bs58.decode(addressString);
    const rawBytes = Uint8Array.from(decodedBuffer);
    const slicedBytes = rawBytes.subarray(2, rawBytes.length - 4);
    const combinedBytes = new Uint8Array([0xCD, 0x03, ...slicedBytes]);
    const sigmaBoolean = Buffer.from(combinedBytes).toString('base64');
    // console.log('\x1b[32m', 'Base64 Encoded', '\x1b[0m', sigmaBoolean);

    const ergoAuthRequest: ErgoAuthRequest = {
      address: addressString,
      signingMessage: loginRequest.message,
      sigmaBoolean,
      userMessage: 'Sign the message to sign in to Ergopad',
      messageSeverity: 'INFORMATION',
      replyTo,
    };
    // console.log(ergoAuthRequest)
    res.status(200).json(ergoAuthRequest);
  } catch (e: any) {
    res.status(500).json({ error: `ERR::login::${e.message}` });
  }
}