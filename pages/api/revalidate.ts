// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.secret !== REVALIDATE_SECRET) {
    return res.status(401).json({message: 'Invalid Token'});
  }
  async function revalidation() {
    try {
      await res.revalidate('/');
      await res.revalidate('/members/create-member');
      return res.json({ revalidated: true });
    } catch (error) {
      return res.status(500).send('Error Revlidating');
    }
  }
  revalidation();
}

