import axios from "axios";
import { dateTime } from "../../../utils/dates";
import { routes } from "../../../utils/routes";

const BUSINESS_SHORT_CODE = process.env.NEXT_PUBLIC_PAY_BILL;
const PASS_KEY = process.env.NEXT_PUBLIC_SECURITY_CREDENTIAL;
const TRANSACTION_TYPE = "CustomerPayBillOnline";
const ACCOUNT_REFERENCE = "Test";
const CALL_BACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URI;
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const TIME_STAMP = dateTime("now");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.PASS_KEY}`,
};

const TimeStamp = dateTime("now");
const shortCode = process.env.BUSINESS_SHORT_CODE;

const data = {
  BusinessShortcode: shortCode,
  Password: Buffer.from(shortCode! + process.env.PASS_KEY + TimeStamp).toString(
    "base64"
  ),
  TimeStamp,
  TransactionType: TRANSACTION_TYPE,
  Amount: 10,
  PartyA: PHONE_NUMBER,
  PartyB: BUSINESS_SHORT_CODE,
  PhoneNumber: PHONE_NUMBER,
  CallBackURL: CALL_BACK_URL,
  AccountReference: ACCOUNT_REFERENCE,
  TransactionDesc: "Test",
};

const sendReq = async () => {
  try {
    const res = await axios.request({
      method: 'POST',
      url: routes.sandbox,
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
      method: 'GET',
      url: routes.sandbox,
      headers,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
