import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch the verification status from your database or cache
    // This is the status that the webhook updates
    // For this example, let's assume a mock status
    const status = 'GREEN'; // This should be fetched from your data store

    res.status(200).json({ status });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}