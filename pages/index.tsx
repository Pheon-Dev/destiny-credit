import React, { useEffect, useState } from "react";
import axios from "axios";
import { TransactionsTable, Protected } from "../components";
import { trpc } from "../utils/trpc";
import { Group, LoadingOverlay } from "@mantine/core";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [load, setLoad] = useState(true);
  const [loaded, setLoaded] = useState(false);

  /* const hello = trpc.useQuery(['hello', { text: 'client' }]); */
  /* if (!hello.data) { */
  /*     console.log("Loading ...") */
  /*   } */
  /* if (hello.data) { */
  /*     console.log(hello.data.greeting) */
  /*   } */

  async function fetchTransactions() {
    const controller = new AbortController();
    const signal = controller.signal;

    const res = await axios.request({
      method: "GET",
      url: "/api/transactions/payments",
      signal,
    });
    const data = res.data.transactions;

    setTransactions(data);
    transactions.length === 0 && setLoaded(true);
    return () => {
      controller.abort();
    };
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Protected>
      {(transactions.length > 0 && (
        <TransactionsTable transactions={transactions} />
      )) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      )}
      {loaded && transactions.length === 0 && (
        <Group position="center">No New Transactions</Group>
      )}
    </Protected>
  );
}
