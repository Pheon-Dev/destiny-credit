import type { NextApiRequest, NextApiResponse } from "next";
const formidable = require("formidable");
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Fields = {
  transactionType: string;
  transID: string;
  transTime: string;
  transAmount: string;
  businessShortCode: string;
  billRefNumber: string;
  invoiceNumber: string;
  orgAccountBalance: string;
  thirdPartyTransID: string;
  msisdn: string;
  firstName: string;
  middleName: string;
  lastName: string;
};
async function confirm(req: NextApiRequest, res: NextApiResponse) {
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
          msisdn: fields.Msisdn,
          firstName: fields.FirstName,
          middleName: fields.MiddleName,
          lastName: fields.LastName,
        });
      });
    });
    const body = JSON.stringify(data);

    console.log(body);

    console.log(result[0].transactionType);

    const supabaseAdmin = createClient(
      SUPABASE_URL || "",
      SUPABASE_SERVICE_ROLE_KEY || ""
    );
    await supabaseAdmin.from("transactions").insert([
      {
          transactionType: result[0].transactionType,
          transID: result[0].transID,
          transTime: result[0].transTime,
          transAmount: result[0].transAmount,
          businessShortCode: result[0].businessShortCode,
          billRefNumber: result[0].billRefNumber,
          invoiceNumber: result[0].invoiceNumber,
          orgAccountBalance: result[0].orgAccountBalance,
          thirdPartyTransID: result[0].thirdPartyTransID,
          msisdn: result[0].msisdn,
          firstName: result[0].firstName,
          middleName: result[0].middleName,
          lastName: result[0].lastName,
      },
    ]);
    // return data.then(({fields, files})=> {
    // res.status(200).json({ data: result });
    // })
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
