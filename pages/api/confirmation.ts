import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import formidable from "formidable";
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

export default async function confirm(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function write({ data }: { data: Fields[] }) {
    const url_db = "https://destiny-credit.vercel.app/api/transaction";
    const headers_db = {
      "Content-Type": "application/json",
    };

    const body = {
      transactionType: data[0].transactionType,
      transID: data[0].transID,
      transTime: data[0].transTime,
      transAmount: data[0].transAmount,
      businessShortCode: data[0].businessShortCode,
      billRefNumber: data[0].billRefNumber,
      invoiceNumber: data[0].invoiceNumber,
      orgAccountBalance: data[0].orgAccountBalance,
      thirdPartyTransID: data[0].thirdPartyTransID,
      msisdn: data[0].msisdn,
      firstName: data[0].firstName,
      middleName: data[0].middleName,
      lastName: data[0].lastName,
    };

    const res_db = await axios.request({
      data: JSON.stringify(body),
      method: "POST",
      url: url_db,
      headers: headers_db,
    });

    console.log(res_db.data);

    const supabaseAdmin = createClient(
      SUPABASE_URL || "",
      SUPABASE_SERVICE_ROLE_KEY || ""
    );
    await supabaseAdmin.from("transactions").insert([
      {
        body,
      },
    ]);
  }

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
        write({ data: result });
      });
    });
    const body = JSON.stringify(data);

    console.log(body);

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
