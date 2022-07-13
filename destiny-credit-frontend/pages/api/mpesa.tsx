import type { NextApiRequest, NextApiResponse } from "next";
import { Mpesa } from "mpesa-api";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const credentials = {
    clientKey: `${process.env.consumer_key}`,
    clientSecret: `${process.env.consumer_secret}`,
    initiatorPassword: `${process.env.security_credential}`,
    // securityCredential: `${process.env.security_credential}`,
    // certificatePath: null,
  };

  const environment = "sandbox";

  const mpesa = new Mpesa(credentials, environment);

  // mpesa
  //   .lipaNaMpesaQuery({
  //     BusinessShortCode: 4085055,
  //     CheckoutRequestID: "Checkout Request ID",
  //     passKey: "Lipa Na M-PESA Pass Key",
  //   })
  //   .then((response) => {
  //     console.log(response);
  //     res.status(200).json({ name: `${JSON.stringify(response, null, 2)}` });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(400).json({ name: `${JSON.stringify(error, null, 2)}` });
  //   });

  // mpesa.lipaNaMpesaOnline({
  //   BusinessShortCode: Number(4085055),
  //   Amount: 1000,
  //   PartyA: "Party A",
  //   PartyB: "Party B",
  //   PhoneNumber: "Phone Number",
  //   CallBackURL: "CallBack URL",
  //   AccountReference: "Account Reference",
  //   passKey: "Lipa Na M-PESA Pass Key",
  //   TransactionType: "CustomerPayBillOnline",
  //   TransactionDesc: "Transaction Desc",
  // })
  //   .then((response) => {
  //     console.log(response);
  //   res.status(200).json({ name: `${JSON.stringify(response, undefined, 2)}`})
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   res.status(400).json({ name: `${JSON.stringify(error, undefined, 2)}`})
  //   });

  mpesa.c2bSimulate({
    ShortCode: 4085055,
    Amount: 1000,
    Msisdn: 254768858280,
    CommandID: "CustomerPayBillOnline",
    BillRefNumber: ""
  })
    .then((response) => {
      console.log(response);
    res.status(200).json({ name: `${JSON.stringify(response, undefined, 2)}`})
    })
    .catch((error) => {
      console.log(error);
    res.status(400).json({ name: `${JSON.stringify(error, undefined, 2)}`})
    });
}
