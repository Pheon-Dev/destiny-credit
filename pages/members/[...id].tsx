import React, { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Members } from "../../types";
import { PrismaClient } from "@prisma/client";

const MemberDetail = ({ data }: { data: Members[] }) => {
  const [member, setMember] = useState();
  const router = useRouter();
  const id = router.query.id as string;

  const fetchMember = async () => {
    let subscribe = true;
    if (subscribe) {
      const res = await axios.request({
        method: "POST",
        url: `/api/members/${id}`,
        data: {
          id: `${id}`,
        },
      });
      setMember(res.data);
    }

    return () => {
      subscribe = false;
    };
  };

  useEffect(() => {
    fetchMember();
  }, []);

  return (
    <>
      <pre>{JSON.stringify(member, undefined, 2)}</pre>
      <Text>MemberDetail :</Text>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  let data = await prisma.members.findMany();
  data = JSON.parse(JSON.stringify(data));
  return {
    props: {
      data,
    },
  };
};

export default MemberDetail;
