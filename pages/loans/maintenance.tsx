import React, { useState } from "react";
import { PrismaClient } from "@prisma/client";
import { MembersTable } from "../../components";
import { Members } from "../../types";
import { GetServerSideProps } from "next";

const Page = ({ data }: { data: Members[] }) => {
  /* console.log(data); */
  return (
    <>
      <div>
        <MembersTable members={data} />
      </div>
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

export default Page;

