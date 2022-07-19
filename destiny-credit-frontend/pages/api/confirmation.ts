import axios from "axios";
let c2b = require("mpesa-c2b");
import type { NextApiRequest, NextApiResponse } from "next";
import { routes } from "../../utils/routes";

const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
const PASS_KEY = process.env.NEXT_PUBLIC_PASS_KEY;
const BUSINESS_SHORT_CODE = process.env.NEXT_PUBLIC_PAY_BILL;

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

//   stk push
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function confReq() {
    try {
      const token = await getToken();
      const url =
        "https://safaricom.co.ke/mpesa_online/lnmo_checkout_server.php?wsdl";

      const data = {
        marchantID: BUSINESS_SHORT_CODE,
        passKey: PASS_KEY,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.request({
        method: "GET",
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

  confReq();
}
