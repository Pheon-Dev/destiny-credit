import {
  StkQueryInterface,
  StkQueryResponseInterface,
  CredentialInterface,
} from "../../models/interfaces";
import { routes } from "./routes";
import axios from "axios";

const baseUrl =
  "https://developer.safaricom.co.ke/lipa-na-m-pesa-online/apis/post/stkpush/v1/processrequest";
const environment = "sandbox";

export class Mpesa {
  environment: string;
  clientKey: string;
  clientSecret: string;
  // securityCredential: string;

  constructor(
    {
      clientKey,
      clientSecret,
      // securityCredential,
      initiatorPassword,
      certificatePath,
    }: CredentialInterface,
    environment: "sandbox"
  ) {
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
    // this.clientKey = `${process.env.customer_key}`;
    // this.clientSecret = `${process.env.customer_secret}`;
    // this.initiatorPassword= process.env.initiator_password,
    this.environment = "sandbox";

    // if (!securityCredential) {
    //    null;
    // } else {
    //   this.securityCredential = securityCredential;
    // }
  }
}

async function FetchApi({
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

  // class token = await this.authenicate()

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

FetchApi({
  BusinessShortCode: 123456,
  CheckoutRequestID: "Checkout Request ID",
  passKey: "Lipa Na M-PESA Pass Key",
})
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
