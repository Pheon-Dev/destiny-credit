import React, { useState, useEffect, useCallback } from "react";
import type { Member } from "@prisma/client";
import { useRouter } from "next/router";
import { IconInfoCircle  } from "@tabler/icons";
import { Table, Badge, Group } from "@mantine/core";
import { TitleText } from "../Text/TitleText";
import { trpc } from "../../utils/trpc";
import { EmptyTable } from "./EmptyTable";

export const MembersTable = ({
  call,
  status,
  email,
}: {
  call: string;
  status?: string;
  email: string;
}) => {
  const logs = trpc.logs.logs.useQuery();

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

  const { data: members, fetchStatus } = trpc.loans.create_loan.useQuery();

  const Header = () => (
    <tr>
      <th>Code</th>
      <th>Names</th>
      <th>Phone</th>
      <th>ID</th>
      <th>Date</th>
      <th>Status</th>
      {user?.role !== "CO" && <th>Info</th>}
    </tr>
  );

  return (
    <>
      {!members && <EmptyTable status={fetchStatus} call={call} />}
      {members && (
        <>
          <Group position="center" m="lg">
            {call === "create-loan" && <TitleText title="Registered Members" />}
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
                  role={`${user?.role}`}
                />
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
  const utils = trpc.useContext();
  const deleteMemberById = trpc.members.member_delete.useMutation({
    onSuccess: async () => {
      await utils.members.members.invalidate();
    },
  });
  const deleteMember = useCallback(
    (id: string) => {
      deleteMemberById.mutate({
        id: id,
      });
    },
    [deleteMemberById]
  );

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
              onClick={() => {
                router.push(`/members/details/${member.id}`);
              }}
            >
              <IconInfoCircle size={24} />
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
              onClick={() => {
                /* deleteMember(`${member.id}`); */
                router.push(`/members/details/${member.id}`);
              }}
            >
              <IconInfoCircle size={24} />
            </td>
          )}
        </tr>
      )}
    </>
  );
};
