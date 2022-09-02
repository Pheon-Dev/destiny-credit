import React, { useEffect, useState } from "react";
import axios from "axios";
import { TransactionsTable } from "../components";
import { trpc } from "../utils/trpc";
import { Group, LoadingOverlay } from "@mantine/core";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [load, setLoad] = useState(true);
  /* const hello = trpc.useQuery(['hello', { text: 'client' }]); */

  /* if (!hello.data) { */
  /*     console.log("Loading ...") */
  /*   } */
  /* if (hello.data) { */
  /*     console.log(hello.data.greeting) */
  /*   } */

  async function fetchTransactions() {
    let subscription = true;
    if (subscription) {
      const res = await axios.request({
        method: "GET",
        url: "/api/transactions/payments",
      });
      const data = res.data.transactions;

      setTransactions(data);
      transactions.length === 0 && setLoad((prev) => !prev);
    }
    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchTransactions();
  }, [transactions]);

  return (
    <>
      {(transactions.length > 0 && (
        <TransactionsTable transactions={transactions} />
      )) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      )}
      {transactions.length === 0 && (
        <Group position="center">No New Transactions</Group>
      )}
    </>
  );
}
