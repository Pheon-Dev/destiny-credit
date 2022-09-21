import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import axios from "axios";
import { createRouter } from "../create-router";
import { Fields, Logs } from "../../types";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;

const prisma = new PrismaClient();

export const transactionsRouter = createRouter()
  .query("logs", {
    resolve: async () => {
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

        const url =
          "https://logtail.com/api/v1/query?source_ids=158744&query=transID";

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

        let transactions = [{}];

        log.data?.map(async (t: Logs) => {
          if (t?.message.startsWith("START")) {
            const data = t?.message.split("{")[1].split("}")[0];
            /* transactions.push({ */
            /*   transaction: data.split(",").map((e) => */
            /*     e.trim() */
            /*   ), */
            /* }); */
            let transactionType = data
              .split(",")[0]
              .split(":")[1]
              .trim()
              .split("'")[1];
            let transID = data.split(",")[1].split(":")[1].trim().split("'")[1];
            let transTime = data
              .split(",")[2]
              .split(":")[1]
              .trim()
              .split("'")[1];
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
            let firstName = data
              .split(",")[10]
              .split(":")[1]
              .trim()
              .split("'")[1];
            let middleName = data
              .split(",")[11]
              .split(":")[1]
              .trim()
              .split("'")[1];
            let lastName = data
              .split(",")[12]
              .split(":")[1]
              .trim()
              .split("'")[1];

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
            /* console.log(transaction[0].transactionType); */

            transactions.push({
              transaction,
            });

            const search = await prisma.transaction.findMany({
              where: {
                transID: transaction[0].transID,
              },
            });
            try {
              if (search.length > 1) {
                const duplicate = await prisma.transaction.findFirst({
                  where: {
                    transID: transaction[0].transID,
                  },
                });
                /* console.log("Duplicate :", duplicate?.firstName); */
                return await prisma.transaction.deleteMany({
                  where: {
                    transID: duplicate?.transID,
                  },
                });
              }
              if (search.length === 1) {
                /* console.log("Logged :", transaction[0]?.firstName + ":" + transaction[0]?.transID + ":" + transaction[0]?.transAmount); */
                return;
              }
              if (
                transaction[0]?.transactionType === "PAY BILL" ||
                transaction[0]?.transactionType === "CUSTOMER MERCHANT PAYMENT"
              )
                /* console.log("New :", transaction[0]?.firstName); */
                return await prisma.transaction.create({
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
                  },
                });
            } catch (error) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: `transactions.logs ${error}`,
              });
            }
          }
          return {
            message: "Transaction not Found",
          };
        });

        /* if (transactions.length > 0) */
        /*   return { */
        /*     data: transactions.length, */
        /*     from: new_date + " " + str_tdate, */
        /*     to: now_date + " " + str_tdate, */
        /*     message: "Transactions Upto Date", */
        /*   }; */

        /* return await prisma.transaction.findMany(); */
        const logs = await prisma.transaction.findMany();
        if (!logs) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `transaction.logs not found`,
          });
        }
        return logs;
        /* return { */
        /*   data: transactions.length, */
        /*   from: new_date + " " + str_tdate, */
        /*   to: now_date + " " + str_tdate, */
        /*   message: "No New Transactions", */
        /* }; */
      } catch (error) {
        console.log("transactions.logs");
      }
    },
  })
  .query("transaction", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      const transaction = await prisma.transaction.findFirst({
        where: {
          transID: input.id,
        },
      });
      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.transaction not found`,
        });
      }
      return transaction;
    },
  })
  .query("transactions", {
    resolve: async () => {
      const transactions = await prisma.transaction.findMany();
      if (!transactions) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.transactions not found`,
        });
      }
      return transactions;
    },
  });
