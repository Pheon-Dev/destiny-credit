import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function create(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        guarantorId,
        memberId,
        tenure,
        principal,
        maintained,
        approved,
        disbursed,
        grace,
        installment,
        productId,
        payoff,
        penalty,
        processingFee,
        sundays,
        memberName,
        productName,
        interest,
      } = req.body;

      await prisma.loan.create({
        data: {
          guarantorId: guarantorId,
          memberId: memberId,
          tenure: tenure,
          principal: principal,
          maintained: maintained,
          approved: approved,
          disbursed: disbursed,
          grace: grace,
          installment: installment,
          productId: productId,
          payoff: payoff,
          penalty: penalty,
          processingFee: processingFee,
          sundays: sundays,
          memberName: memberName,
          productName: productName,
          interest: interest,
        },
      });

      console.log("Created Successfully");
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
