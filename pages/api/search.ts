// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { searchTransaction, createIndex } from "../../lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createIndex();
  const q = req.query.q;
  const transaction = await searchTransaction(q);
  res.status(200).send({ transaction });
}
