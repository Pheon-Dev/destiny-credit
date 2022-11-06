import { NextPage } from "next";
import { Button, Group } from "@mantine/core";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { EmptyTable, Protected, TransactionsTable } from "../../components";
import { IconPlus } from "@tabler/icons";

const Page: NextPage = () => {
  const router = useRouter()
  const call = "register";

  return (
    <Protected>
      <Group position="left">
        <Button
          variant="light"
          onClick={() => {
            router.push("/members/register/member");
          }}
        >
          <IconPlus size={16} /> New Member
        </Button>
      </Group>
      <Suspense fallback={
        <EmptyTable call={call} />
      }>
        <TransactionsTable call={call} />
      </Suspense>
    </Protected>
  );
};
export default Page;
