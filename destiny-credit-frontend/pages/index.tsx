import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = (data: any)  => {
  const [tel, setTel] = useState("254");
  const [amt, setAmt] = useState("");
  const [pay, setPay] = useState("");
  const [ref, setRef] = useState("");
  const router = useRouter();

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

    // let response = await fetch("api/confirmation", {
    //   method: "POST",
    // });
    // let res_data = await response.json();
    // console.log(res_data);

    // const con = await axios.request({
    //   method: "POST",
    //   url: "/api/confirmation",
    // });
    // console.log(con.data);
    //
    // const val = await axios.request({
    //   method: "POST",
    //   url: "/api/validation",
    // });
    // console.log(val.data);
  };

  // const fetchPayments = async () => {
  //   try {
  //     await fetch("https://destiny-credit.vercel.app/api/confirmation", {
  //       method: "POST",
  //     });
  //     return router.push(router.asPath);
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // };
  //
  // useEffect(() => {
  //   fetchPayments();
  // }, [amt, pay, tel, ref]);

    console.log(data);
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
      </main>

      {/* <pre>{JSON.stringify(data, undefined, 2)}</pre> */}
    </div>
  );
};

export async function getStaticProps() {
    const res = await fetch("https://destiny-credit.vercel.app/api/confirmation");
    const data = await res.json()

    return { props: { data } }
  }
export default Home;
