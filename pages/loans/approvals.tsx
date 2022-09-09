import React, { useEffect, useState } from "react";
import { Protected } from "../../components";
import { NextPage } from "next";
import axios from "axios";
import {
  Group,
  Stepper,
  Button,
  LoadingOverlay,
  Text,
  TextInput,
  Card,
  Box,
  Grid,
  Badge,
  Select,
  Menu,
  ActionIcon,
  Switch,
  Autocomplete,
} from "@mantine/core";
import Router, { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
} from "@tabler/icons";
import { Loans } from "../../types";

const Page: NextPage = () => {
  const [loans, setLoans] = useState([]);

  async function fetchMembers() {
    let subscription = true;

    if (subscription) {
      const mem = await axios.request({
        method: "GET",
        url: `/api/loans`,
      });

      const mems = mem.data.loans;

      setLoans(mems);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchMembers();
  }, [loans]);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setTimeout(() => {
        updateNotification({
          id: "maintainance-status",
          color: "teal",
          title: "Successful Loan Maintenance!",
          message: `Next Step is Adding a Loan Guarantor ...`,
          icon: <IconCheck size={16} />,
          autoClose: 8000,
        });
      });
      /* router.push("/"); */
      /* const res = await axios.get("/api/"); */
      /* const data = res.data; */
      /* return Router.replace(Router.asPath); */
    } catch (error) {
      setTimeout(() => {
        updateNotification({
          id: "maintainance-status",
          title: "Maintenance Error!",
          message: `Please Try Maintaining Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      });
    }
  };

  return (
    <>
    <Protected>
    <Text>Members List For Approval</Text>
    <pre>{JSON.stringify(loans, undefined, 2)}</pre>
    </Protected>
    </>
  );
};

export default Page;
