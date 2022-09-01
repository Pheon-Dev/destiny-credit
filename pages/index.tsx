import React, { useEffect, useState } from "react";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { Transactions } from "../types";
import { TransactionsTable } from "../components";
import { GetServerSideProps } from "next";
import { LoadingOverlay } from "@mantine/core";

export default function Home() {
/* export default function Home({ */
/*   transactions, */
/* }: { */
/*   transactions: Transactions[]; */
/* }) { */
  const [transactions, setTransactions] = useState([]);
  async function fetchTransactions() {
    let subscription = true;
    if (subscription) {
      const res = await axios({method: "GET", url: "/api/transactions/payments"})
      const data = res.data.transactions
      /* console.log(data) */
        setTransactions(data)
      }
      return () => {
          subscription = false;
        }
    }
  useEffect(() => {
      fetchTransactions();
    }, [])

  /* console.log(transactions) */
  return (
    <>
    {/* {(transactions && <pre>{JSON.stringify(transactions, undefined, 2)}</pre>) || ( */}
      {(transactions.length > 0 && <TransactionsTable transactions={transactions} />) || (
        <LoadingOverlay visible overlayBlur={2} />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  let data = await prisma.transactions.findMany();

  data = JSON.parse(JSON.stringify(data));

  return { props: { transactions: data } };
};
