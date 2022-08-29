import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { PrismaClient } from "@prisma/client";

async function members(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const members = await prisma.members.findMany();
      res.status(200).json({ members: members })
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }
  main()
}

export default members;

