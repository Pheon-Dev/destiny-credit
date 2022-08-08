import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import { client } from "../utils/client";
import styles from "../styles/Home.module.css";

const AXIOM_API_TOKEN = process.env.NEXT_PUBLIC_AXIOM_API_TOKEN;
const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;
const LOGTAIL_SOURCE_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_SOURCE_TOKEN;
const AXIOM_API_ORG_ID = process.env.NEXT_PUBLIC_AXIOM_API_ORG_ID;

const Home: NextPage = (data: any) => {
  const [tel, setTel] = useState("254");
  const [amt, setAmt] = useState("");
  const [pay, setPay] = useState("");
  const [ref, setRef] = useState("");
  const [datalog, setDatalog] = useState("");
  // console.log(con_data)

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

  const handleData = async (item: any) => {
    // item.preventDefault();
    let dest = item.split("{")[2].split("}")[0];

    let transactionType = dest.split(",")[0].split(":")[1].split('"')[1];
    let transID = dest.split(",")[1].split(":")[1].split('"')[1];
    let transTime = dest.split(",")[2].split(":")[1].split('"')[1];
    let transAmount = dest.split(",")[3].split(":")[1].split('"')[1];
    let businessShortCode = dest.split(",")[4].split(":")[1].split('"')[1];
    let billRefNumber = dest.split(",")[5].split(":")[1].split('"')[1];
    let invoiceNumber = dest.split(",")[6].split(":")[1].split('"')[1];
    let orgAccountBalance = dest.split(",")[7].split(":")[1].split('"')[1];
    let thirdPartyTransID = dest.split(",")[8].split(":")[1].split('"')[1];
    let msisdn = dest.split(",")[9].split(":")[1].split('"')[1];
    let firstName = dest.split(",")[10].split(":")[1].split('"')[1];
    let middleName = dest.split(",")[11].split(":")[1].split('"')[1];
    let lastName = dest.split(",")[12].split(":")[1].split('"')[1];

    console.log(transactionType);
    const res_data = await fetch("/api/transaction", {
      body: JSON.stringify({
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
        lastName: lastName
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const result = await res_data.json();
    console.log(result);
  };

  handleData(data?.data?.data[0]?.message_string);

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
          <pre>{JSON.stringify(data.data.data[0], undefined, 2)}</pre>
          {/* <pre>{JSON.stringify(data, undefined, 2)}</pre> */}
          {/* {data && (data[0]?.map((item: any, index: any) => { */}
          {/*     <div key={index}> */}
          {/*     {item} */}
          {/*     </div> */}
          {/*   }))} */}
        </div>
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
  const sources = await fetch("https://logtail.com/api/v1/sources", {
    method: "GET",
    headers: { Authorization: `Bearer ${LOGTAIL_API_TOKEN}` },
  });

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
