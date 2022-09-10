import React, { useEffect, useState } from "react";
import axios from "axios";
import { PaymentsTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const PaymentsList = () => {
  const [loans, setLoans] = useState([]);
  const [load, setLoad] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const fetchLoans = async (signal: AbortSignal) => {
    try {
      const res = await axios.request({
        method: "GET",
        url: "/api/loans",
      });

      const data = res.data.loans;
      setLoans(data);
      loans.length === 0 && setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchLoans(signal);

    setTimeout(() => {
      loans.length === 0 && setLoad(false);
    }, 8000);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {(loans.length > 0 && (
        <PaymentsTable loans={loans} call="payments" />
      )) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      )}
      {loaded && loans.length === 0 && (
        <Group position="center">
          <Text>No Disbursed loans</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
