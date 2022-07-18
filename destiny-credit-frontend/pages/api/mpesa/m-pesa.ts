import type { NextApiRequest, NextApiResponse } from "next";
import { Mpesa } from "mpesa-api";
import {
  CredentialsInterface,
  StkQueryInterface,
  StkQueryResponseInterface,
  StkPushInterface,
  StkPushResponseInterface,
  HttpServiceConfig,
  HttpServiceResponse,
  C2BSimulateInterface,
  C2BSimulateResponseInterface,
  AuthorizeResponseInterface,
  C2BRegisterResponseInterface,
} from "../../../models/interfaces";
import axios from "axios";
import { routes } from "../../../utils/routes";
import { request as httpsRequest } from "https";
import { request as httpRequest } from "http";
import { parse, UrlWithStringQuery } from "url";
import { publicEncrypt } from "crypto";
import { RSA_PKCS1_PADDING } from "constants";
import { promises } from "fs";
import { resolve } from "path";

const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
const INITIATOR_PASSWORD = process.env.NEXT_PUBLIC_INITIATOR_PASSWORD;
const SECURITY_CREDENTIAL = process.env.NEXT_PUBLIC_SECURITY_CREDENTIAL;
const PASS_KEY = process.env.NEXT_PUBLIC_PASS_KEY;
const PAY_BILL = process.env.NEXT_PUBLIC_PAY_BILL;
const TILL_NUMBER = process.env.NEXT_PUBLIC_TILL_NUMBER;
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const CALL_BACK_URL = process.env.NEXT_PUBLIC_CALL_BACK_URI;

type Data = {
  name: string;
};

export class HttpService {
  uri: UrlWithStringQuery;
  headers: Record<string, any>;

  constructor({ baseURL, headers }: HttpServiceConfig) {
    // const {baseURL, headers} = config;

    this.uri = parse(baseURL);
    this.headers = headers;
  }

