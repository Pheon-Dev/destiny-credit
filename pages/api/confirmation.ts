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
        async function writeData() {
          if (fields?.TransactionType === "Pay Bill") {
            const url = "https://destiny-credit.vercel.app/api/transaction";
            const headers = {
              "Content-Type": "application/json",
            };

            const body = {
              transactionType: fields?.TransactionType,
              transID: fields?.TransID,
              transTime: fields?.TransTime,
              transAmount: fields?.TransAmount,
              businessShortCode: fields?.BusinessShortCode,
              billRefNumber: fields?.BillRefNumber,
              invoiceNumber: fields?.InvoiceNumber,
              orgAccountBalance: fields?.OrgAccountBalance,
              thirdPartyTransID: fields?.ThirdPartyTransID,
              msisdn: fields?.Msisdn,
              firstName: fields?.FirstName,
              middleName: fields?.MiddleName,
              lastName: fields?.LastName,
            };
            const results = await axios.request({
              data: JSON.stringify(body),
              method: "POST",
              url: url,
              headers: headers,
            });
            console.log(results);
          }
          if (fields?.ResultDesc === "Accepted") {
            const url = "https://destiny-credit.vercel.app/api/test";
            const headers = {
              "Content-Type": "application/json",
            };

            const body = {
              transactionTest: fields?.ResultDesc,
            };
            const results = await axios.request({
              data: JSON.stringify(body),
              method: "POST",
              url: url,
              headers: headers,
            });
            console.log(results);
          }
        }
        writeData();
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
