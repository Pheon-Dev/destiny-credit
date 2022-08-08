import type { NextApiRequest, NextApiResponse } from "next";
const formidable = require("formidable");
import { createTransaction } from "../../lib/redis";

async function confirm(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = await createTransaction(req.body);
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: {id},
    });

    const data = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(req, function (err: any, fields: any, files: any) {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const body = JSON.stringify(data);
    console.log(body);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Something went wrong", error });
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};

export default confirm;
