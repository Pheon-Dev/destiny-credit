import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { FormEvent, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [tel, setTel] = useState('254');
  const [amt, setAmt] = useState('');

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
    if (+amt <= 0) return;

    const res = await axios.request({
      method: 'POST',
      url: '/api/mpesa',
      data: { PhoneNumber: +tel, Amount: +amt },
    });

    console.log(res);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>MPESA pay</title>
        <meta name="description" content="MPESA pay" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={submitHandler} className={styles.form}>
          <h1 className={styles.title}>Mpesa Pay</h1>
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
          <button type="submit">Pay</button>
        </form>
      </main>

      <footer className={styles.footer}>Mpesa payment integration</footer>
    </div>
  );
};

export default Home;