  get<T = unknown>(
    path: string,
    { headers }: HttpServiceConfig
  ): Promise<HttpServiceResponse<T>> {
    return new Promise<HttpServiceResponse<T>>((resolve, reject) => {
      try {
        const request =
          this.uri.protocol === "https:" ? httpsRequest : httpRequest;

        const clientRequest = request(
          {
            protocol: this.uri.protocol,
            hostname: this.uri.hostname,
            path,
            method: "GET",
            headers: {
              ...this.headers,
              ...headers,
            },
          },
          (response) => {
            const { headers, statusCode, statusMessage } = response;
            let dataChunks = "";

            response.on("data", (chunk) => {
              dataChunks += chunk;
            });

            response.on("end", () => {
              let data: any;

              try {
                data = JSON.parse(dataChunks);
              } catch (error) {
                data = dataChunks?.toString();
              }

              const result = {
                protocol: this.uri.protocol,
                hostname: this.uri.hostname,
                path: path,
                method: "GET",
                headers,
                statusCode,
                statusMessage,
                data,
              };

              if (Number(statusCode) >= 200 && Number(statusCode) < 300) {
                return resolve({
                  protocol: `${this.uri.protocol}`,
                  hostname: `${this.uri.hostname}`,
                  path: path,
                  method: "GET",
                  headers,
                  statusCode: Number(statusCode),
                  statusMessage: `${statusMessage}`,
                  data,
                });
              }

              reject(result);
            });
          }
        );
        clientRequest.on("error", (error) => {
          reject(error);
        });

        clientRequest.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  post<T = unknown, K extends any = any>(
    path: string,
    payload: K,
    { headers }: HttpServiceConfig
  ): Promise<HttpServiceResponse<T>> {
    return new Promise<HttpServiceResponse<T>>((resolve, reject) => {
      try {
        const request =
          this.uri.protocol === "https:" ? httpsRequest : httpRequest;

        const data = JSON.stringify(payload);

        const clientRequest = request(
          {
            protocol: this.uri.protocol,
            hostname: this.uri.hostname,
            path,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": data.length,
              ...this.headers,
              ...headers,
            },
          },
          (response) => {
            const { headers, statusCode, statusMessage } = response;

            let dataChunks = "";

            response.on("data", (chunk) => {
              dataChunks += chunk;
            });

            response.on("data", () => {
              let data: any;

              try {
                data = JSON.parse(dataChunks);
              } catch (error) {
                data = dataChunks?.toString();
              }

              const result = {
                protocol: this.uri.protocol,
                hostname: this.uri.hostname,
                path: path,
                method: "POST",
                headers,
                statusCode,
                statusMessage,
                data,
              };

              if (Number(statusCode) >= 200 && Number(statusCode) < 300) {
                return resolve({
                  protocol: `${this.uri.protocol}`,
                  hostname: `${this.uri.hostname}`,
                  path: path,
                  method: "POST",
                  headers,
                  statusCode: Number(statusCode),
                  statusMessage: `${statusMessage}`,
                  data,
                });
              }

              reject(result);
            });
          }
        );

        clientRequest.on("error", (error) => {
          reject(error);
        });

        clientRequest.write(data);
        clientRequest.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export class MpesaApi {
  private http: HttpService;
  private environment: string;
  private clientKey: string;
  private clientSecret: string;
  private securityCredential: string;
  private certificatePath: string;

  constructor(
    {
      clientKey,
      clientSecret,
      securityCredential,
      initiatorPassword,
      certificatePath,
    }: CredentialsInterface,
    environment: "production" | "sandbox"
  ) {
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
    this.securityCredential = `${securityCredential}`;
    this.environment = "production";
    this.certificatePath = "../../keys/production-cert.cer";

    this.http = new HttpService({
      baseURL:
        environment === "production" ? routes.production : routes.sandbox,
      headers: { "Content-Type": "application/json" },
    });

    if (!securityCredential && !initiatorPassword) {
      throw new Error(
        "You must provide either the security credential or initiator password. Both cannot be null."
      );
    }

    if (!securityCredential) {
      this.generateSecurityCredential(initiatorPassword, this.certificatePath);
    } else {
      this.securityCredential = securityCredential;
    }
  }

  async generateSecurityCredential(password: string, certificatePath: string) {
    let certificate: string;

    if (certificatePath != null) {
      const certificateBuffer = await promises.readFile(certificatePath);

      certificate = String(certificateBuffer);
    } else {
      const certificateBuffer = await promises.readFile(
        resolve(
          __dirname,
          this.environment === "production"
            ? "../../../keys/production-cert.cer"
            : "../../../keys/sandbox-cert.cer"
        )
      );
      certificate = String(certificateBuffer);
    }

    this.securityCredential = publicEncrypt(
      {
        key: certificate,
        padding: RSA_PKCS1_PADDING,
      },
      Buffer.from(password)
    ).toString("base64");
  }

  async authenticate(): Promise<string> {
    const response = await axios.get<AuthorizeResponseInterface>(routes.oauth, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(this.clientKey + ":" + this.clientSecret).toString(
            "base64"
          ),
      },
    });

    return response.data.access_token;
  }

  async lipaNaMpesaQuery({
    BusinessShortCode,
    passKey,
    CheckoutRequestID,
  }: StkQueryInterface): Promise<StkQueryResponseInterface> {
    const token = await this.authenticate();
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
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log(JSON.stringify(response.data, null, 4));

    return response.data;
  }

  async c2bSimulate({
    ShortCode,
    CommandID,
    Amount,
    Msisdn,
    BillRefNumber,
  }: C2BSimulateInterface): Promise<C2BRegisterResponseInterface> {
    const token = await this.authenticate();

    const response = await axios.post<C2BSimulateResponseInterface>(
      routes.c2bsimulate,
      {
        ShortCode,
        CommandID,
        Amount,
        Msisdn,
        BillRefNumber: BillRefNumber ?? "account",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return response.data;
  }

  async lipaNaMpesaOnline({
    BusinessShortCode,
    passKey,
    TransactionDesc,
    TransactionType,
    PartyA,
    PartyB,
    Amount,
    AccountReference,
    CallBackURL,
    PhoneNumber,
  }: StkPushInterface): Promise<StkPushResponseInterface> {
    const Timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);

    const Password = Buffer.from(
      BusinessShortCode + passKey + Timestamp
    ).toString("base64");

    const token = await this.authenticate();

    const response = await axios.post<StkPushResponseInterface>(
      routes.stkpush,
      {
        BusinessShortCode,
        Password,
        Timestamp,
        TransactionType: TransactionType ?? "CustomerPayBillOnline",
        Amount,
        PartyA,
        PartyB,
        PhoneNumber,
        CallBackURL,
        AccountReference,
        TransactionDesc: TransactionDesc ?? "Lipa na M-PESA Online",
      },
      {
        headers: {
          // Authorization: "Bearer " + SECURITY_CREDENTIAL,
          Authorization: "Bearer " + token,
        },
      }
    );

    return response.data;
  }
}

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

  // const mpesa = new Mpesa(credentials, environment);
  const mpesa = new MpesaApi(credentials, environment);

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

  // mpesa
  //   .c2b({
  //     CommandID: "CustomerPayBillOnline",
  //     Amount: 1,
  //     Msisdn: `${PHONE_NUMBER}`,
  //     BillRefNumber: "00000",
  //     ShortCode: Number(PAY_BILL),
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
  //
  mpesa
    .lipaNaMpesaOnline({
      BusinessShortCode: Number(PAY_BILL),
      passKey: `${PASS_KEY}`,
      TransactionDesc: "Transaction Desc",
      TransactionType: "CustomerPayBillOnline",
      PartyA: `${PHONE_NUMBER}`,
      PartyB: `${PAY_BILL}`,
      Amount: 1,
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
  //   .c2bRegister({
  //     ShortCode: Number(PAY_BILL),
  //     ConfirmationURL: `${CALL_BACK_URL}`,
  //     ValidationURL: `${CALL_BACK_URL}`,
  //     ResponseType: "Completed",
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

  // mpesa
  //   .c2bSimulate({
  //     ShortCode: Number(PAY_BILL),
  //     Amount: 100,
  //     Msisdn: Number(PHONE_NUMBER),
  //     CommandID: "CustomerPayBillOnline",
  //     BillRefNumber: "00000",
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
