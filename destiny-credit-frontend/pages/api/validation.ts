import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  async function validate() {
    try {

      // console.log(req.body);
      // console.log(req.data);
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  validate();
}
