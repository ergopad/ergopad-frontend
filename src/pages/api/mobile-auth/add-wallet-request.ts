import { ErgoAddress, ErgoTree } from '@fleet-sdk/core'
import { prisma } from '@server/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

interface ErgoAuthRequest {
  address: string
  signingMessage: string
  sigmaBoolean: string
  userMessage: string
  messageSeverity: 'INFORMATION'
  replyTo: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { verificationId, address } = req.query
  const addressString = address?.toString()

  // Fetch the login request using the verificationId
  const loginRequest = await prisma.loginRequest.findUnique({
    where: { verificationId: verificationId as string },
  })

  if (!loginRequest) {
    return res.status(422).json({ error: 'Invalid login request' })
  }

  const user = await prisma.user.findUnique({
    where: { id: loginRequest.userId },
  })

  if (!user) {
    return res.status(422).json({ error: 'User not found' })
  }

  if (!addressString) {
    return res.status(422).json({ error: 'Address missing' })
  }

  try {
    const replyTo = `${process.env.AUTH_DOMAIN}/api/mobile-auth/verify?verificationId=${verificationId}`

    const addr = ErgoAddress.fromBase58(addressString)
    const tree = new ErgoTree(addr.ergoTree)
    const treeBytes = Array.from(tree.toBytes())
    treeBytes.shift()
    treeBytes.shift()
    const sigmaBoolean = Buffer.from(treeBytes).toString('base64')

    const ergoAuthRequest: ErgoAuthRequest = {
      address: addressString,
      signingMessage: loginRequest.message,
      sigmaBoolean,
      userMessage: 'Sign the message to sign in to Ergopad',
      messageSeverity: 'INFORMATION',
      replyTo,
    }
    // console.log(ergoAuthRequest)
    res.status(200).json(ergoAuthRequest)
  } catch (e: any) {
    res.status(500).json({ error: `ERR::login::${e.message}` })
  }
}
