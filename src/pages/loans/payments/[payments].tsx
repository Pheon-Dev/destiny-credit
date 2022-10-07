import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Protected, TitleText } from "../../../components";
import { Button, Group, Loader, Skeleton, Table, TransferList, TransferListData, useMantineColorScheme } from "@mantine/core";
import { NextPage } from "next";
import { IconLoader2 } from "@tabler/icons";
import { Transaction } from "@prisma/client";
import { useSession } from "next-auth/react";

const PaymentsList = ({ email, status }: { email: string; status: string }) => {
  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  const user_data = trpc.users.user.useQuery({
    email: `${email}`,
  });

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setUser({
        id: `${user_data?.data?.id}`,
        role: `${user_data?.data?.role}`,
        username: `${user_data?.data?.username}`,
        firstname: `${user_data?.data?.firstName}`,
        lastname: `${user_data?.data?.lastName}`,
        email: `${user_data?.data?.email}`,
        state: `${user_data?.data?.state}`,
      });
    }
    return () => {
      subscribe = false;
    };
  }, [
    user_data?.data?.id,
    user_data?.data?.role,
    user_data?.data?.username,
    user_data?.data?.firstName,
    user_data?.data?.lastName,
    user_data?.data?.email,
    user_data?.data?.state,
  ]);

  const router = useRouter();
  const id = router.query.payments as string;

  const Header = () => (
    <tr>
      <th>Payment Date</th>
      <th>Paid Amount</th>
      <th>O|S Arrears</th>
      <th>Paid Arrears</th>
      <th>O|S Penalty</th>
      <th>Paid Penalty</th>
      <th>O|S Interest</th>
      <th>Paid Interest</th>
      <th>O|S Principal</th>
      <th>Paid Principal</th>
      <th>O|S Balance</th>
      <th>M-PESA Code</th>
    </tr>
  );

  const Row = () => {
    return <Skeleton height={8} radius="xl" />;
  };

  const payments = trpc.payments.payment.useQuery({ id: id });

  const payment = payments?.data

  const transactions = payment?.transactions

  let paid: any = [];
  let recent: any = [];

  const date = (time: string) => {
    const day = time.slice(6, 8);
    const month = time.slice(4, 6);
    const year = time.slice(0, 4);

    const d = new Date()
    d.setDate(+day)
    d.setMonth(+month)
    d.setFullYear(+year)
    /* return d.toDateString().slice(0, 11) + '"' + year.slice(2) */
    return d.toDateString()
  };

  console.table({...transactions})

  transactions?.map(
    (t: Transaction) =>
      (t.state === "new" &&
        recent.push({
          value: `${t.id}`,
          label: `[${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}] :
          ${`${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, "")}
          on ${date(`${t.transTime}`)}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        })) ||
      (t.state === "handled" &&
        paid.push({
          value: `${t.id}`,
          label: `[${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}] :
          ${`${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, "")}
          on ${date(`${t.transTime}`)}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        })) ||
      (t.state === "paid" &&
        paid.push({
          value: `${t.id}`,
          label: `[${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}] :
          ${`${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, "")}
          on ${date(`${t.transTime}`)}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        })) ||
      (!t.state &&
        recent.push({
          value: `${t.id}`,
          label: `[${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}] :
          ${`${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, "")}
          on ${date(`${t.transTime}`)}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        }))
  );
  /* console.table({ ...data }) */
  const initialValues: TransferListData = [recent, paid];

  const [data, setData] = useState<TransferListData>(initialValues);

  const utils = trpc.useContext();
  const handle = trpc.transactions.state.useMutation({
    onSuccess: async () => {
      await utils.transactions.transactions.invalidate();
    },
  });

  const handleState = useCallback(() => {
    try {
      if (data[1] && user?.id) {
        data[1].map((d) => {
          handle.mutate({
            id: d.value,
            handlerId: `${user?.id}`,
            updaterId: `${user?.id}`,
            payment: `loan`,
            state: `paid`,
          });
          /* console.log(d) */
        });
      }
    } catch (error) {
      console.log("Error Handling State!");
    }
  }, [handle, data]);

  return (
    <Suspense
      fallback={
        <>
          <Group position="center" m="lg">
            <TitleText title="Loading payment Payment Statement ..." />
          </Group>
          <Group position="center" m="lg" style={{ position: "relative" }}>
            <Skeleton height={16} radius="xl" />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Skeleton height={16} radius="xl" />
          </Group>
        </>
      }
    >
      {payment && (
        <>
          <Group position="apart" m="lg">
            <TitleText title={`${payment?.loan.memberName}`} />
            {payments?.fetchStatus === "fetching" && (<Loader />) || (
              <IconLoader2 onClick={() => payments?.refetch()} />
            )}
          </Group>
          <Table striped highlightOnHover horizontalSpacing="md">
            <thead>
              <Header />
            </thead>
            <tbody>

              {payment?.loan?.payment?.map((payment) => (
                <tr key={payment?.mpesa} style={{ cursor: "auto" }}>
                  <td>{payment?.currInstDate}</td>
                  <td>
                    {`${payment.amount}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsBalance}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>{payment.mpesa}</td>
                </tr>
              ))}


              {payment.loan.payment.length > 0 && (

                <tr style={{ backgroundColor: "grey", color: "white" }}>
                  <td>TOTAL</td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.total}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsBalance}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>TOTAL</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <Header />
            </tfoot>
          </Table>
        </>
      )}
      <Group position="center" m="lg">
        <TitleText title={`M-PESA Payments`} />
      </Group>
      <Group position="center" m="lg">
        <TransferList
          value={data}
          onChange={setData}
          listHeight={300}
          searchPlaceholder="Search..."
          nothingFound="Nothing here"
          titles={["Recent", "Paid"]}
          breakpoint="sm"
        />
      </Group>
      <Group position="center" m="lg">
        {data[0].length > 0 && (
          <Button variant="gradient" onClick={handleState}>
            Handle
          </Button>
        )}
      </Group>
      <pre>{JSON.stringify(payment, undefined, 2)}</pre>
    </Suspense>
  );
};

const Page: NextPage = () => {
  const { status, data } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  return (
    <Protected>
      {check?.length > 0 && <PaymentsList email={email} status={status} />}
    </Protected>
  );
};

export default Page;
