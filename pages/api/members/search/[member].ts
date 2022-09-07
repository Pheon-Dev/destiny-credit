import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function member(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        firstName,
        lastName
      } = req.body;

      const member = await prisma.member.findMany({
        where: {
          firstName: `${firstName}`,
          lastName: `${lastName}`
        },
      });
      res.status(200).json({ member: member });

      return {
        props: { member }
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

export default member;

