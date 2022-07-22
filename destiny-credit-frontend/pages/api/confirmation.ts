import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { dateTime } from "../../utils/dates";
import { routes } from "../../utils/routes";

const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
const INITIATOR_PASSWORD = process.env.NEXT_PUBLIC_INITIATOR_PASSWORD;
const SECURITY_CREDENTIAL = process.env.NEXT_PUBLIC_SECURITY_CREDENTIAL;
const PASS_KEY = process.env.NEXT_PUBLIC_PASS_KEY;
const BUSINESS_SHORT_CODE = process.env.NEXT_PUBLIC_PAY_BILL;
const TILL_NUMBER = process.env.NEXT_PUBLIC_TILL_NUMBER;
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;

const VALIDATION_URL = process.env.NEXT_PUBLIC_VALIDATION_URL;
const CONFIRMATION_URL = process.env.NEXT_PUBLIC_CONFIRMATION_URL;

// const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URL;
const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URI;

const TRANSACTION_TYPE = "CustomerPayBillOnline";
const ACCOUNT_REFERENCE = "Account Reference";
const TIMESTAMP = dateTime();

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

  async function confirm() {
    try {
      // const { PhoneNumber, Amount, BusinessShortCode, BillRef } = req.body;
      // const data = {
      //   ShortCode: BusinessShortCode,
      //   Amount: Amount,
      //   Msisdn: PhoneNumber,
      //   CommandID: TRANSACTION_TYPE,
      //   BillRefNumber: `${BillRef}`,
      // };
      // const token = await getToken();
      // const url = routes.production + routes.c2bsimulate;
      //
      // const headers = {
      //   "Content-Type": "application/json",
      //   Authorization: `Bearer ${token}`,
      // };
      //
      // const response = await axios.request({
      //   method: "POST",
      //   url,
      //   headers,
      //   // data,
      // });
      //
      // res.status(200).json(response.data);

      console.log(req.body);
      // console.log(req.data);
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  confirm();
}
