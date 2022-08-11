// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {createIndex} from "../../lib/redis"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createIndex();
  res.status(200).send("OK")
}

