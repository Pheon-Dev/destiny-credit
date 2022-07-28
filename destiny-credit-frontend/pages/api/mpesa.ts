import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { dateTime } from "../../utils/dates";
import { routes } from "../../utils/routes";
const fs = require("fs");

function syncWriteFile(filename: string, data: any) {
  fs.writeFileSync(filename, data, {
    flag: "a+",
  });

  const contents = fs.readFileSync(filename, "utf-8");
  console.log(contents);

  return contents;
}

async function asyncWriteFile(filename: string, data: any) {
  try {
    await fs.promises.writeFile(
      fs.writeFileSync(filename, data, {
        flag: "a+", // flag: "w",
      })
    );

    const contents = await fs.promises.readFile(
      filename,
      "utf-8"
    );
    console.log(contents);

    return contents;
  } catch (err) {
    console.log(err);
    return "Something went wrong";
  }
}


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

const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URL;
// const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URI;

const TRANSACTION_TYPE = "CustomerPayBillOnline";
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

async function file_get_contents(uri: string, callback?: any) {
  let resp = await fetch(uri, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  let data = await resp.json();

  return callback ? callback(data) : data;
}

//   stk push
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function lipaNM() {
    try {
      const { PhoneNumber, Amount, BusinessShortCode } = req.body;
      const token = await getToken();
      const url = routes.production + routes.stkpush;

      const data = {
        BusinessShortCode: BusinessShortCode,
        Password: Buffer.from(
          `${BUSINESS_SHORT_CODE}${PASS_KEY}${TIMESTAMP}`
        ).toString("base64"),
        Timestamp: TIMESTAMP,
        TransactionType: TRANSACTION_TYPE,
        Amount,
        PartyA: PhoneNumber,
        PartyB: BUSINESS_SHORT_CODE,
        PhoneNumber,
        CallBackURL: CALLBACK_URL,
        AccountReference: ACCOUNT_REFERENCE,
        TransactionDesc: "Payment of loan services",
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

  async function c2bSim() {
    try {
      const { PhoneNumber, Amount, BusinessShortCode, BillRef } = req.body;
      const token = await getToken();
      const url = routes.production + routes.c2bsimulate;

      const data = {
        ShortCode: BusinessShortCode,
        Amount: Amount,
        Msisdn: PhoneNumber,
        CommandID: TRANSACTION_TYPE,
        BillRefNumber: `${BillRef}`,
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
      // syncWriteFile(
      // // asyncWriteFile(
      //   "./pages/api/simulation.json",
      //   JSON.stringify(response.data, null, 4)
      // );
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  async function c2bQry() {
    try {
      const token = await getToken();
      const url = routes.production + routes.stkquery;

      const data = {
        BusinessShortCode: Number(BUSINESS_SHORT_CODE),
        Password: Buffer.from(
          `${BUSINESS_SHORT_CODE}${PASS_KEY}${TIMESTAMP}`
        ).toString("base64"),
        Timestamp: TIMESTAMP,
        CheckoutRequestID: "ws_CO_22072022083144984768858280",
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

  async function confirm() {
    try {
      const data = file_get_contents(
        "https://destiny-credit.vercel.app/api/confirmation"
      );
      // syncWriteFile(
      //   "./pages/api/confirmation.json",
      //   JSON.stringify(data, undefined, 2)
      // );
      // const token = await getToken();
      // const url = "https://destiny-credit.vercel.app/api/confirmation";
      //
      // const data = {
      //   BusinessShortCode: Number(BUSINESS_SHORT_CODE),
      //   Password: Buffer.from(
      //     `${BUSINESS_SHORT_CODE}${PASS_KEY}${TIMESTAMP}`
      //   ).toString("base64"),
      // };
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
      // });

      res.status(200).json(data);
      
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }

  confirm()
  // c2bReg();
  // c2bSim();
  // lipaNM();
  // c2bQry();
}

