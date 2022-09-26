import axios from "axios";
import { t } from "../trpc";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { Fields, Logs } from "../../types";
import { TRPCError } from "@trpc/server";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;

export const logsRouter = t.router({
  logs: t.procedure.query(async () => {
    try {
      const date = new Date();

      date.setDate(date.getDate() - 2);

      const url =
        "https://logtail.com/api/v1/query?source_ids=158744&query=transID";
      /* const url = "https://logtail.com/api/v1/query?source_ids=158744&query=transID"; */

      const token = LOGTAIL_API_TOKEN;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        let response = await axios.request({
          method: "GET",
          url,
          headers,
        });

        const log = response.data;
        if (response.data) {
          let transactions = [{}];

          log.data?.map(async (t: Logs) => {
            if (t?.message.startsWith("START")) {
              const data = t?.message.split("{")[1].split("}")[0];

              let transactionType = data
                .split(",")[0]
                .split(":")[1]
                .trim()
                .split("'")[1];
              let transID = data
                .split(",")[1]
                .split(":")[1]
                .trim()
                .split("'")[1];
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
              let msisdn = data
                .split(",")[9]
                .split(":")[1]
                .trim()
                .split("'")[1];
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

              transactions.push({
                transaction,
              });

              const search = await prisma.transaction.findMany({
                where: {
                  transID: transaction[0].transID,
                },
              });
              if (!search) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message: `logs.search not found`,
                });
              }
              try {
                if (search.length > 1) {
                  const duplicate = await prisma.transaction.findFirst({
                    where: {
                      transID: transaction[0].transID,
                    },
                  });
                  if (!duplicate) {
                    throw new TRPCError({
                      code: "NOT_FOUND",
                      message: `logs.duplicate not found`,
                    });
                  }

                  const delete_duplicate = await prisma.transaction.deleteMany({
                    where: {
                      transID: duplicate?.transID,
                    },
                  });
                  if (!delete_duplicate) {
                    throw new TRPCError({
                      code: "NOT_FOUND",
                      message: `logs.delete_duplicate not found`,
                    });
                  }
                  return delete_duplicate;
                }
                if (search.length === 1) {
                  return;
                }
                if (
                  transaction[0].transactionType === "PAY BILL" ||
                  transaction[0].transactionType === "CUSTOMER MERCHANT PAYMENT"
                ) {
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
                      state: "new",
                    },
                  });

                  if (!new_transaction) {
                    throw new TRPCError({
                      code: "NOT_FOUND",
                      message: `logs.delete_duplicate not found`,
                    });
                  }
                  return new_transaction;
                }
                return;
              } catch (error) {
                return;
              }
            }
            return {
              message: "Transaction not Found",
            };
          });
        }
      } catch (error) {
        console.log("logs.response", error);
      }
      const logs = await prisma.transaction.findMany({
        where: {},
        orderBy: {
          transTime: "desc",
        },
      });
      if (!logs) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `logs.logs not found`,
        });
      }
      return logs;
    } catch (error) {
      console.log("logs.logs", error);
    }
  }),
  log: t.procedure.query(async () => {
    const url =
      "https://logtail.com/api/v1/query?source_ids=158744&query=transID";
    /* const url = "https://logtail.com/api/v1/query?source_ids=158744&query=transID"; */

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
    return log;
  }),
});
