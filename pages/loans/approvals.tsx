import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoansTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [load, setLoad] = useState(true);
  const [loaded, setLoaded] = useState(false);

  async function fetchLoans() {
    let subscription = true;

    if (subscription) {
      const res = await axios.request({
        method: "GET",
        url: "/api/loans",
      });

      const data = res.data.loans;
      setLoans(data);
      loans.length === 0 && setLoaded(true);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchLoans();
    setTimeout(() => {
      loans.length === 0 && setLoad(false);
    }, 8000);
  }, [loans]);

  return (
    <>
      {(loans.length > 0 && <LoansTable loans={loans} call="approvals" />) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      )}
      {loaded && loans.length === 0 && (
        <Group position="center">
          <Text>No Maintained loans</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
    return <LoansList />
  }

export default Page;
