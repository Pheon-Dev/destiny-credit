import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { PrismaClient } from "@prisma/client";

async function members(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      /* const members = await prisma.members.findMany(); */
/* 0729991003 */
const members = await prisma.members.update({
        where: {
          id: "d3db2051-2b19-4207-8bef-a59074043d47"
        },
        data: {
          phoneNumber: "0729991003"
        }
      });
      res.status(200).json({ members: members })
      return {
        props : { members }
      }
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

