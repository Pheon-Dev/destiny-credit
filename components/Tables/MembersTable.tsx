import React from "react";
import { Table } from "@mantine/core";
import { Members } from "../../types";

export function MembersTable({
  members,
}: {
  members: Members[];
}) {
  return (
    <>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <tr>
            <th>CODE</th>
            <th>NAMES</th>
            <th>PHONE</th>
            <th>ID</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((member) => (
            <MemberRow
              key={member.memberNumber}
              member={member}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>CODE</th>
            <th>NAMES</th>
            <th>PHONE</th>
            <th>ID</th>
            <th>DATE</th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

function MemberRow({ member }: { member: Members }) {
  return (
    <tr>
      <td>{member.memberNumber}</td>
      <td>
        {member.firstName +
          " " +
          member.lastName}
      </td>
      <td>{member.phoneNumber}</td>
      <td>{member.idPass}</td>
      <td>{member.date}</td>
    </tr>
  );
}

