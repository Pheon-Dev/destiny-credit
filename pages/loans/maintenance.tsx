import React, { forwardRef, useState } from "react";
import { PrismaClient } from "@prisma/client";
import { Members, MemberProps } from "../../types";
import { GetServerSideProps } from "next";
import {
  Autocomplete,
  Group,
  Text,
} from "@mantine/core";

const Page = ({ data }: { data: Members[] }) => {
  const [member, setMember] = useState('');

  const members = data.map((item) => ({ ...item, value: item.firstName + " " + item.lastName }));

  const AutoCompleteItem = forwardRef<HTMLDivElement, MemberProps>(
    ({ firstName, lastName, memberId, ...others }: MemberProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div>
            <Text>{memberId}: {firstName} {lastName}</Text>
          </div>
        </Group>
      </div>
    )
  );
  /* console.log(members) */
  return (
      <>
      <Autocomplete
        label="Select Customer"
        placeholder="Select Customer"
        itemComponent={AutoCompleteItem}
        data={members}
        value={member}
        onChange={setMember}
        filter={(value, item) =>
          item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.firstName.toLowerCase().includes(value.toLowerCase().trim())
        }
      />
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
