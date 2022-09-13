import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function products(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const products = await prisma.product.findMany();

      res.status(200).json({ products: products });

      return {
        props: { products },
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

export default products;
