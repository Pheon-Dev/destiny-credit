// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { searchTransaction } from "../../lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q;
  const transaction = await searchTransaction();
  res.status(200).send({ transaction });
}
