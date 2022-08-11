import { listTransactions, createIndex } from "../../lib/redis";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createIndex();
  const transactions = await listTransactions();

  res.status(200).json({ transactions })
}
