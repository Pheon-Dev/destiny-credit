import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function loan(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        id,
        disbursed
      } = req.body;

      const loan = await prisma.loan.findMany({
        where: {
          id: `${id}`
        },
      });
      if (disbursed) {
      await prisma.loan.update({
        where: {
          id: `${id}`,
        },
        data: {
          disbursed: disbursed,
        },
      });
      }

      res.status(200).json({ loan: loan });

      return {
        props: { loan }
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

export default loan;


