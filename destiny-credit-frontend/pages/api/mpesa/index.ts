import type { NextApiRequest, NextApiResponse } from "next";
import { Mpesa } from "mpesa-api";

const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
const INITIATOR_PASSWORD = process.env.NEXT_PUBLIC_INITIATOR_PASSWORD;
const SECURITY_CREDENTIAL = process.env.NEXT_PUBLIC_SECURITY_CREDENTIAL;
const PASS_KEY = process.env.NEXT_PUBLIC_PASS_KEY;
const PAY_BILL = process.env.NEXT_PUBLIC_PAY_BILL;
const TILL_NUMBER = process.env.NEXT_PUBLIC_TILL_NUMBER;
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const CALL_BACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URL;

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const credentials = {
    clientKey: `${CONSUMER_KEY}`,
    clientSecret: `${CONSUMER_SECRET}`,
    initiatorPassword: `${SECURITY_CREDENTIAL}`,
    // securityCredential: `${SECURITY_CREDENTIAL}`,
    // certificatePath: null,
  };

  // const environment = "sandbox";
  const environment = "production";

  const mpesa = new Mpesa(credentials, environment);
  // const mpesa = new MpesaApi(credentials, environment);

  // mpesa
  //   .lipaNaMpesaQuery({
  //     BusinessShortCode: Number(PAY_BILL),
  //     CheckoutRequestID: "Checkout Request ID",
  //     passKey: `${CONSUMER_KEY}`,
  //   })
  //   .then((response) => {
  //     console.log(response);
  //     res.status(200).json({ name: `${JSON.stringify(response, null, 2)}` });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(400).json({ name: `${JSON.stringify(error, null, 2)}` });
  //   });

  mpesa
    .lipaNaMpesaOnline({
      BusinessShortCode: Number(PAY_BILL),
      passKey: `${PASS_KEY}`,
      TransactionDesc: "Transaction Desc",
      TransactionType: "CustomerPayBillOnline",
      PartyA: `${PHONE_NUMBER}`,
      PartyB: `${PAY_BILL}`,
      Amount: 1000,
      PhoneNumber: `${PHONE_NUMBER}`,
      CallBackURL: `${CALL_BACK_URL}`,
      AccountReference: "Account Reference",
    })
    .then((response) => {
      console.log(response);
      res
        .status(200)
        .json({ name: `${JSON.stringify(response, undefined, 2)}` });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ name: `${JSON.stringify(error, undefined, 2)}` });
    });

  // mpesa
  //   .c2bSimulate({
  //     ShortCode: Number(PAY_BILL),
  //     Amount: 1000,
  //     Msisdn: Number(PHONE_NUMBER),
  //     CommandID: "CustomerPayBillOnline",
  //     BillRefNumber: "8986987",
  //   })
  //   .then((response) => {
  //     console.log(response);
  //     res
  //       .status(200)
  //       .json({ name: `${JSON.stringify(response, undefined, 2)}` });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(400).json({ name: `${JSON.stringify(error, undefined, 2)}` });
  //   });
}
