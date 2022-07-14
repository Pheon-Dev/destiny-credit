import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { dateTime } from "../../../utils/dates";
import { routes } from "../../../utils/routes";

const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;

const BUSINESS_SHORT_CODE = process.env.NEXT_PUBLIC_PAY_BILL;
const PASS_KEY = process.env.NEXT_PUBLIC_INITIATOR_PASSWORD;
const TRANSACTION_TYPE = "CustomerPayBillOnline";
const ACCOUNT_REFERENCE = "Test";
const CALL_BACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URL;
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const TIME_STAMP = dateTime();

const tokenUrl = routes.sandbox + routes.oauth;
const stkUrl = routes.sandbox + routes.stkpush;

async function getToken() {
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
  switch (req.method) {
    case "GET":
      try {
        // const { PhoneNumber, Amount } = req.body;
        const token = await getToken();
        const url = stkUrl;

        const data = {
          BusinessShortCode: BUSINESS_SHORT_CODE,
          Password: Buffer.from(
            `${BUSINESS_SHORT_CODE}${PASS_KEY}${TIME_STAMP}`
          ).toString("base64"),
          TimeStamp: TIME_STAMP,
          TransactionType: TRANSACTION_TYPE,
          Amount: 100,
          PartyA: PHONE_NUMBER,
          PartyB: BUSINESS_SHORT_CODE,
          PhoneNumber: PHONE_NUMBER,
          CallBackURL: CALL_BACK_URL,
          AccountReference: ACCOUNT_REFERENCE,
          TransactionDesc: "Test",
        };

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.request({
        method: 'GET',
        url,
        headers,
        data,
        });

        res.status(200).json(response.data);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error :', error });
      }
      break;

      default:
        res.status(405).json({ message: `${req.method} method not allowed!`});
      break;
  }
}
