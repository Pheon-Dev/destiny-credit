import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const fs = require("fs");
const moment = require("moment");
const { connect } = require("../../lib/mongodb");
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  async function confirm() {
    try {
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });

      console.log(req.body)
      // const data = file_get_contents(
      //   "https://destiny-credit.vercel.app/api/confirmation"
      // );
      // syncWriteFile(
      //   "./lib/confirmation.json",
      //   JSON.stringify(req.body, undefined, 2)
      // );

    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  confirm();
}
