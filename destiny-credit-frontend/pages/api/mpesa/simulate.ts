// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}

// import type { NextApiRequest, NextApiResponse } from 'next'
// import { Mpesa } from 'mpesa-node';
//
// const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY;
// const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
// const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
//
// type Data = {
//   name: string
// }
//
// const mpesaApi = new Mpesa({ consumerKey: CONSUMER_KEY, consumerSecret: CONSUMER_SECRET});
// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   mpesaApi.c2bSimulate(
//     PHONE_NUMBER,
//     500,
//     'iuyre897ui'
//   ).then((result: any) =>{
//     res.status(200).json(result)
//   }).catch((error: any) =>{
//     res.status(400).json(error)
//   })
// }
//
