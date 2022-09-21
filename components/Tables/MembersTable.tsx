import React from "react";
import type { Member } from "@prisma/client";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";
import { Table, Badge, Group } from "@mantine/core";
import { TitleText } from "../Text/TitleText";

export const MembersTable = ({
  members,
  call,
  role,
}: {
  members: Member[];
  call: string;
  role: string;
}) => {
  const Header = () => (
    <tr>
      <th>Code</th>
      <th>Names</th>
      <th>Phone</th>
      <th>ID</th>
      <th>Date</th>
      <th>Status</th>
      {role !== "CO" && <th>Action</th>}
    </tr>
  );

  return (
    <>
      <Group position="center" m="lg">
        {call === "create-loan" && (
          <TitleText title="Newly Registered Members" />
        )}
        {call === "all-members" && <TitleText title="All Members List" />}
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {members?.map((member) => (
            <MemberRow
              key={member.memberId}
              member={member}
              call={call}
              role={role}
            />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
};

const MemberRow = ({
  member,
  call,
  role,
}: {
  member: Member;
  call: string;
  role: string;
}) => {
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
                onClick={() => router.push(`/members/details/${member.id}`)}
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
          {role !== "CO" && (
            <td
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/members/details/${member.id}`)}
            >
              <IconEdit size={24} />
            </td>
          )}
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
          {role !== "CO" && (
            <td
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/members/details/${member.id}`)}
            >
              <IconEdit size={24} />
            </td>
          )}
        </tr>
      )}
    </>
  );
};
