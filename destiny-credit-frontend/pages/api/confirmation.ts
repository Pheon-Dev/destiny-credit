import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("----------------- Confirmation ------------------");
  async function confirm() {
    try {
      console.log(req.body);
      console.log(req);
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "success",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  confirm();
}

//
// import express from "express";
// import bodyParser from "body-parser";
// const app = express();
// app.use(bodyParser.json())
//
// app.post('/', (req, res) => {
//   console.log('----------------- Confirmation ------------------')
//   console.log(req.body)
//       res.status(200).json({
//         "ResultCode": 0,
//         "ResultDesc": "success"
//       });
// })
