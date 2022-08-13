import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const formidable = require("formidable");

async function confirm(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });

    const url = "https://destiny-credit.vercel.app/api/transaction";
    const headers = {
      "Content-Type": "application/json",
    };

    const data = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(req, function (err: any, fields: any, files: any) {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    const body = JSON.stringify(data);

    console.log(body);

    if (req.body?.TransTime) {
      const body_data = {
        transactionType: req.body?.TransactionType,
        transID: req.body?.TransID,
        transTime: req.body?.TransTime,
        transAmount: req.body?.TransAmount,
        businessShortCode: req.body?.BusinessShortCode,
        billRefNumber: req.body?.BillRefNumber,
        invoiceNumber: req.body?.InvoiceNumber,
        orgAccountBalance: req.body?.OrgAccountBalance,
        thirdPartyTransID: req.body?.ThirdPartyTransID,
        msisdn: req.body?.Msisdn,
        firstName: req.body?.FirstName,
        middleName: req.body?.MiddleName,
        lastName: req.body?.LastName,
      };

      const results = await axios.request({
        data: JSON.stringify(body_data),
        method: "POST",
        url: url,
        headers: headers,
      });
      console.log("Results :", results);
      console.log("Data :", body_data);
    }
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
