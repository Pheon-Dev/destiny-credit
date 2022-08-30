import type { NextApiRequest, NextApiResponse } from "next";
/* import { supabase } from "../../lib/supabase"; */
import { PrismaClient } from "@prisma/client";

async function register(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        id
      } = req.body;

      const member = await prisma.members.findMany({
        where: {
          id: `${id}`
        },
      });
      res.status(200).json({ member: member });
      console.log(member)

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

export default register;
