import type { NextApiRequest, NextApiResponse } from "next";
const formidable = require("formidable");
import { log, withAxiom } from "next-axiom";

async function confirm(req: NextApiRequest, res: NextApiResponse) {
    try {
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }

  const data = await new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, function (err: any, fields: any, files: any) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const body = JSON.stringify(data);
  console.log(body);

}
export const config = {
  api: {
    bodyParser: false,
  },
};

export default withAxiom(confirm);
