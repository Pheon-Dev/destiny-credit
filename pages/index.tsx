import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;

const Home: NextPage = (data: any) => {
  const [tel, setTel] = useState("254");
  const [amt, setAmt] = useState("");
  const [pay, setPay] = useState("");
  const [ref, setRef] = useState("");
  const [transactions, setTransactions] = useState([]);

  async function fetchTransactions() {
    const res = await fetch("/api/list");

    const result = await res.json();

    setTransactions(result["transactions"]);
    return result;
  }

  useEffect(() => {
    fetchTransactions();
  }, [data]);

    // console.log(transactions);

  const refChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.currentTarget.value))) return;
    setRef(e.currentTarget.value);
  };

  const payChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.currentTarget.value))) return;
    setPay(e.currentTarget.value);
  };

  const amtChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.currentTarget.value))) return;
    setAmt(e.currentTarget.value);
  };

  const telChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.currentTarget.value))) return;
    setTel(e.currentTarget.value);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tel.length < 9) return;
    if (pay.length < 1) return;
    if (ref.length < 1) return;
    if (+amt <= 0) return;

    const res = await axios.request({
      method: "POST",
      url: "/api/mpesa",
      data: {
        PhoneNumber: +tel,
        Amount: +amt,
        BusinessShortCode: +pay,
        BillRef: +ref,
      },
    });
    console.log(res.data);
  };

  return (
    <div className="w-full bg-gray-300">
      <Head>
        <title>Destiny Credit</title>
        <meta name="description" content="Destiny Credit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={submitHandler} className={styles.form}>
          <label htmlFor="tel">Phone Number</label>
          <input
            type="tel"
            name="tel"
            placeholder="Enter phone number"
            value={tel}
            onChange={telChange}
          />
          <label htmlFor="amt">Amount</label>
          <input
            type="text"
            name="amt"
            placeholder="Enter amount"
            value={amt}
            onChange={amtChange}
          />
          <label htmlFor="pay">Pay Bill</label>
          <input
            type="text"
            name="pay"
            placeholder="Enter Pay Bill No."
            value={pay}
            onChange={payChange}
          />
          <label htmlFor="pay">Bill Ref</label>
          <input
            type="text"
            name="ref"
            placeholder="Enter Bill Ref No."
            value={ref}
            onChange={refChange}
          />
          <button type="submit">Pay</button>
        </form>

        <div className="text-blue-500 text-sm">/api/confirmation</div>
        <div className="text-black-500 text-sm flex justify-center ml-auto mr-auto">
          <pre>{JSON.stringify(transactions, undefined, 2)}</pre>
        </div>
        <div>
          <>
            {transactions &&
              transactions.map((item: any) => {
                <div
                  key={item.entityId}
                  className="text-black-500 text-sm flex justify-center ml-auto mr-auto"
                >
                  {item.firstName}
                </div>;
              })}
          </>
        </div>
        {/* <button */}
        {/*   // onClick={handleSave} */}
        {/*   className="bg-green-800 text-white rounded-lg p-3" */}
        {/* > */}
        {/*   Reload */}
        {/* </button> */}
      </main>
    </div>
  );
};

export async function getStaticProps() {
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

  const data = await mpesa.json();

  return { props: { data }, revalidate: 1 };
}

export default Home;
