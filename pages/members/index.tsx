import React, { FormEvent, useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { supabase } from "../../lib/supabase";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { IconCalendar, IconCheck } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import {
  LoadingOverlay,
  TextInput,
  Grid,
  Button,
  Divider,
  Group,
  Select,
  Text,
} from "@mantine/core";
import { TitleText, MembersTable } from "../../components";
import { Members } from "../../types";
import { showNotification, updateNotification } from "@mantine/notifications";
import { GetServerSideProps } from "next";
import useSWR from "swr";

const MembersList = ({ data }: { data: Members[] }) => {
  console.log(data);
  return (
    <>
      <div>
        <Text>Members List</Text>
        <MembersTable members={data} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  /* const { data, error } = await supabase */
  /*   .from("members") */
  /*   .select("*") */
  /*   .order("id"); */

  /* if (error) return console.log({ error: error }); */

  /* const res = await axios.request({ */
  /*   method: "GET", */
  /*   url: "/api/members", */
  /* }); */
  /**/
  /* const data = res.data; */

  const prisma = new PrismaClient();
  let data = await prisma.members.findMany();
  data = JSON.parse(JSON.stringify(data))

  return {
    props: {
      data,
    },
  };
};

export default MembersList;
