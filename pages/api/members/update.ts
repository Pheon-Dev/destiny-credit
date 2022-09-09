import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function register(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        id,
        maintained,
      } = req.body;

      await prisma.member.update({
        where: {
          id: `${id}`,
        },
        data: {
          maintained: maintained,
        },
      });

      console.log("Updated Successfully")
      res.status(200).json({ message: req.body });
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

export default register;
