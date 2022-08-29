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

const MembersList = ({ members }: { members: any }) => {
  console.log(members);
  return (
    <>
      <div>
      <Text>Members List</Text>
        {/* <MembersTable members={members} /> */}
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

  const res = await axios.request({
    method: "GET",
    /* url: "https://destiny-credit.vercel.app/api/members", */
    url: "/api/members",
  });

  const data = res.data;

  return {
    props: {
      members: data,
    },
  };
};

export default MembersList;
