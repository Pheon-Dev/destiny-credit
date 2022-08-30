import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { Fields } from "../../types";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function queryAndWrite() {
    try {
      const date = new Date();
      const n_date = new Date();

      date.setDate(date.getDate() - 2);
      let str_date: string = date.toLocaleDateString();
      let str_ndate: string = n_date.toLocaleDateString();
      let str_tdate: string = n_date.toLocaleTimeString();

      const new_date =
        str_date.split("/")[2] +
        "-" +
        str_date.split("/")[1] +
        "-" +
        str_date.split("/")[0];

      const now_date =
        str_ndate.split("/")[2] +
        "-" +
        str_ndate.split("/")[1] +
        "-" +
        str_ndate.split("/")[0];

      // let str_now_date = `${now_date}` + ' ' + `${str_tdate}`

      // const url_one = "https://logtail.com/api/v1/query?source_ids=158744&query=transID" + `&to=${str_now_date}`;

      const url = "https://logtail.com/api/v1/query?source_ids=158744&query=transID";
      // const url = "https://logtail.com/api/v1/query?source_ids=158744";
      // const url = "https://logtail.com/api/v1/query";
      // const url = "https://logtail.com/api/v1/sources";

      const token = LOGTAIL_API_TOKEN;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let response = await axios.request({
        method: "GET",
        url,
        headers,
      });

      // if (response.status !== 200) {
      //   try {
      //     response = await axios.request({
      //       method: "GET",
      //       url: url_two,
      //       headers,
      //     });
      //   } catch (error) {
      //     res.status(500).json({ message: "Something went wrong" });
      //   }
      // }

      const log = response.data;

      if (log.data.length > 0) {
        let counter: number = log.data.length;
        while (counter !== 0) {
          const data_res: string = log.data[counter]?.message
            .split("{")[1]
            .split("}")[0];
          // counter++;
          let transactionType: string = data_res
            .split(",")[0]
            .split(":")[1]
            .split("'")[1];
          let transID: string = data_res
            .split(",")[1]
            .split(":")[1]
            .split("'")[1];
          let transTime: string = data_res
            .split(",")[2]
            .split(":")[1]
            .split("'")[1];
          let transAmount: string = data_res
            .split(",")[3]
            .split(":")[1]
            .split("'")[1];
          let businessShortCode: string = data_res
            .split(",")[4]
            .split(":")[1]
            .split("'")[1];
          let billRefNumber: string = data_res
            .split(",")[5]
            .split(":")[1]
            .split("'")[1];
          let invoiceNumber: string = data_res
            .split(",")[6]
            .split(":")[1]
            .split("'")[1];
          let orgAccountBalance: string = data_res
            .split(",")[7]
            .split(":")[1]
            .split("'")[1];
          let thirdPartyTransID: string = data_res
            .split(",")[8]
            .split(":")[1]
            .split("'")[1];
          let msisdn: string = data_res
            .split(",")[9]
            .split(":")[1]
            .split("'")[1];
          let firstName: string = data_res
            .split(",")[10]
            .split(":")[1]
            .split("'")[1];
          let middleName: string = data_res
            .split(",")[11]
            .split(":")[1]
            .split("'")[1];
          let lastName: string = data_res
            .split(",")[12]
            .split(":")[1]
            .split("'")[1];

          let result: Array<Fields> = [];

          result.push({
            transactionType: transactionType,
            transAmount: transAmount,
            businessShortCode: businessShortCode,
            billRefNumber: billRefNumber,
            transID: transID,
            transTime: transTime,
            invoiceNumber: invoiceNumber,
            orgAccountBalance: orgAccountBalance,
            thirdPartyTransID: thirdPartyTransID,
            msisdn: msisdn,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
          });

          const { data, error } = await supabase
            .from("transactions")
            .select()
            .textSearch("transTime", `'${transTime}'`);

          if (error)
            return res
              .status(500)
              .json({ message: "Error Fetching Data From Database" });

          if (data.length === 0) {
            if (
              transactionType === "Pay Bill" ||
              transactionType === "Customer Merchant Payment"
            ) {
              await supabase.from("transactions").insert([
                {
                  transactionType: transactionType,
                  transID: transID,
                  transTime: transTime,
                  transAmount: transAmount,
                  businessShortCode: businessShortCode,
                  billRefNumber: billRefNumber,
                  invoiceNumber: invoiceNumber,
                  orgAccountBalance: orgAccountBalance,
                  thirdPartyTransID: thirdPartyTransID,
                  msisdn: msisdn,
                  firstName: firstName,
                  middleName: middleName,
                  lastName: lastName,
                },
              ]);
            }

            counter--;
          }

          if (data.length !== 0) {
            counter--;
          }
        }
      }

      res.status(200).json({
        data: log.data,
        from: new_date + " " + str_tdate,
        to: now_date + " " + str_tdate,
        message: "Transactions Upto Date",
      });
    } catch (error) {
      res.status(500).json({ message: "Something Went Wrong With The Internal Server!" });
      // res.status(500).json({ message: error });
    }
  }
  queryAndWrite();
}
