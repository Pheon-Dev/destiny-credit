import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const formidable = require("formidable");

async function confirm(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });

    const data = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(req, function (err: any, fields: any, files: any) {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const url = "https://destiny-credit.vercel.app/api/test";
    const headers = {
      "Content-Type": "application/json",
    };
    console.log("--------")
    console.log(data)
    console.log("--------")
    const body_data = {
      transactionTest: data,
    };
    const results = await axios.request({
      data: JSON.stringify(body_data),
      method: "POST",
      url: url,
      headers: headers,
    });

    console.log(results);
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
