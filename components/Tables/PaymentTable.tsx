import React from "react";
import { Table, Group } from "@mantine/core";
import { TitleText } from "../Text/TitleText";
import type { Payment } from "@prisma/client";

export const PaymentTable = ({
  payments,
  call,
}: {
  payments: Payment[];
  call: string;
}) => {
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
    </tr>
  );
  return (
    <>
      <Group position="center" m="lg">
        {call === "payments" && <TitleText title="Recent Payments List" />}
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {payments?.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

const PaymentRow = ({ payment, call }: { payment: Payment; call: string }) => {
  /* const router = useRouter(); */
  return (
    <>
      {call === "payments" && (
        <tr style={{ cursor: "auto" }}>
          <td>{`${payment.amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>
            {`${payment.outsArrears}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.paidArrears}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.outsPenalty}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.paidPenalty}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.outsInterest}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.paidInterest}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.outsPrincipal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.paidPrincipal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            {`${payment.outsBalance}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
        </tr>
      )}
    </>
  );
}
