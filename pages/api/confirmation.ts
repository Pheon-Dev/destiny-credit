import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const formidable = require("formidable");
const ObjectId = require("mongodb").ObjectId;
const { connect } = require("../../lib/mongodb");
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
        async function write() {
          console.log(fields.TransactionType);
          let { db }: any = await connect();

          await db.collection("transactions").insertOne(req.body);

          const url = "https://destiny-credit.vercel.app/api/transaction";
          const headers = {
            "Content-Type": "application/json",
          };

          const body_data = {
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
          const supabaseAdmin = createClient(
            SUPABASE_URL || "",
            SUPABASE_SERVICE_ROLE_KEY || ""
          );
          await supabaseAdmin.from("transactions").insert([
            {
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
            },
          ]);

          const results = await axios.request({
            data: JSON.stringify(body_data),
            method: "POST",
            url: url,
            headers: headers,
          });
          console.log("Results :", results);
          console.log("Data :", body_data);
        }
        write();
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
