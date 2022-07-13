import type { NextApiRequest, NextApiResponse } from "next";
// import { Mpesa } from "mpesa-api";
import axios from "axios";
import {
  CredentialInterface,
  StkQueryInterface,
  StkQueryResponseInterface,
  HttpServiceConfig,
  HttpServiceResponse
} from "../../models/interfaces";
import { routes } from "./routes";
import { request as httpsRequest } from "https";
import { request as httpRequest } from "http";
import { parse, UrlWithStringQuery } from "url";

type Data = {
  name: string;
};

export class HttpService{
  uri: UrlWithStringQuery;
  headers: Record<string, any>;

  constructor({baseURL, headers}: HttpServiceConfig) {
    // const {baseURL, headers} = config;

    this.uri = parse(baseURL);
    this.headers = headers;
  }
}

export class Mpesa {
  environment: string;
  clientKey: string;
  clientSecret: string;

  constructor(
    {
      clientKey,
      clientSecret,
      initiatorPassword,
      securityCredential,
      certificatePath,
    }: CredentialInterface,
    environment: "sandbox" | "production"
  ) {
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
    this.environment = "sandbox";
  }

  async lipaNaMpesaQuery({
    BusinessShortCode,
    passKey,
    CheckoutRequestID,
  }: StkQueryInterface): Promise<StkQueryResponseInterface> {
    const TimeStamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);

    const Password = Buffer.from(
      BusinessShortCode + passKey + TimeStamp
    ).toString("base64");

    const response = await axios.post<StkQueryResponseInterface>(
      routes.stkquery,
      {
        BusinessShortCode,
        Password,
        TimeStamp,
        CheckoutRequestID,
      },
      {
        headers: {
          Authorization: "Bearer" + process.env.security_credential,
        },
      }
    );

    console.log(JSON.stringify(response.data, null, 4));

    return response.data;
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const credentials = {
    clientKey: `${process.env.consumer_key}`,
    clientSecret: `${process.env.consumer_secret}`,
    initiatorPassword: `${process.env.security_credential}`,
    // securityCredential: `${process.env.security_credential}`,
    // certificatePath: './SandboxCertificate.cer',
  };

  const environment = "sandbox";

  const mpesa = new Mpesa(credentials, environment);

  mpesa
    .lipaNaMpesaQuery({
      BusinessShortCode: 4085055,
      CheckoutRequestID: "Checkout Request ID",
      passKey: "Lipa Na M-PESA Pass Key",
    })
    .then((response) => {
      console.log(response);
      res.status(200).json({ name: `${JSON.stringify(response, null, 2)}` });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ name: `${JSON.stringify(error, null, 2)}` });
    });

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

  // mpesa.c2bSimulate({
  //   ShortCode: 4085055,
  //   Amount: 1000,
  //   Msisdn: 254768858280,
  //   CommandID: "CustomerPayBillOnline",
  //   BillRefNumber: ""
  // })
  //   .then((response) => {
  //     console.log(response);
  //   res.status(200).json({ name: `${JSON.stringify(response, undefined, 2)}`})
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   res.status(400).json({ name: `${JSON.stringify(error, undefined, 2)}`})
  //   });
}
