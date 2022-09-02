import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function product(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        id
      } = req.body;

      const product = await prisma.product.findMany({
        where: {
          id: `${id}`
        },
      });
      res.status(200).json({ product: product });

      return {
        props: { product }
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

export default product;
