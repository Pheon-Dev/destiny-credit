import axios from "axios";
import { dateTime } from "../../../utils/dates";
import { routes } from "../../../utils/routes";

const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
const INITIATOR_PASSWORD = process.env.NEXT_PUBLIC_INITIATOR_PASSWORD;
const SECURITY_CREDENTIAL = process.env.NEXT_PUBLIC_SECURITY_CREDENTIAL;
const PASS_KEY = process.env.NEXT_PUBLIC_PASS_KEY;
const BUSINESS_SHORT_CODE = process.env.NEXT_PUBLIC_PAY_BILL;
const TILL_NUMBER = process.env.NEXT_PUBLIC_TILL_NUMBER;
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URL;
// const CALLBACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URI;

const TRANSACTION_TYPE = "CustomerPayBillOnline";
const ACCOUNT_REFERENCE = "Account Reference";
const TIMESTAMP = dateTime("now");

const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
  "base64"
);

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${auth}`,
};

const data = {
  BusinessShortCode: BUSINESS_SHORT_CODE,
  Password: Buffer.from(BUSINESS_SHORT_CODE! + PASS_KEY + TIMESTAMP).toString(
    "base64"
  ),
  TIMESTAMP,
  TransactionType: TRANSACTION_TYPE,
  Amount: 1,
  PartyA: PHONE_NUMBER,
  PartyB: BUSINESS_SHORT_CODE,
  PhoneNumber: PHONE_NUMBER,
  CallBackURL: CALLBACK_URL,
  AccountReference: ACCOUNT_REFERENCE,
  TransactionDesc: "Payment of X",
};

const sendReq = async () => {
  try {
    const res = await axios.request({
      method: "POST",
      url: routes.production + routes.stkpush,
      headers,
      data,
    });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const getToken = async () => {
  try {
    const res = await axios.request({
      method: "GET",
      url: routes.production + routes.stkquery,
      headers,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
