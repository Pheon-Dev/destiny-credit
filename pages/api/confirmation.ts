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
        console.log(fields.TransactionType);
        async function writeData() {
            const url = "https://destiny-credit.vercel.app/api/transaction";
            const headers = {
              "Content-Type": "application/json",
            };

            let transactionType = fields.TransactionType;
            let transID = fields.TransID;
            let transTime = fields.TransTime;
            let transAmount = fields.TransAmount;
            let businessShortCode = fields.BusinessShortCode;
            let billRefNumber = fields.BillRefNumber;
            let invoiceNumber = fields.InvoiceNumber;
            let orgAccountBalance = fields.OrgAccountBalance;
            let thirdPartyTransID = fields.ThirdPartyTransID;
            let msisdn = fields.Msisdn;
            let firstName = fields.FirstName;
            let middleName = fields.MiddleName;
            let lastName = fields.LastName;

            const body = {
              transactionType: transactionType,
              transID: transID,
              transTime: transTime,
              transAmount: transAmount,
              businessShortCode: businessShortCode,
              billRefNumber: billRefNumber,
              invoiceNumber: invoiceNumber,
              orgAccountBalance: orgAccountBalance,
              thirdPartyTransID: thirdPartyTransID,
              msisdn: msisdn,
              firstName: firstName,
              middleName: middleName,
              lastName: lastName,
            };

            const results = await axios.request({
              data: JSON.stringify(body),
              method: "POST",
              url: url,
              headers: headers,
            });
            console.log(results);
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
