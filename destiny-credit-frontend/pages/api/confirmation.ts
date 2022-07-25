import type { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");
const { connect } = require('../../lib/mongodb');
const ObjectId = require("mongodb").ObjectId;

function syncWriteFile(filename: string, data: any) {
  fs.writeFileSync(filename, data, {
    flag: "a+",
  });

  const contents = fs.readFileSync(filename, "utf-8");
  console.log(contents);

  return contents;
}

async function asyncWriteFile(filename: string, data: any) {
  try {
    await fs.promises.writeFile(
      fs.writeFileSync(filename, data, {
        flag: "a+", // flag: "w",
      })
    );

    const contents = await fs.promises.readFile(
      filename,
      "utf-8"
    );
    console.log(contents);

    return contents;
  } catch (err) {
    console.log(err);
    return "Something went wrong";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // switch (req.method) {
  //   case 'POST': {
  //     // return addPayments(req, res);
  //     return console.log(req, res);
  //   }
  // }
  async function confirm() {
    try {
      // console.log(req.body);
      // asyncWriteFile(
      // syncWriteFile(
      //   "./pages/api/confirmation.json",
      //   JSON.stringify(req.body, null, 4)
      // );
      // console.log(req.data);
      // res.status(200).json({
      //   ResultCode: 0,
      //   ResultDesc: "Accepted",
      // });
      res.status(200).json(res);
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  confirm();
}
