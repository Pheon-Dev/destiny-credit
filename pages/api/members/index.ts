import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function members(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const members = await prisma.member.findMany();

      res.status(200).json({ members: members });

      return {
        props: { members },
      };

    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export default members;
