import React, { useState, useEffect } from "react";
import { TitleText, EmptyTable } from "../../components";
import { Table, Group, Badge } from "@mantine/core";
import type { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

export const ProductsTable = ({ call }: { call: string }) => {
  const { data } = useSession();

  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  if (data?.user?.email) {
    const user_data = trpc.users.user.useQuery({
      email: `${data?.user?.email}`,
    });

    useEffect(() => {
      setUser({
        id: `${user_data?.data?.id}`,
        role: `${user_data?.data?.role}`,
        username: `${user_data?.data?.username}`,
        firstname: `${user_data?.data?.firstName}`,
        lastname: `${user_data?.data?.lastName}`,
        email: `${user_data?.data?.email}`,
        state: `${user_data?.data?.state}`,
      });
    }, []);
  }

  const { data: products, fetchStatus } = trpc.products.products.useQuery();
  const Header = () => (
    <tr>
      <th>Code</th>
      <th>Name</th>
      <th>Cycle</th>
      <th>Rate</th>
      <th>Status</th>
    </tr>
  );

  return (
    <>
      {!products && <EmptyTable call={call} status={fetchStatus} />}
      {products && (
        <>
          <Group position="center" m="lg">
            <TitleText title="Products List" />
          </Group>
          <Table striped highlightOnHover horizontalSpacing="md">
            <thead>
              <Header />
            </thead>
            {!products && (
              <tbody>
                <tr>
                  <Group position="center" m="lg">
                    <TitleText title="Products List is Empty, Create a New One" />
                  </Group>
                </tr>
              </tbody>
            )}
            {products && (
              <>
                <tbody>
                  {products?.map((product) => (
                    <ProductRow key={product.productId} product={product} />
                  ))}
                </tbody>
                <tfoot>
                  <Header />
                </tfoot>
              </>
            )}
          </Table>
        </>
      )}
    </>
  );
};

const ProductRow = ({ product }: { product: Product }) => {
  const router = useRouter();
  return (
    <tr
      style={{ cursor: "pointer" }}
      onClick={() => router.push(`/products/details/${product.id}`)}
    >
      <td>{product.productId}</td>
      <td>{product.productName}</td>
      <td>{product.repaymentCycle}</td>
      <td>{product.interestRate} %</td>
      <td>
        {product.approved ? (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/products/details/${product.id}`)}
            variant="gradient"
            gradient={{
              from: "teal",
              to: "lime",
            }}
          >
            Approved
          </Badge>
        ) : (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/products/details/${product.id}`)}
            variant="gradient"
            gradient={{
              from: "indigo",
              to: "cyan",
            }}
          >
            Approve
          </Badge>
        )}
      </td>
    </tr>
  );
};
