import { prisma } from '@server/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  const deleteCount = await prisma.user.deleteMany({
    where: {
      status: 'pending',
      createdAt: {
        lte: tenMinutesAgo,
      },
    },
  })

  res.status(200).json({ deleted: deleteCount.count })
}
