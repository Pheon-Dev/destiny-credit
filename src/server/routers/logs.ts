import axios from "axios";
import { t } from "../trpc";
import { prisma } from "../prisma";
import { Fields, Logs, TransactionsLog } from "../../../types";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;

export const logsRouter = t.router({
  logs: t.procedure.query(async () => {
    const date = new Date();
    const n_date = new Date();

    date.setDate(date.getDate() - 3);

    const new_date = date.toJSON();

    const now_date = n_date.toJSON();

    const url = `https://logtail.com/api/v1/query?source_ids=158744&query=transID&from=${new_date}&to=${now_date}`;

    const token = LOGTAIL_API_TOKEN;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let response = await axios.request({
      method: "GET",
      url,
      headers,
    });

    const log = response.data;
    let transactions: Array<TransactionsLog> = [];

    log.data?.map(async (t: Logs) => {
      if (t?.message.match("INTERNAL_SERVER_ERROR"))
        return {
          data: t?.message.length,
          message: "INTERNAL_SERVER_ERROR",
          from: new_date,
          to: now_date,
        };
      if (t?.message.startsWith("START")) {
        const data = t?.message.split("{")[1].split("}")[0];
        let transactionType = data
          .split(",")[0]
          .split(":")[1]
          .trim()
          .split("'")[1];
        let transID = data.split(",")[1].split(":")[1].trim().split("'")[1];
        let transTime = data.split(",")[2].split(":")[1].trim().split("'")[1];
        let transAmount = data
          .split(",")[3]
          .split(":")[1]
          .trim()
          .split("'")[1]
          .split(".")[0];
        let businessShortCode = data
          .split(",")[4]
          .split(":")[1]
          .trim()
          .split("'")[1];
        let billRefNumber = data
          .split(",")[5]
          .split(":")[1]
          .trim()
          .split("'")[1];
        let invoiceNumber = data
          .split(",")[6]
          .split(":")[1]
          .trim()
          .split("'")[1];
        let orgAccountBalance = data
          .split(",")[7]
          .split(":")[1]
          .trim()
          .split("'")[1]
          .split(".")[0];
        let thirdPartyTransID = data
          .split(",")[8]
          .split(":")[1]
          .trim()
          .split("'")[1];
        let msisdn = data.split(",")[9].split(":")[1].trim().split("'")[1];
        let firstName = data.split(",")[10].split(":")[1].trim().split("'")[1];
        let middleName = data.split(",")[11].split(":")[1].trim().split("'")[1];
        let lastName = data.split(",")[12].split(":")[1].trim().split("'")[1];
        let state = "new";

        let transaction: Array<Fields> = [];
        transaction.push({
          transactionType: transactionType.toUpperCase(),
          transID: transID,
          transTime: transTime,
          transAmount: transAmount,
          businessShortCode: businessShortCode,
          billRefNumber: billRefNumber.toUpperCase(),
          invoiceNumber: invoiceNumber,
          orgAccountBalance: orgAccountBalance,
          thirdPartyTransID: thirdPartyTransID,
          msisdn: msisdn,
          firstName: firstName.toUpperCase(),
          middleName: middleName.toUpperCase(),
          lastName: lastName.toUpperCase(),
        });

        transactions.push({
          transaction,
        });

        const search = await prisma.transaction.findMany({
          where: {
            transID: transaction[0].transID,
          },
        });

        if (!search) {
          return {
            message: "Error Searching Match ...",
            from: new_date,
            to: now_date,
          };
        }

        if (search.length === 1) {
          return;
        }

        if (search) {
          try {
            if (search.length > 1) {
              const delete_duplicate = await prisma.transaction.delete({
                where: {
                  id: search[0].id,
                },
              });

              return delete_duplicate;
            }

            if (isNaN(+transaction[0].transAmount) === true) {
              return;
            }

            const new_transaction = await prisma.transaction.create({
              data: {
                transactionType: transaction[0]?.transactionType,
                transID: transaction[0]?.transID,
                transTime: transaction[0]?.transTime,
                transAmount: transaction[0]?.transAmount,
                businessShortCode: transaction[0]?.businessShortCode,
                billRefNumber: transaction[0]?.billRefNumber,
                invoiceNumber: transaction[0]?.invoiceNumber,
                orgAccountBalance: transaction[0]?.orgAccountBalance,
                thirdPartyTransID: transaction[0]?.thirdPartyTransID,
                msisdn: transaction[0]?.msisdn,
                firstName: transaction[0]?.firstName,
                middleName: transaction[0]?.middleName,
                lastName: transaction[0]?.lastName,
                state: state,
                payment: "",
              },
            });

            return {
              transaction: new_transaction,
            };
          } catch (error) {
            return {
              message: "Error Writing ...",
              from: new_date,
              to: now_date,
            };
          }
        }
      }
    });
    return {
      message: `${transactions.length} Total Results Found!`,
      data: transactions,
      from: new_date,
      to: now_date,
    };
  }),
});
