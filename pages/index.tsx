import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Navbar,
  Group,
  AppShell,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle";
import { MainLinks } from "../components/MainLinks";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Transactions = {
  id: number;
  transactionType: string;
  transID: string;
  transTime: string;
  transAmount: string;
  businessShortCode: string;
  billRefNumber: string;
  invoiceNumber: string;
  orgAccountBalance: string;
  thirdPartyTransID: string;
  msisdn: string;
  firstName: string;
  middleName: string;
  lastName: string;
};

type Data = {
  transactionType: string;
  transID: string;
  transTime: string;
  transAmount: string;
  businessShortCode: string;
  billRefNumber: string;
  invoiceNumber: string;
  orgAccountBalance: string;
  thirdPartyTransID: string;
  msisdn: string;
  firstName: string;
  middleName: string;
  lastName: string;
};

export default function Home({
  data,
  transactions,
}: {
  data: Data[];
  transactions: Transactions[];
}) {
  const [mpesaTransactions, setMpesaTransactions] = useState([]);
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  async function fetchTransactions() {
    const res = await fetch("/api/list");

    const result = await res.json();

    setMpesaTransactions(result["transactions"]);
    return result;
  }

  useEffect(() => {
    fetchTransactions();
  }, [data]);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="xs"
          hiddenBreakpoint="sm"
          hidden={!opened}
          height={500}
          width={{base: 300}}
        >
          <Navbar.Section grow mt="xs">
          <MainLinks />
          </Navbar.Section>
        </Navbar>
      }
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>App SideBar</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      // footer={
      //   <Footer height={60} p="md">
      //     App Footer
      //   </Footer>
      // }
      header={
        <Header height={70}>
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((prev) => !prev)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Text style={{ fontWeight: "bold" }}>DESTINY CREDIT LTD</Text>
            <ColorSchemeToggle />
          </Group>
        </Header>
      }
    >
      <div className="w-full bg-gray-300">
        <div className="text-black-500 text-sm flex justify-center ml-auto mr-auto">
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
          {transactions.map((transaction) => (
            <TransactionDiv
              key={transaction.transID}
              transaction={transaction}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function TransactionDiv({ transaction }: { transaction: Transactions }) {
  return <pre>{JSON.stringify(transaction, undefined, 2)}</pre>;
}

export const getServerSideProps = async (context: any) => {
  const { res } = context;
  res.setHeader("Cache-Control", `s-maxage=60, stale-while-revalidate`);

  // export const getSaticProps = async () => {
  const supabaseAdmin = createClient(
    SUPABASE_URL || "",
    SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const sources = await fetch("https://logtail.com/api/v1/sources", {
    method: "GET",
    headers: { Authorization: `Bearer ${LOGTAIL_API_TOKEN}` },
  });

  // const transactions = await fetch("https://data.mongodb-api.com/app/data-tkbsg/endpoint/data/v1");

  const mpesa = await fetch("https://destiny-credit.vercel.app/api/mpesa", {
    method: "GET",
  });

  const query = await fetch("https://logtail.com/api/v1/query", {
    method: "GET",
    headers: { Authorization: `Bearer ${LOGTAIL_API_TOKEN}` },
  });

  const mpesa_data = await query.json();
  const { data } = await supabaseAdmin.from("transactions").select("*");

  return { props: { data: mpesa_data, transactions: data } };
};
