import { Button, Group, LoadingOverlay, Table, Tabs } from "@mantine/core";
import { Transaction } from "@prisma/client";
import { IconCash, IconDeviceMobileMessage, IconUser } from "@tabler/icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { TitleText } from "../../../components";
import { trpc } from "../../../utils/trpc";

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.member as string;

  const { data: member, status } = trpc.members.member.useQuery({ id: id });

  const firstname = member?.firstName;
  const middlename = member?.lastName.split(" ")[0];
  const lastname = member?.lastName.split(" ")[1];
  const phone = member?.phoneNumber;

  const { data: transactions } = trpc.transactions.payments.useQuery({
    firstname: `${firstname}`,
    middlename: `${middlename}`,
    lastname: `${lastname}`,
    phone: `${phone}`,
  });

  const TransactionsTable = () => {
    const Header = () => (
      <tr>
        <th>
          <>Time</>
        </th>
        <th>Names</th>
        <th>Amount</th>
        <th>Phone</th>
        <th>
          <Group position="center">Code</Group>
        </th>
      </tr>
    );

    return (
      <>
        {transactions && (
          <>
            <Table striped highlightOnHover horizontalSpacing="md" mb="xl">
              <thead>
                <Header />
              </thead>
              <tbody>
                {transactions?.map((transaction, index) => (
                  <TransactionRow key={index} transaction={transaction} />
                ))}
              </tbody>
              <tfoot>
                <Header />
              </tfoot>
            </Table>
          </>
        )}
      </>
    );
  };

  const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
    const date = (time: string) => {
      const minute = time.slice(10, 12);
      const hour = time.slice(8, 10);
      const when = hour + ":" + minute;
      return when;
    };
    return (
      <>
        <tr>
          <td>
            <Group>{date(transaction.transTime)}</Group>
          </td>
          <td>
            {transaction.firstName +
              " " +
              transaction.middleName +
              " " +
              transaction.lastName}
          </td>
          <td>
            {`${transaction.transAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>{transaction.msisdn}</td>
          <td>
            <Group position="center">
              <>{transaction.transID}</>
            </Group>
          </td>
        </tr>
      </>
    );
  };

  const MemberDetails = () => {

    return (
      <>
        <Button variant="outline" onClick={() => router.push(`/members/register/update/${id}`)}>Update</Button>
        <pre>{JSON.stringify(member, undefined, 2)}</pre>
      </>
    );

  };

  const MemberLoans = () => {
    return (
      <>
        <pre>{JSON.stringify(member?.loans, undefined, 2)}</pre>
      </>
    );
  };

  return (
    <>
      {member && (
        <Tabs variant="outline" defaultValue="details" orientation="horizontal">
          <Tabs.List position="center">
            <Tabs.Tab value="details" icon={<IconUser size={14} />}>
              Details
            </Tabs.Tab>
            <Tabs.Tab value="loans" icon={<IconCash size={14} />}>
              Loans
            </Tabs.Tab>
            <Tabs.Tab
              value="transactions"
              icon={<IconDeviceMobileMessage size={14} />}
            >
              M-PESA
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="xs">
            <Group position="left" m="md" mt="lg">
              <TitleText title="Member Details" />
            </Group>
            <Group position="center">
              <MemberDetails />
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="loans" pt="xs">
            <Group position="left" m="md" mt="lg">
              <TitleText title="Member Loans" />
            </Group>
            <Group position="center">
              <MemberLoans />
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="transactions" pt="xs">
            <Group position="left" m="md" mt="lg">
              <TitleText title="M-PESA Transactions" />
            </Group>
            <Group position="center">
              <TransactionsTable />
            </Group>
          </Tabs.Panel>
        </Tabs>
      )}
      {!member && (
        <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      )}
    </>
  );
};

export default Page;
