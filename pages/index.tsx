import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Transactions = {
  id: number;
  transactionType: string;
  transID: string;
  transTime: string;
  transAmount: string;
  businessShortCode: string;
  billRefNumber: string;
  invoiceNumber: string;
  orgAccountBalance: string;
  thirdPartyTransID: string;
  msisdn: string;
  firstName: string;
  middleName: string;
  lastName: string;
};

type Data = {
  transactionType: string;
  transID: string;
  transTime: string;
  transAmount: string;
  businessShortCode: string;
  billRefNumber: string;
  invoiceNumber: string;
  orgAccountBalance: string;
  thirdPartyTransID: string;
  msisdn: string;
  firstName: string;
  middleName: string;
  lastName: string;
};

export default function Home({
  data,
  transactions,
}: {
  data: Data[];
  transactions: Transactions[];
}) {
  const [mpesaTransactions, setMpesaTransactions] = useState([]);

  async function fetchTransactions() {
    const res = await fetch("/api/list");

    const result = await res.json();

    setMpesaTransactions(result["transactions"]);
    return result;
  }

  useEffect(() => {
    fetchTransactions();
  }, [data]);

  return (
          <div className="w-full bg-gray-300">
            <div className="text-black-500 text-sm flex justify-center ml-auto mr-auto">
              <pre>{JSON.stringify(data, undefined, 2)}</pre>
              {transactions.map((transaction) => (
                <TransactionDiv key={transaction.transID} transaction={transaction} />
              ))}
            </div>

            {/* <button */}
            {/*   // onClick={handleSave} */}
            {/*   className="bg-green-800 text-white rounded-lg p-3" */}
            {/* > */}
            {/*   Reload */}
            {/* </button> */}
          </div>
  );
}

function TransactionDiv({ transaction }: { transaction: Transactions }) {
  return <pre>{JSON.stringify(transaction, undefined, 2)}</pre>
}

export const getServerSideProps = async (context: any) => {
  const { res } = context;
  res.setHeader("Cache-Control", `s-maxage=60, stale-while-revalidate`);

  // export const getSaticProps = async () => {
  const supabaseAdmin = createClient(
    SUPABASE_URL || "",
    SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const sources = await fetch("https://logtail.com/api/v1/sources", {
    method: "GET",
    headers: { Authorization: `Bearer ${LOGTAIL_API_TOKEN}` },
  });

  // const transactions = await fetch("https://data.mongodb-api.com/app/data-tkbsg/endpoint/data/v1");

  const mpesa = await fetch("https://destiny-credit.vercel.app/api/mpesa", {
    method: "GET",
  });

  const query = await fetch("https://logtail.com/api/v1/query", {
    method: "GET",
    headers: { Authorization: `Bearer ${LOGTAIL_API_TOKEN}` },
  });

  const mpesa_data = await query.json();
  const { data } = await supabaseAdmin.from("transactions").select("*");

  return { props: { data: mpesa_data, transactions: data } };
};
