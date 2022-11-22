import { Badge, Group, Table, Tooltip } from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { TitleText } from "../Text/TitleText";
import { EmptyTable } from "./EmptyTable";

export const PARTable = ({
  call,
  email,
}: {
  call: string;
  status: string;
  email: string;
}) => {
  const router = useRouter();
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

  const { data: loans, fetchStatus } = trpc.loans.report.useQuery();

  const Header = () => (
    <tr>
      <th>Names</th>
      <th>Principal</th>
      <th>O|S Balance</th>
      <th>O|S Arrears</th>
      <th>O|S Penalty</th>
      <th>Start Date</th>
      <th>Status</th>
      {user?.role !== "CO" && <th>Action</th>}
    </tr>
  );
  const role = user?.role

  return (
    <>
      {!loans && <EmptyTable call="par-table" status={fetchStatus} />}
      {loans && (
        <>
          <Group position="center" m="lg">
            {call === "par-report" && <TitleText title="PAR Report" />}
          </Group>

          <Table striped highlightOnHover horizontalSpacing="md">
            <thead>
              <Header />
            </thead>
            <tbody>
              {loans?.map((loan) => (
                <>
                  {call === "par-report" && (
                    <tr style={{ cursor: "auto" }}>
                      <td>{loan.memberName}</td>
                      <td>{`${loan.principal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      {
                        loan?.payment.length > 0 && (
                          <td>{`${loan?.payment[loan?.payment.length - 1]?.outsBalance}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        ) || (
                          <td>{`${+loan.installment + +loan.principal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        )
                      }
                      {
                        loan?.payment.length > 0 && (
                          <td>{`${loan?.payment[loan?.payment.length - 1]?.outsArrears}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        ) || (
                          <td>{`${0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        )
                      }
                      {
                        loan?.payment.length > 0 && (
                          <td>{`${loan?.payment[loan?.payment.length - 1]?.outsPenalty}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        ) || (
                          <td>{`${0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        )
                      }
                      <td>
                        {loan.startDate}
                      </td>
                      <td>
                        {!loan.disbursed && !loan.approved && loan.maintained && (
                          <>
                            {role === "CO" && (
                              <Tooltip label="Approval" color="gray" withArrow>
                                <Badge
                                  style={{ cursor: "pointer" }}
                                  variant="gradient"
                                  gradient={{
                                    from: "grey",
                                    to: "indigo",
                                  }}
                                >
                                  Pending
                                </Badge>
                              </Tooltip>
                            )}
                            {role !== "CO" && (
                              <Badge
                                style={{ cursor: "pointer" }}
                                onClick={() => router.push(`/loans/approve/${loan.id}`)}
                                variant="gradient"
                                gradient={{
                                  from: "indigo",
                                  to: "red",
                                }}
                              >
                                Approve
                              </Badge>
                            )}
                          </>
                        )}
                        {!loan.disbursed && loan.approved && (
                          <>
                            {role === "CO" && (
                              <Tooltip label="Disbursement" color="gray" withArrow>
                                <Badge
                                  style={{ cursor: "pointer" }}
                                  variant="gradient"
                                  gradient={{
                                    from: "grey",
                                    to: "green",
                                  }}
                                >
                                  Pending
                                </Badge>
                              </Tooltip>
                            )}
                            {role !== "CO" && (
                              <Badge
                                style={{ cursor: "pointer" }}
                                onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                                variant="gradient"
                                gradient={{
                                  from: "red",
                                  to: "blue",
                                }}
                              >
                                Disburse
                              </Badge>
                            )}
                          </>
                        )}
                        {loan.disbursed && loan.cleared && (
                          <Badge
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                            variant="gradient"
                            gradient={{
                              from: "violet",
                              to: "gray",
                            }}
                          >
                            Cleared
                          </Badge>
                        ) || (
                            <Badge
                              style={{ cursor: "pointer" }}
                              onClick={() => router.push(`/loans/payments/${loan.id}`)}
                              variant="gradient"
                              gradient={{
                                from: "blue",
                                to: "violet",
                              }}
                            >
                              Active
                            </Badge>
                          )}
                        {loan.defaulted && (
                          <Badge
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                            variant="gradient"
                            gradient={{
                              from: "red",
                              to: "orange",
                            }}
                          >
                            Defaulted
                          </Badge>
                        )}
                      </td>
                      {role !== "CO" && (
                        <td
                          style={{ cursor: "pointer" }}
                          onClick={() => router.push(`/loans/${loan.id}`)}
                        >
                          <IconEdit size={24} />
                        </td>
                      )}
                    </tr>
                  )}
                </>
              ))}
            </tbody>
            <tfoot>
              <Header />
            </tfoot>
          </Table>
          <pre>{JSON.stringify(loans, undefined, 2)}</pre>
        </>
      )}
    </>
  );
};
