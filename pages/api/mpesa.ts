import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function queryAndWrite() {
    try {
      const url = `https://logtail.com/api/v1/query?source_ids=158744&query=transID`;
      const token = LOGTAIL_API_TOKEN;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.request({
        method: "GET",
        url,
        headers,
      });

      res.status(200).json({
        data: response.data.data,
        message: "Transactions Upto Date",
      });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  queryAndWrite();
}
