import React, { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { NextPage } from "next";

const Page: NextPage = () => {
  const [member, setMember] = useState();
  const router = useRouter();
  const id = router.query.member as string;

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
    <Text>Member Page :</Text>
      <pre>{JSON.stringify(member, undefined, 2)}</pre>
    </>
  );
};

export default Page;
