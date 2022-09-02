import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function create(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        productId,
        productName,
        minimumRange,
        maximumRange,
        interestRate,
        frequency,
        maximumTenure,
        repaymentCycle,
        processingFee,
        gracePeriod,
        penaltyRate,
        penaltyCharge,
        penaltyPayment,
        approved,
      } = req.body;

      await prisma.products.create({
        data: {
          productId: productId,
          productName: productName,
          minimumRange: minimumRange,
          maximumRange: maximumRange,
          interestRate: interestRate,
          frequency: frequency,
          maximumTenure: maximumTenure,
          repaymentCycle: repaymentCycle,
          processingFee: processingFee,
          gracePeriod: gracePeriod,
          penaltyRate: penaltyRate,
          penaltyCharge: penaltyCharge,
          penaltyPayment: penaltyPayment,
          approved: approved,
        },
      });

      console.log("Created Successfully")
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

export default create;
