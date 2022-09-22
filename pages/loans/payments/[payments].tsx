import React from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import {
  EmptyTable,
  Protected,
  TitleText,
} from "../../../components";
import { Group, LoadingOverlay, Table } from "@mantine/core";

const PaymentsList = () => {
  try {
    const router = useRouter();
    const id = router.query.payments as string;

    const Header = () => (
      <tr>
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
        {/* <th>M-PESA</th> */}
      </tr>
    );
  const TransactionsHeader = () => (
    <tr>
      <th>ID</th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      <th>Type</th>
    </tr>
  );
    const { data: loan, status: loan_status } = trpc.useQuery([
      "loans.loan-payment",
      { id: id },
    ]);
    const { data: member, status: member_status } = trpc.useQuery([
      "members.member",
      { id: `${loan?.memberId}` },
    ]);
    const { data: payments, status: payment_status } = trpc.useQuery([
      "loans.payment",
      { id: id },
    ]);

    const names = member?.lastName;

    const firstname = member?.firstName;
    const middlename = names?.split(" ")[0];
    const lastname = names?.split(" ")[1];
    const phonenumber = member?.phoneNumber;

    const { data: transactions, status: transactions_status } = trpc.useQuery([
      "loans.transactions",
      {
        firstName: `${firstname}`,
        middleName: `${middlename}`,
        lastName: `${lastname}`,
        phoneNumber: `${phonenumber}`,
      },
    ]);

    return (
      <>
        <Group position="center" m="lg">
      <TitleText title={`${loan?.memberName}`} />
        </Group>
        <Table
          striped
          highlightOnHover
          horizontalSpacing="md"
          style={{ position: "relative" }}
        >
          <LoadingOverlay
            overlayBlur={2}
            visible={payment_status === "loading"}
          />
          <thead>
            <Header />
          </thead>
          <tbody>
            {payments?.map((payment) => (
              <tr key={payment?.id} style={{ cursor: "auto" }}>
                <td>
                  {`${payment.amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                {/* <td> */}
                {/*   {payment.mpesa} */}
                {/* </td> */}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <Header />
          </tfoot>
        </Table>
      <Group position="center" m="lg">
      <TitleText title={`M-PESA Payments`} />
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <TransactionsHeader />
        </thead>
        <tbody>
          {transactions?.map((transaction) => (
        <tr
        key={transaction.id}
          /* style={{ */
          /*   cursor: transaction.billRefNumber !== "" ? "pointer" : "text", */
          /* }} */
          /* onClick={() => { */
          /*   transaction.billRefNumber !== "" */
          /*     ? router.push(`/members/register/${transaction.transID}`) */
          /*     : null; */
          /* }} */
        >
          <td>{transaction.transID}</td>
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
          {transaction.billRefNumber === "" ? (
            <td>{transaction.transTime}</td>
          ) : (
            <td>{transaction.billRefNumber}</td>
          )}
        </tr>
          ))}
        </tbody>
        <tfoot>
          <TransactionsHeader />
        </tfoot>
      </Table>
      </>
    );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="payment" />
      </Protected>
    );
  }
};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
