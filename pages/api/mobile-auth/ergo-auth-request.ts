import { prisma } from '@server/prisma';
import { Address } from 'ergo-lib-wasm-nodejs';
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
  const { verificationId } = req.query;

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

  if (!user.nonce) {
    return res.status(422).json({ error: 'Signing message was not generated, please try again' });
  }

  const address = user.defaultAddress;

  if (!address) {
    return res.status(422).json({ error: 'User address not found' });
  }

  try {
    const replyTo = `${process.env.AUTH_DOMAIN}/api/mobile-auth/verify?verificationId=${verificationId}`;
    // console.log(address)
    const rawBytes = Address.from_mainnet_str(address).content_bytes()
    console.log(rawBytes)
    const indexedBytes = rawBytes.slice(1)
    const resultBytes = [205, ...indexedBytes];
    const base64String = Buffer.from(resultBytes).toString('base64');
    console.log(resultBytes)
    console.log(base64String)

    // decode address to bytes using base58
    // copy the range from index 1 to index length - 4
    // insert 205 at the beginning of the new array


    // use paideia API to get the sigmaBoolean because there is no way to do it without accessing the appkit
    // First API call
    const loginResponse = await fetch('https://api.paideia.im/auth/login/mobile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        addresses: [address],
      }),
    });

    const loginData = await loginResponse.json();

    // console.log(loginData)

    // Extract requestId from the first response
    const requestId = loginData.verificationId;

    // Second API call
    const signingRequestResponse = await fetch(`https://api.paideia.im/auth/signing_request/${requestId}`);
    const signingRequestData = await signingRequestResponse.json();

    // Extract sigmaBoolean from the second response
    const sigmaBoolean = signingRequestData.sigmaBoolean;

    console.log('address: ' + address)
    console.log('sigma boolean: ' + sigmaBoolean)

    const ergoAuthRequest: ErgoAuthRequest = {
      address,
      signingMessage: user.nonce,
      sigmaBoolean: sigmaBoolean,
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