// import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
// import express, {request, response} from 'express';
// // const next = require('next');
//
// // const defaultEndPoint = `https://developer.safaricom.co.ke/lipa-na-m-pesa-online/apis/post/stkpush/v1/processrequest`;
// const app = express();
//
// app.use('/api/mpesa', createProxyMiddleware({target: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', changeOrigin: true}))
// app.listen(3000)
//
import axios from 'axios';

const baseUrl = "https://developer.safaricom.co.ke/lipa-na-m-pesa-online/apis/post/stkpush/v1/processrequest"
  // const environment = "sandbox"

type HeaderProps = {
  clientKey: string,
  clientSecret: string,
  securityCredential: string
}

export default async function FetchApi(){
  try {
    const {data} = await axios.get<HeaderProps>(
      baseUrl,
      {
        headers: {
          clientKey: `${process.env.customer_key}`,
          clientSecret: `${process.env.customer_secret}`,
          // initiatorPassword: process.env.initiator_password,
          securityCredential: `${process.env.security_credential}`,
        },
      }
    )

    console.log(JSON.stringify(data, null, 4));

  return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message :', error.message)

      return error.message;
    } 

    console.log('Unexpected Error! :', error);
    return 'An Unexpected Error Occurred!';
  }
}


FetchApi();

  // public async lipaNaMpesaQuery({
  //   BusinessShortCode,
  //   passKey,
  //   CheckoutRequestID,
  // }: StkQueryInterface): Promise<StkQueryResponseInterface> {
  //   const Timestamp = new Date()
  //     .toISOString()
  //     .replace(/[^0-9]/g, '')
  //     .slice(0, -3);
  //
  //   const Password = Buffer.from(
  //     BusinessShortCode + passKey + Timestamp,
  //   ).toString('base64');
  //
  //   const token = await this.authenticate();
  //
  //   const response = await this.http.post<StkQueryResponseInterface>(
  //     routes.stkquery,
  //     {
  //       BusinessShortCode,
  //       Password,
  //       Timestamp,
  //       CheckoutRequestID,
  //     },
  //     {
  //       headers: {
  //         Authorization: 'Bearer ' + token,
  //       },
  //     },
  //   );
  //
  //   return response.data;
  // }
