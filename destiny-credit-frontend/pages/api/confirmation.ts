import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const fs = require("fs");
const fileGetContents = require("file-get-contents");
const moment = require("moment");
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
  async function file_get_contents(uri: string, callback: any) {
    let resp = await fetch(uri), ret = await resp.text();

    return callback ? callback(ret) : ret;
  }

  file_get_contents("https://destiny-credit.vercel.app/api/confirmation", console.log);
  // file_get_contents("https://destiny-credit.vercel.app/api/confirmation").then(ret => console.log(ret));

// function file_get_contents(uri, callback) {
//     fetch(uri).then(res => res.text()).then(text => callback(text));
// }

  async function confirm() {
    try {
      // console.log(req.body);
      // asyncWriteFile(
      // syncWriteFile(
      //   "./pages/api/confirmation.json",
      //   JSON.stringify(req.body, null, 4)
      // );

      // const confirmationReq  = {
      //   transactionType: req.body.TransactionType,
      //   action: "confirmation",
      //   phone: req.body.MSISDN,
      //   firstName: req.body.FirstName,
      //   middleName: req.body.MiddleName,
      //   lastName: req.body.LastName,
      //   OrgAccountBalance: req.body.OrgAccountBalance,
      //   amount: req.body.TransAmount,
      //   accountNumber: req.body.BillRefNumber,
      //   transID: req.body.TransID,
      //   time: req.body.TransTime,
      // }
      // res.status(200).json(confirmationReq);
      //
      // console.log(JSON.stringify(confirmationReq));

  const data = fileGetContents("https://destiny-credit.vercel.app/api/confirmation");
    console.log(data)
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
        data: JSON.parse(data),
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  confirm();
}
