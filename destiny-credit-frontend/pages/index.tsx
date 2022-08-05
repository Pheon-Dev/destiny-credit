import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import { client } from "../utils/client";
import styles from "../styles/Home.module.css";

const Home: NextPage = (data: any) => {
  const [tel, setTel] = useState("254");
  const [amt, setAmt] = useState("");
  const [pay, setPay] = useState("");
  const [ref, setRef] = useState("");
  const [datalog, setDatalog] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transID, setTransID] = useState("");
  const [transTime, setTransTime] = useState("");
  const [transAmount, setTransAmount] = useState("");
  const [businessShortCode, setBusinessShortCode] = useState("");
  const [billRefNumber, setBillRefNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [orgAccountBalance, setOrgAccountBalance] = useState("");
  const [thirdPartyTransID, setThirdPartyTransID] = useState("");
  const [mSISDN, setMSISDN] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  // const fetchPayments = () => {
  //   const query = `*[_type == "mpesaPayments"]`;
  //   let subs = true;
  //   if (subs) {
  //     client.fetch(query).then((data) => {
  //       setDatalog(data);
  //     });
  //   }
  //   return () => (subs = false);
  // };
  //
  // useEffect(() => {
  //   fetchPayments();
  //   // setDataset(data);
  // }, []);
  //
  // const handleSave = () => {
  //   // setDataset(data);
  //   setTransactionType(data.TransactionType);
  //   setTransID(data.TransID);
  //   setTransTime(data.TransTime);
  //   setTransAmount(data.TransAmount);
  //   setBusinessShortCode(data.BusinessShortCode);
  //   setBillRefNumber(data.BillRefNumber);
  //   setInvoiceNumber(data.InvoiceNumber);
  //   setOrgAccountBalance(data.OrgAccountBalance);
  //   setThirdPartyTransID(data.ThirdPartyTransID);
  //   setMSISDN(data.MSISDN);
  //   setFirstName(data.FirstName);
  //   setMiddleName(data.MiddleName);
  //   setLastName(data.LastName);
  //   if (data.length > 0) {
  //     const doc = {
  //       _type: "mpesaPayments",
  //       transactionType,
  //       transID,
  //       transTime,
  //       transAmount,
  //       businessShortCode,
  //       billRefNumber,
  //       invoiceNumber,
  //       orgAccountBalance,
  //       thirdPartyTransID,
  //       mSISDN,
  //       firstName,
  //       middleName,
  //       lastName,
  //     };
  //     client.create(doc).then(() => {
  //       console.log(doc);
  //     });
  //   } else {
  //     console.log("Data Empty");
  //   }
  // };

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
    <div className="w-full">
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
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
        <div className="text-blue-500 text-sm">/data/fetched</div>
        {datalog.length > 0 && (
          <pre>{JSON.stringify(datalog, undefined, 2)}</pre>
        )}
        <button
          // onClick={handleSave}
          className="bg-green-800 text-white rounded-lg p-3"
        >
          Reload
        </button>
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    "https://destiny-credit.vercel.app/api/confirmation",
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );

  const data = await res.json();

  return { props: { data }, revalidate: 1 };
}

export default Home;
