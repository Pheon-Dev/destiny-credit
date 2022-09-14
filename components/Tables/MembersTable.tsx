import React from "react";
import { Member } from "@prisma/client";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";
import { Table, Badge, Group } from "@mantine/core";
import { TitleText } from "../Text/TitleText";

export const MembersTable = ({
  members,
  call,
}: {
  members: Member[];
  call: string;
}) => {
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
      <Group position="center" m="lg">
        {call === "approvals" && <TitleText title="Approvals List" />}
        {call === "create-loan" && <TitleText title="Maintain a New Loan" />}
        {call === "all-members" && <TitleText title="All Members List" />}
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {members?.map((member) => (
            <MemberRow key={member.memberId} member={member} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

const MemberRow = ({ member, call }: { member: Member; call: string }) => {
  const router = useRouter();

  return (
    <>
      {call === "all-members" && (
        <tr style={{ cursor: "auto" }}>
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
                Active
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
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/members/${member.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
      {call === "create-loan" && !member.maintained && (
        <tr style={{ cursor: "auto" }}>
          <td>{member.memberId}</td>
          <td>{member.firstName + " " + member.lastName}</td>
          <td>{member.phoneNumber}</td>
          <td>{member.idPass}</td>
          <td>{member.date}</td>
          <td>
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
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/members/${member.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
      {call === "approvals" && member.maintained && (
        <tr style={{ cursor: "auto" }}>
          <td>{member.memberId}</td>
          <td>{member.firstName + " " + member.lastName}</td>
          <td>{member.phoneNumber}</td>
          <td>{member.idPass}</td>
          <td>{member.date}</td>
          <td>
            <Badge
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/approve/${member.id}`)}
              variant="gradient"
              gradient={{
                from: "teal",
                to: "lime",
              }}
            >
              Approve
            </Badge>
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/members/${member.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
    </>
  );
}
