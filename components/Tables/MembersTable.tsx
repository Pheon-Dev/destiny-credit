import React from "react";
import { Table, Badge } from "@mantine/core";
import { Members } from "../../types";
import { useRouter } from "next/router";
import { IconInfoCircle } from "@tabler/icons";

export function MembersTable({ members }: { members: Members[] }) {
  const Header = () => (
          <tr>
            <th>Code</th>
            <th>Names</th>
            <th>Phone</th>
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
  );
  return (
    <>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {members?.map((member) => (
            <MemberRow key={member.memberId} member={member} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function MemberRow({ member }: { member: Members }) {
  const router = useRouter();
  return (
    <tr
      style={{ cursor: "pointer" }}
    >
      <td>{member.memberId}</td>
      <td>{member.firstName + " " + member.lastName}</td>
      <td>{member.phoneNumber}</td>
      <td>{member.idPass}</td>
      <td>{member.date}</td>
      <td>
        {member.maintained ? (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/members/${member.id}`)}
            variant="gradient"
            gradient={{
              from: "teal",
              to: "lime",
            }}
          >
            Maintained
          </Badge>
        ) : (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/loans/maintain/${member.id}`)}
            variant="gradient"
            gradient={{
              from: "indigo",
              to: "cyan",
            }}
          >
            Maintain
          </Badge>
        )}
      </td>
      <td
      onClick={() => router.push(`/members/${member.id}`)}
      ><IconInfoCircle size={24} /></td>
    </tr>
  );
}
