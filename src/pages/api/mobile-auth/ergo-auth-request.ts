import { ErgoAddress, ErgoTree } from '@fleet-sdk/core';
import { prisma } from '@server/prisma';
import { deleteEmptyUser } from '@server/utils/deleteEmptyUser';
import { NextApiRequest, NextApiResponse } from 'next';

interface ErgoAuthRequest {
  address: string;
  signingMessage: string;
  sigmaBoolean: string;
  userMessage: string;
  messageSeverity: "INFORMATION";
  replyTo: string;
}

export default async function ergoauthLoginMobile(req: NextApiRequest, res: NextApiResponse) {
  const { verificationId, address } = req.query;
  const addressString = address?.toString()

  // console.log('\x1b[32m', 'verificationID: ', '\x1b[0m', verificationId);
  // console.log('\x1b[32m', 'addressString: ', '\x1b[0m', addressString);

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
    if (user.status === 'pending') deleteEmptyUser(user.id)
    return res.status(422).json({ error: 'No address provided' });
  }

  if (!user.nonce) {
    if (user.status === 'pending') deleteEmptyUser(user.id)
    return res.status(422).json({ error: 'Signing message was not generated, please try again' });
  }

  try {
    const replyTo = `${process.env.AUTH_DOMAIN}/api/mobile-auth/verify?verificationId=${verificationId}`;

    const addr = ErgoAddress.fromBase58(addressString);
    const tree = new ErgoTree(addr.ergoTree);
    const treeBytes = Array.from(tree.toBytes());
    treeBytes.shift();
    treeBytes.shift();
    const sigmaBoolean = Buffer.from(treeBytes).toString("base64");

    const ergoAuthRequest: ErgoAuthRequest = {
      address: addressString,
      signingMessage: user.nonce,
      sigmaBoolean: sigmaBoolean,
      userMessage: 'Sign the message to sign in to Ergopad',
      messageSeverity: 'INFORMATION',
      replyTo,
    };
    // console.log('\x1b[32m', 'Ergo auth request: ', '\x1b[0m', ergoAuthRequest);
    res.status(200).json(ergoAuthRequest);
  } catch (e: any) {
    if (user.status === 'pending') deleteEmptyUser(user.id)
    res.status(500).json({ error: `ERR::login::${e.message}` });
  }
}