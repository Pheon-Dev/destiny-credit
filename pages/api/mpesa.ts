import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { dateTime } from "../../utils/dates";
import { routes } from "../../utils/routes";
import { searchTransaction, createIndex } from "../../lib/redis";
import supabase from "../../lib/supabase";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;

const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY_TILL;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET_TILL;
const PASS_KEY = process.env.NEXT_PUBLIC_PASS_KEY_TILL;
const BUSINESS_SHORT_CODE = process.env.NEXT_PUBLIC_TILL_SHORT_CODE;

const TRANSACTION_TYPE = "CustomerBuyGoodsOnline";

// const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
// const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
// const PASS_KEY = process.env.NEXT_PUBLIC_PASS_KEY;
// const BUSINESS_SHORT_CODE = process.env.NEXT_PUBLIC_PAY_BILL;
// const TRANSACTION_TYPE = "CustomerPayBillOnline";

const VALIDATION_URL = process.env.NEXT_PUBLIC_VALIDATION_URL;
const CONFIRMATION_URL = process.env.NEXT_PUBLIC_CONFIRMATION_URL;

const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URL;
// const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URI;

const ACCOUNT_REFERENCE = "Account Reference";
const TIMESTAMP = dateTime();

// generate token
async function getToken() {
  const tokenUrl = routes.production + routes.oauth;

  const url = tokenUrl;
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64"
  );

  const headers = { Authorization: `Basic ${auth}` };

  const res = await axios.request({ method: "GET", url, headers });

  return res.data.access_token;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function c2bReg() {
    try {
      const token = await getToken();
      const url = routes.production + routes.c2bregister;

      const data = {
        ShortCode: Number(BUSINESS_SHORT_CODE),
        ConfirmationURL: `${CONFIRMATION_URL}`,
        ValidationURL: `${VALIDATION_URL}`,
        ResponseType: "Completed",
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.request({
        method: "POST",
        url,
        headers,
        data,
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  async function logs() {
    try {
      const token = LOGTAIL_API_TOKEN;
      // const url = "https://logtail.com/api/v1/query?";
      const date = new Date();
      const q_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      q_date.setDate(q_date.getDate() - 2)
      const new_date = q_date.getFullYear() + '-' + (Number(q_date.getMonth() + 1)).toString() + '-' + q_date.getDate();
      const url = `https://logtail.com/api/v1/query?query=transactionType&from=2022-08-20 12:00:00&source_ids=158744`;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.request({
        method: "GET",
        url,
        headers,
      });

      const data = response.data;
      // res.status(200).json({ data: data.data, message: "All Transactions!" });

      if (data.data.length > 0) {
        let counter: number = 0;
        while (counter < data.data.length) {
          console.log(counter);
          const data_res = data.data[counter]?.message
            .split("{")[2]
            .split("}")[0];

          let transactionType = data_res
            .split(",")[0]
            .split(":")[1]
            .split('"')[1];
          let transID = data_res.split(",")[1].split(":")[1].split('"')[1];
          let transTime = data_res.split(",")[2].split(":")[1].split('"')[1];
          let transAmount = data_res.split(",")[3].split(":")[1].split('"')[1];
          let businessShortCode = data_res
            .split(",")[4]
            .split(":")[1]
            .split('"')[1];
          let billRefNumber = data_res
            .split(",")[5]
            .split(":")[1]
            .split('"')[1];
          let invoiceNumber = data_res
            .split(",")[6]
            .split(":")[1]
            .split('"')[1];
          let orgAccountBalance = data_res
            .split(",")[7]
            .split(":")[1]
            .split('"')[1];
          let thirdPartyTransID = data_res
            .split(",")[8]
            .split(":")[1]
            .split('"')[1];
          let msisdn = data_res.split(",")[9].split(":")[1].split('"')[1];
          let firstName = data_res.split(",")[10].split(":")[1].split('"')[1];
          let middleName = data_res.split(",")[11].split(":")[1].split('"')[1];
          let lastName = data_res.split(",")[12].split(":")[1].split('"')[1];

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

          await createIndex();
          let q = transTime;
          const transaction = await searchTransaction(q);

          if (transaction.length > 0) {
            counter++;
            res
              .status(200)
              .json({ data: body, message: "Transaction Exists!", date: new_date });
          }

          const url_db = "https://destiny-credit.vercel.app/api/transaction";
          const headers_db = {
            "Content-Type": "application/json",
          };

          const res_db = await axios.request({
            data: JSON.stringify(body),
            method: "POST",
            url: url_db,
            headers: headers_db,
          });

          console.log(res_db.data);

          await supabase.from("transactions").insert([ body ]);

          counter++;
          res.status(200).json({ data: body, message: "Transaction Created!" });
        }
      }
       res
        .status(200)
        .json({ data: data.data, message: "No New Transactions!", date: new_date });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }
  logs();
  // c2bReg();
}
