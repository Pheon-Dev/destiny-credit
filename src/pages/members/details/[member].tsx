import React from "react";
import { LoadingOverlay, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../../../utils/trpc";

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.member as string;

  const { data: member, status } = trpc.members.member.useQuery({id: id})


  return (
    <>
      {member && (
      <pre>{JSON.stringify(member, undefined, 2)}</pre>
      )}
      {!member && (
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      )}
    </>
  );
};

export default Page;

