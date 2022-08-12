import type { NextApiRequest, NextApiResponse } from "next";
import { createTest } from "../../lib/redis";

async function test(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = await createTest(req.body);
    res.status(200).json({ id });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Something went wrong", error });
  }
}

export default test;


