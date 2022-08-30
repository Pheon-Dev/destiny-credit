import React from "react";
import { Table, Badge, Text } from "@mantine/core";
import { Members } from "../../types";
import { useRouter } from "next/router";

export function MembersTable({ members }: { members: Members[] }) {
  return (
    <>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <tr>
            <th>Code</th>
            <th>Names</th>
            <th>Phone</th>
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((member) => (
            <MemberRow key={member.memberNumber} member={member} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Code</th>
            <th>Names</th>
            <th>Phone</th>
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

function MemberRow({ member }: { member: Members }) {
  const router = useRouter();
  return (
    <tr
    style={{cursor: "pointer"}}
    onClick={() => router.push(`/members/${member.id}`)}
    >
      <td>{member.memberNumber}</td>
      <td>{member.firstName + " " + member.lastName}</td>
      <td>{member.phoneNumber}</td>
      <td>{member.idPass}</td>
      <td>{member.date}</td>
      <td>
        {member.maintained ? (
          <Badge
          variant="gradient"
          gradient={{
              from: 'teal',
              to: 'lime'
            }}
          >
          Maintained
          </Badge>
        ) : (
          <Badge
          variant="gradient"
          gradient={{
              from: 'indigo',
              to: 'cyan'
            }}
          >
          Maintain
          </Badge>
        )}
      </td>
    </tr>
  );
}
