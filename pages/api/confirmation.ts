import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { Fields } from "../../types";

export default async function confirm(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
    let result: Array<Fields> = [];

    const data = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(req, function (err: any, fields: any, files: any) {
        if (err) return reject(err);
        resolve({ fields, files });
        // res.json({ files, fields });
        result.push({
          transactionType: fields.TransactionType,
          transID: fields.TransID,
          transTime: fields.TransTime,
          transAmount: fields.TransAmount,
          businessShortCode: fields.BusinessShortCode,
          billRefNumber: fields.BillRefNumber,
          invoiceNumber: fields.InvoiceNumber,
          orgAccountBalance: fields.OrgAccountBalance,
          thirdPartyTransID: fields.ThirdPartyTransID,
          msisdn: fields.MSISDN,
          firstName: fields.FirstName,
          middleName: fields.MiddleName,
          lastName: fields.LastName,
        });
        console.log(result);
      });
    });
    /* const body = JSON.stringify(data); */
    // console.log(body);
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
