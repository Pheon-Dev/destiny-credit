import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const formidable = require("formidable");

async function confirm(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });

    const url = "https://destiny-credit.vercel.app/api/test";
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

    const body_data = {
      transactionTest: body,
      // transID: body?.fields.TransID,
      // transTime: body?.fields.TransTime,
      // transAmount: body?.fields.TransAmount,
      // businessShortCode: body?.fields.BusinessShortCode,
      // billRefNumber: body?.fields.BillRefNumber,
      // invoiceNumber: body?.fields.InvoiceNumber,
      // orgAccountBalance: body?.fields.OrgAccountBalance,
      // thirdPartyTransID: body?.fields.ThirdPartyTransID,
      // msisdn: body?.fields.Msisdn,
      // firstName: body?.fields.FirstName,
      // middleName: body?.fields.MiddleName,
      // lastName: body?.fields.LastName,
    };

    const results = await axios.request({
      data: body_data,
      method: "POST",
      url: url,
      headers: headers,
    });
    console.log(results);
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
