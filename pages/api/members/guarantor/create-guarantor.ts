import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function create(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        id,
        guarantorName,
        guarantorPhone,
        guarantorRelationship,
        guarantorId,
        memberId,
      } = req.body;

      await prisma.guarantor.create({
        data: {
          id: id,
          guarantorName: guarantorName,
          guarantorPhone: guarantorPhone,
          guarantorRelationship: guarantorRelationship,
          guarantorId: guarantorId,
          memberId: memberId,
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
