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

export async function getStaticProps() {
  /* const prisma = new PrismaClient(); */
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("id");

  /* const members = await prisma.members.findMany(); */

  if (error) return console.log({ error: error });
  return {
    props: {
      members: data,
      /* list: members, */
    },
  };
}

  const  MembersList = ({ members }: { members: any }) => {
    console.log(members)
  return (
    <>
      <div>
      <MembersTable members={members} />
      </div>
    </>
  );
};

export default MembersList;
