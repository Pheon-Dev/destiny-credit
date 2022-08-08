import type { NextApiRequest, NextApiResponse } from "next";
import { createTransaction } from "../../lib/redis";

async function transaction(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = await createTransaction(req.body);
    res.status(200).json({ id });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Something went wrong", error });
  }
}

export default transaction;

