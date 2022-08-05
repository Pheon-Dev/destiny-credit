import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const fs = require("fs");
const micro = require("micro");
const formidable = require("formidable");
const moment = require("moment");
const { connect } = require("../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;
import { client } from "../../utils/client";

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

    const contents = await fs.promises.readFile(filename, "utf-8");
    console.log(contents);

    return contents;
  } catch (err) {
    console.log(err);
    return "Something went wrong";
  }
}

async function file_get_contents(uri: string, callback?: any) {
  let resp = await fetch(uri, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  let data = await resp.json();

  return callback ? callback(data) : data;
}

async function confirm(req: NextApiRequest, res: NextApiResponse) {
  async function confirmation() {
    try {
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }
  confirmation();

  const data = await new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, function (err: any, fields: any, files: any) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const body = JSON.stringify(data);
  console.log(body);

      syncWriteFile(
        "./lib/confirmation.json",
        JSON.stringify(body, undefined, 2)
      );
  // let datalog = body;
  // const handleSave = () => {
  //   // setDataset(data);
  //   if (datalog) {
  //     const doc = {
  //       _type: "mpesaPayments",
  //       datalog,
  //     };
  //     client.create(doc).then(() => {
  //       console.log(doc);
  //     });
  //   } else {
  //     console.log("Data Empty");
  //   }
  // };
  //
  // handleSave();
}
export const config = {
  api: {
    bodyParser: false,
  },
};

// export default micro(confirm);
export default confirm;
